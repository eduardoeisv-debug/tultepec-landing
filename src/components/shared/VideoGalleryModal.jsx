import { useEffect, useRef, useState } from "react";
import { X, Play, ArrowLeft } from "lucide-react";
import useGalleryVideos from "../../hooks/useGalleryVideos.js";
import useScrollLock from "../../hooks/useScrollLock.js";
import "./VideoGalleryModal.css";

export default function VideoGalleryModal({ open, onClose, category, title }) {
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
        <button className="video-gallery-modal__close" onClick={onClose} aria-label="Cerrar">
          <X size={18} strokeWidth={2} />
        </button>

        <span className="eyebrow">Álbum de videos</span>
        <h3 id="video-gallery-modal-title">{title}</h3>

        {status === "loading" && <p className="video-gallery-modal__status">Buscando videos…</p>}

        {status === "done" && videos.length === 0 && (
          <p className="video-gallery-modal__status">
            Todavía no hay videos aquí. Colócalos en{" "}
            <code>{`public/videos/${category}/`}</code> numerados como{" "}
            <code>01</code>, <code>02</code>… (acepta .mp4, .webm o .mov) y aparecerán en este
            orden.
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
                aria-label={`Ver video ${i + 1} de ${videos.length}`}
              >
                <Play size={22} strokeWidth={0} fill="currentColor" />
                <span>Video {i + 1}</span>
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
              <ArrowLeft size={15} strokeWidth={2} /> Volver a la cuadrícula
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
