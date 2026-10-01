// Categorías de fotos del mosaico del hero. Cada una corresponde a una
// carpeta en public/images/<slug>/ con fotos numeradas: 01.jpg, 02.jpg, ...
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
