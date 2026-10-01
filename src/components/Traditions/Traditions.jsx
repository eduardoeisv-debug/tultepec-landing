import { timeline } from "../../data/content.js";
import TimelineItem from "../shared/TimelineItem.jsx";
import PapelPicadoDivider from "../shared/PapelPicadoDivider.jsx";
import useReveal from "../../hooks/useReveal.js";
import useParallax from "../../hooks/useParallax.js";
import "./Traditions.css";

export default function Traditions() {
  const headRef = useReveal();
  const lineRef = useParallax(30);

  return (
    <section className="traditions" id="tradiciones">
      <PapelPicadoDivider />
      <div className="container">
        <div className="section-head section-head--center reveal" ref={headRef}>
          <span className="eyebrow">Momentos y tradiciones</span>
          <h2>La línea de tiempo del oficio</h2>
          <p>
            De la mezcla artesanal de pólvora a los castillos que hoy conocen en el mundo entero:
            así se fue tejiendo la historia de Tultepec.
          </p>
        </div>

        <div className="traditions__timeline">
          <span className="traditions__line" ref={lineRef} aria-hidden="true" />
          {timeline.map((item, i) => (
            <TimelineItem
              key={item.title}
              year={item.year}
              title={item.title}
              text={item.text}
              align={i % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
