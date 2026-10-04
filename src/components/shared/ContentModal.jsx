import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import useScrollLock from "../../hooks/useScrollLock.js";
import "./ContentModal.css";

// Modal genérico de contenido: pantalla completa con un título y lo que se
// le pase como children. Usado por "Planea tu visita" para que "Cómo
// llegar" y "Calendario de fiestas" solo se muestren al hacer clic, en vez
// de estar siempre desplegados en la página.
export default function ContentModal({ open, onClose, eyebrow, title, children }) {
  const dialogRef = useRef(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="content-modal__backdrop" onMouseDown={onClose}>
      <div
        className="content-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-modal-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="content-modal__close" onClick={onClose} aria-label="Cerrar">
          <X size={18} strokeWidth={2} />
        </button>

        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h3 id="content-modal-title">{title}</h3>

        <div className="content-modal__body">{children}</div>
      </div>
    </div>
  );
}
