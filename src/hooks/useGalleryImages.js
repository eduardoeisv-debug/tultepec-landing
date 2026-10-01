import { useEffect, useState } from "react";
import { probeImageVariants } from "../lib/imageProbe.js";

const MAX_PHOTOS = 20;

// Prueba public/images/<category>/01.* .. 20.* (con extensiones comunes:
// jpg, jpeg, png, webp, jfif) y devuelve, en orden, solo las que sí existen.
// Así el orden del álbum lo controla el nombre del archivo, y agregar o
// quitar fotos no requiere tocar código.
export default function useGalleryImages(category, active) {
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!active || !category) return undefined;

    let cancelled = false;
    setStatus("loading");

    const basePaths = Array.from({ length: MAX_PHOTOS }, (_, i) => {
      const n = String(i + 1).padStart(2, "0");
      return `/images/${category}/${n}`;
    });

    Promise.all(basePaths.map((base) => probeImageVariants(base))).then((results) => {
      if (cancelled) return;
      setImages(results.filter(Boolean));
      setStatus("done");
    });

    return () => {
      cancelled = true;
    };
  }, [category, active]);

  return { status, images };
}
