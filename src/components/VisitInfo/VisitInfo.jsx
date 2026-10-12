import { CalendarDays } from "lucide-react";
import FiestasStrip from "./FiestasStrip.jsx";
import ComoLlegarBlock from "./ComoLlegarBlock.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./VisitInfo.css";

// Única sección de información de visita de la landing: calendario por
// mes (FiestasStrip, datos en src/data/fiestas.js) + mapa y transporte
// (ComoLlegarBlock). Es el destino del botón "¿Cuándo vienes?" al final
// del hero.
//
// Los dos bloques llevan el mismo tratamiento (ícono + h3) a propósito:
// antes solo el calendario tenía encabezado y el mapa arrancaba directo
// con el párrafo, así que visualmente se sentían como una sola masa de
// contenido en vez de dos bloques distintos.
export default function VisitInfo() {
  const { t } = useLanguage();

  return (
    <section className="visit-info" id="visita">
      <div className="container visit-info__inner">
        <div className="section-head">
          <span className="eyebrow eyebrow--light">{t("visitInfo.eyebrow")}</span>
          <h2>{t("visitInfo.title")}</h2>
        </div>

        <div className="visit-info__block">
          <FiestasStrip>
            <div className="visit-info__block-head">
              <span className="visit-info__block-icon" aria-hidden="true">
                <CalendarDays size={20} strokeWidth={1.8} />
              </span>
              <h3>{t("visitInfo.monthsSubtitle")}</h3>
            </div>
          </FiestasStrip>
        </div>

        <div className="visit-info__block">
          <ComoLlegarBlock />
        </div>
      </div>
    </section>
  );
}
