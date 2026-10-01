export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  res.setHeader("Set-Cookie", "moderation_session=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax");
  res.status(200).json({ ok: true });
}
