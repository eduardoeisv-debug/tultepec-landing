// Contenido de la landing "Tultepec · Pueblo Pirotécnico".
// Los datos históricos generales (fechas, denominaciones, fiesta patronal) están
// verificados con fuentes públicas de divulgación turística e histórica.
// Todo lo marcado con `illustrative: true` es contenido ilustrativo/placeholder
// (cifras aproximadas o testimonios de ejemplo) pensado para reemplazarse con
// material real del pueblo más adelante. Todos los campos de texto son
// bilingües ({ es, en }) y se leen con `pick()` del LanguageContext.

export const stats = [
  {
    value: { es: "Siglo XIX", en: "19th century" },
    label: { es: "Origen documentado del oficio", en: "Documented origin of the craft" },
    detail: {
      es: "Familias tultepequenses trabajando la pólvora y el papel desde hace más de 150 años.",
      en: "Families from Tultepec have worked with gunpowder and paper for more than 150 years.",
    },
    illustrative: false,
  },
  {
    value: { es: "1989", en: "1989" },
    label: { es: "Primera Feria Nacional de la Pirotecnia", en: "First Feria Nacional de la Pirotecnia" },
    detail: {
      es: "Cada marzo, el pueblo reúne a artesanos de todo el país en torno al fuego.",
      en: "Every March, the town brings together artisans from across the country around fire.",
    },
    illustrative: false,
  },
  {
    value: { es: "3–5", en: "3-5" },
    label: { es: "Generaciones por familia", en: "Generations per family" },
    detail: {
      es: "El saber se hereda de padres a hijos dentro del mismo taller familiar.",
      en: "Knowledge is passed from parents to children within the same family workshop.",
    },
    illustrative: true,
  },
  {
    value: { es: "+300", en: "300+" },
    label: { es: "Talleres artesanales", en: "Artisan workshops" },
    detail: {
      es: "Pequeños talleres familiares repartidos por las colonias de Tultepec.",
      en: "Small family workshops spread across Tultepec's neighborhoods.",
    },
    illustrative: true,
  },
];

export const tensionPoints = [
  {
    title: { es: "La memoria oral se puede perder", en: "Oral memory can be lost" },
    text: {
      es: "Gran parte del conocimiento —tiempos de secado, mezclas, formas de los castillos— nunca se ha escrito. Vive en la voz de quienes lo practican, y con cada generación que no lo transmite, el riesgo de que se pierda crece.",
      en: "Much of the knowledge — drying times, mixtures, castillo shapes — has never been written down. It lives in the voices of those who practice it, and with every generation that doesn't pass it on, the risk of losing it grows.",
    },
  },
  {
    title: { es: "Un oficio que también ha dolido", en: "A craft that has also caused pain" },
    text: {
      es: "El nombre de Tultepec también está ligado a tragedias, como las ocurridas en el mercado de San Pablito. Son parte de la historia del pueblo y merecen recordarse con respeto, no con espectáculo: cada accidente marcó familias, endureció normas y dejó lecciones que el propio oficio ha ido incorporando.",
      en: "Tultepec's name is also tied to tragedies, like those that occurred at the San Pablito market. They're part of the town's history and deserve to be remembered with respect, not spectacle: every accident marked families, toughened regulations, and left lessons the craft itself has kept incorporating.",
    },
  },
  {
    title: { es: "El orgullo que sostiene el oficio", en: "The pride that sustains the craft" },
    text: {
      es: "A pesar del riesgo y del estigma que a veces carga el pueblo hacia afuera, dentro de Tultepec la pirotecnia sigue siendo motivo de identidad: se enseña con cuidado, se celebra con fe y se defiende como forma de vida.",
      en: "Despite the risk and the stigma the town sometimes carries from the outside, within Tultepec fireworks remain a source of identity: taught with care, celebrated with faith, and defended as a way of life.",
    },
  },
];

