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

// thumbSrc/thumb2xSrc se calculan con un simple replace de ruta, no con
// otro sondeo de red: scripts/optimize-images.mjs garantiza que, por
// cada <folder>/NN.webp encontrado arriba, también existen
// <folder>/thumbs/NN.webp (400px, 1x) y <folder>/thumbs/NN@2x.webp
// (800px, 2x/retina) -- mismo nombre, solo cambia la carpeta. Si el día
// de mañana alguien suelta una foto nueva sin correr ese script,
// thumbSrc apuntaría a un archivo inexistente; GaleriaView.jsx usa
// <img loading> normal (no <picture>), así que un 404 ahí solo deja el
// recuadro vacío en vez de romper la cuadrícula entera -- aceptable
// para un caso que ya requiere acordarse de correr el script de
// optimización de todos modos.
function toThumb(src, folder) {
  return src.replace(`/${folder}/`, `/${folder}/thumbs/`);
}

function loadAll() {
  const work = IMAGE_CATEGORIES.map(async (cat) => {
    const found = await probeCategoryBatched(cat.folder);
    return found.map((item) => ({
      id: item.id,
      src: item.src,
      thumbSrc: toThumb(item.src, item.folder),
      thumb2xSrc: toThumb(item.src, item.folder).replace(/\.webp$/, "@2x.webp"),
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

// A diferencia de preloadGaleriaImages (solo HEAD, para DESCUBRIR qué
// fotos existen), esto sí baja los bytes de verdad de cada miniatura
// con new Image().src -- para cuando el navegador los vuelva a pedir
// al entrar a la Galería, ya los tenga en caché HTTP y se vean al
// instante. A propósito NO se llama sola al montar el shell (serían
// ~1-1.6MB de descarga para cualquiera que ni toque el menú) -- la
// dispara quien de verdad muestra intención de llegar ahí: abrir el
// menú, o pasar el mouse/dedo por la fila de Pirotecnia (ver
// ColumnaCristal.jsx/CristalShell.jsx).
let thumbsPrecargados = false;
export function preloadGaleriaThumbnails() {
  if (thumbsPrecargados) return;
  thumbsPrecargados = true;
  ensureLoaded().then((photos) => {
    for (const photo of photos) {
      const esRetina = window.devicePixelRatio > 1;
      new Image().src = esRetina ? photo.thumb2xSrc : photo.thumbSrc;
    }
  });
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
