import { isModerationAuthenticated } from "./_lib/cookies.js";

const VALID_STATUSES = ["pending", "approved", "rejected"];

// Cambia el status de una memoria (aprobar / rechazar / regresar a pendiente),
// usando la service_role key. Solo accesible con la cookie de sesión del
// panel de moderación.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  if (!isModerationAuthenticated(req)) {
    res.status(401).json({ ok: false, error: "not_authenticated" });
    return;
  }

  const { id, status } = req.body || {};

  if (!id || !VALID_STATUSES.includes(status)) {
    res.status(400).json({ ok: false, error: "invalid_input" });
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const response = await fetch(`${supabaseUrl}/rest/v1/community_memories?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    res.status(502).json({ ok: false, error: "update_failed" });
    return;
  }

  res.status(200).json({ ok: true });
}
