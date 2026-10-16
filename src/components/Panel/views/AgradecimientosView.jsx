import AgradecimientoEspecial from "../../shared/AgradecimientoEspecial.jsx";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";

// Lo que hoy aparece en el pie de página: el agradecimiento especial
// (AgradecimientoEspecial.jsx, compartido con Footer.jsx) más el
// aviso de proyecto independiente -- mismo texto que footer.disclaimer,
// ninguna palabra cambiada. Sin título propio -- Seccion.jsx (Cristal)
// ya pone el único h2 visible de la vista.
export default function AgradecimientosView() {
  const { t } = useLanguage();
  return (
    <div className="panel-view__texto-wrap">
      <AgradecimientoEspecial className="panel-view__texto" />
      <p className="panel-view__texto panel-view__texto--disclaimer">{t("footer.disclaimer")}</p>
    </div>
  );
}
