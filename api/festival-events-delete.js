import { isModerationAuthenticated } from "./_lib/cookies.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  if (!isModerationAuthenticated(req)) {
    res.status(401).json({ ok: false, error: "not_authenticated" });
    return;
  }

  const { id } = req.body || {};
  if (!id) {
    res.status(400).json({ ok: false, error: "missing_id" });
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const response = await fetch(`${supabaseUrl}/rest/v1/festival_events?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
  });

  if (!response.ok) {
    res.status(502).json({ ok: false, error: "delete_failed" });
    return;
  }

  res.status(200).json({ ok: true });
}
