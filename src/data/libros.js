// Ficha de los libros de la antología "Memorias de mi Pueblo" (3 tomos),
// mostrados en la ventana "Relatos Escritos". Portada, título, subtítulo y
// tomo son datos reales (fotos en Fotos_Libros/, procesadas y copiadas a
// public/images/libros/). `autor`, `descripcion` y `precio` van en null
// hasta tener el dato real -- RelatosModal.jsx oculta esos campos por
// completo en vez de mostrar un marcador de "dato pendiente".
//
// TODO (pendiente de confirmar, no inventar):
// - Autor/es, descripción breve y precio de cada tomo.
// - WHATSAPP_NUMBER: reemplazar con el número real de contacto.
// - libro-3.jpeg se fotografió con un ligero ángulo/rotación, lo que deja
//   una cuña oscura de fondo visible en las esquinas superiores que un
//   recorte rectangular simple no puede quitar sin cortar la portada real.
//   Si se puede, reemplazar por un escaneo plano o una foto mejor
//   encuadrada. libro-1.jpeg ya se recortó (se quitó el margen negro
//   superior de la foto); el resto del negro visible en las tres
//   portadas es arte original de la ilustración (lunas, siluetas), no
//   fondo de foto.

// Formato internacional, solo dígitos (sin "+", espacios ni guiones).
// Ejemplo real: "5215512345678" (52 = México, 1 = celular, resto el número).
export const WHATSAPP_NUMBER = "5210000000000"; // TODO: reemplazar con el número real

export const LIBROS = [
  {
    id: "tomo-1",
    tomo: "I",
    titulo: { es: "Memorias de mi Pueblo", en: "Memories of my Town" },
    subtitulo: { es: "Antología narrativa", en: "Narrative anthology" },
    portada: "/images/libros/libro-1.jpeg",
    autor: null,
    descripcion: null,
    precio: null,
  },
  {
    id: "tomo-2",
    tomo: "II",
    titulo: { es: "Memorias de mi Pueblo", en: "Memories of my Town" },
    subtitulo: { es: "Antología narrativa", en: "Narrative anthology" },
    portada: "/images/libros/libro-2.jpeg",
    autor: null,
    descripcion: null,
    precio: null,
  },
  {
    id: "tomo-3",
    tomo: "III",
    titulo: { es: "Memorias de mi Pueblo", en: "Memories of my Town" },
    subtitulo: { es: "Antología narrativa", en: "Narrative anthology" },
    portada: "/images/libros/libro-3.jpeg",
    autor: null,
    descripcion: null,
    precio: null,
  },
];
