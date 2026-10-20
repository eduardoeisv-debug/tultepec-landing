import { useEffect, useState } from "react";
import { PHOTO_META } from "../data/galeria.js";

const MANIFEST_URL = "/galeria/manifest.json";
// Cuántas miniaturas adelanta preloadGaleriaThumbnails -- no las 45, para
// no gastarle datos a quien ni toque Pirotecnia (ver ese comentario).
const PRELOAD_COUNT = 9;

// Caché en memoria del módulo: una sola petición real por carga de
// página (el manifest, ~45 entradas, unos pocos KB), no 45 fotos
// probadas una por una. Reemplaza el sondeo por HEAD que vivía aquí
// antes (useGaleriaImages.js probaba "01.jpg", "01.jpeg"... hasta el
// primer hueco) -- ese sondeo confundía cualquier error de red real
// (paquete perdido, conexión reiniciada, normal en datos móviles) con
// "esta foto no existe", y cortaba ahí el resto de la categoría aunque
// hubiera más fotos después (bug confirmado en producción: en celular
// con mala señal se veían 7 de 45 fotos). El manifest lo genera
// scripts/build-galeria-manifest.mjs en build, a partir de lo que de
// verdad hay en public/images/ -- no hay ninguna petición cuyo fallo se
// pueda confundir con "no existe".
let photosCache = null;
let inFlight = null;

function conMeta(photo) {
  return { ...photo, meta: PHOTO_META[photo.id] || null };
}

async function cargarManifest() {
  const res = await fetch(MANIFEST_URL, { cache: "force-cache" });
  if (!res.ok) throw new Error(`No se pudo cargar ${MANIFEST_URL} (${res.status})`);
  const data = await res.json();
  return data.photos.map(conMeta);
}

function ensureLoaded() {
  if (photosCache) return Promise.resolve(photosCache);
  if (!inFlight) {
    inFlight = cargarManifest().then((all) => {
      photosCache = all;
      inFlight = null;
      return all;
    });
  }
  return inFlight;
}

// Dispara la carga del manifest en segundo plano (p.ej. unos segundos
// después de que carga el hero, antes de que el visitante toque la
// tarjeta de Pirotecnia) para que la caché ya esté lista cuando de
// verdad abra la galería y se sienta instantánea.
export function preloadGaleriaImages() {
  ensureLoaded();
}

// A diferencia de preloadGaleriaImages (solo el manifest, texto chico),
// esto sí baja los bytes de verdad de las primeras PRELOAD_COUNT
// miniaturas (las que se ven sin hacer scroll, no las 45) con
// new Image().src -- para cuando el navegador las vuelva a pedir al
// entrar a la Galería, ya las tenga en caché HTTP y se vean al
// instante. A propósito NO se llama sola al montar el shell, ni con
// las 45 -- la dispara solo quien de verdad muestra intención de
// entrar a Pirotecnia (ver ColumnaCristal.jsx/CristalShell.jsx), y
// nunca descarga más de lo que la primera pantalla necesita.
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

    ensureLoaded().then(
      (all) => {
        if (cancelled) return;
        setPhotos(all);
        setStatus("done");
      },
      () => {
        if (cancelled) return;
        setStatus("error");
      }
    );

    return () => {
      cancelled = true;
    };
  }, [active]);

  return { status, photos };
}
