import { useEffect, useRef, useState } from "react";
import { X, Construction } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import OverlayPapelPicado from "./OverlayPapelPicado.jsx";
import "./MuseosModal.css";

const CLOSE_ANIM_MS = 220;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Ventana "Museos": mismo lenguaje visual nocturno/glass que HistoryModal/
// GaleriaOverlay/RelatosModal/MemoriesModal (papel picado, cierre de 44px,
// bottom sheet en celular). Por ahora solo muestra un aviso de "en
// construcción" -- cuando haya contenido, este cuerpo se reemplaza por
// pestañas al estilo RelatosModal/MemoriesModal (SegmentedTabs): una para
// la historia de los museos de Tultepec y una por cada museo.
export default function MuseosModal({ open, onClose, triggerRef }) {
  const { t } = useLanguage();
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);

  useFocusTrap(dialogRef, open);

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
    bodyRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div className={`museos-overlay__backdrop ${closing ? "is-closing" : ""}`} onMouseDown={requestClose}>
      <div
        className={`museos-overlay ${closing ? "is-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="museos-overlay-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <OverlayPapelPicado />

        <button type="button" className="museos-overlay__close" onClick={requestClose} aria-label={t("common.cerrar")}>
          <X size={20} strokeWidth={2.2} />
        </button>

        <header className="museos-overlay__head">
          <span className="eyebrow eyebrow--light">{t("museosModal.eyebrow")}</span>
          <h2 id="museos-overlay-title">{t("museosModal.title")}</h2>
        </header>

        <div className="museos-overlay__body" tabIndex={-1} ref={bodyRef}>
          <div className="museos-overlay__placeholder">
            <span className="museos-overlay__placeholder-icon" aria-hidden="true">
              <Construction size={40} strokeWidth={1.6} />
            </span>
            <p className="museos-overlay__placeholder-text">{t("museosModal.enConstruccion")}</p>
            <p className="museos-overlay__placeholder-sub">{t("museosModal.enConstruccionSub")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
