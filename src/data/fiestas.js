// Calendario de fiestas de Tultepec, mes por mes. Edita este archivo para
// agregar, quitar o corregir eventos -- cada mes es un objeto con un
// arreglo `eventos` (puede estar vacío).
//
// Campos de cada evento: { nombre, fecha, descripcion }, cada uno bilingüe
// como { es, en }. `fecha` y `descripcion` son opcionales: si no hay dato
// confirmado, omite el campo -- FiestasStrip.jsx no renderiza esa línea
// cuando está vacía, así que nunca se muestra texto de relleno en la UI.
//
// TODO (datos pendientes de confirmar con el pueblo, no inventar):
// - Semana Santa: fecha exacta del año (es movible; aquí solo se indica
//   que cae en marzo o abril). La descripción es genérica (celebración
//   religiosa nacional) -- falta el detalle de cómo se festeja en
//   Tultepec específicamente.
// - Natividad de María (8 de septiembre): descripción del festejo local.
// - Día de Muertos (1-2 de noviembre, fecha nacional): descripción del
//   festejo local.
// - Santa Cecilia: fecha exacta y descripción -- no hay dato alguno aún.
// - Navidad (25 de diciembre, fecha nacional): descripción del festejo
//   local.
// - Enero, febrero, abril, mayo, junio, julio, agosto y octubre: sin
//   ningún evento confirmado todavía.

const fiestas = [
  { mes: 1, mesNombre: { es: "Enero", en: "January" }, eventos: [] },
  { mes: 2, mesNombre: { es: "Febrero", en: "February" }, eventos: [] },
  {
    mes: 3,
    mesNombre: { es: "Marzo", en: "March" },
    eventos: [
      {
        nombre: { es: "San Juan de Dios", en: "San Juan de Dios" },
        fecha: { es: "8 de marzo", en: "March 8" },
        descripcion: {
          es: "Fiesta patronal de los pirotécnicos de Tultepec; es el origen documentado de la tradición del pueblo.",
          en: "Patron saint feast of Tultepec's pyrotechnic artisans; the documented origin of the town's tradition.",
        },
      },
      {
        nombre: { es: "Semana Santa", en: "Holy Week" },
        fecha: { es: "Fecha variable (marzo o abril, según el año)", en: "Variable date (March or April, depending on the year)" },
        descripcion: {
          es: "Celebraciones religiosas previas a la temporada de fiestas del pueblo.",
          en: "Religious observances ahead of the town's festival season.",
        },
      },
    ],
  },
  { mes: 4, mesNombre: { es: "Abril", en: "April" }, eventos: [] },
  { mes: 5, mesNombre: { es: "Mayo", en: "May" }, eventos: [] },
  { mes: 6, mesNombre: { es: "Junio", en: "June" }, eventos: [] },
  { mes: 7, mesNombre: { es: "Julio", en: "July" }, eventos: [] },
  { mes: 8, mesNombre: { es: "Agosto", en: "August" }, eventos: [] },
  {
    mes: 9,
    mesNombre: { es: "Septiembre", en: "September" },
    eventos: [
      {
        nombre: { es: "Natividad de María", en: "Nativity of Mary" },
        fecha: { es: "8 de septiembre", en: "September 8" },
      },
    ],
  },
  { mes: 10, mesNombre: { es: "Octubre", en: "October" }, eventos: [] },
  {
    mes: 11,
    mesNombre: { es: "Noviembre", en: "November" },
    eventos: [
      {
        nombre: { es: "Día de Muertos", en: "Day of the Dead" },
        fecha: { es: "1 y 2 de noviembre (fecha nacional)", en: "November 1-2 (national date)" },
      },
      { nombre: { es: "Santa Cecilia", en: "Santa Cecilia" } },
    ],
  },
  {
    mes: 12,
    mesNombre: { es: "Diciembre", en: "December" },
    eventos: [
      {
        nombre: { es: "Navidad", en: "Christmas" },
        fecha: { es: "25 de diciembre (fecha nacional)", en: "December 25 (national date)" },
      },
    ],
  },
];

export default fiestas;
