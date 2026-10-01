import { isModerationAuthenticated } from "./_lib/cookies.js";

// Crea o actualiza un testimonio curado (si viene `id`, actualiza; si no,
// inserta uno nuevo). Solo accesible con sesión de moderación.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  if (!isModerationAuthenticated(req)) {
    res.status(401).json({ ok: false, error: "not_authenticated" });
    return;
  }

  const { id, quote, name, role, display_order, published } = req.body || {};

  if (typeof quote !== "string" || quote.trim().length < 10) {
    res.status(400).json({ ok: false, error: "invalid_quote" });
    return;
  }
  if (typeof name !== "string" || !name.trim() || typeof role !== "string" || !role.trim()) {
    res.status(400).json({ ok: false, error: "invalid_name_or_role" });
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };

  const payload = {
    quote: quote.trim(),
    name: name.trim(),
    role: role.trim(),
    display_order: Number.isFinite(display_order) ? display_order : 0,
    published: published !== false,
  };

  const response = id
    ? await fetch(`${supabaseUrl}/rest/v1/curated_testimonials?id=eq.${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      })
    : await fetch(`${supabaseUrl}/rest/v1/curated_testimonials`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

  if (!response.ok) {
    res.status(502).json({ ok: false, error: "save_failed" });
    return;
  }

  res.status(200).json({ ok: true });
}
