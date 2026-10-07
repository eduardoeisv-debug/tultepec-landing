// Calendario de fiestas de Tultepec, mes por mes. Edita este archivo para
// agregar, quitar o corregir eventos -- cada mes es un objeto con un
// arreglo `eventos` (puede estar vacío).
//
// Campos de cada evento: { nombre, fecha, descripcion }.
//
// Solo se completaron con datos reales los eventos que ya aparecían en el
// sitio (San Juan de Dios y Natividad de María, con su fecha exacta). Para
// Día de Muertos, Navidad, Semana Santa y Santa Cecilia se usó únicamente
// la fecha/temporada en la que esas celebraciones caen a nivel nacional
// (son fechas públicas, no específicas de Tultepec); el detalle de cómo
// se festejan en el pueblo queda marcado "POR VERIFICAR". Los meses sin
// ningún evento confirmado también quedan marcados así.

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
        fecha: "Fecha variable (marzo o abril, según el año) — POR VERIFICAR",
        descripcion: "POR VERIFICAR",
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
    eventos: [
      {
        nombre: "Natividad de María",
        fecha: "8 de septiembre",
        descripcion: "POR VERIFICAR",
      },
    ],
  },
  { mes: 10, mesNombre: "Octubre", eventos: [] },
  {
    mes: 11,
    mesNombre: "Noviembre",
    eventos: [
      {
        nombre: "Día de Muertos",
        fecha: "1 y 2 de noviembre (fecha nacional) — POR VERIFICAR festejo local",
        descripcion: "POR VERIFICAR",
      },
      {
        nombre: "Santa Cecilia",
        fecha: "POR VERIFICAR",
        descripcion: "POR VERIFICAR",
      },
    ],
  },
  {
    mes: 12,
    mesNombre: "Diciembre",
    eventos: [
      {
        nombre: "Navidad",
        fecha: "25 de diciembre (fecha nacional) — POR VERIFICAR festejo local",
        descripcion: "POR VERIFICAR",
      },
    ],
  },
];

export default fiestas;
