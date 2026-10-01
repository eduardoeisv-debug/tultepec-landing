// Comprueba si una imagen existe con un HEAD (solo encabezados, sin bajar
// el archivo completo). Antes esto se hacía con `new Image()`, que sí
// descarga el archivo entero aunque nunca se muestre -- un desperdicio real
// en cuanto las fotos pasaron de no existir (404 rápido) a existir de verdad.
export async function probeImage(src) {
  try {
    const res = await fetch(src, { method: "HEAD", cache: "force-cache" });
    return res.ok;
  } catch {
    return false;
  }
}

// Extensiones comunes según el origen de la foto: cámara/edición (.jpg,
// .jpeg), capturas de pantalla (.png), descargas del navegador (.jfif),
// formatos modernos (.webp).
const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "jfif"];

// Prueba "<basePath>.jpg", "<basePath>.jpeg", etc. en orden y devuelve la
// primera ruta que exista, o null si ninguna existe.
export async function probeImageVariants(basePath) {
  for (const ext of EXTENSIONS) {
    const src = `${basePath}.${ext}`;
    // eslint-disable-next-line no-await-in-loop -- se prueba en orden a propósito
    const ok = await probeImage(src);
    if (ok) return src;
  }
  return null;
}
