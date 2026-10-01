import SparkField from "../shared/SparkField.jsx";
import ShareButtons from "../shared/ShareButtons.jsx";
import LikeButton from "../shared/LikeButton.jsx";
import useReveal from "../../hooks/useReveal.js";
import "./FinalCTA.css";

export default function FinalCTA() {
  const ref = useReveal();

  return (
    <section className="final-cta" ref={ref}>
      <SparkField count={14} />
      <div className="container final-cta__content reveal">
        <h2>La memoria del pueblo sigue encendida</h2>
        <p>
          Cada visita a este archivo es una forma de mantener viva la historia de Tultepec.
          Vuelve cuando quieras seguir el hilo de la tradición.
        </p>
        <div className="final-cta__actions">
          <a className="btn btn--primary" href="#tradiciones">
            Sigue explorando el archivo
          </a>
        </div>

        <LikeButton />

        <div className="final-cta__share">
          <ShareButtons />
        </div>
      </div>
    </section>
  );
}
