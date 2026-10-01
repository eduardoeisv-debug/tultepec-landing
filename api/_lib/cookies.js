// Helper mínimo de cookies para las funciones serverless (sin dependencias).
export function parseCookies(req) {
  const header = req.headers.cookie;
  if (!header) return {};

  return Object.fromEntries(
    header.split(";").map((part) => {
      const idx = part.indexOf("=");
      const key = decodeURIComponent(part.slice(0, idx).trim());
      const value = decodeURIComponent(part.slice(idx + 1).trim());
      return [key, value];
    })
  );
}

export function isModerationAuthenticated(req) {
  const cookies = parseCookies(req);
  return Boolean(process.env.MODERATION_SESSION_SECRET) && cookies.moderation_session === process.env.MODERATION_SESSION_SECRET;
}
