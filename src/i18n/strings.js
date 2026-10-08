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

  "hero.title.line1": { es: "Tultepec Capital de la", en: "Tultepec Capital of" },
  "hero.title.line2": { es: "Pirotecnia", en: "Fireworks" },
  "hero.subtitle": {
    es: "Lugar donde el fuego se convierte en arte: entre papel, carrizo, madera, hilo y pólvora se crean espectaculares castillos, toros monumentales, luces de bengala, cohetes y muchos productos más.",
    en: "A place where fire becomes art: with paper, reed, wood, thread and gunpowder, artisans create spectacular castillos, monumental toros, sparklers, firecrackers and many other products.",
  },
  "hero.verVideo": { es: "Ver video", en: "Watch video" },
  "hero.dalePlay": { es: "Dale play", en: "Press play" },
  "hero.scrollCue": { es: "¿Cuándo vienes?", en: "When are you coming?" },

  "hero.card.history.title": { es: "Explora la historia", en: "Explore the history" },
  "hero.card.history.caption": { es: "Momentos y tradiciones", en: "Moments and traditions" },
  "hero.card.memories.title": { es: "Memorias de mi pueblo", en: "Memories of my town" },
  "hero.card.memories.caption": { es: "Testimonios del pueblo", en: "Stories from the town" },
  "hero.card.books.title": { es: "Relatos Escritos", en: "Written Accounts" },
  "hero.card.books.caption": { es: "3 libros publicados", en: "3 published books" },
  "hero.card.galeria.title": { es: "Imágenes y videos", en: "Photos and videos" },
  "hero.card.galeria.caption": { es: "Galería del pueblo", en: "Gallery of the town" },
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
  "footer.sources": {
    es: "Datos históricos generales (fiesta de San Juan de Dios, origen de la Feria Nacional de la Pirotecnia) tomados de fuentes públicas de divulgación histórica y turística.",
    en: "General historical data (the San Juan de Dios feast day, the origin of the Feria Nacional de la Pirotecnia) drawn from public historical and tourism sources.",
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
  "testimonials.prev": { es: "Testimonio anterior", en: "Previous testimonial" },
  "testimonials.next": { es: "Testimonio siguiente", en: "Next testimonial" },
  "testimonials.verTestimonio": { es: "Ver testimonio {n}", en: "View testimonial {n}" },

  "visitInfo.eyebrow": { es: "Planea tu visita", en: "Plan your visit" },
  "visitInfo.title": { es: "¿Cuándo vienes y cómo llegas?", en: "When should you come, and how do you get here?" },
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
    es: "Aún no hay eventos confirmados para {mes}.",
    en: "There are no confirmed events for {mes} yet.",
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

  "memoriesModal.eyebrow": { es: "Memorias de mi pueblo", en: "Memories of my town" },
  "memoriesModal.title": { es: "Lo que cuentan quienes lo viven", en: "What those who live it have to say" },
  "memoriesModal.tabs.ariaLabel": { es: "Secciones de Memorias de mi pueblo", en: "Memories of my town sections" },
  "memoriesModal.tabs.memorias": { es: "Memorias", en: "Memories" },
  "memoriesModal.tabs.voces": { es: "Voces", en: "Voices" },
  "memoriesModal.tabs.comparte": { es: "Comparte", en: "Share" },
  "memoriesModal.filtroAriaLabel": { es: "Filtrar por libro", en: "Filter by book" },
  "memoriesModal.notaIdioma": { es: "Textos originales en español.", en: "Original texts in Spanish." },
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
  "booksModal.whatsapp": { es: "Preguntar por WhatsApp", en: "Ask via WhatsApp" },
  "booksModal.note": {
    es: "Número de contacto por WhatsApp pendiente de confirmar.",
    en: "WhatsApp contact number still pending confirmation.",
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

  "privacyModal.eyebrow": { es: "Aviso de privacidad", en: "Privacy notice" },
  "privacyModal.title": { es: "Cómo tratamos tus datos", en: "How we handle your data" },
  "privacyModal.updated": { es: "Última actualización: septiembre de 2026.", en: "Last updated: September 2026." },
  "privacyModal.h1": { es: "¿Quién es responsable de tus datos?", en: "Who is responsible for your data?" },
  "privacyModal.p1": {
    es: 'Este sitio es un proyecto cultural independiente, hecho como pieza de portafolio. No representa a ninguna institución de gobierno ni organización oficial. Los responsables del tratamiento de los datos recabados a través de este sitio son Addair del Rosario Torices Vargas y Eduardo Israel Sánchez Villaseñor, y pueden ser contactados en {email}.',
    en: "This site is an independent cultural project, made as a portfolio piece. It does not represent any government institution or official organization. Those responsible for processing the data collected through this site are Addair del Rosario Torices Vargas and Eduardo Israel Sánchez Villaseñor, who can be reached at {email}.",
  },
  "privacyModal.h2": { es: "¿De dónde viene el contenido histórico?", en: "Where does the historical content come from?" },
  "privacyModal.p2": {
    es: "La historia, las memorias familiares y los testimonios que dan vida a este archivo provienen del conocimiento y los recuerdos compartidos por la Profesora Juana Antonieta Zuñiga Urban y el Profesor Fernando Manuel Torices Ramírez, a quienes pertenece esa historia. Addair del Rosario Torices Vargas y Eduardo Israel Sánchez Villaseñor son responsables únicamente de la creación, operación de este sitio web y del tratamiento de los datos personales descrito en este aviso.",
    en: "The history, family memories, and testimonials that give life to this archive come from the knowledge and memories shared by Professor Juana Antonieta Zuñiga Urban and Professor Fernando Manuel Torices Ramírez, to whom that history belongs. Addair del Rosario Torices Vargas and Eduardo Israel Sánchez Villaseñor are responsible only for the creation and operation of this website and for the handling of personal data described in this notice.",
  },
  "privacyModal.h3": { es: "¿Qué datos recabamos y para qué?", en: "What data do we collect, and why?" },
  "privacyModal.p3": {
    es: 'Al usar la función "Comparte tu memoria" puedes proporcionar, de forma voluntaria:',
    en: 'By using the "Share your memory" feature, you may voluntarily provide:',
  },
  "privacyModal.li1": {
    es: "Tu nombre (opcional; puedes dejarlo en blanco y compartir de forma anónima).",
    en: "Your name (optional; you can leave it blank and share anonymously).",
  },
  "privacyModal.li2": {
    es: "Tu relación con Tultepec y el texto de tu memoria.",
    en: "Your connection to Tultepec and the text of your memory.",
  },
  "privacyModal.li3": {
    es: "Tu correo electrónico (opcional, solo para contactarte sobre tu envío; nunca se muestra públicamente).",
    en: "Your email address (optional, only to contact you about your submission; never shown publicly).",
  },
  "privacyModal.p4": {
    es: "Estos datos se usan únicamente para revisar tu memoria antes de decidir si se publica en el archivo del sitio, y para contactarte si dejaste tu correo y es necesario. No se venden ni se comparten con terceros con fines comerciales.",
    en: "This data is used only to review your memory before deciding whether to publish it in the site's archive, and to contact you if you left your email and it's necessary. It is never sold or shared with third parties for commercial purposes.",
  },
  "privacyModal.h5": { es: "Verificación anti-spam y analítica", en: "Anti-spam verification and analytics" },
  "privacyModal.p5": {
    es: "Para evitar envíos automatizados (bots), este formulario usa Cloudflare Turnstile, que procesa información técnica del navegador (no datos personales identificables) para verificar que quien envía es una persona. Este sitio también puede usar analítica web agregada y anónima para entender cuántas personas lo visitan, sin identificarte individualmente.",
    en: "To prevent automated (bot) submissions, this form uses Cloudflare Turnstile, which processes technical browser information (not personally identifiable data) to verify that a human is submitting it. This site may also use aggregated, anonymous web analytics to understand how many people visit it, without identifying you individually.",
  },
  "privacyModal.h6": { es: "¿Dónde se almacenan tus datos?", en: "Where is your data stored?" },
  "privacyModal.p6": {
    es: "Las memorias enviadas se guardan en una base de datos gestionada por Supabase. El acceso está restringido y cada envío pasa por una revisión manual antes de poder mostrarse públicamente.",
    en: "Submitted memories are stored in a database managed by Supabase. Access is restricted, and every submission goes through a manual review before it can be shown publicly.",
  },
  "privacyModal.h7": { es: "Tus derechos (ARCO)", en: "Your rights (ARCO)" },
  "privacyModal.p7": {
    es: "Puedes solicitar en cualquier momento el Acceso, Rectificación, Cancelación u Oposición al tratamiento de los datos que nos hayas compartido, incluyendo pedir que se elimine una memoria ya enviada. Para ejercer cualquiera de estos derechos, escribe a {email}.",
    en: "You can request Access, Rectification, Cancellation, or Opposition (ARCO) to the processing of the data you've shared with us at any time, including asking for a submitted memory to be deleted. To exercise any of these rights, write to {email}.",
  },
  "privacyModal.h8": { es: "Cambios a este aviso", en: "Changes to this notice" },
  "privacyModal.p8": {
    es: "Este aviso puede actualizarse conforme el sitio evolucione. La fecha de la versión vigente siempre aparece al inicio de este texto.",
    en: "This notice may be updated as the site evolves. The date of the current version always appears at the top of this text.",
  },

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
};
