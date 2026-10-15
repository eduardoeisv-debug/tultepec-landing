import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./FuegoTexto.css";

// Banda entre VisitInfo y Juegos (reemplaza a la antigua Marquesina
// deslizante): el texto no se desplaza, aparece y desaparece en bucle
// con un degradado de colores de fuego (dorado -> terracota -> rojo)
// que también "titila" un poco mientras está visible, como una llama.
// Texto fijo en src/i18n/strings.js ("fuegoTexto.texto"), cambia solo
// con el selector de idioma.
export default function FuegoTexto() {
  const { t } = useLanguage();
  const mensaje = t("fuegoTexto.texto");

  return (
    <div className="fuego-texto">
      <p className="fuego-texto__linea" aria-label={mensaje}>
        <span className="fuego-texto__llama" aria-hidden="true">
          🔥
        </span>
        <span className="fuego-texto__palabras" aria-hidden="true">
          {mensaje}
        </span>
        <span className="fuego-texto__llama" aria-hidden="true">
          🔥
        </span>
      </p>
    </div>
  );
}
