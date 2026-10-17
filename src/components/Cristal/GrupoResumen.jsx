import { ChevronRight } from "lucide-react";
import { rutaHash } from "../../hooks/useHashRoute.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./GrupoResumen.css";

// Vista "resumen" de un grupo del menú (Pirotecnia, Memorias, Eventos,
// Visítanos): lo que se muestra al entrar al grupo sin elegir todavía
// una subopción -- antes el router caía directo en la primera
// subopción (ver useHashRoute.js), lo que escondía el resto del
// abanico cuando se llegaba desde una tarjeta del Bento de Inicio en
// vez de abrir el flyout del menú, donde sí se ven todas. Vía Seccion
// (que ya pone el eyebrow/título del grupo encima), solo el abanico
// de subopciones como tarjetas de cristal, mismo lenguaje visual que
// el resto de Menú Cristal.
export default function GrupoResumen({ item }) {
  const { t } = useLanguage();
  return (
    <div className="cristal-grupo-resumen">
      {item.hijos.map((hijo) => (
        <a
          key={hijo.id}
          className={`cristal-grupo-resumen__tile${hijo.soon ? " is-proximamente" : ""}`}
          href={rutaHash(item.id, hijo.id)}
        >
          <span>
            {t(hijo.label)}
            {hijo.soon && <span className="cristal-grupo-resumen__badge">{t("menu.proximamente.badge")}</span>}
          </span>
          <ChevronRight className="cristal-grupo-resumen__flecha" size={16} strokeWidth={2} aria-hidden="true" />
        </a>
      ))}
    </div>
  );
}
