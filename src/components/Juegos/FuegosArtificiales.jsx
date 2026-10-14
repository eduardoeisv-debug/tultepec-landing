// Castillo pirotécnico para la landing de Tultepec: tocas el cielo y un
// cohete sale del castillo; al llegar a `meta` se enciende el gran final.
// Motor de canvas sin dependencias en fireworks-engine.js; los textos
// viven en src/i18n/strings.js (claves "juegos.fuegos.*").

import { useEffect, useRef, useState } from "react";
import { createFireworks } from "./fireworks-engine.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./FuegosArtificiales.css";

export default function FuegosArtificiales({ meta = 10 }) {
  const { t } = useLanguage();
  const seccionRef = useRef(null);
  const lienzoRef = useRef(null);
  const motorRef = useRef(null);
  const [progreso, setProgreso] = useState(0);
  const [final, setFinal] = useState(false);

  useEffect(() => {
    const motor = createFireworks(lienzoRef.current, {
      goal: meta,
      onProgress: setProgreso,
      onFinale: setFinal,
    });
    motorRef.current = motor;

    // Solo anima mientras la sección está en pantalla.
    const observador = new IntersectionObserver(
      ([entrada]) => (entrada.isIntersecting ? motor.start() : motor.stop()),
      { threshold: 0.2 }
    );
    observador.observe(seccionRef.current);

    return () => {
      observador.disconnect();
      motor.destroy();
      motorRef.current = null;
    };
  }, [meta]);

  return (
    <section className="fuegos" ref={seccionRef} aria-labelledby="fuegos-titulo">
      <header className="fuegos__cabecera">
        <h2 className="fuegos__titulo" id="fuegos-titulo">
          {t("juegos.fuegos.titulo")}
        </h2>
        <p className="fuegos__texto">{t("juegos.fuegos.texto")}</p>
      </header>

      <div className="fuegos__cielo">
        <canvas
          ref={lienzoRef}
          className="fuegos__lienzo"
          role="img"
          aria-label={t("juegos.fuegos.cieloAriaLabel")}
          data-no-fireworks
        />
        {final && (
          <p className="fuegos__final" role="status">
            {t("juegos.fuegos.mensajeFinal")}
          </p>
        )}
      </div>

      <div className="fuegos__barra">
        <div className="fuegos__progreso">
          <ol className="fuegos__mechas" aria-hidden="true">
            {Array.from({ length: meta }, (_, i) => (
              <li key={i} className={`fuegos__mecha${i < progreso ? " is-on" : ""}`} />
            ))}
          </ol>
          <span className="fuegos__cuenta">
            {progreso}/{meta}
          </span>
        </div>
        <button type="button" className="fuegos__boton" onClick={() => motorRef.current?.fireRandom()}>
          {t("juegos.fuegos.boton")}
        </button>
      </div>
    </section>
  );
}
