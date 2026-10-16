import { useLanguage } from "../../../i18n/LanguageContext.jsx";
import "./AcercaDeView.css";

// Para qué se hizo la página y en qué versión va. El párrafo de
// "proyecto independiente" reutiliza footer.disclaimer tal cual (ya
// aprobado en el pie de página) en vez de duplicar el mismo texto con
// otra redacción. Sin título propio -- Seccion.jsx (Cristal) ya pone
// el único h2 visible de la vista.
export default function AcercaDeView() {
  const { t } = useLanguage();
  return (
    <div className="panel-view__texto-wrap">
      <span className="acerca-de__version">{t("acercaDe.version")}</span>
      <p className="panel-view__texto acerca-de__parrafo">{t("acercaDe.proposito")}</p>
      <p className="panel-view__texto acerca-de__parrafo">{t("acercaDe.alcance")}</p>
      <p className="panel-view__texto acerca-de__parrafo">{t("footer.disclaimer")}</p>
    </div>
  );
}
