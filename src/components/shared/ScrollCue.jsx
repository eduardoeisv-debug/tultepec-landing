import "./ScrollCue.css";

// Indicación de scroll (etiqueta + flecha que rebota) reutilizada al final
// del hero ("Conoce nuestra historia" -> #bienvenida) y al final de la
// carta de bienvenida ("¿Cuándo vienes?" -> #visita). `onClick` decide a
// dónde se desplaza; este componente solo pone la forma.
export default function ScrollCue({ label, onClick }) {
  return (
    <button type="button" className="scroll-cue" onClick={onClick}>
      <span className="scroll-cue__label">{label}</span>
      <svg
        className="scroll-cue__arrow"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 4 L12 18 M6 12 L12 18 L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
