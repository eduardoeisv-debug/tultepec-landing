// Calendario de fiestas de Tultepec, mes por mes. Contenido tomado
// íntegramente de Documentos/Eventos_Tultepec_2026.csv (hoja compartida
// por el pueblo) -- no se agregó ningún evento, fecha o lugar que no
// esté en ese archivo. Dentro de cada mes, los eventos van en el mismo
// orden cronológico en que aparecen en la hoja. La columna "Lugar" del
// CSV se usa como `descripcion` de cada evento.
//
// Campos de cada evento: { nombre, fecha, descripcion }, cada uno bilingüe
// como { es, en }. `fecha` y `descripcion` son opcionales: si no hay dato
// confirmado, omite el campo -- FiestasStrip.jsx no renderiza esa línea
// cuando está vacía, así que nunca se muestra texto de relleno en la UI.
//
// La Feria Internacional de la Pirotecnia corre del 27 de febrero al 15
// de marzo, pero solo se lista una vez (en febrero, su mes de inicio)
// para no duplicarla en los dos meses.
//
// Los campos `en` se generaron a partir del texto en español ya aprobado
// y llevan TODO: revisar traducción -- falta que alguien que domine el
// inglés los revise antes de publicarlos con confianza.

const fiestas = [
  {
    mes: 1,
    mesNombre: { es: "Enero", en: "January" },
    eventos: [
      {
        nombre: { es: "Día de Reyes", en: "Three Kings' Day" /* TODO: revisar traducción */ },
        fecha: { es: "6 de enero", en: "January 6" },
        descripcion: { es: "Parroquias locales", en: "Local parishes" /* TODO: revisar traducción */ },
      },
      {
        nombre: {
          es: "Festividad del Niño Jesús de las Palomitas",
          en: "Feast of the Niño Jesús de las Palomitas" /* TODO: revisar traducción */,
        },
        fecha: { es: "7 de enero", en: "January 7" },
        descripcion: { es: "Barrios tradicionales", en: "Traditional neighborhoods" /* TODO: revisar traducción */ },
      },
      {
        nombre: {
          es: "Peregrinación de Ciclistas a la Basílica de Guadalupe",
          en: "Cyclists' Pilgrimage to the Basílica de Guadalupe" /* TODO: revisar traducción */,
        },
        fecha: { es: "11 de enero", en: "January 11" },
        descripcion: { es: "Desde Tultepec a CDMX", en: "From Tultepec to Mexico City" /* TODO: revisar traducción */ },
      },
      {
        nombre: {
          es: "Festividad de la Virgen de Guadalupe",
          en: "Feast of the Virgin of Guadalupe" /* TODO: revisar traducción */,
        },
        fecha: { es: "12 de enero", en: "January 12" },
        descripcion: { es: "Parroquias locales", en: "Local parishes" /* TODO: revisar traducción */ },
      },
      {
        nombre: {
          es: "Peregrinación anual a la Basílica de Guadalupe",
          en: "Annual pilgrimage to the Basílica de Guadalupe" /* TODO: revisar traducción */,
        },
        fecha: { es: "Último jueves de enero", en: "Last Thursday of January" /* TODO: revisar traducción */ },
        descripcion: { es: "CDMX", en: "Mexico City" /* TODO: revisar traducción */ },
      },
      {
        nombre: {
          es: "Festividad de los Dulces Nombres de María",
          en: "Feast of the Holy Names of Mary" /* TODO: revisar traducción */,
        },
        fecha: {
          es: "Último sábado o domingo de enero",
          en: "Last Saturday or Sunday of January" /* TODO: revisar traducción */,
        },
        descripcion: { es: "Comunidades locales", en: "Local communities" /* TODO: revisar traducción */ },
      },
    ],
  },
  {
    mes: 2,
    mesNombre: { es: "Febrero", en: "February" },
    eventos: [
      {
        nombre: { es: "Festividad de la Candelaria", en: "Feast of Candlemas (La Candelaria)" /* TODO: revisar traducción */ },
        fecha: { es: "2 de febrero", en: "February 2" },
        descripcion: { es: "Parroquias locales", en: "Local parishes" /* TODO: revisar traducción */ },
      },
      {
        nombre: {
          es: "Virgen de San Juan de los Lagos (Teyahualco)",
          en: "Virgin of San Juan de los Lagos (Teyahualco)" /* TODO: revisar traducción */,
        },
        fecha: { es: "2 de febrero", en: "February 2" },
        descripcion: { es: "Teyahualco", en: "Teyahualco" },
      },
      {
        nombre: { es: "Miércoles de Ceniza", en: "Ash Wednesday" /* TODO: revisar traducción */ },
        fecha: { es: "18 de febrero", en: "February 18" },
        descripcion: { es: "Parroquias locales", en: "Local parishes" /* TODO: revisar traducción */ },
      },
      {
        nombre: {
          es: "Inauguración Feria Internacional de la Pirotecnia",
          en: "Opening of the Feria Internacional de la Pirotecnia" /* TODO: revisar traducción */,
        },
        fecha: { es: "21 de febrero", en: "February 21" },
        descripcion: { es: "MUNAPI", en: "MUNAPI" },
      },
      {
        nombre: {
          es: "Feria Internacional de la Pirotecnia (conciertos, concursos pirotécnicos, toritos, castillos)",
          en: "Feria Internacional de la Pirotecnia (concerts, fireworks competitions, toritos, castillos)" /* TODO: revisar traducción */,
        },
        fecha: { es: "27 de febrero al 15 de marzo", en: "February 27 – March 15" },
        descripcion: {
          es: "Recinto Ferial y calles de Tultepec",
          en: "Fairgrounds and streets of Tultepec" /* TODO: revisar traducción */,
        },
      },
    ],
  },
  {
    mes: 3,
    mesNombre: { es: "Marzo", en: "March" },
    eventos: [
      {
        nombre: {
          es: "Fiestas Patronales en honor a San Juan de Dios",
          en: "Patron saint feast in honor of San Juan de Dios" /* TODO: revisar traducción */,
        },
        fecha: { es: "7 al 9 de marzo", en: "March 7–9" },
        descripcion: { es: "Centro de Tultepec", en: "Downtown Tultepec" /* TODO: revisar traducción */ },
      },
    ],
  },
  {
    mes: 4,
    mesNombre: { es: "Abril", en: "April" },
    eventos: [
      {
        nombre: {
          es: "Peregrinaciones de Pascua y Semana Santa",
          en: "Easter and Holy Week pilgrimages" /* TODO: revisar traducción */,
        },
        descripcion: { es: "Calles y parroquias", en: "Streets and parishes" /* TODO: revisar traducción */ },
      },
    ],
  },
  {
    mes: 5,
    mesNombre: { es: "Mayo", en: "May" },
    eventos: [
      {
        nombre: { es: "Festividad de la Santa Cruz", en: "Feast of the Holy Cross" /* TODO: revisar traducción */ },
        descripcion: { es: "Barrios locales", en: "Local neighborhoods" /* TODO: revisar traducción */ },
      },
    ],
  },
  {
    mes: 6,
    mesNombre: { es: "Junio", en: "June" },
    eventos: [
      {
        nombre: { es: "Corpus Christi", en: "Corpus Christi" },
        descripcion: { es: "Parroquias locales", en: "Local parishes" /* TODO: revisar traducción */ },
      },
    ],
  },
  {
    mes: 7,
    mesNombre: { es: "Julio", en: "July" },
    eventos: [
      {
        nombre: {
          es: "Festividad de la Virgen del Carmen",
          en: "Feast of Our Lady of Mount Carmel" /* TODO: revisar traducción */,
        },
        descripcion: { es: "Comunidades locales", en: "Local communities" /* TODO: revisar traducción */ },
      },
    ],
  },
  {
    mes: 8,
    mesNombre: { es: "Agosto", en: "August" },
    eventos: [
      {
        nombre: {
          es: "Festividad de la Asunción de la Virgen María",
          en: "Feast of the Assumption of Mary" /* TODO: revisar traducción */,
        },
        descripcion: { es: "Parroquias locales", en: "Local parishes" /* TODO: revisar traducción */ },
      },
    ],
  },
  {
    mes: 9,
    mesNombre: { es: "Septiembre", en: "September" },
    eventos: [
      {
        nombre: {
          es: "Fiestas Patrias (Grito de Independencia, desfile cívico)",
          en: "Fiestas Patrias (Grito de Independencia, civic parade)" /* TODO: revisar traducción */,
        },
        descripcion: { es: "Plaza principal", en: "Main square" /* TODO: revisar traducción */ },
      },
    ],
  },
  {
    mes: 10,
    mesNombre: { es: "Octubre", en: "October" },
    eventos: [
      {
        nombre: {
          es: "Festividad de San Francisco de Asís",
          en: "Feast of Saint Francis of Assisi" /* TODO: revisar traducción */,
        },
        descripcion: { es: "Comunidades locales", en: "Local communities" /* TODO: revisar traducción */ },
      },
    ],
  },
  {
    mes: 11,
    mesNombre: { es: "Noviembre", en: "November" },
    eventos: [
      {
        nombre: {
          es: "Día de Muertos (altares, ofrendas, pirotecnia)",
          en: "Day of the Dead (altars, offerings, fireworks)" /* TODO: revisar traducción */,
        },
        fecha: { es: "1 y 2 de noviembre", en: "November 1–2" },
        descripcion: { es: "Calles y panteones", en: "Streets and cemeteries" /* TODO: revisar traducción */ },
      },
    ],
  },
  {
    mes: 12,
    mesNombre: { es: "Diciembre", en: "December" },
    eventos: [
      {
        nombre: { es: "Posadas navideñas", en: "Christmas posadas" /* TODO: revisar traducción */ },
        descripcion: { es: "Barrios locales", en: "Local neighborhoods" /* TODO: revisar traducción */ },
      },
      {
        nombre: { es: "Nochebuena", en: "Christmas Eve" /* TODO: revisar traducción */ },
        fecha: { es: "24 de diciembre", en: "December 24" },
        descripcion: { es: "Parroquias locales", en: "Local parishes" /* TODO: revisar traducción */ },
      },
      {
        nombre: { es: "Navidad", en: "Christmas" /* TODO: revisar traducción */ },
        fecha: { es: "25 de diciembre", en: "December 25" },
        descripcion: { es: "Parroquias locales", en: "Local parishes" /* TODO: revisar traducción */ },
      },
      {
        nombre: { es: "Año Nuevo", en: "New Year" /* TODO: revisar traducción */ },
        fecha: { es: "31 de diciembre", en: "December 31" },
        descripcion: { es: "Calles y hogares", en: "Streets and homes" /* TODO: revisar traducción */ },
      },
    ],
  },
];

export default fiestas;
