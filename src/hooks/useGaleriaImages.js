import { useEffect, useState } from "react";
import { probeImageVariants } from "../lib/imageProbe.js";
import { IMAGE_CATEGORIES, PHOTO_META } from "../data/galeria.js";

const MAX_PHOTOS = 20;

// Prueba public/images/<folder>/01.* .. 20.* para cada categoría de
// IMAGE_CATEGORIES (en paralelo) y devuelve una sola lista combinada de
// fotos, cada una con su categoría/chip y los metadatos opcionales de
// PHOTO_META (si existen). El orden respeta IMAGE_CATEGORIES y, dentro de
// cada categoría, el número del archivo.
export default function useGaleriaImages(active) {
  const [status, setStatus] = useState("idle"); // idle | loading | done
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (!active) return undefined;

    const controller = new AbortController();
    setStatus("loading");

    const work = IMAGE_CATEGORIES.map(async (cat) => {
      const slots = Array.from({ length: MAX_PHOTOS }, (_, i) => String(i + 1).padStart(2, "0"));
      const results = await Promise.all(
        slots.map(async (n) => {
          const src = await probeImageVariants(`/images/${cat.folder}/${n}`, controller.signal);
          if (!src) return null;
          const metaKey = `${cat.folder}/${n}`;
          return {
            id: metaKey,
            src,
            folder: cat.folder,
            chip: cat.chip,
            categoryLabel: cat.label,
            meta: PHOTO_META[metaKey] || null,
          };
        })
      );
      return results.filter(Boolean);
    });

    Promise.all(work).then((perCategory) => {
      if (controller.signal.aborted) return;
      setPhotos(perCategory.flat());
      setStatus("done");
    });

    return () => controller.abort();
  }, [active]);

  return { status, photos };
}
