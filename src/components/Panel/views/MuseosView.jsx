import { Construction } from "lucide-react";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";

// Mismo contenido que antes mostraba MuseosModal.jsx (el aviso de "en
// construcción"), sin su propio título -- Seccion.jsx (Cristal) ya
// pone el único h2 visible de la vista.
export default function MuseosView() {
  const { t } = useLanguage();
  return (
    <div className="panel-soon">
      <span className="panel-soon__icono" aria-hidden="true">
        <Construction size={34} strokeWidth={1.6} />
      </span>
      <p className="panel-soon__texto">{t("museosModal.enConstruccion")}</p>
      <p className="panel-soon__sub">{t("museosModal.enConstruccionSub")}</p>
    </div>
  );
}
