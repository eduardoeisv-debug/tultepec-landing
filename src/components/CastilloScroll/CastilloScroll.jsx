import useScrollSpy from "../../hooks/useScrollSpy.js";
import CastilloSVG from "./CastilloSVG.jsx";
import MobileProgressBar from "./MobileProgressBar.jsx";
import FiestasStrip from "./FiestasStrip.jsx";
import ComoLlegarBlock from "./ComoLlegarBlock.jsx";
import "./CastilloScroll.css";

const FLOOR_LABELS = ["Qué es Tultepec", "Castillos y toritos", "Las fiestas del año", "Cómo llegar"];

// Recorrido vertical entre el hero y "La memoria del pueblo sigue
// encendida": un castillo pirotécnico (SVG) que se va iluminando piso por
// piso a medida que se hace scroll por 4 bloques de contenido. En
// computadora el castillo queda pegado (sticky) a la izquierda; en
// tableta/celular se convierte en una barra de progreso horizontal fija
// arriba (ver MobileProgressBar).
export default function CastilloScroll() {
  const { activeIndex, setRef, scrollToIndex } = useScrollSpy(4);

  return (
    <section className="castillo-scroll" id="recorrido" aria-label="Recorrido: el castillo pirotécnico de Tultepec">
      <MobileProgressBar activeIndex={activeIndex} onJump={scrollToIndex} />

      <div className="container castillo-scroll__grid">
        <div className="castillo-scroll__rail">
          <div className="castillo-scroll__sticky">
            <CastilloSVG activeIndex={activeIndex} />
            <div className="castillo-scroll__dots" role="tablist" aria-label="Ir a un bloque del recorrido">
              {FLOOR_LABELS.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-selected={index === activeIndex}
                  aria-label={label}
                  className={`castillo-scroll__dot${index === activeIndex ? " is-active" : ""}`}
                  onClick={() => scrollToIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="castillo-scroll__content">
          <article
            ref={setRef(0)}
            className={`castillo-block${activeIndex === 0 ? " is-active" : ""}`}
          >
            <span className="eyebrow eyebrow--light">Qué es Tultepec</span>
            <h3>Un pueblo que convierte el fuego en arte</h3>
            <p>
              Tultepec convierte el fuego en arte: castillos y toritos que sus familias han
              heredado por generaciones.
            </p>
          </article>

          <article
            ref={setRef(1)}
            className={`castillo-block${activeIndex === 1 ? " is-active" : ""}`}
          >
            <span className="eyebrow eyebrow--light">Castillos y toritos</span>
            <h3>Dos símbolos, un mismo oficio</h3>
            <p>
              El castillo es la torre de varas que se enciende de a pisos, cada uno con sus
              propias ruedas y figuras. El torito es la pieza que un artesano carga sobre los
              hombros y corre entre el público, lanzando chispas a su paso.
            </p>
            <div className="castillo-block__image">
              <img
                src="/images/castillos-monumentales/04.jfif"
                alt="Castillo pirotécnico encendido durante una fiesta en Tultepec"
                loading="lazy"
              />
            </div>
          </article>

          <article
            ref={setRef(2)}
            className={`castillo-block${activeIndex === 2 ? " is-active" : ""}`}
          >
            <span className="eyebrow eyebrow--light">Las fiestas del año</span>
            <h3>¿En qué mes hay fiesta?</h3>
            <FiestasStrip />
          </article>

          <article
            ref={setRef(3)}
            className={`castillo-block${activeIndex === 3 ? " is-active" : ""}`}
          >
            <span className="eyebrow eyebrow--light">Cómo llegar</span>
            <h3>¿Cuándo vienes y cómo llegas?</h3>
            <ComoLlegarBlock />
          </article>
        </div>
      </div>
    </section>
  );
}
