import AgradecimientoEspecial from "../../shared/AgradecimientoEspecial.jsx";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";

// Lo que hoy aparece en el pie de página como agradecimiento especial
// (AgradecimientoEspecial.jsx, compartido con Footer.jsx) -- mismo
// texto, ninguna palabra cambiada.
export default function AgradecimientosView({ titleRef }) {
  const { t } = useLanguage();
  return (
    <div className="panel-view">
      <span className="eyebrow eyebrow--light">{t("agradecimientos.eyebrow")}</span>
      <h1 className="panel-view__titulo" tabIndex={-1} ref={titleRef}>
        {t("agradecimientos.title")}
      </h1>
      <AgradecimientoEspecial className="panel-view__texto" />
    </div>
  );
}
