import FiestasStrip from "./FiestasStrip.jsx";
import ComoLlegarBlock from "./ComoLlegarBlock.jsx";
import "./VisitInfo.css";

// Única sección de información de visita de la landing: calendario por
// mes (FiestasStrip, datos en src/data/fiestas.js) + mapa, transporte y
// consejos (ComoLlegarBlock). Es el destino de la tarjeta "Cómo llegar"
// del hero.
export default function VisitInfo() {
  return (
    <section className="visit-info" id="visita">
      <div className="container visit-info__inner">
        <div className="section-head section-head--center">
          <span className="eyebrow eyebrow--light">Cómo llegar</span>
          <h2>¿Cuándo vienes y cómo llegas?</h2>
        </div>

        <div className="visit-info__block">
          <h3>¿En qué mes hay fiesta?</h3>
          <FiestasStrip />
        </div>

        <div className="visit-info__block">
          <ComoLlegarBlock />
        </div>
      </div>
    </section>
  );
}
