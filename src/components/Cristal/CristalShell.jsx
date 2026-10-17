import { lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import MENU from "../../data/menu.js";
import useHashRoute, { rutaHash } from "../../hooks/useHashRoute.js";
import useScrollLock from "../../hooks/useScrollLock.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import TopBarCristal from "./TopBarCristal.jsx";
import ColumnaCristal from "./ColumnaCristal.jsx";
import Seccion from "./Seccion.jsx";
import InicioCristal from "./InicioCristal.jsx";
import GrupoResumen from "./GrupoResumen.jsx";
import HeroPapelPicado from "../shared/HeroPapelPicado.jsx";
import "./CristalShell.css";

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
  const item = ruta.itemId ? MENU.find((i) => i.id === ruta.itemId) : undefined;
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
    contenido = <InicioCristal titleRef={titleRef} onOpenPrivacy={onOpenPrivacy} />;
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
      <InicioCristal titleRef={titleRef} onOpenPrivacy={onOpenPrivacy} />
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
      <TopBarCristal enInicio={!ruta.itemId} onAbrirMenu={() => setMenuAbierto(true)} botonMenuRef={botonMenuRef} />
      {menuAbierto && <ColumnaCristal ruta={ruta} onCompartir={onCompartir} onCerrar={cerrarMenu} />}
      <main className="cristal-stage" ref={stageRef}>
        <div className="cristal-stage__papel">
          <HeroPapelPicado />
        </div>
        {contenido}
      </main>
    </div>
  );
}
