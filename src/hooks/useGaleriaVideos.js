import { useEffect, useState } from "react";
import { probeVideoVariants } from "../lib/videoProbe.js";
import { VIDEO_CATEGORIES, VIDEO_META } from "../data/galeria.js";

const MAX_VIDEOS = 20; // tope de seguridad, no el número de peticiones reales
const BATCH_SIZE = 8;

// Mismo patrón de caché + sondeo por lotes + precarga que
// useGaleriaImages.js -- ver los comentarios ahí para el porqué.
let videosCache = null;
let inFlight = null;

async function probeCategoryBatched(folder) {
  const found = [];
  for (let start = 1; start <= MAX_VIDEOS; start += BATCH_SIZE) {
    const batchNums = [];
    for (let i = start; i < start + BATCH_SIZE && i <= MAX_VIDEOS; i++) {
      batchNums.push(String(i).padStart(2, "0"));
    }
    const batchResults = await Promise.all(
      batchNums.map((n) => probeVideoVariants(`/videos/${folder}/${n}`).then((src) => ({ n, src })))
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
  const work = VIDEO_CATEGORIES.map(async (cat) => {
    const found = await probeCategoryBatched(cat.folder);
    return found.map((item) => ({
      id: item.id,
      src: item.src,
      folder: item.folder,
      categoryLabel: cat.label,
      meta: VIDEO_META[item.metaKey] || null,
    }));
  });
  return Promise.all(work).then((perCategory) => perCategory.flat());
}

function ensureLoaded() {
  if (videosCache) return Promise.resolve(videosCache);
  if (!inFlight) {
    inFlight = loadAll().then((all) => {
      videosCache = all;
      inFlight = null;
      return all;
    });
  }
  return inFlight;
}

export function preloadGaleriaVideos() {
  ensureLoaded();
}

export default function useGaleriaVideos(active) {
  const [status, setStatus] = useState(videosCache ? "done" : "idle");
  const [videos, setVideos] = useState(videosCache || []);

  useEffect(() => {
    if (!active) return undefined;
    if (videosCache) {
      setVideos(videosCache);
      setStatus("done");
      return undefined;
    }

    let cancelled = false;
    setStatus("loading");

    ensureLoaded().then((all) => {
      if (cancelled) return;
      setVideos(all);
      setStatus("done");
    });

    return () => {
      cancelled = true;
    };
  }, [active]);

  return { status, videos };
}
