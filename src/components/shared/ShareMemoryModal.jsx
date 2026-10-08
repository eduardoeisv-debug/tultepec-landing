import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import ShareMemoryForm from "./ShareMemoryForm.jsx";
import useScrollLock from "../../hooks/useScrollLock.js";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./ShareMemoryModal.css";

// Modal independiente de "Comparte tu memoria": ahora solo el marco
// (fondo, cerrar, bloqueo de scroll, foco, Escape) -- el formulario en sí
// vive en ShareMemoryForm.jsx, compartido con la pestaña "Comparte tu
// memoria" de MemoriesModal. Nada de la lógica de envío cambió.
//
// Ya no tiene ningún botón que lo abra en la interfaz (ese lugar ahora es
// la pestaña de MemoriesModal), pero se deja montado y funcional por si
// hace falta un acceso directo en otro lugar más adelante.
export default function ShareMemoryModal({ open, onClose, onOpenPrivacy }) {
  const { t } = useLanguage();
  const dialogRef = useRef(null);

  useScrollLock(open);
  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.querySelector("input, textarea, select")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="memory-modal__backdrop" onMouseDown={onClose}>
      <div
        className="memory-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-memory-form-title"
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="memory-modal__close" onClick={onClose} aria-label={t("common.cerrar")}>
          <X size={18} strokeWidth={2} />
        </button>

        <ShareMemoryForm theme="light" onOpenPrivacy={onOpenPrivacy} onClose={onClose} />
      </div>
    </div>
  );
}
