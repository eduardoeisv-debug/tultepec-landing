import { lazy, useCallback, useEffect, useRef, useState } from "react";
import MENU from "../../data/menu.js";
import useHashRoute from "../../hooks/useHashRoute.js";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import useScrollLock from "../../hooks/useScrollLock.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import ColumnaCristal from "./ColumnaCristal.jsx";
import Seccion from "./Seccion.jsx";
import InicioCristal from "./InicioCristal.jsx";
import HeroPapelPicado from "../shared/HeroPapelPicado.jsx";
import "./CristalShell.css";

const BREAKPOINT = "(min-width: 701px)";

const HistoriaView = lazy(() => import("../Panel/views/HistoriaView.jsx"));
const GaleriaView = lazy(() => import("../Panel/views/GaleriaView.jsx"));
const MemoriasPuebloView = lazy(() => import("../Panel/views/MemoriasPuebloView.jsx"));
const RelatosView = lazy(() => import("../Panel/views/RelatosView.jsx"));
const ComparteView = lazy(() => import("../Panel/views/ComparteView.jsx"));
const MuseosView = lazy(() => import("../Panel/views/MuseosView.jsx"));
const CalendarioView = lazy(() => import("../Panel/views/CalendarioView.jsx"));
const ComoLlegarView = lazy(() => import("../Panel/views/ComoLlegarView.jsx"));
const PlaneaVisitaView = lazy(() => import("../Panel/views/PlaneaVisitaView.jsx"));
const JuegosSeccion = lazy(() => import("../Panel/views/JuegosSeccion.jsx"));
const AgradecimientosView = lazy(() => import("../Panel/views/AgradecimientosView.jsx"));
const AcercaDeView = lazy(() => import("../Panel/views/AcercaDeView.jsx"));
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

// Punto de entrada de "Menú Cristal": columna fija (ColumnaCristal.jsx)
// + contenido de la ruta activa (InicioCristal, la vista de privacidad
// o una Seccion genérica) a la derecha, igual que ContentPanel.jsx
// hacía en el diseño anterior -- mismo manejo de foco/scroll/título de
// documento, solo que ahora no hay encabezado fijo aparte que el
// scroll tenga que esquivar.
export default function CristalShell() {
  const ruta = useHashRoute();
  const { t } = useLanguage();
  const stageRef = useRef(null);
  const esEscritorio = useMediaQuery(BREAKPOINT);
  // En celular, al entrar a una sección (no en Inicio) la columna se
  // oculta por completo y el contenido usa toda la pantalla -- ya no
  // se ve apretada junto a la columna ni al voltear el teléfono. Un
  // botón "Menú" en Seccion.jsx (onAbrirMenu) la trae de vuelta como
  // una capa a pantalla completa (igual que antes hacía el menú
  // plegable de Barra Fija); elegir cualquier opción ahí la vuelve a
  // cerrar.
  const [menuAbiertoMovil, setMenuAbiertoMovil] = useState(false);
  const ocultaRailMovil = !esEscritorio && Boolean(ruta.itemId) && !menuAbiertoMovil;
  const overlayRailMovil = !esEscritorio && Boolean(ruta.itemId) && menuAbiertoMovil;

  useEffect(() => {
    setMenuAbiertoMovil(false);
  }, [ruta.itemId, ruta.hijoId]);

  useScrollLock(overlayRailMovil);

  useEffect(() => {
    if (!overlayRailMovil) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuAbiertoMovil(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [overlayRailMovil]);

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

  const onAbrirMenu = () => setMenuAbiertoMovil(true);

  let contenido;
  let tituloDocumento;
  if (ruta.itemId === "privacidad") {
    tituloDocumento = `${t("cristal.privacidad.titulo")} · Tultepec`;
    contenido = (
      <Seccion
        eyebrow="Tultepec"
        titulo={t("cristal.privacidad.titulo")}
        Vista={PrivacidadContenido}
        titleRef={titleRef}
        onAbrirMenu={onAbrirMenu}
      />
    );
  } else if (!ruta.itemId) {
    tituloDocumento = "Tultepec · Estado de México";
    contenido = <InicioCristal titleRef={titleRef} />;
  } else {
    const item = MENU.find((i) => i.id === ruta.itemId);
    const hijo = item?.hijos ? item.hijos.find((h) => h.id === ruta.hijoId) : null;
    const clave = item?.hijos ? `${item.id}/${hijo?.id}` : item?.id;
    const etiqueta = hijo ? t(hijo.label) : item ? t(item.label) : "";
    tituloDocumento = item ? `${etiqueta} · Tultepec` : "Tultepec · Estado de México";
    contenido = item ? (
      <Seccion
        eyebrow={t(item.label)}
        titulo={etiqueta}
        Vista={REGISTRO[clave]}
        titleRef={titleRef}
        onOpenPrivacy={onOpenPrivacy}
        onAbrirMenu={onAbrirMenu}
      />
    ) : (
      <InicioCristal titleRef={titleRef} />
    );
  }

  // Sube al inicio de la página y actualiza el título del documento al
  // cambiar de ruta -- ambos como efecto (no durante el render, que
  // debe quedarse puro) y saltando la primera carga, igual que hacía
  // ContentPanel.jsx en el diseño anterior.
  const esPrimerCambioRef = useRef(true);
  useEffect(() => {
    document.title = tituloDocumento;
    if (esPrimerCambioRef.current) {
      esPrimerCambioRef.current = false;
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruta.itemId, ruta.hijoId]);

  return (
    <div className="cristal-root">
      <div className="cristal-shell">
        <ColumnaCristal
          ruta={ruta}
          onCompartir={onCompartir}
          oculta={ocultaRailMovil}
          overlay={overlayRailMovil}
          onSeleccionar={() => setMenuAbiertoMovil(false)}
        />
        <main className="cristal-stage" ref={stageRef} inert={overlayRailMovil || undefined}>
          <div className="cristal-stage__papel">
            <HeroPapelPicado />
          </div>
          {contenido}
        </main>
      </div>
    </div>
  );
}
