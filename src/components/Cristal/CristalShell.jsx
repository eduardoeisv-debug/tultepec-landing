import { lazy, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import SECTIONS from "../../data/sections.js";
import useHashRoute, { rutaHash } from "../../hooks/useHashRoute.js";
import useScrollLock from "../../hooks/useScrollLock.js";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import { preloadGaleriaImages } from "../../hooks/useGaleriaImages.js";
import { preloadGaleriaVideos } from "../../hooks/useGaleriaVideos.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import TopBarCristal from "./TopBarCristal.jsx";
import BottomNav from "./BottomNav.jsx";
import ColumnaCristal from "./ColumnaCristal.jsx";
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
import JuegosSeccion from "../Panel/views/JuegosSeccion.jsx";
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

// Mismo tono sólido que BottomNav/ColumnaCristal usan como fondo
// (--cristal-glass-movil, ~97% opaco) vs. el azul del degradado del
// sitio que trae index.html por defecto (su <meta name="theme-color">).
const COLOR_CHROME_MOVIL = "#0e0e26";
const COLOR_CHROME_SITIO = "#1a1b4b";

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

  // Al cerrar el menú (Escape, clic fuera, X o elegir una opción), el
  // foco vuelve a la hamburguesa que lo abrió -- si no, tras cerrar
  // queda "perdido" en el <body> y hay que tabular desde cero.
  const cerrarMenu = useCallback(() => {
    setMenuAbierto(false);
    botonMenuRef.current?.focus();
  }, []);

  useEffect(() => {
    setMenuAbierto(false);
  }, [ruta.itemId, ruta.hijoId]);

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
      <Seccion eyebrow="Tultepec" titulo={t("cristal.privacidad.titulo")} Vista={PrivacidadContenido} titleRef={titleRef} />
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
        titulo={etiqueta}
        Vista={esResumenGrupo ? vistaGrupoResumen : REGISTRO[clave]}
        titleRef={titleRef}
        onOpenPrivacy={onOpenPrivacy}
      />
    ) : (
      <InicioCristal titleRef={titleRef} />
    );
  }

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
  const esPrimerCambioRef = useRef(true);
  useLayoutEffect(() => {
    document.title = tituloDocumento;
    if (esPrimerCambioRef.current) {
      esPrimerCambioRef.current = false;
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruta.itemId, ruta.hijoId]);

  return (
    <div className="cristal-root">
      <TopBarCristal enInicio={!ruta.itemId} onAbrirMenu={() => setMenuAbierto(true)} botonMenuRef={botonMenuRef} menuAbierto={menuAbierto} />
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
      <Footer onOpenPrivacy={onOpenPrivacy} enInicio={!ruta.itemId} />
      <BottomNav enInicio={!ruta.itemId} onAbrirMenu={() => setMenuAbierto(true)} menuAbierto={menuAbierto} />
    </div>
  );
}
