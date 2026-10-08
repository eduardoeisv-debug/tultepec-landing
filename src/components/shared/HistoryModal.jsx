import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import OverlayPapelPicado from "./OverlayPapelPicado.jsx";
import HistoryInfographic from "./HistoryInfographic.jsx";
import "./HistoryModal.css";

const CLOSE_ANIM_MS = 220;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Ventana "Explora la historia": mismo lenguaje visual nocturno/glass que
// GaleriaOverlay y RelatosModal (papel picado, cierre de 44px, bottom
// sheet en celular) en vez del ContentModal claro genérico -- para que la
// infografía (tarjetas glass, azul noche) no choque con el fondo del
// panel que la contiene.
export default function HistoryModal({ open, onClose, triggerRef }) {
  const { t } = useLanguage();
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) setClosing(false);
  }, [open]);

  const finishClose = () => {
    onClose();
    triggerRef?.current?.focus();
  };

  const requestClose = () => {
    if (prefersReducedMotion()) {
      finishClose();
      return;
    }
    setClosing(true);
    setTimeout(finishClose, CLOSE_ANIM_MS);
  };

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div className={`history-overlay__backdrop ${closing ? "is-closing" : ""}`} onMouseDown={requestClose}>
      <div
        className={`history-overlay ${closing ? "is-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-overlay-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <OverlayPapelPicado />

        <button type="button" className="history-overlay__close" onClick={requestClose} aria-label={t("common.cerrar")}>
          <X size={20} strokeWidth={2.2} />
        </button>

        <header className="history-overlay__head">
          <span className="eyebrow eyebrow--light">{t("historyModal.eyebrow")}</span>
          <h2 id="history-overlay-title">{t("historyModal.title")}</h2>
        </header>

        <div className="history-overlay__body">
          <HistoryInfographic />
        </div>
      </div>
    </div>
  );
}
