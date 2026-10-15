// Ficha de los libros de la antología "Memorias de mi Pueblo" (3 tomos),
// mostrados en la ventana "Relatos Escritos". Portada, título, subtítulo y
// tomo son datos reales (fotos en Fotos_Libros/, procesadas y copiadas a
// public/images/libros/). `autor`, `descripcion` y `precio` van en null
// hasta tener el dato real -- RelatosModal.jsx oculta esos campos por
// completo en vez de mostrar un marcador de "dato pendiente".
//
// TODO (pendiente de confirmar, no inventar):
// - Autor/es, descripción breve y precio de cada tomo.
// - Número de WhatsApp de Juana Antonieta Zúñiga Urbán (CONTACTOS más abajo).
// - libro-3.jpeg se fotografió con un ligero ángulo/rotación, lo que deja
//   una cuña oscura de fondo visible en las esquinas superiores que un
//   recorte rectangular simple no puede quitar sin cortar la portada real.
//   Si se puede, reemplazar por un escaneo plano o una foto mejor
//   encuadrada. libro-1.jpeg ya se recortó (se quitó el margen negro
//   superior de la foto); el resto del negro visible en las tres
//   portadas es arte original de la ilustración (lunas, siluetas), no
//   fondo de foto.

// Dos personas del grupo "Memorias de mi Pueblo" atienden las preguntas
// sobre los libros por WhatsApp. `numero` en formato internacional, solo
// dígitos (sin "+", espacios ni guiones): 52 = México, 1 = celular,
// resto el número -- ejemplo real: "5215512345678". Mientras no se
// confirme el número de alguien, se deja en null (no inventar) y
// RelatosModal.jsx muestra su nombre sin enlace, en vez de un número
// inventado.
export const CONTACTOS = [
  {
    nombre: "Fernando Manuel Torices Ramírez",
    rol: { es: "Profesor", en: "Teacher" },
    numero: "5215531251510",
  },
  {
    nombre: "Juana Antonieta Zúñiga Urbán",
    rol: { es: "Profesora", en: "Teacher" },
    numero: null, // TODO: reemplazar cuando se confirme
  },
];

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
