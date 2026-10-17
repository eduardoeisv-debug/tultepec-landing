// Diccionario central de textos de interfaz (botones, encabezados, texto
// fijo de los componentes). Cada llave tiene su versión `es` y `en`.
// Los párrafos largos que viven en src/data/*.js (calendario, historia,
// testimonios, libros) NO están aquí -- esos archivos guardan cada campo
// traducible como { es, en } directamente, y se leen con `pick()` del
// LanguageContext en vez de `t()`.
export const STRINGS = {
  "app.cargando": { es: "Cargando…", en: "Loading…" },
  "memoryEntryCard.anonimo": { es: "Anónimo", en: "Anonymous" },

  "header.subtitle": { es: "Estado de México", en: "State of Mexico" },
  "languageSwitcher.ariaLabel": { es: "Cambiar idioma", en: "Change language" },

  "hero.bienvenidosEyebrow": { es: "Bienvenidos a Tultepec", en: "Welcome to Tultepec" },
  "hero.title.line1": { es: "Capital de la", en: "Capital of" },
  "hero.title.line2": { es: "Pirotecnia", en: "Fireworks" },
  "hero.subtitle": {
    es: "Este es un espacio para guardar y compartir las memorias de nuestro pueblo: su historia, su gente, sus fiestas y el oficio que convierte el fuego en arte.",
    en: "This is a space to keep and share the memories of our town: its history, its people, its festivities, and the craft that turns fire into art.",
  },
  "hero.verVideo": { es: "Ver video", en: "Watch video" },
  "hero.verBienvenida": { es: "Ver bienvenida", en: "Watch welcome" },
  "hero.videoCaption": { es: "Un recorrido por el pueblo en 1:28", en: "A tour of the town in 1:28" },

  "hero.card.books.title": { es: "Relatos Escritos", en: "Written Accounts" },
  "hero.video.ariaLabel": {
    es: "Reproducir video de bienvenida a Tultepec",
    en: "Play Tultepec welcome video",
  },
  "video.restart": { es: "Reiniciar video", en: "Restart video" },
  "video.watchAgain": { es: "Ver de nuevo", en: "Watch again" },
  "video.endedSub": { es: "El video ha terminado", en: "The video has ended" },
  "common.cerrar": { es: "Cerrar", en: "Close" },

  "footer.tagline": {
    es: "Un archivo hecho para honrar la memoria de un pueblo.",
    en: "An archive made to honor the memory of a town.",
  },
  "footer.thanks": {
    es: "Un agradecimiento especial a la Profesora Juana Antonieta Zuñiga Urban y al Profesor Fernando Manuel Torices Ramírez, por compartir con generosidad su conocimiento y sus recuerdos — el verdadero corazón de este archivo.",
    en: "A special thanks to Professor Juana Antonieta Zuñiga Urban and Professor Fernando Manuel Torices Ramírez, for generously sharing their knowledge and memories — the true heart of this archive.",
  },
  "footer.thanksName1": { es: "la Profesora Juana Antonieta Zuñiga Urban", en: "Professor Juana Antonieta Zuñiga Urban" },
  "footer.thanksName2": { es: "Profesor Fernando Manuel Torices Ramírez", en: "Professor Fernando Manuel Torices Ramírez" },
  "footer.disclaimer": {
    es: "Proyecto cultural independiente, hecho como pieza de portafolio. No representa a ninguna institución de gobierno, gremio pirotécnico ni organizador oficial de la Feria Nacional de la Pirotecnia.",
    en: "Independent cultural project, made as a portfolio piece. It does not represent any government institution, pyrotechnic guild, or official organizer of the Feria Nacional de la Pirotecnia.",
  },
  "footer.sealAlt": {
    es: "Sello EA — Dos mentes, una visión. Creamos el futuro.",
    en: "EA Seal — Two minds, one vision. We create the future.",
  },
  "footer.madeBy": { es: "Hecho por", en: "Made by" },
  "footer.copyright": {
    es: "Tultepec · Pueblo Pirotécnico — proyecto de portafolio.",
    en: "Tultepec · Firework-Making Town — portfolio project.",
  },
  "footer.privacyLink": { es: "Aviso de privacidad", en: "Privacy notice" },

  "finalCta.title": { es: "La memoria del pueblo sigue encendida", en: "The town's memory still burns bright" },
  "finalCta.text": {
    es: "Cada visita a este archivo es una forma de mantener viva la historia de Tultepec. Vuelve cuando quieras seguir el hilo de la tradición.",
    en: "Every visit to this archive helps keep Tultepec's history alive. Come back whenever you want to pick up the thread of tradition.",
  },
  "finalCta.engageText": {
    es: "Hola, si te gustó el contenido de este sitio, déjanos tu like y un comentario",
    en: "Hi! If you liked this site's content, leave us a like and a comment",
  },
  "finalCta.comentar": { es: "Comentar", en: "Comment" },

  "testimonials.eyebrow": { es: "Voces del pueblo", en: "Voices of the town" },
  "testimonials.title": { es: "Lo que cuentan quienes lo viven", en: "What those who live it have to say" },
  "testimonials.subtitle": {
    es: "Testimonios de artesanos y familias, junto con las memorias que la propia comunidad ha compartido y ya fueron revisadas.",
    en: "Accounts from artisans and families, together with the memories the community itself has shared and that have already been reviewed.",
  },
  "testimonials.loading": { es: "Cargando voces…", en: "Loading voices…" },
  "testimonials.error": { es: "No pudimos cargar los testimonios.", en: "We couldn't load the testimonials." },
  "testimonials.empty": {
    es: "Todavía no hay voces publicadas. Sé la primera persona en compartir la tuya.",
    en: "There are no published voices yet. Be the first to share yours.",
  },
  "testimonials.comparteTuMemoria": { es: "Comparte tu memoria", en: "Share your memory" },
  "testimonials.notaIdioma": {
    es: "Estas voces se muestran en el idioma en que fueron escritas (mayormente español).",
    en: "These voices are shown in the language they were written in (mostly Spanish).",
  },
  "testimonials.prev": { es: "Testimonio anterior", en: "Previous testimonial" },
  "testimonials.next": { es: "Testimonio siguiente", en: "Next testimonial" },
  "testimonials.verTestimonio": { es: "Ver testimonio {n}", en: "View testimonial {n}" },

  "bienvenida.eyebrow": { es: "Mensaje de bienvenida", en: "Welcome message" },
  "bienvenida.nota.titulo": { es: "Una carta para ti", en: "A letter for you" },
  "bienvenida.title": { es: "Una casa para nuestras memorias", en: "A home for our memories" },
  "bienvenida.subtitle": {
    es: "Por qué existe esta página, contado por quienes la hacemos.",
    en: "Why this page exists, told by those who made it.",
  },
  "bienvenida.carta.p1": {
    es: "Tultepec es conocido por su pirotecnia, pero detrás de cada castillo y cada torito hay familias, recuerdos y tradiciones que han pasado de generación en generación.",
    en: "Tultepec is known for its fireworks, but behind every castillo and every torito there are families, memories and traditions passed down from generation to generation.",
  },
  "bienvenida.carta.p2": {
    es: "Creamos este sitio para que esas memorias no se pierdan. Aquí encontrarás relatos de nuestra gente, la historia del pueblo, las fiestas que celebramos a lo largo del año y las imágenes que lo cuentan mejor que cualquier palabra.",
    en: "We created this site so those memories don't get lost. Here you'll find stories from our people, the town's history, the festivities we celebrate throughout the year, and the images that tell it better than any words.",
  },
  "bienvenida.carta.p3": {
    es: "Si eres de aquí, esperamos que te reconozcas en estas páginas. Si nos visitas por primera vez, bienvenido: esta también es tu casa.",
    en: "If you're from here, we hope you recognize yourself in these pages. If this is your first visit, welcome: this is your home too.",
  },
  "bienvenida.firma.despedida": { es: "Con cariño,", en: "With love," },
  "bienvenida.firma.nombres": {
    es: "Eduardo Israel Sánchez Villaseñor",
    en: "Eduardo Israel Sánchez Villaseñor",
  },
  "bienvenida.cta.pregunta": {
    es: "¿Tienes una historia de Tultepec?",
    en: "Do you have a story about Tultepec?",
  },
  "bienvenida.cta.compartir": { es: "Comparte tu historia", en: "Share your story" },
  "bienvenida.cta.leeMemorias": { es: "Lee las memorias del pueblo", en: "Read the town's memories" },
  "bienvenida.leerNota": { es: "Toca para leerla", en: "Tap to read it" },
  "bienvenida.ocultarNota": { es: "Toca para ocultar", en: "Tap to hide" },

  "visitInfo.eyebrow": { es: "Planea tu visita", en: "Plan your visit" },
  "visitInfo.title": { es: "¿Cuándo vienes y cómo llegas?", en: "When should you come, and how do you get here?" },
  "visitInfo.calendarLabel": { es: "Calendario de eventos", en: "Events calendar" },
  "visitInfo.monthsSubtitle": { es: "¿En qué mes hay eventos?", en: "Which month has events?" },

  "comoLlegar.intro": {
    es: "Tultepec es un municipio del Estado de México, dentro de la zona metropolitana norte del Valle de México: a menos de una hora de la Ciudad de México, perfecto para una visita de un día.",
    en: "Tultepec is a municipality in the State of Mexico, within the northern metropolitan area of the Valley of Mexico: less than an hour from Mexico City, perfect for a day trip.",
  },
  "comoLlegar.heading": { es: "¿Cómo llegas?", en: "How do you get here?" },
  "comoLlegar.mapTitle": { es: "Mapa de Tultepec, Estado de México", en: "Map of Tultepec, State of Mexico" },
  "comoLlegar.comoLlegar": { es: "Cómo llegar", en: "Get directions" },
  "comoLlegar.card.cdmx.title": { es: "Desde la Ciudad de México", en: "From Mexico City" },
  "comoLlegar.card.cdmx.text": {
    es: "Alrededor de 40 km, aproximadamente 1 hora por la Autopista México-Pachuca o el Circuito Exterior Mexiquense, según el tráfico.",
    en: "About 40 km, roughly 1 hour via the México-Pachuca highway or the Circuito Exterior Mexiquense, depending on traffic.",
  },

  "fiestasStrip.mesesAriaLabel": { es: "Meses del año", en: "Months of the year" },
  "fiestasStrip.sinEventos": {
    es: "Este mes puedes visitar los talleres y el mercado de cohetes.",
    en: "This month you can visit the workshops and the fireworks market.",
  },

  "shareButtons.label": { es: "Comparte esta página", en: "Share this page" },
  "shareButtons.whatsapp": { es: "Compartir por WhatsApp", en: "Share via WhatsApp" },
  "shareButtons.facebook": { es: "Compartir en Facebook", en: "Share on Facebook" },
  "shareButtons.copyLink": { es: "Copiar enlace", en: "Copy link" },
  "shareButtons.copied": { es: "¡Enlace copiado!", en: "Link copied!" },
  "shareButtons.shareText": {
    es: "Tultepec, el pueblo que le puso nombre al fuego — conoce su historia:",
    en: "Tultepec, the town that gave fire its name — discover its history:",
  },

  "likeButton.teGusta": { es: "Te gusta", en: "You like this" },
  "likeButton.meGusta": { es: "Me gusta", en: "Like" },

  "historyModal.eyebrow": { es: "Explora la historia", en: "Explore the history" },
  "historyModal.title": { es: "La historia de Tultepec", en: "The history of Tultepec" },

  "museosModal.eyebrow": { es: "Museos", en: "Museums" },
  "museosModal.title": { es: "Los museos de Tultepec", en: "Tultepec's museums" },
  "museosModal.enConstruccion": {
    es: "Este módulo está en construcción.",
    en: "This section is under construction.",
  },
  "museosModal.enConstruccionSub": {
    es: "Muy pronto podrás conocer aquí la historia de los museos de Tultepec y explorar cada uno por separado.",
    en: "Soon you'll be able to learn the history of Tultepec's museums here and explore each one individually.",
  },

  "memoriesModal.eyebrow": { es: "Memorias de mi pueblo", en: "Memories of my town" },
  "memoriesModal.title": { es: "Lo que cuentan quienes lo viven", en: "What those who live it have to say" },
  "memoriesModal.tabs.ariaLabel": { es: "Secciones de Memorias de mi pueblo", en: "Memories of my town sections" },
  "memoriesModal.tabs.memorias": { es: "Memorias", en: "Memories" },
  "memoriesModal.tabs.voces": { es: "Voces", en: "Voices" },
  "memoriesModal.tabs.comparte": { es: "Comparte", en: "Share" },
  "memoriesModal.filtroAriaLabel": { es: "Filtrar por libro", en: "Filter by book" },
  "memoriesModal.libroBtn": { es: "Libro {n}", en: "Book {n}" },
  "memoriesModal.notaIdioma": {
    es: "Textos originales en español.",
    en: "Original texts in Spanish.",
  },
  "memoriesModal.creditoAutorizacion": {
    es: "Textos publicados con autorización de sus autores.",
    en: "Texts published with their authors' permission.",
  },

  "relatos.title": { es: "Memorias de mi Pueblo", en: "Memories of my Town" },
  "relatos.tabs.ariaLabel": { es: "Secciones de Relatos Escritos", en: "Written Accounts sections" },
  "relatos.tabs.historia": { es: "Quiénes somos", en: "Who we are" },
  "relatos.tabs.libros": { es: "Los libros", en: "The books" },
  "relatos.historia.vacioTitulo": {
    es: "Pronto compartiremos la historia de quienes formamos este grupo",
    en: "We'll soon share the story of those who make up this group",
  },
  "relatos.historia.vacioSub": {
    es: "Estamos preparando este contenido con cuidado.",
    en: "We're putting this content together with care.",
  },
  "relatos.historia.hitosTitulo": { es: "Cómo nos formamos", en: "How we came together" },
  "relatos.historia.integrantesTitulo": { es: "Quiénes lo integramos", en: "Who's part of it" },
  "relatos.historia.verLibros": { es: "Ver los libros", en: "See the books" },

  "booksModal.title": { es: "Libros sobre la historia de Tultepec", en: "Books on the history of Tultepec" },
  "booksModal.intro": {
    es: "Tres publicaciones ya disponibles para quien quiera llevarse la memoria del pueblo más allá de esta página.",
    en: "Three publications already available for anyone who wants to take the town's memory beyond this page.",
  },
  "booksModal.preguntarA": { es: "Preguntar a {nombre} por WhatsApp", en: "Ask {nombre} via WhatsApp" },
  "booksModal.numeroPendiente": { es: "Número por confirmar", en: "Number pending confirmation" },
  "booksModal.note": {
    es: "El número de WhatsApp de la profesora Juana Antonieta está pendiente de confirmar; mientras tanto, puedes escribirle al profesor Fernando.",
    en: "Juana Antonieta's WhatsApp number is still pending confirmation; in the meantime, you can message Fernando.",
  },
  "booksModal.portadaAlt": {
    es: "Portada de Memorias de mi Pueblo, tomo {tomo}",
    en: "Cover of Memories of my Town, volume {tomo}",
  },
  "booksModal.dotsAriaLabel": { es: "Elegir tomo", en: "Choose volume" },
  "booksModal.verTomo": { es: "Ver tomo {tomo}", en: "View volume {tomo}" },

  "hi.timeline.eyebrow": { es: "Momentos y tradiciones", en: "Moments and traditions" },
  "hi.timeline.title": { es: "La línea de tiempo del oficio", en: "A timeline of the craft" },
  "hi.timeline.leerMas": { es: "Leer más", en: "Read more" },
  "hi.timeline.leerMenos": { es: "Leer menos", en: "Read less" },
  "hi.faq.eyebrow": { es: "Preguntas frecuentes", en: "Frequently asked questions" },
  "hi.faq.title": { es: "Para entender mejor la tradición", en: "To better understand the tradition" },

  "commentModal.errorEmpty": { es: "Escribe un comentario antes de enviarlo.", en: "Write a comment before sending it." },
  "commentModal.errorTurnstile": {
    es: "Completa la verificación de seguridad antes de enviar.",
    en: "Complete the security check before sending.",
  },
  "commentModal.errorSubmit": {
    es: "No se pudo enviar tu comentario. Intenta de nuevo en unos minutos.",
    en: "We couldn't send your comment. Please try again in a few minutes.",
  },
  "commentModal.successTitle": { es: "Gracias por tu comentario", en: "Thanks for your comment" },
  "commentModal.successText": {
    es: "Lo recibimos y pasará por una breve revisión antes de publicarse.",
    en: "We received it and it'll go through a brief review before being published.",
  },
  "commentModal.eyebrow": { es: "Deja tu comentario", en: "Leave your comment" },
  "commentModal.title": { es: "¿Qué te pareció este archivo?", en: "What did you think of this archive?" },
  "commentModal.intro": {
    es: "Cuéntanos qué te gustó o qué le agregarías. Antes de publicarse, cada comentario pasa por una revisión.",
    en: "Tell us what you liked or what you'd add. Before being published, every comment goes through a review.",
  },
  "commentModal.nameLabel": { es: "Tu nombre (opcional)", en: "Your name (optional)" },
  "commentModal.namePlaceholder": {
    es: "Déjalo en blanco para comentar de forma anónima",
    en: "Leave it blank to comment anonymously",
  },
  "commentModal.commentLabel": { es: "Tu comentario", en: "Your comment" },
  "commentModal.commentPlaceholder": { es: "Escribe aquí tu comentario...", en: "Write your comment here..." },
  "commentModal.charsRemaining": { es: "{n} caracteres restantes", en: "{n} characters left" },
  "commentModal.emailLabel": { es: "Correo (opcional, no se hace público)", en: "Email (optional, never made public)" },
  "commentModal.emailPlaceholder": {
    es: "Solo por si queremos contactarte sobre tu comentario",
    en: "Only in case we need to contact you about your comment",
  },
  "commentModal.cancelar": { es: "Cancelar", en: "Cancel" },
  "commentModal.enviando": { es: "Enviando…", en: "Sending…" },
  "commentModal.enviarComentario": { es: "Enviar comentario", en: "Send comment" },

  "shareMemoryModal.errorTooShort": {
    es: "Cuéntanos un poco más: al menos {n} caracteres.",
    en: "Tell us a bit more: at least {n} characters.",
  },
  "shareMemoryModal.errorTurnstile": {
    es: "Completa la verificación de seguridad antes de enviar.",
    en: "Complete the security check before sending.",
  },
  "shareMemoryModal.errorSubmit": {
    es: "No se pudo guardar tu memoria. Intenta de nuevo en unos minutos.",
    en: "We couldn't save your memory. Please try again in a few minutes.",
  },
  "shareMemoryModal.successTitle": { es: "Gracias por compartir tu memoria", en: "Thanks for sharing your memory" },
  "shareMemoryModal.successText": {
    es: "La recibimos y pasará por una breve revisión antes de sumarse al archivo del pueblo. Apreciamos que hayas dedicado un momento a contarla.",
    en: "We received it and it'll go through a brief review before joining the town's archive. We appreciate you taking a moment to share it.",
  },
  "shareMemoryModal.eyebrow": { es: "Comparte tu memoria", en: "Share your memory" },
  "shareMemoryModal.title": { es: "Tu historia también es parte de Tultepec", en: "Your story is part of Tultepec too" },
  "shareMemoryModal.intro": {
    es: "Cuéntanos un recuerdo, una anécdota o algo que quieras que se sepa sobre el pueblo del fuego. Antes de publicarse, cada memoria pasa por una revisión.",
    en: "Tell us a memory, an anecdote, or something you'd like people to know about the town of fire. Before being published, every memory goes through a review.",
  },
  "shareMemoryModal.nameLabel": { es: "Tu nombre (opcional)", en: "Your name (optional)" },
  "shareMemoryModal.namePlaceholder": {
    es: "Déjalo en blanco para compartir de forma anónima",
    en: "Leave it blank to share anonymously",
  },
  "shareMemoryModal.relationshipLabel": { es: "¿Cuál es tu relación con Tultepec?", en: "What's your connection to Tultepec?" },
  "shareMemoryModal.memoryLabel": { es: "Tu memoria", en: "Your memory" },
  "shareMemoryModal.memoryPlaceholder": {
    es: "Por ejemplo: lo que se siente ver un castillo encendido por primera vez, una historia de tu familia, un aprendizaje del taller...",
    en: "For example: what it feels like to see a castillo lit for the first time, a story from your family, something you learned at the workshop...",
  },
  "shareMemoryModal.minChars": { es: "Mínimo {n} caracteres · ", en: "Minimum {n} characters · " },
  "shareMemoryModal.emailLabel": { es: "Correo (opcional, no se hace público)", en: "Email (optional, never made public)" },
  "shareMemoryModal.emailPlaceholder": {
    es: "Solo por si queremos contactarte sobre tu memoria",
    en: "Only in case we need to contact you about your memory",
  },
  "shareMemoryModal.consentPre": {
    es: "Autorizo que esta memoria pueda mostrarse públicamente en este archivo (de forma anónima si no dejo mi nombre). Consulta nuestro",
    en: "I authorize this memory to be shown publicly in this archive (anonymously if I don't leave my name). See our",
  },
  "shareMemoryModal.consentLink": { es: "aviso de privacidad", en: "privacy notice" },
  "shareMemoryModal.enviando": { es: "Enviando…", en: "Sending…" },
  "shareMemoryModal.enviarMemoria": { es: "Enviar mi memoria", en: "Send my memory" },
  "shareMemoryModal.enviarOtra": { es: "Enviar otra memoria", en: "Share another memory" },

  "galeria.title": { es: "Galería", en: "Gallery" },
  "galeria.subtitle": {
    es: "Fotos y videos de las tradiciones del pueblo",
    en: "Photos and videos of the town's traditions",
  },
  "galeria.tabs.ariaLabel": { es: "Secciones de la galería", en: "Gallery sections" },
  "galeria.tabs.imagenes": { es: "Imágenes", en: "Photos" },
  "galeria.tabs.videos": { es: "Videos", en: "Videos" },
  "galeria.chips.ariaLabel": { es: "Filtrar por categoría", en: "Filter by category" },
  "galeria.cargandoFotos": { es: "Buscando fotos…", en: "Looking for photos…" },
  "galeria.cargandoVideos": { es: "Buscando videos…", en: "Looking for videos…" },
  "galeria.vacio.titulo": { es: "Pronto compartiremos más", en: "More coming soon" },
  "galeria.vacio.fotos": {
    es: "Aún no hay fotos para esta categoría.",
    en: "There are no photos for this category yet.",
  },
  "galeria.vacio.videos": {
    es: "Todavía no hay videos publicados.",
    en: "There are no published videos yet.",
  },
  "galeria.verFoto": { es: "Ver foto {n} de {total}", en: "View photo {n} of {total}" },
  "galeria.fotoAnterior": { es: "Foto anterior", en: "Previous photo" },
  "galeria.fotoSiguiente": { es: "Foto siguiente", en: "Next photo" },
  "galeria.reproducir": { es: "Reproducir video: {titulo}", en: "Play video: {titulo}" },

  "juegos.eyebrow": { es: "¿Te quedas un ratito?", en: "Staying a little longer?" },
  "juegos.title": { es: "Un ratito de juego", en: "A little play time" },
  "juegos.tabsAriaLabel": { es: "Minijuegos de Tultepec", en: "Tultepec mini-games" },
  "juegos.tabs.torito": { es: "Laberinto del torito", en: "Torito maze" },
  "juegos.tabs.toritoCorto": { es: "Torito", en: "Maze" },
  "juegos.tabs.memorama": { es: "Memorama", en: "Memory game" },
  "juegos.tabs.memoramaCorto": { es: "Cartas", en: "Cards" },
  "juegos.tabs.sopa": { es: "Sopa de letras", en: "Word search" },
  "juegos.tabs.sopaCorto": { es: "Sopa", en: "Words" },

  "juegos.torito.titulo": { es: "Ayuda al torito", en: "Help the torito" },
  "juegos.torito.texto": {
    es: "Recorre las calles, recoge todas las chispas y esquiva a los cohetes locos. Los castillos te hacen invencible por unos segundos.",
    en: "Run through the streets, collect all the sparks and dodge the crazy rockets. Castillos make you invincible for a few seconds.",
  },
  "juegos.torito.puntos": { es: "Puntos", en: "Points" },
  "juegos.torito.vidas": { es: "Vidas", en: "Lives" },
  "juegos.torito.nivel": { es: "Nivel", en: "Level" },
  "juegos.torito.mejor": { es: "Mejor", en: "Best" },
  "juegos.torito.reiniciar": { es: "Reiniciar", en: "Restart" },
  "juegos.torito.vidasAriaLabel": { es: "{n} vidas", en: "{n} lives" },
  "juegos.torito.idleTitulo": { es: "¿Listo para correr?", en: "Ready to run?" },
  "juegos.torito.idleTexto": {
    es: "Son 3 niveles. Cada vez los cohetes van más rápido.",
    en: "There are 3 levels. The rockets get faster each time.",
  },
  "juegos.torito.jugar": { es: "Jugar", en: "Play" },
  "juegos.torito.pausaTitulo": { es: "Pausa", en: "Paused" },
  "juegos.torito.seguir": { es: "Seguir", en: "Resume" },
  "juegos.torito.listo": { es: "¡Listo!", en: "Ready!" },
  "juegos.torito.nivelCompleto": { es: "¡Nivel completo!", en: "Level complete!" },
  "juegos.torito.overTitulo": { es: "Se acabó la mecha", en: "The fuse ran out" },
  "juegos.torito.overTexto": { es: "{puntos} puntos.", en: "{puntos} points." },
  "juegos.torito.esMejorMarca": { es: " Es tu mejor marca.", en: " That's your best score." },
  "juegos.torito.jugarOtraVez": { es: "Jugar otra vez", en: "Play again" },
  "juegos.torito.ganasteTitulo": { es: "¡Viva Tultepec!", en: "Long live Tultepec!" },
  "juegos.torito.ganasteTexto": {
    es: "Completaste los {niveles} niveles con {puntos} puntos.",
    en: "You completed all {niveles} levels with {puntos} points.",
  },
  "juegos.torito.controlesAriaLabel": { es: "Controles", en: "Controls" },
  "juegos.torito.flechaArriba": { es: "Arriba", en: "Up" },
  "juegos.torito.flechaIzquierda": { es: "Izquierda", en: "Left" },
  "juegos.torito.flechaAbajo": { es: "Abajo", en: "Down" },
  "juegos.torito.flechaDerecha": { es: "Derecha", en: "Right" },
  "juegos.torito.mapaAriaLabel": {
    es: "Laberinto con un torito que recoge chispas y huye de cohetes. Usa las flechas del teclado o desliza el dedo para moverlo.",
    en: "Maze with a torito collecting sparks and fleeing from rockets. Use the keyboard arrows or swipe to move it.",
  },
  "juegos.torito.ayudaTeclado": {
    es: "Mueve al torito con las flechas del teclado o con W, A, S y D.",
    en: "Move the torito with the keyboard arrows or with W, A, S and D.",
  },
  "juegos.torito.ayudaTactil": {
    es: "Desliza el dedo sobre el mapa o usa las flechas para moverte.",
    en: "Swipe on the map or use the arrows to move.",
  },

  "juegos.memorama.titulo": { es: "Memorama pirotécnico", en: "Firework memory game" },
  "juegos.memorama.texto": {
    es: "Encuentra las 8 parejas de la fiesta pirotécnica de Tultepec. Gana quien necesita menos intentos.",
    en: "Find the 8 pairs from Tultepec's firework festival. Fewer attempts wins.",
  },
  "juegos.memorama.intentos": { es: "Intentos", en: "Attempts" },
  "juegos.memorama.tiempo": { es: "Tiempo", en: "Time" },
  "juegos.memorama.mejor": { es: "Mejor", en: "Best" },
  "juegos.memorama.reiniciar": { es: "Reiniciar", en: "Restart" },
  "juegos.memorama.jugarOtraVez": { es: "Jugar otra vez", en: "Play again" },
  "juegos.memorama.cartasAriaLabel": { es: "Cartas del memorama", en: "Memory game cards" },
  "juegos.memorama.cartaBocaAbajo": { es: "Carta {n}, boca abajo", en: "Card {n}, face down" },
  "juegos.memorama.finTitulo": { es: "¡Completaste el memorama!", en: "You completed the memory game!" },
  "juegos.memorama.finTexto": { es: "{intentos} intentos en {tiempo}.", en: "{intentos} attempts in {tiempo}." },
  "juegos.memorama.esMejorMarca": { es: " Es tu mejor marca.", en: " That's your best score." },

  "juegos.memorama.carta.cohete": { es: "Cohete", en: "Rocket" },
  "juegos.memorama.carta.castillo": { es: "Castillo", en: "Castillo" },
  "juegos.memorama.carta.torito": { es: "Torito", en: "Torito" },
  "juegos.memorama.carta.rueda": { es: "Rueda", en: "Wheel" },
  "juegos.memorama.carta.volcan": { es: "Volcán", en: "Volcano" },
  "juegos.memorama.carta.bengala": { es: "Bengala", en: "Sparkler" },
  "juegos.memorama.carta.papel": { es: "Papel picado", en: "Papel picado" },
  "juegos.memorama.carta.parroquia": { es: "Parroquia", en: "Parish church" },

  "juegos.sopa.titulo": { es: "Sopa de letras", en: "Word search" },
  "juegos.sopa.texto": {
    es: "Encuentra las 10 palabras de Tultepec. Toca la primera y la última letra de cada una; pueden estar en horizontal, vertical, diagonal o al revés.",
    en: "Find the 10 words from Tultepec. Tap the first and last letter of each one; they can run horizontally, vertically, diagonally or backwards.",
  },
  "juegos.sopa.encontradas": { es: "Encontradas", en: "Found" },
  "juegos.sopa.reiniciar": { es: "Nueva sopa", en: "New puzzle" },
  "juegos.sopa.jugarOtraVez": { es: "Jugar otra vez", en: "Play again" },
  "juegos.sopa.tableroAriaLabel": { es: "Tablero de la sopa de letras", en: "Word search board" },
  "juegos.sopa.celdaAriaLabel": { es: "Letra {letra}, fila {fila}, columna {columna}", en: "Letter {letra}, row {fila}, column {columna}" },
  "juegos.sopa.palabrasAriaLabel": { es: "Palabras por encontrar", en: "Words to find" },
  "juegos.sopa.finTitulo": { es: "¡Completaste la sopa!", en: "You solved the puzzle!" },
  "juegos.sopa.finTexto": { es: "Eres un experto pirotécnico.", en: "You're a true fireworks expert." },

  // Menú lateral (src/data/menu.js + SidebarMenu.jsx + ContentPanel.jsx):
  // 9 opciones de nivel superior, algunas con submenú.
  "menu.header.titulo": { es: "Menú", en: "Menu" },
  "menu.ariaLabel": { es: "Menú principal", en: "Main menu" },
  "menu.movil.abrir": { es: "Abrir menú", en: "Open menu" },
  "menu.movil.cerrar": { es: "Cerrar menú", en: "Close menu" },
  "menu.inicio": { es: "Inicio", en: "Home" },
  "menu.proximamente": { es: "Próximamente", en: "Coming soon" },
  "menu.proximamente.badge": { es: "Próximamente", en: "Coming soon" },
  "menu.proximamente.anuncio": { es: "Próximamente: {opcion}", en: "Coming soon: {opcion}" },

  "panel.proximamente.titulo": { es: "Esta sección se está preparando", en: "This section is being prepared" },
  "panel.proximamente.texto": {
    es: "Todavía estamos armando \"{opcion}\". Vuelve pronto para verla.",
    en: "We're still putting together \"{opcion}\". Check back soon.",
  },
  "panel.breadcrumbsAriaLabel": { es: "Ubicación actual", en: "Current location" },

  "menu.item.pirotecnia": { es: "Pirotecnia", en: "Fireworks" },
  "menu.item.memorias": { es: "Memorias", en: "Memories" },
  "menu.item.museos": { es: "Museos", en: "Museums" },
  "menu.item.eventos": { es: "Eventos", en: "Events" },
  "menu.item.gastronomia": { es: "Gastronomía", en: "Food" },
  "menu.item.musica": { es: "Música", en: "Music" },
  "menu.item.visitanos": { es: "Visítanos", en: "Visit us" },
  "menu.item.juegos": { es: "Juegos", en: "Games" },
  "menu.item.agradecimientos": { es: "Agradecimientos", en: "Acknowledgments" },
  "menu.item.acercaDe": { es: "Acerca de", en: "About" },

  "menu.opcion.historia": { es: "Historia", en: "History" },
  "menu.opcion.galeria": { es: "Galería de imágenes", en: "Image gallery" },
  "menu.opcion.videosTipo": { es: "Videos por tipo", en: "Videos by type" },
  "menu.opcion.memoriasOficio": { es: "Memorias del oficio", en: "Memories of the craft" },
  "menu.opcion.memoriasPueblo": { es: "Memorias de mi pueblo", en: "Memories of my town" },
  "menu.opcion.relatos": { es: "Relatos escritos", en: "Written accounts" },
  "menu.opcion.comparte": { es: "Comparte tu historia", en: "Share your story" },
  "menu.opcion.calendario": { es: "Calendario por mes", en: "Calendar by month" },
  "menu.opcion.fiestasAno": { es: "Fiestas del año", en: "Festivals of the year" },
  "menu.opcion.fichaEvento": { es: "Ficha de cada evento", en: "Event details" },
  "menu.opcion.comoLlegar": { es: "Cómo llegar", en: "How to get there" },
  "menu.opcion.planeaVisita": { es: "Planea tu visita", en: "Plan your visit" },
  "menu.opcion.mapaRecorridos": { es: "Mapa y recorridos", en: "Map and routes" },
  "menu.opcion.torito": { es: "Laberinto del torito", en: "Torito maze" },
  "menu.opcion.memorama": { es: "Memorama", en: "Memory game" },
  "menu.opcion.sopa": { es: "Sopa de letras", en: "Word search" },

  "agradecimientos.eyebrow": { es: "Con cariño", en: "With gratitude" },
  "agradecimientos.title": { es: "Agradecimientos", en: "Acknowledgments" },

  "acercaDe.eyebrow": { es: "Sobre este sitio", en: "About this site" },
  "acercaDe.title": { es: "Acerca de", en: "About" },
  "acercaDe.version": { es: "Versión 1.0", en: "Version 1.0" },
  "acercaDe.proposito": {
    es: "Esta página nació para guardar y compartir la memoria de Tultepec: su historia, su gente, sus fiestas y el oficio que convierte el fuego en arte. Es un archivo vivo, pensado para que cualquiera -- de aquí o de lejos -- pueda conocer y ayudar a preservar esa herencia.",
    en: "This page was created to keep and share the memory of Tultepec: its history, its people, its festivities, and the craft that turns fire into art. It's a living archive, meant so that anyone -- from here or from afar -- can get to know and help preserve that heritage.",
  },
  "acercaDe.alcance": {
    es: "Esta es la versión 1.0 del sitio: ya reúne la historia del pueblo, la galería de imágenes, las memorias y relatos compartidos por la comunidad, el calendario de fiestas, cómo llegar y los primeros juegos. Seguirá creciendo con nuevas secciones.",
    en: "This is version 1.0 of the site: it already brings together the town's history, the image gallery, memories and stories shared by the community, the festival calendar, how to get here, and the first games. It will keep growing with new sections.",
  },

  // Menú Cristal (src/components/Cristal/): columna fija + flyouts +
  // vista de Inicio con accesos, pasos y novedades.
  "cristal.marca.sub": { es: "Pueblo Pirotécnico", en: "Firework-Making Town" },
  "cristal.inicio.bienvenidosA": { es: "Bienvenidos a", en: "Welcome to" },
  "cristal.paso": { es: "Paso", en: "Step" },
  "cristal.novedades.titulo": { es: "Últimas novedades", en: "Latest updates" },
  "cristal.novedades.memoriasSub": { es: "Tomo I", en: "Volume I" },
  "cristal.novedades.galeriaSub": { es: "Fotos y videos", en: "Photos and videos" },
  "cristal.novedades.calendarioSub": { es: "Próximos eventos", en: "Upcoming events" },
  "cristal.novedades.juegosSub": { es: "3 juegos", en: "3 games" },
  "cristal.novedades.agradecimientosSub": { es: "Gracias", en: "Thank you" },
  "cristal.tiles.calendarioSub": { es: "Feria Nacional", en: "National Fair" },
  "cristal.tiles.memoriasSub": { es: "Recuerdos", en: "Memories" },
  "cristal.seccion.proximamente": {
    es: "Esta sección se está preparando. Vuelve pronto para verla.",
    en: "This section is being prepared. Check back soon.",
  },
  "cristal.privacidad.titulo": { es: "Aviso de privacidad", en: "Privacy notice" },
};
