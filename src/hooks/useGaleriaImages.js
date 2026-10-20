import { useEffect, useState } from "react";
import { probeImageVariants } from "../lib/imageProbe.js";
import { IMAGE_CATEGORIES, PHOTO_META } from "../data/galeria.js";

const MAX_PHOTOS = 30; // tope de seguridad, no el número de peticiones reales
const BATCH_SIZE = 8;
// Cuántas miniaturas adelanta preloadGaleriaThumbnails -- no las 45, para
// no gastarle datos a quien ni toque Pirotecnia (ver ese comentario).
const PRELOAD_COUNT = 9;

// Caché en memoria del módulo: una vez detectadas las fotos reales de cada
// categoría en esta pestaña del navegador, no se vuelven a probar en
// aperturas siguientes de la galería (abrir, cerrar y volver a abrir no
// repite las peticiones), y preloadGaleriaImages() (ver Hero.jsx) puede
// dejarlas listas desde antes de que el visitante abra la galería. Se
// pierde solo al recargar la página.
let photosCache = null;
let partialPhotos = [];
let inFlight = null;
// Quien quiera enterarse de cada categoría que va resolviendo mientras
// photosCache todavía no existe (ver loadAll/ensureLoaded de abajo) -- en
// la práctica solo el hook de este archivo se suscribe, pero Set en vez de
// una sola variable por si StrictMode llega a montar dos instancias.
const subscribers = new Set();

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

function notifySubscribers() {
  for (const fn of subscribers) fn(partialPhotos);
}

// A diferencia de la versión anterior (que esperaba a Promise.all de las
// 5 categorías antes de mostrar UNA sola foto), aquí cada categoría que
// termina se suma de inmediato a partialPhotos y avisa a quien esté
// escuchando (el hook de abajo) -- así la cuadrícula empieza a pintar en
// cuanto la categoría MÁS RÁPIDA resuelve, en vez de esperar a la más
// lenta (castillos-monumentales, 16 fotos, necesita 3 rondas de sondeo
// contra 1-2 de las demás). Bajo redes lentas, esperar a las 5 Y DESPUÉS
// montar las 45 fotos de golpe era justo lo que se sentía como "llegan
// desordenadas, con huecos": nada se veía durante la espera larga, y
// luego 45 peticiones de imagen competían todas a la vez por ancho de
// banda. El orden final (una vez completo) sigue siendo el de
// IMAGE_CATEGORIES (Promise.all preserva el orden de entrada, no el de
// resolución), así que preloadGaleriaThumbnails (más abajo) puede seguir
// asumiendo que las primeras PRELOAD_COUNT del arreglo completo son
// siempre las mismas.
function loadAll() {
  partialPhotos = [];
  const work = IMAGE_CATEGORIES.map(async (cat) => {
    const found = await probeCategoryBatched(cat.folder);
    const categoryPhotos = found.map((item) => ({
      id: item.id,
      src: item.src,
      thumbSrc: toThumb(item.src, item.folder),
      thumb2xSrc: toThumb(item.src, item.folder).replace(/\.webp$/, "@2x.webp"),
      folder: item.folder,
      chip: cat.chip,
      categoryLabel: cat.label,
      meta: PHOTO_META[item.metaKey] || null,
    }));
    partialPhotos = [...partialPhotos, ...categoryPhotos];
    notifySubscribers();
    return categoryPhotos;
  });
  return Promise.all(work).then((perCategory) => perCategory.flat());
}

// Dispara el sondeo una sola vez, lo guarda en la caché del módulo y
// devuelve la misma promesa en curso a quien lo pida mientras tanto (el
// hook de abajo y preloadGaleriaImages() comparten esta función, así que
// nunca se duplican las peticiones). El resultado no se cancela si el
// componente que lo disparó se desmonta -- sigue siendo útil para cuando
// se abra la galería más tarde, en esta sesión o en otra apertura.
// onProgress (opcional) se suscribe a las actualizaciones parciales
// mientras el sondeo sigue en curso -- quien lo pase debe quitarse de
// `subscribers` cuando ya no le interese (ver el cleanup del hook).
function ensureLoaded(onProgress) {
  if (onProgress) subscribers.add(onProgress);
  if (photosCache) return Promise.resolve(photosCache);
  if (!inFlight) {
    inFlight = loadAll().then((all) => {
      photosCache = all;
      inFlight = null;
      subscribers.clear();
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
// fotos existen), esto sí baja los bytes de verdad de las primeras
// PRELOAD_COUNT miniaturas (las 3 filas que se ven sin hacer scroll, no
// las 45) con new Image().src -- para cuando el navegador las vuelva a
// pedir al entrar a la Galería, ya las tenga en caché HTTP y se vean al
// instante. A propósito NO se llama sola al montar el shell, ni con las
// 45 -- la dispara solo quien de verdad muestra intención de entrar a
// Pirotecnia (ver ColumnaCristal.jsx/CristalShell.jsx), y nunca descarga
// más de lo que la primera pantalla necesita.
let thumbsPrecargados = false;
export function preloadGaleriaThumbnails() {
  if (thumbsPrecargados) return;
  thumbsPrecargados = true;
  ensureLoaded().then((photos) => {
    const esRetina = window.devicePixelRatio > 1;
    for (const photo of photos.slice(0, PRELOAD_COUNT)) {
      new Image().src = esRetina ? photo.thumb2xSrc : photo.thumbSrc;
    }
  });
}

export default function useGaleriaImages(active) {
  const [status, setStatus] = useState(photosCache ? "done" : partialPhotos.length ? "partial" : "idle");
  const [photos, setPhotos] = useState(photosCache || partialPhotos);

  useEffect(() => {
    if (!active) return undefined;
    if (photosCache) {
      setPhotos(photosCache);
      setStatus("done");
      return undefined;
    }

    let cancelled = false;
    setStatus(partialPhotos.length ? "partial" : "loading");
    setPhotos(partialPhotos);

    const onProgress = (partial) => {
      if (cancelled) return;
      setPhotos(partial);
      setStatus("partial");
    };

    ensureLoaded(onProgress).then((all) => {
      if (cancelled) return;
      setPhotos(all);
      setStatus("done");
    });

    return () => {
      cancelled = true;
      subscribers.delete(onProgress);
    };
  }, [active]);

  return { status, photos };
}
