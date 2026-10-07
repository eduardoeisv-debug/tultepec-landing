import FiestasStrip from "./FiestasStrip.jsx";
import ComoLlegarBlock from "./ComoLlegarBlock.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./VisitInfo.css";

// Única sección de información de visita de la landing: calendario por
// mes (FiestasStrip, datos en src/data/fiestas.js) + mapa y transporte
// (ComoLlegarBlock). Es el destino de la tarjeta "Visítanos" del hero.
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
          <h3>{t("visitInfo.monthsSubtitle")}</h3>
          <FiestasStrip />
        </div>

        <div className="visit-info__block">
          <ComoLlegarBlock />
        </div>
      </div>
    </section>
  );
}
