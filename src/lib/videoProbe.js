// Igual que imageProbe.js, pero para video: comprueba con un HEAD si un
// archivo existe, sin descargarlo completo.
export async function probeVideo(src, signal) {
  try {
    const res = await fetch(src, { method: "HEAD", cache: "force-cache", signal });
    return res.ok;
  } catch {
    return false;
  }
}

const EXTENSIONS = ["mp4", "webm", "mov"];

// Prueba "<basePath>.mp4", "<basePath>.webm", etc. en paralelo y devuelve
// la primera que exista, o null si ninguna existe.
export async function probeVideoVariants(basePath, signal) {
  const checks = EXTENSIONS.map(async (ext) => {
    const src = `${basePath}.${ext}`;
    const ok = await probeVideo(src, signal);
    if (!ok) throw new Error("not found");
    return src;
  });
  try {
    return await Promise.any(checks);
  } catch {
    return null;
  }
}
