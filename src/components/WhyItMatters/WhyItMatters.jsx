import { tensionPoints } from "../../data/content.js";
import useReveal from "../../hooks/useReveal.js";
import "./WhyItMatters.css";

export default function WhyItMatters() {
  const ref = useReveal();

  return (
    <section className="why" ref={ref}>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Por qué esta historia importa</span>
          <h2>Entre el orgullo y el riesgo de olvidar</h2>
          <p>
            La tradición pirotécnica de Tultepec no vive solo en las ferias: vive en la tensión
            entre lo que se celebra y lo que se ha perdido en el camino.
          </p>
        </div>

        <div className="why__grid">
          {tensionPoints.map((point, i) => (
            <article className="why-card reveal" style={{ transitionDelay: `${i * 100}ms` }} key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
