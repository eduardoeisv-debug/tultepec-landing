import { useEffect, useState } from "react";
import { probeVideoVariants } from "../lib/videoProbe.js";
import { VIDEO_CATEGORIES, VIDEO_META } from "../data/galeria.js";

const MAX_VIDEOS = 12;

// Igual que useGaleriaImages, pero para video: combina las tres categorías
// de VIDEO_CATEGORIES en una sola lista de tarjetas, cada una con sus
// metadatos opcionales (título, descripción, duración) si existen.
export default function useGaleriaVideos(active) {
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!active) return undefined;

    const controller = new AbortController();
    setStatus("loading");

    const work = VIDEO_CATEGORIES.map(async (cat) => {
      const slots = Array.from({ length: MAX_VIDEOS }, (_, i) => String(i + 1).padStart(2, "0"));
      const results = await Promise.all(
        slots.map(async (n) => {
          const src = await probeVideoVariants(`/videos/${cat.folder}/${n}`, controller.signal);
          if (!src) return null;
          const metaKey = `${cat.folder}/${n}`;
          return {
            id: metaKey,
            src,
            folder: cat.folder,
            categoryLabel: cat.label,
            meta: VIDEO_META[metaKey] || null,
          };
        })
      );
      return results.filter(Boolean);
    });

    Promise.all(work).then((perCategory) => {
      if (controller.signal.aborted) return;
      setVideos(perCategory.flat());
      setStatus("done");
    });

    return () => controller.abort();
  }, [active]);

  return { status, videos };
}
