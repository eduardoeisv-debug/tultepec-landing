// Login del panel de moderación (/moderar). Compara la contraseña contra
// MODERATION_PASSWORD y, si coincide, pone una cookie httpOnly con el valor
// de MODERATION_SESSION_SECRET -- las demás funciones de moderación solo
// aceptan solicitudes que traigan esa misma cookie.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const { password } = req.body || {};

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
