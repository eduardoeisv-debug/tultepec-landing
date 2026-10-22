import { lazy, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import SECTIONS from "../../data/sections.js";
import useHashRoute, { rutaHash } from "../../hooks/useHashRoute.js";
import useScrollLock from "../../hooks/useScrollLock.js";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import { preloadGaleriaImages, preloadGaleriaThumbnails } from "../../hooks/useGaleriaImages.js";
import { preloadGaleriaVideos } from "../../hooks/useGaleriaVideos.js";
import {
  hayVueltaPendiente,
  consumirProximaDesdeMenu,
  marcarVueltaAlMenu,
  hayVueltaAlMenuPendiente,
  recordarUltimaSubopcion,
} from "../../hooks/useVolverASecciones.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import TopBarCristal from "./TopBarCristal.jsx";
import BottomNav from "./BottomNav.jsx";
import ColumnaCristal from "./ColumnaCristal.jsx";
import CartaSheet from "../Bienvenida/CartaSheet.jsx";
import Seccion from "./Seccion.jsx";
import InicioCristal from "./InicioCristal.jsx";
import GrupoResumen from "./GrupoResumen.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";
import ErrorFallback from "./ErrorFallback.jsx";
import HeroPapelPicado from "../shared/HeroPapelPicado.jsx";
import Footer from "../Footer/Footer.jsx";
// Importadas directo, no con React.lazy -- precargarlas en segundo
// plano (lo que hacía esta misma sección antes) seguía dejando un
// hueco real: si el usuario tocaba una opción del menú ANTES de que
// la precarga alcanzara a terminar (típicamente los primeros 1-3s
// tras cargar, justo cuando alguien suele empezar a explorar), esa
// primera navegación todavía disparaba una descarga de red de
// verdad, y durante ese rato la página se veía corta (solo título +
// esqueleto), dejando ver el bloque de compartir y el pie de una vez.
// Juntas pesan ~15kB comprimidas (ver el historial) -- un costo chico
// y fijo en el paquete principal a cambio de que nunca más dependan
// de una descarga para aparecer. PrivacidadContenido se queda como
// React.lazy aparte: carga react-markdown + remark-gfm (~168kB
// comprimidos, muy por arriba del resto) y no es una opción del menú
// que alguien toque de pasada.
import HistoriaView from "../Panel/views/HistoriaView.jsx";
import GaleriaView from "../Panel/views/GaleriaView.jsx";
import MemoriasPuebloView from "../Panel/views/MemoriasPuebloView.jsx";
import RelatosView from "../Panel/views/RelatosView.jsx";
import ComparteView from "../Panel/views/ComparteView.jsx";
import MuseosView from "../Panel/views/MuseosView.jsx";
import CalendarioView from "../Panel/views/CalendarioView.jsx";
import ComoLlegarView from "../Panel/views/ComoLlegarView.jsx";
import PlaneaVisitaView from "../Panel/views/PlaneaVisitaView.jsx";
import JuegosSeccion, { preloadJuegos } from "../Panel/views/JuegosSeccion.jsx";
import AgradecimientosView from "../Panel/views/AgradecimientosView.jsx";
import AcercaDeView from "../Panel/views/AcercaDeView.jsx";
import "./CristalShell.css";

const PrivacidadContenido = lazy(() => import("../Panel/views/PrivacidadContenido.jsx"));

// Mismo registro "item/hijo" -> componente que ya usaba ContentPanel.jsx
// (ver esa misma tabla en la rama de Barra Fija) -- Museos, Juegos,
// Agradecimientos y Acerca de son "item" a secas porque ya no tienen
// hijos en Menú Cristal.
const REGISTRO = {
  "pirotecnia/historia": HistoriaView,
  "pirotecnia/galeria": GaleriaView,
  "memorias/pueblo": MemoriasPuebloView,
  "memorias/relatos": RelatosView,
  "memorias/comparte": ComparteView,
  museos: MuseosView,
  "eventos/calendario": CalendarioView,
  "visitanos/como-llegar": ComoLlegarView,
  "visitanos/planea-visita": PlaneaVisitaView,
  juegos: JuegosSeccion,
  agradecimientos: AgradecimientosView,
  "acerca-de": AcercaDeView,
};

const SITE_URL = "https://tultepec-landing.vercel.app/";

// sessionStorage (no un ref/estado): tiene que sobrevivir a un
// remontaje completo de CristalShell -- el botón atrás del navegador
// recarga este mismo bundle desde el historial del navegador en
// Safari/iOS con bfcache desactivado, así que un ref en memoria no
// siempre llega vivo hasta ese momento.
const INICIO_SCROLL_KEY = "tultepec:inicioScrollY";

// Mismo tono sólido que BottomNav/ColumnaCristal usan como fondo
// (--cristal-glass-movil, ~97% opaco) vs. el azul del degradado del
// sitio que trae index.html por defecto (su <meta name="theme-color">).
const COLOR_CHROME_MOVIL = "#0e0e26";
const COLOR_CHROME_SITIO = "#1a1b4b";

// Si ya se abrió "Una carta para ti" desde la barra inferior alguna
// vez -- el punto de novedad del botón (BottomNav.jsx) no vuelve a
// aparecer una vez que esto es true. try/catch: en modo privado o con
// el almacenamiento bloqueado, localStorage.getItem/setItem puede
// lanzar -- si falla, se trata como "nunca vista" (el punto sigue
// apareciendo en cada visita, degradado pero no roto).
const CARTA_VISTA_KEY = "tultepec:cartaVista";

// Cambia SOLO esto (a cualquier texto distinto, p.ej. "2026-11") el
// día que el TEXTO de la carta cambie de verdad -- no hace falta
// tocar nada más: quien ya la había marcado como vista con una
// versión distinta a la de hoy vuelve a ver el punto de novedad, como
// si no la hubiera leído, porque leerCartaVista() de abajo compara
// las dos versiones, no solo si "ya se abrió alguna vez".
const LETTER_VERSION = "2026-10";

function leerCartaVista() {
  try {
    const guardado = localStorage.getItem(CARTA_VISTA_KEY);
    if (!guardado) return false;
    return JSON.parse(guardado)?.version === LETTER_VERSION;
  } catch {
    // Sin permisos de almacenamiento, o un valor guardado que ya no
    // tiene sentido (el formato viejo, un solo "1" sin versión): se
    // trata como "nunca vista", nunca como un error que rompa algo.
    return false;
  }
}

function guardarCartaVista() {
  try {
    localStorage.setItem(CARTA_VISTA_KEY, JSON.stringify({ version: LETTER_VERSION }));
  } catch {
    // Sin permisos de almacenamiento: no es crítico, el punto de
    // novedad solo volvería a aparecer en la próxima visita.
  }
}

// Punto de entrada de "Menú Cristal": barra superior siempre visible
// (TopBarCristal.jsx, hamburguesa + casita) + el contenido de la ruta
// activa a todo el ancho -- el menú (ColumnaCristal.jsx) ya no es una
// columna fija al lado, es una capa a pantalla completa que solo
// existe en el DOM mientras está abierta, igual en escritorio que en
// celular.
export default function CristalShell() {
  const ruta = useHashRoute();
  const { t } = useLanguage();
  const stageRef = useRef(null);
  const botonMenuRef = useRef(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  // De dónde vino la navegación a la sección ACTUAL: "menu" (una fila
  // del menú lateral, ver ColumnaCristal.jsx), "icons" (una tarjeta de
  // Inicio u otro enlace suelto), o null (Inicio mismo, enlace
  // directo/recarga, o ya se limpió) -- de esto depende a dónde manda
  // el botón "Volver" de Seccion.jsx. Estado de React (no una variable
  // de módulo como el resto de useVolverASecciones.js): Seccion.jsx
  // necesita que el texto del botón cambie con él, y nada obliga a
  // React a volver a renderizar solo porque una variable suelta
  // cambió de valor. Se resuelve en el efecto de cambio de ruta, más
  // abajo.
  const [origen, setOrigen] = useState(null);
  const botonCartaRef = useRef(null);
  const [cartaAbierta, setCartaAbierta] = useState(false);
  // Lazy init (useState(fn), no useState(fn())): localStorage solo se
  // lee una vez, al montar -- no en cada render.
  const [cartaVista, setCartaVista] = useState(leerCartaVista);
  const esMovil = useMediaQuery("(max-width: 768px)");

  // Arranca de inmediato el sondeo de qué fotos/videos existen de
  // verdad en public/images|videos/<categoría>/ (useGaleriaImages.js /
  // useGaleriaVideos.js, "01.jpg", "02.jpg"... hasta el primer hueco)
  // -- a diferencia de las vistas de arriba (ya en el paquete
  // principal, sin red de por medio), esto SÍ es una serie real de
  // peticiones que no se puede resolver con un import estático: hay
  // que preguntarle al servidor qué archivos están ahí. preloadGaleria-
  // Images/Videos ya existían para esto mismo (pensadas para llamarse
  // desde el Hero de antes del rediseño a Menú Cristal) pero habían
  // quedado sin ningún punto que las llamara -- cada visita a Galería
  // empezaba el sondeo desde cero en ese momento, con la página corta
  // mientras tanto (mismo síntoma que ya se corrigió para el resto de
  // las vistas, pero por esta otra causa). Sin idle/retraso: son
  // peticiones chicas, arrancarlas apenas monta el shell les da el
  // mayor margen posible antes de que alguien llegue a tocar esa
  // tarjeta.
  useEffect(() => {
    preloadGaleriaImages();
    preloadGaleriaVideos();
  }, []);

  // Los únicos dos React.lazy que le quedan al sitio (PrivacidadContenido
  // y los 3 minijuegos de Juegos, ver sus respectivos comentarios) se
  // adelantan también aquí, en vez de esperar solo al roce de mouse/dedo
  // sobre su fila del menú (ColumnaCristal.jsx) -- cubre a quien entra
  // directo a una de esas rutas por enlace compartido o navega con
  // teclado/lector de pantalla, que nunca dispara un onMouseEnter.
  // requestIdleCallback (con setTimeout de respaldo en Safari, que no
  // lo trae) para no competir por el hilo principal con el primer
  // pintado real de la página.
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const cancelarIdle = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => {
      preloadJuegos();
      import("../Panel/views/PrivacidadContenido.jsx");
    });
    return () => cancelarIdle(id);
  }, []);

  // La barra inferior fija (BottomNav.jsx) solo existe en celular --
  // su mismo tono (casi negro, no el azul del degradado del sitio)
  // debe pintar también la franja de la barra de gestos de Android/el
  // indicador de inicio de iOS, que el sistema colorea a partir del
  // theme-color y del fondo real de html/body, no de lo que haya
  // encima en capas position:fixed (mismo mecanismo ya identificado
  // para el menú -- ver el historial de CristalShell.css/global.css).
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    document.documentElement.classList.toggle("cristal-chrome-movil", esMovil);
    meta?.setAttribute("content", esMovil ? COLOR_CHROME_MOVIL : COLOR_CHROME_SITIO);
  }, [esMovil]);

  // setCartaAbierta(false) de paso: menú y carta nunca conviven
  // abiertos a la vez (punto 6 del encargo) -- abrir uno cierra el
  // otro, sin importar desde dónde se dispare (hamburguesa, barra
  // inferior...), porque las dos pasan siempre por aquí.
  const abrirMenu = useCallback(() => {
    setCartaAbierta(false);
    setMenuAbierto(true);
  }, []);

  // Marca "ya vista" siempre que se abre (no solo la primera vez): es
  // barato si ya estaba marcada, y así el punto de novedad desaparece
  // en cuanto se abre la hoja, como pide el punto 3 del encargo.
  const abrirCarta = useCallback(() => {
    setMenuAbierto(false);
    setCartaAbierta(true);
    guardarCartaVista();
    setCartaVista(true);
  }, []);

  // Foco de vuelta al botón "Carta" de la barra inferior (el único
  // disparador posible -- a diferencia del menú, esta hoja no tiene
  // equivalente en el encabezado de escritorio).
  const cerrarCarta = useCallback(() => {
    setCartaAbierta(false);
    botonCartaRef.current?.focus();
  }, []);

  // Adelanta la descarga de verdad de las primeras miniaturas de la
  // Galería (no solo el sondeo de qué fotos existen, ya disparado
  // arriba) en cuanto la ruta ENTRA a Pirotecnia -- a propósito no en
  // abrirMenu (demasiado pronto: bajaría datos para cualquiera que abra
  // el menú y nunca toque Pirotecnia) ni con las 45 completas (ver
  // PRELOAD_COUNT en useGaleriaImages.js). Cubre tanto el roce de
  // mouse/dedo sobre la fila del menú (ColumnaCristal.jsx, más rápido
  // porque adelanta ANTES del clic) como entrar directo por un enlace
  // compartido o con teclado/lector de pantalla, que nunca dispara ese
  // roce -- preloadGaleriaThumbnails ya se protege sola contra llamarse
  // dos veces.
  useEffect(() => {
    if (ruta.itemId === "pirotecnia") preloadGaleriaThumbnails();
  }, [ruta.itemId]);

  // Al cerrar el menú (Escape, clic fuera, X o elegir una opción), el
  // foco vuelve a la hamburguesa que lo abrió -- si no, tras cerrar
  // queda "perdido" en el <body> y hay que tabular desde cero.
  const cerrarMenu = useCallback(() => {
    setMenuAbierto(false);
    botonMenuRef.current?.focus();
  }, []);

  useScrollLock(menuAbierto);

  useEffect(() => {
    if (!menuAbierto) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") cerrarMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuAbierto, cerrarMenu]);

  const esPrimeraVezRef = useRef(true);
  const titleRef = useCallback((nodo) => {
    if (!nodo) return;
    if (esPrimeraVezRef.current) {
      esPrimeraVezRef.current = false;
      return;
    }
    nodo.focus();
  }, []);

  const onOpenPrivacy = () => {
    window.location.hash = "#/privacidad";
  };

  const onCompartir = async () => {
    try {
      await navigator.clipboard.writeText(SITE_URL);
    } catch {
      // Sin permisos de portapapeles: el enlace ya está visible en la
      // barra de direcciones, no hay nada más que hacer aquí.
    }
  };

  // Fuera del if/else de abajo (las reglas de hooks no dejan llamar
  // useMemo condicionalmente): item.find es barato, MENU tiene un
  // puñado de filas. Memorizado por `item` (no por cada render) para
  // que Vista sea la MISMA función entre renders mientras se siga en
  // el mismo grupo -- si no, Seccion vería un componente "nuevo" en
  // cada render de CristalShell (p.ej. al abrir/cerrar el menú) y
  // remontaría GrupoResumen de más.
  const item = ruta.itemId ? SECTIONS.find((i) => i.id === ruta.itemId) : undefined;
  const vistaGrupoResumen = useMemo(() => {
    if (!item?.hijos) return null;
    return () => <GrupoResumen item={item} />;
  }, [item]);

  let contenido;
  let tituloDocumento;
  if (ruta.itemId === "privacidad") {
    tituloDocumento = `${t("cristal.privacidad.titulo")} · Tultepec`;
    contenido = (
      <Seccion
        eyebrow="Tultepec"
        seccionId={null}
        origen={origen}
        titulo={t("cristal.privacidad.titulo")}
        Vista={PrivacidadContenido}
        titleRef={titleRef}
        onVolverAlMenu={abrirMenu}
      />
    );
  } else if (!ruta.itemId) {
    tituloDocumento = "Tultepec · Estado de México";
    contenido = <InicioCristal titleRef={titleRef} />;
  } else {
    const hijo = item?.hijos ? item.hijos.find((h) => h.id === ruta.hijoId) : null;
    // Grupo sin subopción elegida todavía (llegó por una tarjeta del
    // Bento de Inicio, o por "#/pirotecnia" a secas): su resumen
    // (GrupoResumen.jsx) en vez de REGISTRO, que no tiene entrada
    // para el grupo a secas.
    const esResumenGrupo = Boolean(item?.hijos && !hijo);
    const clave = item?.hijos ? `${item.id}/${hijo?.id}` : item?.id;
    const etiqueta = hijo ? t(hijo.label) : item ? t(item.label) : "";
    tituloDocumento = item ? `${etiqueta} · Tultepec` : "Tultepec · Estado de México";
    // Dentro de una subopción (no en el resumen del grupo en sí), la
    // miga de pan vuelve a ese resumen en vez de a Inicio -- antes la
    // única salida era la casita de TopBarCristal.jsx, que manda
    // siempre hasta Inicio, así que para ver otra subopción del mismo
    // grupo (p.ej. Historia -> Galería dentro de Pirotecnia) había que
    // salir del todo y volver a entrar por la tarjeta del Bento.
    const eyebrowHref = item?.hijos && hijo ? rutaHash(item.id) : undefined;
    contenido = item ? (
      <Seccion
        eyebrow={t(item.label)}
        eyebrowHref={eyebrowHref}
        seccionId={item.id}
        origen={origen}
        titulo={etiqueta}
        Vista={esResumenGrupo ? vistaGrupoResumen : REGISTRO[clave]}
        titleRef={titleRef}
        onOpenPrivacy={onOpenPrivacy}
        onVolverAlMenu={abrirMenu}
      />
    ) : (
      <InicioCristal titleRef={titleRef} />
    );
  }

  // Índice propio en history.state (no popstate, no history.length)
  // distingue atrás/adelante del navegador de una navegación disparada
  // por esta misma página (un <a href="#/..."> normal, o nuestro
  // propio window.location.hash = "..." en los enlaces "Secciones"/
  // "Volver a las secciones" de Seccion.jsx).
  //
  // Se probaron dos heurísticas antes de esta, las dos con fallas
  // reales (ver el historial):
  // - popstate: un <a href="#/..."> normal SÍ lo dispara además de
  //   hashchange en los navegadores actuales (confirmado con un log
  //   directo en el listener) -- contradice el supuesto de que solo
  //   el botón atrás lo hace.
  // - window.history.length: un clic nuevo agrega una entrada
  //   (length crece) y atrás/adelante viaja entre entradas ya
  //   existentes (length se queda igual o baja) -- cierto, PERO el
  //   historial de sesión tiene un tope (~50 entradas en Chrome/Edge):
  //   al llegarle, el navegador empieza a descartar las más viejas en
  //   vez de seguir creciendo, así que un clic normal en una sesión
  //   larga también dejaría de crecer el length y volvería a
  //   confundirse con "atrás".
  //
  // history.state SÍ aguanta eso: cada entrada nueva (clic normal o
  // hash por script) nace SIN el índice que estampamos aquí abajo
  // (null/undefined) hasta que este mismo efecto la estampa; una
  // entrada ya visitada antes SIGUE llevando el índice que se le
  // estampó esa vez, sin importar cuántas entradas nuevas se hayan
  // creado o descartado desde entonces -- el navegador restaura ese
  // mismo objeto de estado al volver a ella con atrás/adelante. No
  // depende del tamaño del historial, solo de si ESTA entrada en
  // particular ya tiene o no la marca propia.
  const indiceNavRef = useRef(0);
  useLayoutEffect(() => {
    const estadoActual = window.history.state;
    if (estadoActual && typeof estadoActual.indiceNav === "number") {
      // Recarga de página (u otra causa) sobre una entrada que ya
      // estaba estampada -- adopta su índice en vez de reiniciar a 0,
      // para no desalinear la próxima comparación.
      indiceNavRef.current = estadoActual.indiceNav;
    } else {
      window.history.replaceState({ ...estadoActual, indiceNav: 0 }, "", window.location.href);
      indiceNavRef.current = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recuerda, MIENTRAS se está en Inicio, la posición de scroll más
  // reciente -- no retroactivamente al salir de Inicio: para cuando
  // ese otro momento llega, el contenido ya cambió a la sección nueva
  // (puede medir menos alto que Inicio) y el navegador ya pudo haber
  // recortado solo window.scrollY para que quepa, dejando un valor que
  // ya no es el de verdad. rAF (no cada evento de scroll suelto) para
  // no escribir en sessionStorage decenas de veces por segundo.
  useEffect(() => {
    if (ruta.itemId !== null) return undefined;
    let cuadro = null;
    const onScroll = () => {
      if (cuadro) return;
      cuadro = requestAnimationFrame(() => {
        cuadro = null;
        sessionStorage.setItem(INICIO_SCROLL_KEY, String(window.scrollY));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (cuadro) cancelAnimationFrame(cuadro);
    };
  }, [ruta.itemId]);

  // Sube al inicio de la página y actualiza el título del documento al
  // cambiar de ruta -- saltando la primera carga, igual que hacía
  // ContentPanel.jsx en el diseño anterior.
  // useLayoutEffect (no useEffect): corre antes de que el navegador
  // pinte el siguiente frame, así el salto de scroll ya pasó cuando se
  // ve la ruta nueva -- con useEffect (que corre después de pintar)
  // alcanzaba a pintarse un frame de la vista nueva con el scroll
  // todavía en la posición vieja (p.ej. mostrando primero los botones
  // de compartir del fondo de la página anterior) antes de saltar.
  // behavior:"instant", no "auto": "auto" no es instantáneo por sí
  // solo, significa "lo que diga scroll-behavior en el CSS" -- y
  // global.css pone scroll-behavior:smooth en html (para los anclas
  // internos), así que "auto" heredaba ese scroll animado en cada
  // cambio de ruta.
  // itemIdAnteriorRef: el itemId de ANTES de este cambio de ruta --
  // distingue "nueva subsección del mismo grupo" (el origen del grupo
  // sigue siendo el mismo) de "entramos a una sección distinta" (el
  // origen se resuelve de nuevo), y es la sección a resaltar al
  // reabrir el menú cuando se sale de ella con el botón atrás (ver
  // más abajo).
  const esPrimerCambioRef = useRef(true);
  const itemIdAnteriorRef = useRef(null);
  useLayoutEffect(() => {
    document.title = tituloDocumento;
    // Recuerda "grupo + última subopción elegida" en CADA cambio de
    // ruta que caiga sobre una subopción real, venga del menú o no
    // (una tarjeta, un enlace directo, atrás/adelante...) -- este
    // efecto es el único punto que ve absolutamente todas las
    // navegaciones, con o sin el menú de por medio. Entrar al resumen
    // del grupo (ruta.hijoId null) no se guarda a propósito: no borra
    // el recuerdo de cuál fue la última subopción elegida, que es
    // justo lo que ColumnaCristal.jsx necesita para resaltarla ahí
    // aunque la página visible ahora mismo sea ese resumen. Incluida
    // la primera carga (fuera del if/else de abajo): un enlace
    // compartido directo a una subopción también cuenta.
    if (ruta.hijoId) {
      recordarUltimaSubopcion(ruta.itemId, ruta.hijoId);
    }
    if (esPrimerCambioRef.current) {
      esPrimerCambioRef.current = false;
    } else {
      const idAnterior = itemIdAnteriorRef.current;
      const origenAlLlegar = origen; // el de la sección que se DEJA, antes de resolver el de la nueva
      // ¿Esta entrada ya tenía un índice propio estampado (de una
      // visita anterior, restaurado por el navegador al volver a
      // ella), distinto al que veníamos registrando? Entonces es un
      // salto real entre entradas existentes (atrás/adelante). Si no
      // (entrada nueva, sin marca, o casualmente el mismo índice que
      // ya teníamos) la estampa con el siguiente índice -- ver el
      // comentario grande junto a indiceNavRef, arriba.
      const estadoActual = window.history.state;
      const indiceEntrada = estadoActual && typeof estadoActual.indiceNav === "number" ? estadoActual.indiceNav : null;
      const esVueltaAtras = indiceEntrada !== null && indiceEntrada !== indiceNavRef.current;
      if (esVueltaAtras) {
        indiceNavRef.current = indiceEntrada;
      } else {
        indiceNavRef.current += 1;
        window.history.replaceState({ ...estadoActual, indiceNav: indiceNavRef.current }, "", window.location.href);
      }

      // La hoja de "Una carta para ti" nunca sobrevive un cambio de
      // ruta -- es contenido de Inicio, no tendría sentido verla
      // abierta sobre otra sección (p.ej. tras tocar uno de sus
      // propios enlaces, "Comparte tu historia"/"Lee las memorias").
      setCartaAbierta(false);

      // Resuelve el origen de la sección a la que se ENTRA: si
      // ColumnaCristal.jsx dejó avisado que viene del menú, gana; si
      // el itemId no cambió (subsección nueva del mismo grupo), se
      // queda como estaba; si no, es una entrada "fresca" sin pasar
      // por el menú (tarjeta de Inicio, enlace del pie, un CTA, un
      // enlace directo...) -- "icons" por defecto (null si es Inicio),
      // tal como pide el punto 6 del encargo.
      const pendienteOrigenMenu = consumirProximaDesdeMenu();
      const origenResuelto = pendienteOrigenMenu
        ? { tipo: "menu", ...pendienteOrigenMenu }
        : ruta.itemId === idAnterior
          ? origenAlLlegar
          : ruta.itemId === null
            ? null
            : { tipo: "icons" };
      setOrigen(origenResuelto);

      if (hayVueltaAlMenuPendiente()) {
        // El botón "Volver al menú" (Seccion.jsx) ya dejó pedido
        // reabrir el panel con su propio scroll/resaltado (ver
        // ColumnaCristal.jsx) -- solo falta reabrirlo.
        setMenuAbierto(true);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } else if (esVueltaAtras && origenAlLlegar?.tipo === "menu" && ruta.itemId !== idAnterior) {
        // Atrás del navegador/teléfono saliendo de una sección abierta
        // desde el menú: el mismo efecto que el botón de arriba, pero
        // disparado por el historial -- idAnterior es la sección que
        // se deja, la que hay que resaltar al reabrir.
        marcarVueltaAlMenu({ scrollMenu: origenAlLlegar.scrollMenu, seccionId: idAnterior });
        setMenuAbierto(true);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      } else {
        // Cualquier otro cambio de ruta cierra el menú si estaba
        // abierto (antes vivía como un efecto aparte) -- un enlace
        // normal ya lo cierra por su cuenta (ver onCerrar en
        // ColumnaCristal.jsx), esto cubre el resto: editar el hash a
        // mano, o un atrás/adelante que no entra en el caso de arriba.
        setMenuAbierto(false);

        if (hayVueltaPendiente()) {
          // El enlace/botón "Secciones" ya dejó pedido su propio
          // scroll dirigido a un ícono puntual (ver InicioCristal.jsx).
        } else if (esVueltaAtras && ruta.itemId === null) {
          // Atrás/adelante del navegador hacia Inicio (origen "icons"
          // o ninguno): restaura lo que el efecto de arriba venía
          // guardando, en vez del salto al tope de siempre -- el
          // navegador ya no lo hace solo (scrollRestoration="manual"
          // en main.jsx, puesto a propósito para que recargar la
          // página no deje "a la mitad").
          const guardado = sessionStorage.getItem(INICIO_SCROLL_KEY);
          window.scrollTo({ top: guardado ? Number(guardado) : 0, left: 0, behavior: "instant" });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
      }
    }
    itemIdAnteriorRef.current = ruta.itemId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruta.itemId, ruta.hijoId]);

  return (
    <div className="cristal-root">
      <TopBarCristal enInicio={!ruta.itemId} onAbrirMenu={abrirMenu} botonMenuRef={botonMenuRef} menuAbierto={menuAbierto} />
      {menuAbierto && <ColumnaCristal ruta={ruta} onCompartir={onCompartir} onCerrar={cerrarMenu} />}
      <main className="cristal-stage" ref={stageRef}>
        <div className="cristal-stage__papel">
          <HeroPapelPicado />
        </div>
        <ErrorBoundary key={`${ruta.itemId}/${ruta.hijoId}`} fallback={<ErrorFallback />}>
          {contenido}
        </ErrorBoundary>
      </main>
      {/* Fuera del ErrorBoundary de arriba (que se remonta por completo
          en cada cambio de ruta, por su key) para que el pie no
          desaparezca ni tarde en volver mientras el chunk de la vista
          nueva (React.lazy, ver REGISTRO arriba) todavía se descarga --
          antes vivía dentro de cada vista (CierreComun.jsx) y el hueco
          del Suspense de Seccion.jsx se sentía como "el pie tarda". */}
      <Footer onOpenPrivacy={onOpenPrivacy} />
      {/* Siempre montada (no {cartaAbierta && ...} como ColumnaCristal) --
          es lo que deja animar también la SALIDA al cerrar, ver el
          comentario grande en CartaSheet.jsx. */}
      <CartaSheet abierta={cartaAbierta} onCerrar={cerrarCarta} />
      <BottomNav
        enInicio={!ruta.itemId}
        onAbrirMenu={abrirMenu}
        onCerrarMenu={cerrarMenu}
        menuAbierto={menuAbierto}
        onAbrirCarta={abrirCarta}
        onCerrarCarta={cerrarCarta}
        cartaAbierta={cartaAbierta}
        cartaVista={cartaVista}
        botonCartaRef={botonCartaRef}
      />
    </div>
  );
}
