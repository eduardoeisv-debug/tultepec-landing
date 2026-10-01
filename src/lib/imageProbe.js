// Comprueba si una imagen existe con un HEAD (solo encabezados, sin bajar
// el archivo completo). Antes esto se hacía con `new Image()`, que sí
// descarga el archivo entero aunque nunca se muestre -- un desperdicio real
// en cuanto las fotos pasaron de no existir (404 rápido) a existir de verdad.
export async function probeImage(src, signal) {
  try {
    const res = await fetch(src, { method: "HEAD", cache: "force-cache", signal });
    return res.ok;
  } catch {
    return false;
  }
}

// Extensiones comunes según el origen de la foto: cámara/edición (.jpg,
// .jpeg), capturas de pantalla (.png), descargas del navegador (.jfif),
// formatos modernos (.webp).
const EXTENSIONS = ["jpg", "jpeg", "png", "webp", "jfif"];

// Prueba "<basePath>.jpg", "<basePath>.jpeg", etc. todas a la vez (no una
// por una) y devuelve la primera que responda bien, o null si ninguna
// existe. En la práctica cada foto solo existe con una extensión, así que
// probarlas en paralelo no cambia el resultado -- solo evita que una foto
// guardada como .jfif (la última de la lista) tarde 4 intentos en serie
// antes de encontrarse. `signal` permite cancelar las peticiones en vuelo
// si el componente que las pidió se desmonta antes de que respondan (p.ej.
// el doble montaje de React StrictMode en desarrollo).
export async function probeImageVariants(basePath, signal) {
  const checks = EXTENSIONS.map(async (ext) => {
    const src = `${basePath}.${ext}`;
    const ok = await probeImage(src, signal);
    if (!ok) throw new Error("not found");
    return src;
  });
  try {
    return await Promise.any(checks);
  } catch {
    return null;
  }
}
