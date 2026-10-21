import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { rutaHash } from "../../hooks/useHashRoute.js";
import { pedirVolverASecciones, marcarVueltaAlMenu } from "../../hooks/useVolverASecciones.js";
import CierreComun from "./CierreComun.jsx";
import "./Seccion.css";

// Clic normal (botón izquierdo, sin tecla modificadora): navega por
// JS para poder dejar pedida la vuelta ANTES de que cambie el hash
// (ver useVolverASecciones.js). Con Ctrl/Cmd/Shift/clic central (abrir
// en pestaña nueva, etc.) se deja pasar el <a href> normal --
// interceptar esos también rompería ese atajo de siempre.
function esClicSimple(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

// A dónde manda el botón/enlace de regreso de nivel superior (sin
// eyebrowHref, ver más abajo): depende de cómo se entró a ESTA
// sección (origen, prop que viene de CristalShell.jsx) -- "menu"
// vuelve a la vista desde la que se abrió el menú y lo reabre ahí
// (ColumnaCristal.jsx hace su propio scroll/resaltado al montar);
// cualquier otro caso ("icons", o sin origen -- enlace directo,
// recarga) es el comportamiento de siempre: la cuadrícula de Inicio.
function volver(origen, seccionId) {
  if (origen?.tipo === "menu") {
    marcarVueltaAlMenu({ scrollMenu: origen.scrollMenu, seccionId });
    window.location.hash = rutaHash(origen.ruta.itemId, origen.ruta.hijoId);
  } else {
    pedirVolverASecciones(seccionId);
    window.location.hash = "#/";
  }
}

// Enlace de regreso de arriba: "← <Grupo>" dentro de una subsección
// (vuelve al resumen del grupo, href normal, sin JS -- igual que
// siempre, sin importar el origen) o el de nivel superior (ver
// `volver`) en cualquier otro caso.
function VolverLink({ href, label, origen, seccionId }) {
  const handleClick = (e) => {
    if (seccionId === undefined || !esClicSimple(e)) return;
    e.preventDefault();
    volver(origen, seccionId);
  };
  return (
    <a className="cristal-sec__volver" href={href} onClick={handleClick}>
      <ChevronLeft size={16} strokeWidth={2.4} aria-hidden="true" />
      {label}
    </a>
  );
}

// Botón de abajo: mismo destino que el enlace de arriba cuando NO hay
// subsección (ver `volver`) -- a diferencia de antes, ya NO siempre va
// a Inicio: si la sección se abrió desde el menú, vuelve ahí (con el
// panel reabierto) aunque se esté dentro de una subsección, en vez de
// pasar primero por el resumen del grupo.
function VolverBoton({ origen, seccionId }) {
  const { t } = useLanguage();
  const esDesdeMenu = origen?.tipo === "menu";
  const handleClick = (e) => {
    if (!esClicSimple(e)) return;
    e.preventDefault();
    volver(origen, seccionId);
  };
  const href = esDesdeMenu ? rutaHash(origen.ruta.itemId, origen.ruta.hijoId) : "#/";
  return (
    <a className="cristal-sec__volver-boton" href={href} onClick={handleClick}>
      {t(esDesdeMenu ? "cristal.volver.menu" : "cristal.volver.boton")}
    </a>
  );
}

// Envoltura genérica de cualquier vista que no sea Inicio: enlace de
// regreso + miga de pan (nombre del grupo en dorado), h2 (nombre de la
// subopción, o del grupo si no tiene) y el contenido real debajo --
// `Vista` es el componente ya existente del sitio (sin su propio
// título, ver HistoriaView.jsx y compañía), o null si la opción
// todavía no existe (aviso "Próximamente"). El cierre va al final de
// estas vistas internas igual que en Inicio, pero reducido (reducido
// en CierreComun/FinalCTA): solo la franja de compartir, sin título,
// párrafo ni me gusta/comentar -- eso es específico de la portada. Ya
// no trae su propio botón "Menú" -- TopBarCristal.jsx (hamburguesa) ya
// está siempre visible arriba de todo, en cualquier vista.
//
// `eyebrowHref` (ver CristalShell.jsx) distingue si estamos dentro de
// una subsección (apunta al resumen de su grupo) o no (resumen de
// grupo en sí, o sección sin hijos). `seccionId` es siempre el id de
// la sección de NIVEL SUPERIOR actual (item.id en CristalShell.jsx,
// incluso dentro de una subsección), y `origen` de dónde vino esa
// navegación ("menu" | "icons" | null) -- juntos deciden texto y
// destino del botón/enlace de regreso de nivel superior, ver `volver`.
export default function Seccion({ eyebrow, eyebrowHref, seccionId, origen, titulo, Vista, titleRef, onOpenPrivacy }) {
  const { t } = useLanguage();
  const esDesdeMenu = !eyebrowHref && origen?.tipo === "menu";
  return (
    <div className="cristal-sec">
      {eyebrowHref ? (
        <VolverLink href={eyebrowHref} label={eyebrow} />
      ) : (
        <VolverLink
          href={esDesdeMenu ? rutaHash(origen.ruta.itemId, origen.ruta.hijoId) : "#/"}
          label={t(esDesdeMenu ? "cristal.volver.menu" : "cristal.volver.secciones")}
          origen={origen}
          seccionId={seccionId}
        />
      )}
      <span className="cristal-sec__pill">{eyebrow}</span>
      <h2 className="cristal-sec__titulo" tabIndex={-1} ref={titleRef}>
        {titulo}
      </h2>

      <Suspense fallback={<div className="cristal-sec__cargando" aria-hidden="true" />}>
        {Vista ? (
          <Vista onOpenPrivacy={onOpenPrivacy} />
        ) : (
          <p className="cristal-sec__proximamente">{t("cristal.seccion.proximamente")}</p>
        )}
      </Suspense>

      <VolverBoton origen={origen} seccionId={seccionId} />

      <CierreComun ctaClassName="cristal-sec__cta" reducido />
    </div>
  );
}
