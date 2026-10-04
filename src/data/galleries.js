// Categorías de fotos. Cada una corresponde a una carpeta en
// public/images/<slug>/ con fotos numeradas: 01.jpg, 02.jpg, ...
// El número controla el orden en que aparecen en el álbum.
export const GALLERY_CATEGORIES = [
  { slug: "castillos-monumentales", label: "Castillos monumentales" },
  { slug: "san-juan-de-dios", label: "San Juan de Dios" },
  { slug: "talleres-familiares", label: "Talleres familiares" },
  { slug: "toritos", label: "Toritos" },
  { slug: "mojigangas", label: "Mojigangas" },
];

export function coverImage(slug) {
  return `/images/${slug}/01`;
}

// Categorías de video. Cada una corresponde a una carpeta en
// public/videos/<slug>/ con videos numerados: 01.mp4, 02.mp4, ...
export const VIDEO_CATEGORIES = [
  { slug: "toritos", label: "Toritos" },
  { slug: "castillos-monumentales", label: "Castillos monumentales" },
  { slug: "piromusicales", label: "Piromusicales" },
];

export function coverVideo(slug) {
  return `/videos/${slug}/01`;
}
