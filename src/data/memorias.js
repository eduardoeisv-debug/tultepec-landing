// Fragmentos de los 3 libros de la antología "Memorias de mi Pueblo",
// mostrados en la pestaña "Memorias de mi pueblo" del modal que abre la
// tarjeta del mismo nombre en el hero. `titulo` y `texto` son bilingües
// ({ es, en }) y se leen con pick(), igual que el resto del sitio --
// `autor` se queda como un solo valor porque un nombre propio no se
// traduce.
//
// IMPORTANTE: reemplaza cada fragmento marcado "[TEXTO DE EJEMPLO]" por el
// texto real tomado del libro correspondiente (el `es`, cita textual, sin
// resumir ni parafrasear). El campo `en` de esos fragmentos reales se
// genera traduciendo ese texto en español -- márcalo con un comentario
// TODO para que alguien que domine inglés lo revise antes de publicarlo,
// igual que se hizo con src/data/historia.js.

// Chips del filtro de la pestaña 1, uno por tomo (sin "Todos"). `id`
// coincide con el `libro` de cada fragmento de abajo y con el `id` de
// src/data/libros.js (tomo-1/2/3), para poder cruzar datos si hace falta.
export const LIBRO_FILTROS = [
  { id: "tomo-1", label: { es: "Libro I", en: "Book I" } },
  { id: "tomo-2", label: { es: "Libro II", en: "Book II" } },
  { id: "tomo-3", label: { es: "Libro III", en: "Book III" } },
];

export const MEMORIAS = [
  {
    id: "memoria-1",
    libro: "tomo-1",
    autor: "[TEXTO DE EJEMPLO] Nombre de la autora o el autor",
    titulo: null,
    anio: null,
    texto: {
      es: "[TEXTO DE EJEMPLO] Aquí va el fragmento real tomado del Libro I de \"Memorias de mi Pueblo\", tal como aparece publicado. Debe ser una cita textual del libro, no un resumen ni una paráfrasis -- cópialo tal cual del tomo correspondiente, incluyendo la puntuación y los acentos originales.",
      en: "[SAMPLE TEXT] This is where the real fragment from Book I of \"Memorias de mi Pueblo\" goes, exactly as published. It must be a direct quote from the book, not a summary or paraphrase -- copy it as-is from the corresponding volume, including its original punctuation and accents.",
    },
  },
  {
    id: "memoria-2",
    libro: "tomo-1",
    autor: "[TEXTO DE EJEMPLO] Nombre de la autora o el autor",
    titulo: {
      es: "[TEXTO DE EJEMPLO] Título del relato (opcional)",
      en: "[SAMPLE TEXT] Story title (optional)",
    },
    anio: null,
    texto: {
      es: "[TEXTO DE EJEMPLO] Segundo fragmento de ejemplo del Libro I. Puede incluir varias oraciones -- la tarjeta recorta el texto a unas líneas y agrega el botón \"Leer más\" automáticamente si el fragmento es largo.",
      en: "[SAMPLE TEXT] Second sample fragment from Book I. It can include several sentences -- the card clips the text to a few lines and adds the \"Read more\" button automatically when the fragment is long.",
    },
  },
  {
    id: "memoria-3",
    libro: "tomo-2",
    autor: "[TEXTO DE EJEMPLO] Nombre de la autora o el autor",
    titulo: null,
    anio: null,
    texto: {
      es: "[TEXTO DE EJEMPLO] Fragmento de ejemplo del Libro II. Reemplázalo por una cita real del segundo tomo de \"Memorias de mi Pueblo\".",
      en: "[SAMPLE TEXT] Sample fragment from Book II. Replace it with a real quote from the second volume of \"Memorias de mi Pueblo\".",
    },
  },
  {
    id: "memoria-4",
    libro: "tomo-2",
    autor: "[TEXTO DE EJEMPLO] Nombre de la autora o el autor",
    titulo: {
      es: "[TEXTO DE EJEMPLO] Título del relato (opcional)",
      en: "[SAMPLE TEXT] Story title (optional)",
    },
    anio: null,
    texto: {
      es: "[TEXTO DE EJEMPLO] Segundo fragmento de ejemplo del Libro II, un poco más largo para probar cómo se ve el botón \"Leer más\" cuando el texto no cabe completo en la tarjeta en celular.",
      en: "[SAMPLE TEXT] Second sample fragment from Book II, a bit longer to test how the \"Read more\" button looks when the fragment doesn't fit fully in the card on mobile.",
    },
  },
  {
    id: "memoria-5",
    libro: "tomo-3",
    autor: "[TEXTO DE EJEMPLO] Nombre de la autora o el autor",
    titulo: null,
    anio: null,
    texto: {
      es: "[TEXTO DE EJEMPLO] Fragmento de ejemplo del Libro III. Reemplázalo por una cita real del tercer tomo de \"Memorias de mi Pueblo\".",
      en: "[SAMPLE TEXT] Sample fragment from Book III. Replace it with a real quote from the third volume of \"Memorias de mi Pueblo\".",
    },
  },
  {
    id: "memoria-6",
    libro: "tomo-3",
    autor: "[TEXTO DE EJEMPLO] Nombre de la autora o el autor",
    titulo: {
      es: "[TEXTO DE EJEMPLO] Título del relato (opcional)",
      en: "[SAMPLE TEXT] Story title (optional)",
    },
    anio: null,
    texto: {
      es: "[TEXTO DE EJEMPLO] Segundo fragmento de ejemplo del Libro III, para completar dos tarjetas por tomo y poder probar el filtro de libros con contenido real en cada categoría.",
      en: "[SAMPLE TEXT] Second sample fragment from Book III, to round out two cards per volume and test the book filter with content in every category.",
    },
  },
];
