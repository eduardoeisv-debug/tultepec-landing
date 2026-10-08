// Fragmentos de los 3 libros de la antología "Memorias de mi Pueblo",
// mostrados en la pestaña "Memorias de mi pueblo" del modal que abre la
// tarjeta del mismo nombre en el hero. `texto` y `autor` son citas
// textuales de los libros: se quedan siempre en español (nunca pasan por
// pick()), incluso con la página en inglés -- MemoriesModal muestra una
// nota aclarando que los textos originales están en español.
//
// IMPORTANTE: reemplaza cada fragmento marcado "[TEXTO DE EJEMPLO]" por el
// texto real tomado del libro correspondiente. No se debe publicar
// contenido de ejemplo -- son solo relleno para armar el diseño.

// Chips del filtro de la pestaña 1 ("Todos" + un chip por tomo). `id`
// coincide con el `libro` de cada fragmento de abajo y con el `id` de
// src/data/libros.js (tomo-1/2/3), para poder cruzar datos si hace falta.
export const LIBRO_FILTROS = [
  { id: "todos", label: { es: "Todos", en: "All" } },
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
    texto:
      "[TEXTO DE EJEMPLO] Aquí va el fragmento real tomado del Libro I de \"Memorias de mi Pueblo\", tal como aparece publicado. Debe ser una cita textual del libro, no un resumen ni una paráfrasis -- cópialo tal cual del tomo correspondiente, incluyendo la puntuación y los acentos originales.",
  },
  {
    id: "memoria-2",
    libro: "tomo-1",
    autor: "[TEXTO DE EJEMPLO] Nombre de la autora o el autor",
    titulo: "[TEXTO DE EJEMPLO] Título del relato (opcional)",
    anio: null,
    texto:
      "[TEXTO DE EJEMPLO] Segundo fragmento de ejemplo del Libro I. Puede incluir varias oraciones -- la tarjeta recorta el texto a unas líneas y agrega el botón \"Leer más\" automáticamente si el fragmento es largo.",
  },
  {
    id: "memoria-3",
    libro: "tomo-2",
    autor: "[TEXTO DE EJEMPLO] Nombre de la autora o el autor",
    titulo: null,
    anio: null,
    texto:
      "[TEXTO DE EJEMPLO] Fragmento de ejemplo del Libro II. Reemplázalo por una cita real del segundo tomo de \"Memorias de mi Pueblo\".",
  },
  {
    id: "memoria-4",
    libro: "tomo-2",
    autor: "[TEXTO DE EJEMPLO] Nombre de la autora o el autor",
    titulo: "[TEXTO DE EJEMPLO] Título del relato (opcional)",
    anio: null,
    texto:
      "[TEXTO DE EJEMPLO] Segundo fragmento de ejemplo del Libro II, un poco más largo para probar cómo se ve el botón \"Leer más\" cuando el texto no cabe completo en la tarjeta en celular.",
  },
  {
    id: "memoria-5",
    libro: "tomo-3",
    autor: "[TEXTO DE EJEMPLO] Nombre de la autora o el autor",
    titulo: null,
    anio: null,
    texto:
      "[TEXTO DE EJEMPLO] Fragmento de ejemplo del Libro III. Reemplázalo por una cita real del tercer tomo de \"Memorias de mi Pueblo\".",
  },
  {
    id: "memoria-6",
    libro: "tomo-3",
    autor: "[TEXTO DE EJEMPLO] Nombre de la autora o el autor",
    titulo: "[TEXTO DE EJEMPLO] Título del relato (opcional)",
    anio: null,
    texto:
      "[TEXTO DE EJEMPLO] Segundo fragmento de ejemplo del Libro III, para completar dos tarjetas por tomo y poder probar el filtro de libros con contenido real en cada categoría.",
  },
];
