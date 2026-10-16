import { Construction } from "lucide-react";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";

// Mismo contenido que antes mostraba MuseosModal.jsx (el aviso de "en
// construcción"), reubicado aquí sin la ventana modal alrededor -- los
// textos (museosModal.*) no cambiaron.
export default function MuseosView({ titleRef }) {
  const { t } = useLanguage();
  return (
    <div className="panel-view">
      <span className="eyebrow eyebrow--light">{t("museosModal.eyebrow")}</span>
      <h1 className="panel-view__titulo" tabIndex={-1} ref={titleRef}>
        {t("museosModal.title")}
      </h1>
      <div className="panel-soon">
        <span className="panel-soon__icono" aria-hidden="true">
          <Construction size={34} strokeWidth={1.6} />
        </span>
        <p className="panel-soon__texto">{t("museosModal.enConstruccion")}</p>
        <p className="panel-soon__sub">{t("museosModal.enConstruccionSub")}</p>
      </div>
    </div>
  );
}
