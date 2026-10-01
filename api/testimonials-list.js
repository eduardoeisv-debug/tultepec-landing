import { isModerationAuthenticated } from "./_lib/cookies.js";

// Devuelve TODOS los testimonios (publicados y no publicados), usando la
// service_role key para saltar RLS. Solo accesible con sesión de moderación.
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  if (!isModerationAuthenticated(req)) {
    res.status(401).json({ ok: false, error: "not_authenticated" });
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const params = new URLSearchParams({
    select: "id,quote,name,role,display_order,published,created_at",
    order: "display_order.asc",
  });

  const response = await fetch(`${supabaseUrl}/rest/v1/curated_testimonials?${params}`, {
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
  res.status(200).json({ ok: true, testimonials: data });
}
