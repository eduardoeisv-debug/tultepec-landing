import { lazy, Suspense, useCallback, useEffect, useRef } from "react";
import MENU from "../../data/menu.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import SoonView from "./views/SoonView.jsx";
import "./ContentPanel.css";

// Cada vista se carga de forma diferida -- nadie descarga el código del
// laberinto del torito solo por visitar Inicio. El registro mapea
// "item/hijo" (o solo "item" para las opciones directas) al componente
// que la muestra; lo que no está aquí cae en SoonView.jsx (import
// normal, no diferido: es chiquito y lo necesita cualquier ruta sin
// vista propia, así que no vale la pena partirlo en su propio chunk).
const InicioView = lazy(() => import("./views/InicioView.jsx"));
const HistoriaView = lazy(() => import("./views/HistoriaView.jsx"));
const GaleriaView = lazy(() => import("./views/GaleriaView.jsx"));
const MemoriasPuebloView = lazy(() => import("./views/MemoriasPuebloView.jsx"));
const RelatosView = lazy(() => import("./views/RelatosView.jsx"));
const ComparteView = lazy(() => import("./views/ComparteView.jsx"));
const MuseosView = lazy(() => import("./views/MuseosView.jsx"));
const CalendarioView = lazy(() => import("./views/CalendarioView.jsx"));
const ComoLlegarView = lazy(() => import("./views/ComoLlegarView.jsx"));
const PlaneaVisitaView = lazy(() => import("./views/PlaneaVisitaView.jsx"));
const ToritoView = lazy(() => import("./views/ToritoView.jsx"));
const MemoramaView = lazy(() => import("./views/MemoramaView.jsx"));
const SopaView = lazy(() => import("./views/SopaView.jsx"));
const AgradecimientosView = lazy(() => import("./views/AgradecimientosView.jsx"));
const AcercaDeView = lazy(() => import("./views/AcercaDeView.jsx"));

// Claves "item/hijo" o "item" (opciones directas, sin hijos). Lo que no
// aparece aquí (Gastronomía, Música, "Videos por tipo", "Fiestas del
// año"...) no tiene vista propia todavía -- cae en SoonView.jsx. Museos
// SÍ tiene registro propio aunque `soon: true` en menu.js: ese flag es
// solo para que la fila del menú se vea atenuada con su insignia, no
// decide qué se renderiza (ver resolverRuta más abajo).
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
  "juegos/torito": ToritoView,
  "juegos/memorama": MemoramaView,
  "juegos/sopa": SopaView,
  agradecimientos: AgradecimientosView,
  "acerca-de": AcercaDeView,
};

// A partir de la ruta ({itemId, hijoId}) saca la clave de REGISTRO, las
// etiquetas para las migas de pan y el título del documento. Devuelve
// todo null si la ruta no coincide con nada de MENU (no debería pasar:
// useHashRoute.js ya manda esos casos a Inicio antes de llegar aquí).
function resolverRuta(ruta, t) {
  if (!ruta.itemId) return { clave: null, etiquetaGrupo: null, etiquetaOpcion: null };

  const item = MENU.find((i) => i.id === ruta.itemId);
  if (!item) return { clave: null, etiquetaGrupo: null, etiquetaOpcion: null };

  if (item.hijos) {
    const hijo = item.hijos.find((h) => h.id === ruta.hijoId);
    if (!hijo) return { clave: null, etiquetaGrupo: null, etiquetaOpcion: null };
    return { clave: `${item.id}/${hijo.id}`, etiquetaGrupo: t(item.label), etiquetaOpcion: t(hijo.label) };
  }
  return { clave: item.id, etiquetaGrupo: null, etiquetaOpcion: t(item.label) };
}

export default function ContentPanel({ ruta, onOpenPrivacy }) {
  const { t } = useLanguage();
  const panelRef = useRef(null);
  // Las vistas se cargan en diferido (React.lazy): cuando cambia la
  // ruta, el <h1> real todavía no existe (falta que el chunk llegue),
  // así que esperar "un frame" (requestAnimationFrame) no alcanza --
  // llegaba antes de que la vista nueva montara, y el foco se quedaba
  // en el enlace del menú que se acababa de clicar. Una ref de función
  // sí dispara exactamente cuando React monta el <h1> de verdad, sea
  // cual sea la vista y tarde lo que tarde en llegar. Se salta la
  // primera vez (carga inicial de la página) -- forzar el foco a algo
  // que nadie navegó activamente no es lo esperado ahí.
  const esPrimeraVezRef = useRef(true);
  // useCallback con [] para que sea la MISMA función en cada
  // renderizado: una ref de función nueva en cada render (p.ej. al
  // cambiar de idioma, que vuelve a renderizar ContentPanel) hace que
  // React la vuelva a invocar aunque el nodo del DOM no haya cambiado
  // -- eso robaría el foco en cada cambio de idioma, no solo al
  // navegar de verdad.
  const titleRef = useCallback((nodo) => {
    if (!nodo) return;
    if (esPrimeraVezRef.current) {
      esPrimeraVezRef.current = false;
      return;
    }
    nodo.focus();
  }, []);

  const { clave, etiquetaGrupo, etiquetaOpcion } = resolverRuta(ruta, t);
  const Vista = clave ? REGISTRO[clave] : InicioView;

  // Al cambiar de ruta: sube el panel al inicio (en celular esto es lo
  // que de verdad hace que "la página baje al panel de contenido" --
  // scrollIntoView corrige el scroll para cualquier lado que haga
  // falta, subir o bajar) y actualiza el título del documento. El foco
  // lo maneja titleRef (arriba), no este efecto.
  useEffect(() => {
    panelRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
    const base = "Tultepec · Estado de México";
    document.title = etiquetaOpcion ? `${etiquetaOpcion} · ${base}` : base;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruta.itemId, ruta.hijoId]);

  return (
    <div className="panel" ref={panelRef}>
      {ruta.itemId && (
        <p className="panel__breadcrumbs">{etiquetaGrupo ? `${etiquetaGrupo} · ${etiquetaOpcion}` : etiquetaOpcion}</p>
      )}

      <Suspense fallback={<div className="panel__cargando" aria-hidden="true" />}>
        {Vista ? (
          <Vista titleRef={titleRef} onOpenPrivacy={onOpenPrivacy} />
        ) : (
          <SoonView etiqueta={etiquetaOpcion} titleRef={titleRef} />
        )}
      </Suspense>
    </div>
  );
}
