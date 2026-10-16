import ToritoPirotecnico from "../../Juegos/ToritoPirotecnico.jsx";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";

// El componente del juego, tal cual (no se toca ToritoPirotecnico.jsx:
// "Reutiliza los componentes de los juegos tal cual"). Como ese
// componente ya trae su propio <h2> ("Ayuda al torito"), el <h1> de
// esta vista queda oculto visualmente -- existe solo para el título del
// documento y el foco al navegar aquí, sin repetir el título en
// pantalla.
export default function ToritoView({ titleRef }) {
  const { t } = useLanguage();
  return (
    <div className="panel-view panel-view--juego">
      <h1 className="panel-view__titulo-oculto" tabIndex={-1} ref={titleRef}>
        {t("menu.opcion.torito")}
      </h1>
      <ToritoPirotecnico />
    </div>
  );
}
