// Plantilla para la ficha de libros. Todo aquí es de ejemplo (marcado con
// `placeholder: true`) hasta que se reemplace con los datos reales de los
// 3 libros y el número de contacto. Los campos de texto son bilingües
// ({ es, en }); `price` no se traduce (es solo una cifra).

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
    title: { es: "Datos de ejemplar 1", en: "Sample book 1 details" },
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
    title: { es: "Datos de ejemplar 2", en: "Sample book 2 details" },
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
    title: { es: "Datos de ejemplar 3", en: "Sample book 3 details" },
    author: { es: "Autor o autora", en: "Author" },
    description: {
      es: "Breve descripción de una o dos líneas sobre el contenido del libro.",
      en: "Brief one- or two-line description of the book's content.",
    },
    price: "$000 MXN",
    placeholder: true,
  },
];
