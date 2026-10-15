import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Marquesina.css";

// Banda de texto que se desliza en bucle por toda la pantalla. El texto
// sale de strings.js ("marquesina.texto"), así que cambia solo con el
// selector de idioma. `velocidad` son los segundos que tarda una vuelta
// completa (menos = más rápido); `reversa` la mueve de izquierda a derecha.
export default function Marquesina({ velocidad = 30, reversa = false }) {
  const { t } = useLanguage();
  const mensaje = t("marquesina.texto");
  // El mensaje se repite para que un solo grupo ya sea más ancho que
  // cualquier pantalla y el bucle nunca muestre huecos.
  const repeticiones = Array.from({ length: 4 });

  return (
    <div className="marquesina" role="marquee" aria-label={mensaje}>
      <div
        className={`marquesina__pista${reversa ? " marquesina__pista--reversa" : ""}`}
        style={{ animationDuration: `${velocidad}s` }}
        aria-hidden="true"
      >
        {/* Dos grupos idénticos: la animación recorre uno completo (-50%) y
            reinicia sin salto visible. */}
        {[0, 1].map((grupo) => (
          <div className="marquesina__grupo" key={grupo}>
            {repeticiones.map((_, i) => (
              <span className="marquesina__texto" key={i}>
                {mensaje}
                <span className="marquesina__separador">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
