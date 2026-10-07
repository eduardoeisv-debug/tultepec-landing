import "./MobileProgressBar.css";

const LABELS = ["Qué es Tultepec", "Castillos y toritos", "Las fiestas del año", "Cómo llegar"];

// En tableta/celular el castillo vertical se vuelve esta barra delgada:
// 4 mini "pisos" que se van encendiendo y que también sirven para saltar
// directo a cada bloque.
export default function MobileProgressBar({ activeIndex, onJump }) {
  return (
    <nav className="castillo-mobilebar" aria-label="Progreso del recorrido del castillo">
      {LABELS.map((label, index) => (
        <button
          key={label}
          type="button"
          className={`castillo-mobilebar__floor${index === activeIndex ? " is-active" : ""}${
            index < activeIndex ? " is-dim" : ""
          }`}
          onClick={() => onJump(index)}
          aria-current={index === activeIndex ? "step" : undefined}
          aria-label={`Ir a: ${label}`}
        >
          <span className="castillo-mobilebar__wheel" aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