export const benefits = [
  {
    title: { es: "Historia viva, contada por sus protagonistas", en: "Living history, told by its protagonists" },
    text: {
      es: "No es una cronología de museo: son fragmentos de memoria de las familias que encienden la mecha cada año.",
      en: "This isn't a museum timeline: it's fragments of memory from the families who light the fuse every year.",
    },
  },
  {
    title: { es: "Una línea de tiempo del oficio", en: "A timeline of the craft" },
    text: {
      es: "Del papel y la pólvora artesanal a los castillos monumentales de hoy, recorre cómo evolucionó la tradición.",
      en: "From artisanal paper and gunpowder to today's monumental castillos, trace how the tradition evolved.",
    },
  },
  {
    title: { es: "El significado de la fiesta patronal", en: "The meaning of the patron saint feast" },
    text: {
      es: "Descubre por qué San Juan de Dios, patrono de los pirotécnicos, es el corazón espiritual del pueblo.",
      en: "Discover why San Juan de Dios, patron saint of pyrotechnic artisans, is the spiritual heart of the town.",
    },
  },
  {
    title: { es: "El papel de la familia", en: "The role of the family" },
    text: {
      es: "Entiende cómo se transmite el conocimiento de generación en generación, dentro del mismo taller y el mismo apellido.",
      en: "Understand how knowledge is passed down from generation to generation, within the same workshop and the same family name.",
    },
  },
];

export const steps = [
  {
    number: "01",
    title: { es: "Recorre la línea de tiempo", en: "Walk through the timeline" },
    text: {
      es: "Desde el origen artesanal del oficio hasta los castillos que hoy conocen en todo el mundo.",
      en: "From the craft's artisanal origins to the castillos known around the world today.",
    },
  },
  {
    number: "02",
    title: { es: "Escucha las memorias del pueblo", en: "Listen to the town's memories" },
    text: {
      es: "Lee lo que otras personas ya compartieron sobre su relación con el pueblo del fuego.",
      en: "Read what others have already shared about their connection to the town of fire.",
    },
  },
  {
    number: "03",
    title: { es: "Comparte o guarda tu memoria", en: "Share or save your memory" },
    text: {
      es: "Aporta tu propia historia sobre Tultepec para que también forme parte del archivo colectivo.",
      en: "Contribute your own story about Tultepec so it becomes part of the collective archive too.",
    },
  },
];

export const timeline = [
  {
    year: { es: "Origen", en: "Origin" },
    title: { es: "El origen artesanal del oficio", en: "The craft's artisanal origin" },
    text: {
      es: "La pirotecnia llega a México durante la Colonia y encuentra en Tultepec un terreno fértil: familias campesinas que, entre cosecha y cosecha, comienzan a experimentar con pólvora, carrizo y papel para dar forma a los primeros cohetes y buscapiés.",
      en: "Fireworks arrive in Mexico during the colonial era and find fertile ground in Tultepec: farming families who, between harvests, began experimenting with gunpowder, reed, and paper to shape the first rockets and firecrackers.",
    },
  },
  {
    year: { es: "8 de marzo", en: "March 8" },
    title: { es: "San Juan de Dios y la fiesta patronal", en: "San Juan de Dios and the patron saint feast" },
    text: {
      es: "San Juan de Dios es venerado como patrono de los pirotécnicos. Cada 8 de marzo, talleres y familias le rinden homenaje con la quema de castillos y torres, en una fiesta que mezcla fe, gratitud y orgullo de oficio.",
      en: "San Juan de Dios is venerated as the patron saint of pyrotechnic artisans. Every March 8, workshops and families honor him by burning castillos and towers, in a feast that blends faith, gratitude, and pride in the craft.",
    },
  },
  {
    year: { es: "Desde 1989", en: "Since 1989" },
    title: { es: "La Feria Nacional de la Pirotecnia", en: "The Feria Nacional de la Pirotecnia" },
    text: {
      es: "Nacida para dar a Tultepec un espacio de encuentro, exhibición y reconocimiento, la feria reúne cada marzo a artesanos de todo México: concursos de castillos, quema de toritos y un desfile de mojigangas que llena las calles de color.",
      en: "Born to give Tultepec a space for gathering, exhibition, and recognition, the fair brings together artisans from across Mexico every March: castillo competitions, torito burnings, and a parade of mojigangas that fills the streets with color.",
    },
  },
  {
    year: { es: "Todo el año", en: "All year round" },
    title: { es: "Los talleres familiares", en: "The family workshops" },
    text: {
      es: "Detrás de cada feria hay meses de trabajo silencioso en talleres pequeños, muchas veces instalados junto a la casa familiar, donde el conocimiento se enseña con la misma paciencia con la que se arma un castillo.",
      en: "Behind every fair are months of quiet work in small workshops, often set up right next to the family home, where knowledge is taught with the same patience used to build a castillo.",
    },
  },
  {
    year: { es: "Símbolo", en: "Symbol" },
    title: { es: "Castillos y torres", en: "Castillos and towers" },
    text: {
      es: "Estructuras de carrizo que pueden alcanzar varios pisos de altura, cubiertas de figuras giratorias y luces que se encienden en secuencia. Son la pieza más emblemática del oficio y la que exige mayor precisión artesanal.",
      en: "Reed structures that can rise several stories high, covered in spinning figures and lights that ignite in sequence. They're the craft's most emblematic piece, and the one demanding the greatest artisanal precision.",
    },
  },
  {
    year: { es: "Fiesta", en: "Festival" },
    title: { es: "Toritos y mojigangas", en: "Toritos and mojigangas" },
    text: {
      es: "El torito —una armazón con forma de toro cargada de cohetes— se corre entre la gente en las fiestas; las mojigangas, enormes figuras de cartón que caricaturizan a personajes populares, abren paso al recorrido festivo por las calles.",
      en: "The torito — a bull-shaped frame loaded with firecrackers — is run through the crowd during festivals; the mojigangas, giant cardboard figures caricaturing popular characters, lead the festive procession through the streets.",
    },
  },
  {
    year: { es: "Memoria", en: "Memory" },
    title: { es: "El mercado de San Pablito", en: "The San Pablito market" },
    text: {
      es: "Durante años, San Pablito fue el corazón comercial de la pirotecnia en Tultepec. También fue escenario de explosiones que marcaron al pueblo profundamente. Se recuerda no como anécdota, sino como parte del costo humano de un oficio que sus artesanos han seguido dignificando con más cuidado y mejores prácticas.",
      en: "For years, San Pablito was the commercial heart of fireworks in Tultepec. It was also the site of explosions that deeply marked the town. It's remembered not as anecdote, but as part of the human cost of a craft its artisans have kept dignifying with more care and better practices.",
    },
  },
];

