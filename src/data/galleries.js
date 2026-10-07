// Categorías de fotos. Cada una corresponde a una carpeta en
// public/images/<slug>/ con fotos numeradas: 01.jpg, 02.jpg, ...
// El número controla el orden en que aparecen en el álbum. `label` es
// bilingüe -- los nombres propios de las piezas (Toritos, Mojigangas) se
// dejan igual en inglés, como "piñata" o "mariachi", porque traducirlos
// perdería el significado específico.
export const GALLERY_CATEGORIES = [
  { slug: "castillos-monumentales", label: { es: "Castillos monumentales", en: "Monumental Castillos" } },
  { slug: "san-juan-de-dios", label: { es: "Religión", en: "Religion" } },
  { slug: "talleres-familiares", label: { es: "Talleres familiares", en: "Family workshops" } },
  { slug: "toritos", label: { es: "Toritos", en: "Toritos" } },
  { slug: "mojigangas", label: { es: "Mojigangas", en: "Mojigangas" } },
];

export function coverImage(slug) {
  return `/images/${slug}/01`;
}

// Categorías de video. Cada una corresponde a una carpeta en
// public/videos/<slug>/ con videos numerados: 01.mp4, 02.mp4, ...
export const VIDEO_CATEGORIES = [
  { slug: "toritos", label: { es: "Toritos", en: "Toritos" } },
  { slug: "castillos-monumentales", label: { es: "Castillos monumentales", en: "Monumental Castillos" } },
  { slug: "piromusicales", label: { es: "Piromusicales", en: "Musical fireworks" } },
];

export function coverVideo(slug) {
  return `/videos/${slug}/01`;
}
