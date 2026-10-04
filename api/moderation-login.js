// Login y logout del panel de moderación (/moderar), en un solo archivo
// porque el plan Hobby de Vercel limita a 12 funciones serverless por
// deployment. Login: compara la contraseña contra MODERATION_PASSWORD y,
// si coincide, pone una cookie httpOnly con el valor de
// MODERATION_SESSION_SECRET -- las demás funciones de moderación solo
// aceptan solicitudes que traigan esa misma cookie. Logout: body
// `{ logout: true }`, limpia la cookie.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const { password, logout } = req.body || {};

  if (logout) {
    res.setHeader("Set-Cookie", "moderation_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax");
    res.status(200).json({ ok: true });
    return;
  }

  if (!password || password !== process.env.MODERATION_PASSWORD) {
    res.status(401).json({ ok: false, error: "invalid_password" });
    return;
  }

  const maxAgeSeconds = 60 * 60 * 24 * 30; // 30 días
  res.setHeader(
    "Set-Cookie",
    `moderation_session=${process.env.MODERATION_SESSION_SECRET}; Path=/; Max-Age=${maxAgeSeconds}; HttpOnly; Secure; SameSite=Lax`
  );
  res.status(200).json({ ok: true });
}
