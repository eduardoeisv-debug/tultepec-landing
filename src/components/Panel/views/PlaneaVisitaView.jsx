import { CalendarDays } from "lucide-react";
import FiestasStrip from "../../VisitInfo/FiestasStrip.jsx";
import ComoLlegarBlock from "../../VisitInfo/ComoLlegarBlock.jsx";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";
import "../../VisitInfo/VisitInfo.css";

// "Visítanos > Planea tu visita": lo que hoy es la sección completa
// "Planea tu visita" de VisitInfo.jsx (calendario + mapa juntos, como
// ya se ven ahí). "Eventos > Calendario por mes" y "Visítanos > Cómo
// llegar" son atajos a cada bloque por separado; aquí se quedan los
// dos juntos, tal como estaban.
export default function PlaneaVisitaView() {
  const { t } = useLanguage();
  return (
    <div className="panel-view panel-view--anidada">
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

      <div className="visit-info__block">
        <ComoLlegarBlock />
      </div>
    </div>
  );
}
