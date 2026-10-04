import { isModerationAuthenticated } from "./_lib/cookies.js";

const VALID_STATUSES = ["pending", "approved", "rejected"];

// GET: devuelve TODOS los comentarios (cualquier status), usando la
// service_role key para saltar RLS.
// POST: cambia el status de un comentario (aprobar / rechazar / regresar a
// pendiente). Un solo archivo para los dos porque el plan Hobby de Vercel
// limita a 12 funciones serverless por deployment.
// Ambos requieren la cookie de sesión del panel de moderación.
export default async function handler(req, res) {
  if (!isModerationAuthenticated(req)) {
    res.status(401).json({ ok: false, error: "not_authenticated" });
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (req.method === "GET") {
    const params = new URLSearchParams({
      select: "id,created_at,display_name,comment_text,contact_email,status",
      order: "created_at.desc",
    });

    const response = await fetch(`${supabaseUrl}/rest/v1/page_comments?${params}`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    if (!response.ok) {
      res.status(502).json({ ok: false, error: "fetch_failed" });
      return;
    }

    const data = await response.json();
    res.status(200).json({ ok: true, comments: data });
    return;
  }

  if (req.method === "POST") {
    const { id, status } = req.body || {};

    if (!id || !VALID_STATUSES.includes(status)) {
      res.status(400).json({ ok: false, error: "invalid_input" });
      return;
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/page_comments?id=eq.${id}`, {
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
    return;
  }

  res.status(405).json({ ok: false, error: "method_not_allowed" });
}
