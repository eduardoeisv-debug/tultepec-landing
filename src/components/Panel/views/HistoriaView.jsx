import HistoryInfographic from "../../shared/HistoryInfographic.jsx";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";

// Lo que antes era el contenido de HistoryModal.jsx (la infografía
// completa, HistoryInfographic.jsx, sin cambios) -- se quita el modal
// (fondo oscuro, cierre con X, atrapa-foco) porque ya es una vista del
// panel, no una ventana emergente.
export default function HistoriaView({ titleRef }) {
  const { t } = useLanguage();
  return (
    <div className="panel-view">
      <span className="eyebrow eyebrow--light">{t("historyModal.eyebrow")}</span>
      <h1 className="panel-view__titulo" tabIndex={-1} ref={titleRef}>
        {t("historyModal.title")}
      </h1>
      <HistoryInfographic />
    </div>
  );
}
