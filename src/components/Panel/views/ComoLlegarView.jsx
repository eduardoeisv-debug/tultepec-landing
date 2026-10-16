import ComoLlegarBlock from "../../VisitInfo/ComoLlegarBlock.jsx";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";
import "../../VisitInfo/VisitInfo.css";

// El mapa que antes vivía dentro de "Planea tu visita" (VisitInfo.jsx)
// -- ComoLlegarBlock.jsx no se tocó, solo se reubicó.
export default function ComoLlegarView({ titleRef }) {
  const { t } = useLanguage();
  return (
    <div className="panel-view">
      <span className="eyebrow eyebrow--light">{t("visitInfo.eyebrow")}</span>
      <h1 className="panel-view__titulo" tabIndex={-1} ref={titleRef}>
        {t("menu.opcion.comoLlegar")}
      </h1>
      <div className="visit-info__block">
        <ComoLlegarBlock />
      </div>
    </div>
  );
}
