import { Suspense } from "react";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import CierreComun from "./CierreComun.jsx";
import "./Seccion.css";

// Envoltura genérica de cualquier vista que no sea Inicio ni el aviso
// de privacidad: miga de pan (nombre del grupo en dorado), h2 (nombre
// de la subopción, o del grupo si no tiene) y el contenido real
// debajo -- `Vista` es el componente ya existente del sitio (sin su
// propio título, ver HistoriaView.jsx y compañía), o null si la
// opción todavía no existe (aviso "Próximamente"). El cierre (me
// gusta/comentar/compartir + pie de página) va SIEMPRE al final de
// estas vistas internas, igual que en Inicio ahora (ver
// InicioCristal.jsx y CierreComun.jsx). Ya no trae su propio botón
// "Menú" -- TopBarCristal.jsx (hamburguesa) ya está siempre visible
// arriba de todo, en cualquier vista.
//
// Dentro de una subopción, `eyebrowHref` (ver CristalShell.jsx) hace
// de la miga de pan un enlace de regreso al resumen de su grupo
// (GrupoResumen.jsx) -- antes la única salida era la casita de
// TopBarCristal.jsx, que manda siempre hasta Inicio, así que ver otra
// subopción del mismo grupo obligaba a salir del todo y volver a
// entrar por su tarjeta del Bento. Sin eyebrowHref (Inicio, grupos sin
// hijos, o el resumen del grupo en sí) se queda como texto plano,
// igual que antes.
export default function Seccion({ eyebrow, eyebrowHref, titulo, Vista, titleRef, onOpenPrivacy }) {
  const { t } = useLanguage();
  return (
    <div className="cristal-sec">
      {eyebrowHref ? (
        <a className="cristal-sec__pill cristal-sec__pill--link" href={eyebrowHref}>
          <ChevronLeft size={14} strokeWidth={2.4} aria-hidden="true" />
          {eyebrow}
        </a>
      ) : (
        <span className="cristal-sec__pill">{eyebrow}</span>
      )}
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

      <CierreComun ctaClassName="cristal-sec__cta" onOpenPrivacy={onOpenPrivacy} />
    </div>
  );
}
