import { isModerationAuthenticated } from "./_lib/cookies.js";

// Crea o actualiza un evento del calendario (si viene `id`, actualiza; si
// no, inserta uno nuevo). Solo accesible con sesión de moderación.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  if (!isModerationAuthenticated(req)) {
    res.status(401).json({ ok: false, error: "not_authenticated" });
    return;
  }

  const { id, month, day, title, description, is_highlight, is_example, display_order, published } =
    req.body || {};

  const monthNum = Number(month);
  if (!Number.isInteger(monthNum) || monthNum < 1 || monthNum > 12) {
    res.status(400).json({ ok: false, error: "invalid_month" });
    return;
  }
  let dayNum = null;
  if (day !== null && day !== undefined && day !== "") {
    dayNum = Number(day);
    if (!Number.isInteger(dayNum) || dayNum < 1 || dayNum > 31) {
      res.status(400).json({ ok: false, error: "invalid_day" });
      return;
    }
  }
  if (typeof title !== "string" || title.trim().length < 3) {
    res.status(400).json({ ok: false, error: "invalid_title" });
    return;
  }
  if (typeof description !== "string" || description.trim().length < 10) {
    res.status(400).json({ ok: false, error: "invalid_description" });
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
    month: monthNum,
    day: dayNum,
    title: title.trim(),
    description: description.trim(),
    is_highlight: Boolean(is_highlight),
    is_example: is_example !== false,
    display_order: Number.isFinite(display_order) ? display_order : 0,
    published: published !== false,
  };

  const response = id
    ? await fetch(`${supabaseUrl}/rest/v1/festival_events?id=eq.${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      })
    : await fetch(`${supabaseUrl}/rest/v1/festival_events`, {
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
