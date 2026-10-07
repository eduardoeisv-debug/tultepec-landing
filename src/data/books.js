// Ficha de los 3 libros de la antología "Memorias de mi Pueblo". Título,
// subtítulo y portada son datos reales (fotos en Fotos_Libros/, copiadas a
// public/images/libros/). Autor, descripción y precio siguen sin
// confirmar -- `placeholder: true` marca justo esos campos, no el libro
// completo, y BooksModal.jsx lo muestra como "Autor y precio por
// confirmar" en vez de dar a entender que todo el libro es de ejemplo.

// Formato internacional, solo dígitos (sin "+", espacios ni guiones).
// Ejemplo real: "5215512345678" (52 = México, 1 = celular, resto el número).
export const WHATSAPP_NUMBER = "5210000000000"; // TODO: reemplazar con el número real

export const WHATSAPP_DEFAULT_MESSAGE = {
  es: "Hola, quiero más información sobre los libros de memorias de Tultepec.",
  en: "Hi, I'd like more information about the Tultepec memory books.",
};

export const BOOKS = [
  {
    id: "libro-1",
    title: { es: "Memorias de mi Pueblo I", en: "Memories of my Town I" },
    subtitle: { es: "Antología narrativa", en: "Narrative anthology" },
    cover: "/images/libros/libro-1.jpeg",
    author: { es: "Autor o autora", en: "Author" },
    description: {
      es: "Breve descripción de una o dos líneas sobre el contenido del libro.",
      en: "Brief one- or two-line description of the book's content.",
    },
    price: "$000 MXN",
    placeholder: true,
  },
  {
    id: "libro-2",
    title: { es: "Memorias de mi Pueblo II", en: "Memories of my Town II" },
    subtitle: { es: "Antología narrativa", en: "Narrative anthology" },
    cover: "/images/libros/libro-2.jpeg",
    author: { es: "Autor o autora", en: "Author" },
    description: {
      es: "Breve descripción de una o dos líneas sobre el contenido del libro.",
      en: "Brief one- or two-line description of the book's content.",
    },
    price: "$000 MXN",
    placeholder: true,
  },
  {
    id: "libro-3",
    title: { es: "Memorias de mi Pueblo III", en: "Memories of my Town III" },
    subtitle: { es: "Antología narrativa", en: "Narrative anthology" },
    cover: "/images/libros/libro-3.jpeg",
    author: { es: "Autor o autora", en: "Author" },
    description: {
      es: "Breve descripción de una o dos líneas sobre el contenido del libro.",
      en: "Brief one- or two-line description of the book's content.",
    },
    price: "$000 MXN",
    placeholder: true,
  },
];
