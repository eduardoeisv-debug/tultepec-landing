// Contenido de la galería unificada "Imágenes y videos" del hero. Cada
// categoría apunta a una carpeta en public/images/<folder>/ o
// public/videos/<folder>/ con archivos numerados (01, 02, ...) -- agregar
// una foto o video nuevo solo requiere soltar el archivo numerado en la
// carpeta correspondiente (useGaleriaImages/useGaleriaVideos los detectan
// solos), sin tocar este archivo.
//
// Para ponerle título, descripción o créditos a una foto o video en
// particular, agrega una entrada a PHOTO_META o VIDEO_META usando la llave
// "<folder>/<numero>" (ej. "toritos/03"). Si un archivo no tiene entrada,
// se muestra solo con el nombre de su categoría -- nunca se inventa texto.

export const CHIPS = [
  { id: "todas", label: { es: "Todas", en: "All" } },
  { id: "toritos", label: { es: "Toritos", en: "Toritos" } },
  { id: "castillos", label: { es: "Castillos", en: "Castillos" } },
  { id: "otras", label: { es: "Otras", en: "Other" } },
];

export const IMAGE_CATEGORIES = [
  { folder: "toritos", chip: "toritos", label: { es: "Toritos", en: "Toritos" } },
  {
    folder: "castillos-monumentales",
    chip: "castillos",
    label: { es: "Castillos monumentales", en: "Monumental Castillos" },
  },
  { folder: "san-juan-de-dios", chip: "otras", label: { es: "Religión", en: "Religion" } },
  { folder: "talleres-familiares", chip: "otras", label: { es: "Talleres familiares", en: "Family workshops" } },
  { folder: "mojigangas", chip: "otras", label: { es: "Mojigangas", en: "Mojigangas" } },
];

export const VIDEO_CATEGORIES = [
  { folder: "toritos", label: { es: "Toritos", en: "Toritos" } },
  {
    folder: "castillos-monumentales",
    label: { es: "Castillos monumentales", en: "Monumental Castillos" },
  },
  { folder: "piromusicales", label: { es: "Piromusicales", en: "Musical fireworks" } },
];

// Metadatos opcionales por archivo: { titulo: {es,en}, descripcion: {es,en},
// creditos: {es,en}, duracion: "2:14" }. Vacío hasta que haya datos reales.
export const PHOTO_META = {};
export const VIDEO_META = {};
