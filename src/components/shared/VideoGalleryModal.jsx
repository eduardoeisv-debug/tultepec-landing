import { useEffect, useRef, useState } from "react";
import { X, Play, ArrowLeft } from "lucide-react";
import useGalleryVideos from "../../hooks/useGalleryVideos.js";
import useScrollLock from "../../hooks/useScrollLock.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./VideoGalleryModal.css";

export default function VideoGalleryModal({ open, onClose, category, title }) {
  const { t } = useLanguage();
  const { status, videos } = useGalleryVideos(category, open);
  const [activeIndex, setActiveIndex] = useState(null);
  const dialogRef = useRef(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) setActiveIndex(null);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (activeIndex !== null) setActiveIndex(null);
        else onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, activeIndex]);

  if (!open) return null;

  return (
    <div className="video-gallery-modal__backdrop" onMouseDown={onClose}>
      <div
        className="video-gallery-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-gallery-modal-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="video-gallery-modal__close" onClick={onClose} aria-label={t("common.cerrar")}>
          <X size={18} strokeWidth={2} />
        </button>

        <span className="eyebrow">{t("videoGalleryModal.eyebrow")}</span>
        <h3 id="video-gallery-modal-title">{title}</h3>

        {status === "loading" && <p className="video-gallery-modal__status">{t("videoGalleryModal.loading")}</p>}

        {status === "done" && videos.length === 0 && (
          <p className="video-gallery-modal__status">
            {t("videoGalleryModal.empty", { path: `public/videos/${category}/`, n1: "01", n2: "02" })}
          </p>
        )}

        {status === "done" && videos.length > 0 && activeIndex === null && (
          <div className="video-gallery-modal__grid">
            {videos.map((src, i) => (
              <button
                key={src}
                type="button"
                className="video-thumb"
                onClick={() => setActiveIndex(i)}
                aria-label={t("videoGalleryModal.verVideo", { n: i + 1, total: videos.length })}
              >
                <Play size={22} strokeWidth={0} fill="currentColor" />
                <span>{t("videoGalleryModal.videoN", { n: i + 1 })}</span>
              </button>
            ))}
          </div>
        )}

        {status === "done" && videos.length > 0 && activeIndex !== null && (
          <div className="video-gallery-viewer">
            <button
              type="button"
              className="video-gallery-viewer__back"
              onClick={() => setActiveIndex(null)}
            >
              <ArrowLeft size={15} strokeWidth={2} /> {t("galleryModal.volver")}
            </button>

            <video
              key={videos[activeIndex]}
              className="video-gallery-viewer__video"
              src={videos[activeIndex]}
              controls
              autoPlay
              playsInline
            />
          </div>
        )}
      </div>
    </div>
  );
}