export const faqs = [
  {
    question: { es: "¿Qué es la pirotecnia artesanal de Tultepec?", en: "What is Tultepec's artisanal pyrotechnics?" },
    answer: {
      es: "Es la elaboración manual de cohetes, castillos, toritos y otros artificios pirotécnicos, hecha por familias en talleres pequeños, siguiendo técnicas transmitidas de generación en generación desde hace más de un siglo.",
      en: "It's the handmade production of rockets, castillos, toritos, and other fireworks, made by families in small workshops, following techniques passed down from generation to generation for more than a century.",
    },
  },
  {
    question: { es: "¿Por qué se celebra la fiesta de San Juan de Dios?", en: "Why is the feast of San Juan de Dios celebrated?" },
    answer: {
      es: "San Juan de Dios es venerado como patrono de los pirotécnicos. Su fiesta, cada 8 de marzo, es una de las fechas más importantes del calendario de Tultepec: una forma de agradecer y pedir protección para quienes trabajan con fuego.",
      en: "San Juan de Dios is venerated as the patron saint of pyrotechnic artisans. His feast, every March 8, is one of the most important dates on Tultepec's calendar: a way of giving thanks and asking for protection for those who work with fire.",
    },
  },
  {
    question: { es: "¿Qué es un castillo pirotécnico?", en: "What is a pyrotechnic castillo?" },
    answer: {
      es: "Es una estructura de carrizo, de varios metros de altura, cubierta con figuras giratorias y luces pirotécnicas que se encienden en secuencia durante la quema, creando un espectáculo visual que puede durar varios minutos.",
      en: "It's a reed structure, several meters tall, covered with spinning figures and pyrotechnic lights that ignite in sequence during the burn, creating a visual spectacle that can last several minutes.",
    },
  },
  {
    question: { es: "¿Cómo se transmite el oficio dentro de las familias?", en: "How is the craft passed down within families?" },
    answer: {
      es: "De forma directa y práctica: niños y jóvenes acompañan a padres, tíos o abuelos en el taller, primero observando y con tareas sencillas, y con los años asumiendo procesos más delicados, siempre bajo supervisión.",
      en: "Directly and hands-on: children and young people accompany parents, uncles, or grandparents in the workshop, first observing and doing simple tasks, and over the years taking on more delicate processes, always under supervision.",
    },
  },
];
