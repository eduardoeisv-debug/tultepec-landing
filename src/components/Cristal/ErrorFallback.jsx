import { RefreshCw } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./ErrorFallback.css";

// Lo que se ve dentro de ErrorBoundary.jsx cuando una vista no carga.
export default function ErrorFallback() {
  const { t } = useLanguage();
  return (
    <div className="cristal-error">
      <h2 className="cristal-error__titulo">{t("cristal.error.titulo")}</h2>
      <p className="cristal-error__texto">{t("cristal.error.texto")}</p>
      <button type="button" className="cristal-error__boton" onClick={() => window.location.reload()}>
        <RefreshCw size={16} strokeWidth={2} aria-hidden="true" />
        {t("cristal.error.recargar")}
      </button>
    </div>
  );
}
