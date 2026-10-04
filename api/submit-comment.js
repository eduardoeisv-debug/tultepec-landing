// Función serverless de Vercel. Verifica el captcha (Cloudflare Turnstile)
// del lado del servidor y solo si es válido guarda el comentario en
// Supabase. Descarta envíos de bots simples que rellenan el campo
// honeypot oculto del formulario. Mismo patrón que api/submit-memory.js.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const { turnstileToken, honeypot, display_name, comment_text, contact_email } = req.body || {};

  if (honeypot) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!turnstileToken) {
    res.status(400).json({ ok: false, error: "missing_captcha" });
    return;
  }

  if (typeof comment_text !== "string" || comment_text.trim().length < 2 || comment_text.length > 500) {
    res.status(400).json({ ok: false, error: "invalid_comment_text" });
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

  const insertResponse = await fetch(`${supabaseUrl}/rest/v1/page_comments`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      display_name: display_name || null,
      comment_text: comment_text.trim(),
      contact_email: contact_email || null,
    }),
  });

  if (!insertResponse.ok) {
    res.status(500).json({ ok: false, error: "insert_failed" });
    return;
  }

  res.status(200).json({ ok: true });
}
