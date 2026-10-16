import SopaDeLetras from "../../Juegos/SopaDeLetras.jsx";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";

export default function SopaView({ titleRef }) {
  const { t } = useLanguage();
  return (
    <div className="panel-view panel-view--juego">
      <h1 className="panel-view__titulo-oculto" tabIndex={-1} ref={titleRef}>
        {t("menu.opcion.sopa")}
      </h1>
      <SopaDeLetras />
    </div>
  );
}
