// Función serverless de Vercel. Verifica el captcha (Cloudflare Turnstile)
// del lado del servidor -- la clave secreta nunca llega al navegador -- y
// solo si es válido guarda la memoria en Supabase. También descarta envíos
// de bots simples que rellenan el campo honeypot oculto del formulario.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const {
    turnstileToken,
    honeypot,
    display_name,
    relationship,
    memory_text,
    contact_email,
    consent_public,
  } = req.body || {};

  if (honeypot) {
    // Un bot llenó el campo trampa. Respondemos como si todo hubiera ido
    // bien, para no darle pistas de que fue detectado, pero no guardamos nada.
    res.status(200).json({ ok: true });
    return;
  }

  if (!turnstileToken) {
    res.status(400).json({ ok: false, error: "missing_captcha" });
    return;
  }

  if (typeof memory_text !== "string" || memory_text.trim().length < 20 || memory_text.length > 1200) {
    res.status(400).json({ ok: false, error: "invalid_memory_text" });
    return;
  }

  const verifyResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
      remoteip: req.headers["x-forwarded-for"] || "",
    }),
  });
  const verifyData = await verifyResponse.json();

  if (!verifyData.success) {
    res.status(400).json({ ok: false, error: "captcha_failed" });
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/community_memories`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      display_name: display_name || null,
      relationship: relationship || "otro",
      memory_text: memory_text.trim(),
      contact_email: contact_email || null,
      consent_public: consent_public !== false,
    }),
  });

  if (!insertResponse.ok) {
    res.status(500).json({ ok: false, error: "insert_failed" });
    return;
  }

  res.status(200).json({ ok: true });
}
