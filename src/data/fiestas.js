// Calendario de fiestas de Tultepec, mes por mes. Edita este archivo para
// agregar, quitar o corregir eventos -- cada mes es un objeto con un
// arreglo `eventos` (puede estar vacío).
//
// Campos de cada evento: { nombre, fecha, descripcion }. `fecha` y
// `descripcion` son opcionales: si no hay dato confirmado, omite el campo
// o déjalo como "" -- FiestasStrip.jsx no renderiza esa línea cuando está
// vacía, así que nunca se muestra texto de relleno en la UI.
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
  { mes: 1, mesNombre: "Enero", eventos: [] },
  { mes: 2, mesNombre: "Febrero", eventos: [] },
  {
    mes: 3,
    mesNombre: "Marzo",
    eventos: [
      {
        nombre: "San Juan de Dios",
        fecha: "8 de marzo",
        descripcion:
          "Fiesta patronal de los pirotécnicos de Tultepec; es el origen documentado de la tradición del pueblo.",
      },
      {
        nombre: "Semana Santa",
        fecha: "Fecha variable (marzo o abril, según el año)",
        descripcion: "Celebraciones religiosas previas a la temporada de fiestas del pueblo.",
      },
    ],
  },
  { mes: 4, mesNombre: "Abril", eventos: [] },
  { mes: 5, mesNombre: "Mayo", eventos: [] },
  { mes: 6, mesNombre: "Junio", eventos: [] },
  { mes: 7, mesNombre: "Julio", eventos: [] },
  { mes: 8, mesNombre: "Agosto", eventos: [] },
  {
    mes: 9,
    mesNombre: "Septiembre",
    eventos: [{ nombre: "Natividad de María", fecha: "8 de septiembre" }],
  },
  { mes: 10, mesNombre: "Octubre", eventos: [] },
  {
    mes: 11,
    mesNombre: "Noviembre",
    eventos: [
      { nombre: "Día de Muertos", fecha: "1 y 2 de noviembre (fecha nacional)" },
      { nombre: "Santa Cecilia" },
    ],
  },
  {
    mes: 12,
    mesNombre: "Diciembre",
    eventos: [{ nombre: "Navidad", fecha: "25 de diciembre (fecha nacional)" }],
  },
];

export default fiestas;
