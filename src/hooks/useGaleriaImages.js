import { useEffect, useState } from "react";
import { probeImageVariants } from "../lib/imageProbe.js";
import { IMAGE_CATEGORIES, PHOTO_META } from "../data/galeria.js";

const MAX_PHOTOS = 30; // tope de seguridad, no el número de peticiones reales
const BATCH_SIZE = 8;

// Caché en memoria del módulo: una vez detectadas las fotos reales de cada
// categoría en esta pestaña del navegador, no se vuelven a probar en
// aperturas siguientes de la galería (abrir, cerrar y volver a abrir no
// repite las peticiones), y preloadGaleriaImages() (ver Hero.jsx) puede
// dejarlas listas desde antes de que el visitante abra la galería. Se
// pierde solo al recargar la página.
let photosCache = null;
let inFlight = null;

// Prueba public/images/<folder>/01.*, 02.*, ... en LOTES de BATCH_SIZE en
// paralelo (no las 30 posiciones de un jalón, ni tampoco una por una en
// serie): cada lote sale junto, y solo se pide el siguiente lote si el
// anterior vino completo (todas sus posiciones existían). En cuanto un
// lote trae al menos un hueco, ahí termina esa categoría. Las categorías
// entre sí corren en paralelo.
async function probeCategoryBatched(folder, signal) {
  const found = [];
  for (let start = 1; start <= MAX_PHOTOS; start += BATCH_SIZE) {
    const batchNums = [];
    for (let i = start; i < start + BATCH_SIZE && i <= MAX_PHOTOS; i++) {
      batchNums.push(String(i).padStart(2, "0"));
    }
    const batchResults = await Promise.all(
      batchNums.map((n) => probeImageVariants(`/images/${folder}/${n}`, signal).then((src) => ({ n, src })))
    );
    let hitGap = false;
    for (const { n, src } of batchResults) {
      if (!src) {
        hitGap = true;
        break;
      }
      found.push({ id: `${folder}/${n}`, src, folder, metaKey: `${folder}/${n}` });
    }
    if (hitGap) break;
  }
  return found;
}

function loadAll() {
  const work = IMAGE_CATEGORIES.map(async (cat) => {
    const found = await probeCategoryBatched(cat.folder);
    return found.map((item) => ({
      id: item.id,
      src: item.src,
      folder: item.folder,
      chip: cat.chip,
      categoryLabel: cat.label,
      meta: PHOTO_META[item.metaKey] || null,
    }));
  });
  return Promise.all(work).then((perCategory) => perCategory.flat());
}

// Dispara el sondeo una sola vez, lo guarda en la caché del módulo y
// devuelve la misma promesa en curso a quien lo pida mientras tanto (el
// hook de abajo y preloadGaleriaImages() comparten esta función, así que
// nunca se duplican las peticiones). El resultado no se cancela si el
// componente que lo disparó se desmonta -- sigue siendo útil para cuando
// se abra la galería más tarde, en esta sesión o en otra apertura.
function ensureLoaded() {
  if (photosCache) return Promise.resolve(photosCache);
  if (!inFlight) {
    inFlight = loadAll().then((all) => {
      photosCache = all;
      inFlight = null;
      return all;
    });
  }
  return inFlight;
}

// Dispara el sondeo en segundo plano (p.ej. unos segundos después de que
// carga el hero, antes de que el visitante toque la tarjeta "Imágenes y
// videos") para que la caché ya esté lista cuando de verdad abra la
// galería y se sienta instantánea.
export function preloadGaleriaImages() {
  ensureLoaded();
}

export default function useGaleriaImages(active) {
  const [status, setStatus] = useState(photosCache ? "done" : "idle");
  const [photos, setPhotos] = useState(photosCache || []);

  useEffect(() => {
    if (!active) return undefined;
    if (photosCache) {
      setPhotos(photosCache);
      setStatus("done");
      return undefined;
    }

    let cancelled = false;
    setStatus("loading");

    ensureLoaded().then((all) => {
      if (cancelled) return;
      setPhotos(all);
      setStatus("done");
    });

    return () => {
      cancelled = true;
    };
  }, [active]);

  return { status, photos };
}
