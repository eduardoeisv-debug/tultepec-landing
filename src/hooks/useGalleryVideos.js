import { useEffect, useState } from "react";
import { probeVideoVariants } from "../lib/videoProbe.js";

const MAX_VIDEOS = 12;

// Prueba public/videos/<category>/01.* .. 12.* (mp4, webm, mov) y devuelve,
// en orden, solo las que sí existen. Mismo patrón que useGalleryImages.
export default function useGalleryVideos(category, active) {
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (!active || !category) return undefined;

    const controller = new AbortController();
    setStatus("loading");

    const basePaths = Array.from({ length: MAX_VIDEOS }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `/videos/${category}/${n}`;
    });

    Promise.all(basePaths.map((base) => probeVideoVariants(base, controller.signal))).then((results) => {
      if (controller.signal.aborted) return;
      setVideos(results.filter(Boolean));
      setStatus("done");
    });

    return () => {
      controller.abort();
    };
  }, [category, active]);

  return { status, videos };
}
