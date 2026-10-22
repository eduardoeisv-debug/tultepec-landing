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
// reabre el menú ENCIMA de la sección donde se está AHORA (no navega
// a ningún lado); cualquier otro caso ("icons", o sin origen --
// enlace directo, recarga) es el comportamiento de siempre: la
// cuadrícula de Inicio.
//
// `onVolverAlMenu` (prop que llega desde CristalShell.jsx, ver más
// abajo) abre el menú directamente -- antes se navegaba a
// `origen.ruta` (la ruta que estaba activa cuando se entró a esta
// sección DESDE EL MENÚ por primera vez) para que CristalShell.jsx
// notara el cambio de ruta y reabriera el panel ahí; el problema es
// que `origen.ruta` queda vieja en cuanto se navega DENTRO del mismo
// grupo por otro camino que no sea el menú (p.ej. el enlace "‹
// Grupo" hacia el resumen, ver eyebrowHref abajo) -- ese otro
// movimiento no pasa por ColumnaCristal.jsx, así que origen.ruta
// nunca se refresca, y "Volver" terminaba rebobinando la página
// entera hasta la sección original, aunque hacía rato que ya no se
// estaba ahí (confirmado con Playwright, ver el historial). Abrir el
// menú en vez de navegar deja la vista/URL actuales intactas sin
// importar qué tan vieja esté esa ruta guardada -- ya no hace falta
// que esté al día para nada.
function volver(origen, seccionId, onVolverAlMenu) {
  if (origen?.tipo === "menu") {
    marcarVueltaAlMenu({ scrollMenu: origen.scrollMenu, seccionId });
    onVolverAlMenu();
  } else {
    pedirVolverASecciones(seccionId);
    window.location.hash = "#/";
  }
}

// Enlace de regreso de arriba: "← <Grupo>" dentro de una subsección
// (vuelve al resumen del grupo, href normal, sin JS -- igual que
// siempre, sin importar el origen) o el de nivel superior (ver
// `volver`) en cualquier otro caso.
function VolverLink({ href, label, origen, seccionId, onVolverAlMenu }) {
  const handleClick = (e) => {
    if (seccionId === undefined || !esClicSimple(e)) return;
    e.preventDefault();
    volver(origen, seccionId, onVolverAlMenu);
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
// a Inicio: si la sección se abrió desde el menú, reabre el panel ahí
// mismo aunque se esté dentro de una subsección, en vez de pasar
// primero por el resumen del grupo.
function VolverBoton({ origen, seccionId, onVolverAlMenu }) {
  const { t } = useLanguage();
  const esDesdeMenu = origen?.tipo === "menu";
  const handleClick = (e) => {
    if (!esClicSimple(e)) return;
    e.preventDefault();
    volver(origen, seccionId, onVolverAlMenu);
  };
  // href de respaldo (clic modificado / sin JS): ya no apunta a
  // origen.ruta (la misma ruta vieja que `volver` dejó de usar, ver
  // arriba) -- el resumen de ESTA sección es el destino razonable que
  // sí sigue siendo válido sin importar cuánto haya pasado.
  const href = esDesdeMenu ? rutaHash(seccionId) : "#/";
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
export default function Seccion({ eyebrow, eyebrowHref, seccionId, origen, titulo, Vista, titleRef, onOpenPrivacy, onVolverAlMenu }) {
  const { t } = useLanguage();
  const esDesdeMenu = !eyebrowHref && origen?.tipo === "menu";
  return (
    <div className="cristal-sec">
      {eyebrowHref ? (
        <VolverLink href={eyebrowHref} label={eyebrow} />
      ) : (
        <VolverLink
          href={esDesdeMenu ? rutaHash(seccionId) : "#/"}
          label={t(esDesdeMenu ? "cristal.volver.menu" : "cristal.volver.secciones")}
          origen={origen}
          seccionId={seccionId}
          onVolverAlMenu={onVolverAlMenu}
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

      <VolverBoton origen={origen} seccionId={seccionId} onVolverAlMenu={onVolverAlMenu} />

      <CierreComun ctaClassName="cristal-sec__cta" reducido />
    </div>
  );
}
