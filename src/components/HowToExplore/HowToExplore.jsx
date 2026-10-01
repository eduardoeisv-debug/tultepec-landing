import { steps } from "../../data/content.js";
import useReveal from "../../hooks/useReveal.js";
import "./HowToExplore.css";

export default function HowToExplore() {
  const ref = useReveal();

  return (
    <section className="how" ref={ref}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">Cómo explorar la historia</span>
          <h2>Tres pasos para recorrer las memorias del pueblo</h2>
        </div>

        <div className="how__steps">
          {steps.map((step, i) => (
            <div className="how-step reveal" style={{ transitionDelay: `${i * 110}ms` }} key={step.number}>
              <span className="how-step__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              {i < steps.length - 1 && <span className="how-step__connector" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
