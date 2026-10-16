import { useEffect, useRef, useState } from "react";
import { X, RotateCcw } from "lucide-react";
import useScrollLock from "../../hooks/useScrollLock.js";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "../Hero/Hero.css";

// El mismo modal de video que Hero.jsx abría en celular (mismo
// <video src="/video/bienvenida.mp4">, mismos controles de reinicio y
// "ver de nuevo", mismas clases hero__mobile-video-* -- se extrajo
// tal cual para que el acceso "Ver bienvenida" de Inicio (Menú
// Cristal) lo pueda abrir sin depender del resto de Hero.jsx, que ya
// no se usa en este diseño.
export default function VideoBienvenidaModal({ open, onClose, triggerRef }) {
  const { t } = useLanguage();
  const [ended, setEnded] = useState(false);
  const videoRef = useRef(null);
  const closeRef = useRef(null);
  const modalRef = useRef(null);

  useScrollLock(open);
  useFocusTrap(modalRef, open);

  useEffect(() => {
    if (!open) return undefined;
    setEnded(false);
    closeRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    onClose();
    triggerRef?.current?.focus?.();
  };

  const restart = () => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    const p = el.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    setEnded(false);
  };

  return (
    <div className="hero__mobile-video-backdrop" onMouseDown={handleClose}>
      <div
        className="hero__mobile-video-modal"
        role="dialog"
        aria-modal="true"
        aria-label={t("hero.verVideo")}
        tabIndex={-1}
        ref={modalRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="hero__mobile-video-close"
          ref={closeRef}
          onClick={handleClose}
          aria-label={t("common.cerrar")}
        >
          <X size={20} strokeWidth={2.2} />
        </button>
        <video
          ref={videoRef}
          className="hero__mobile-video-el"
          src="/video/bienvenida.mp4"
          controls
          autoPlay
          playsInline
          onEnded={() => setEnded(true)}
          onPlay={() => setEnded(false)}
        />
        {!ended && (
          <button
            type="button"
            className="hero__video-restart hero__video-restart--mobile"
            onClick={restart}
            aria-label={t("video.restart")}
            title={t("video.restart")}
          >
            <RotateCcw size={18} strokeWidth={2} />
          </button>
        )}
        {ended && (
          <div className="hero__video-ended-overlay">
            <button type="button" className="hero__video-ended-btn" onClick={restart}>
              <span className="hero__video-ended-icon" aria-hidden="true">
                <RotateCcw size={26} strokeWidth={2} />
              </span>
              <span className="hero__video-ended-label">{t("video.watchAgain")}</span>
            </button>
            <button type="button" className="hero__video-ended-close" onClick={handleClose}>
              {t("common.cerrar")}
            </button>
            <p className="hero__video-ended-sub">{t("video.endedSub")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
