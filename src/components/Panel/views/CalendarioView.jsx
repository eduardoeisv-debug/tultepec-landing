import { CalendarDays } from "lucide-react";
import FiestasStrip from "../../VisitInfo/FiestasStrip.jsx";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";
import "../../VisitInfo/VisitInfo.css";

// El calendario mensual que antes vivía dentro de "Planea tu visita"
// (VisitInfo.jsx) -- FiestasStrip.jsx no se tocó, solo se reubicó.
export default function CalendarioView({ titleRef }) {
  const { t } = useLanguage();
  return (
    <div className="panel-view">
      <span className="eyebrow eyebrow--light">{t("visitInfo.eyebrow")}</span>
      <h1 className="panel-view__titulo" tabIndex={-1} ref={titleRef}>
        {t("menu.opcion.calendario")}
      </h1>
      <div className="visit-info__block">
        <FiestasStrip>
          <span className="visit-info__calendar-label">{t("visitInfo.calendarLabel")}</span>
          <div className="visit-info__block-head">
            <span className="visit-info__block-icon" aria-hidden="true">
              <CalendarDays size={20} strokeWidth={1.8} />
            </span>
            <h2>{t("visitInfo.monthsSubtitle")}</h2>
          </div>
        </FiestasStrip>
      </div>
    </div>
  );
}
