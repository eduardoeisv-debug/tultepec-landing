import Hero from "../../Hero/Hero.jsx";
import Bienvenida from "../../Bienvenida/Bienvenida.jsx";

// Vista por defecto del panel: el hero (etiqueta, título, subtítulo,
// video de bienvenida) más la carta "Una carta para ti" debajo, tal
// como pide el prompt -- ambos componentes se reutilizan completos,
// solo se quitaron de ser secciones de ancho completo propias para
// vivir aquí. El <h1> real está dentro de Hero.jsx
// (hero__title) -- Inicio es la única vista donde el título visible de
// la página coincide con el de Hero, así que ContentPanel.jsx apunta
// el foco ahí directo en vez de necesitar un <h1> propio.
export default function InicioView({ titleRef }) {
  return (
    <div className="panel-view panel-view--inicio">
      <Hero titleRef={titleRef} />
      <Bienvenida />
    </div>
  );
}
