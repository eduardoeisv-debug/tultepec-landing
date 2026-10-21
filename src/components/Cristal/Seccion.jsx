import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { pedirVolverASecciones } from "../../hooks/useVolverASecciones.js";
import CierreComun from "./CierreComun.jsx";
import "./Seccion.css";

// Clic normal (botón izquierdo, sin tecla modificadora): navega por
// JS para poder dejar pedida la vuelta a la cuadrícula ANTES de que
// cambie el hash (ver useVolverASecciones.js). Con Ctrl/Cmd/Shift/clic
// central (abrir en pestaña nueva, etc.) se deja pasar el <a href>
// normal -- interceptar esos también rompería ese atajo de siempre.
function esClicSimple(e) {
  return e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
}

// Enlace de regreso de arriba: "← <Grupo>" dentro de una subsección
// (vuelve al resumen del grupo, href normal, sin JS -- igual que
// siempre) o "← Secciones" en cualquier otro caso (resumen de grupo o
// sección sin hijos), que vuelve a Inicio Y deja pedido el resaltado
// de este mismo ícono en la cuadrícula (ver InicioCristal.jsx).
function VolverLink({ href, label, seccionId }) {
  const handleClick = (e) => {
    if (seccionId === undefined || !esClicSimple(e)) return;
    e.preventDefault();
    pedirVolverASecciones(seccionId);
    window.location.hash = "#/";
  };
  return (
    <a className="cristal-sec__volver" href={href} onClick={handleClick}>
      <ChevronLeft size={16} strokeWidth={2.4} aria-hidden="true" />
      {label}
    </a>
  );
}

// Botón de abajo: siempre vuelve a Inicio directo (no al resumen del
// grupo, aunque se esté en una subsección) -- un atajo aparte del
// enlace de arriba, pensado para quien ya leyó todo el contenido y
// solo quiere volver a elegir otra cosa.
function VolverBoton({ seccionId }) {
  const { t } = useLanguage();
  const handleClick = (e) => {
    if (!esClicSimple(e)) return;
    e.preventDefault();
    pedirVolverASecciones(seccionId);
    window.location.hash = "#/";
  };
  return (
    <a className="cristal-sec__volver-boton" href="#/" onClick={handleClick}>
      {t("cristal.volver.boton")}
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
// grupo en sí, o sección sin hijos) -- de eso depende el texto/destino
// del enlace de arriba, ver VolverLink. `seccionId` es siempre el id
// de la sección de NIVEL SUPERIOR actual (item.id en CristalShell.jsx,
// incluso dentro de una subsección), para que tanto ese enlace (cuando
// no hay eyebrowHref) como el botón de abajo (siempre) sepan qué ícono
// de la cuadrícula resaltar al volver.
export default function Seccion({ eyebrow, eyebrowHref, seccionId, titulo, Vista, titleRef, onOpenPrivacy }) {
  const { t } = useLanguage();
  return (
    <div className="cristal-sec">
      {eyebrowHref ? (
        <VolverLink href={eyebrowHref} label={eyebrow} />
      ) : (
        <VolverLink href="#/" label={t("cristal.volver.secciones")} seccionId={seccionId} />
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

      <VolverBoton seccionId={seccionId} />

      <CierreComun ctaClassName="cristal-sec__cta" reducido />
    </div>
  );
}
