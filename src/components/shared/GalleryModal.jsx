import { useEffect, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import useGalleryImages from "../../hooks/useGalleryImages.js";
import "./GalleryModal.css";

export default function GalleryModal({ open, onClose, category, title }) {
  const { status, images } = useGalleryImages(category, open);
  const [activeIndex, setActiveIndex] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setActiveIndex(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (activeIndex !== null) setActiveIndex(null);
        else onClose();
      } else if (activeIndex !== null && e.key === "ArrowRight") {
        setActiveIndex((i) => (i + 1) % images.length);
      } else if (activeIndex !== null && e.key === "ArrowLeft") {
        setActiveIndex((i) => (i - 1 + images.length) % images.length);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, activeIndex, images.length]);

  if (!open) return null;

  return (
    <div className="gallery-modal__backdrop" onMouseDown={onClose}>
      <div
        className="gallery-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-modal-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="gallery-modal__close" onClick={onClose} aria-label="Cerrar">
          <X size={18} strokeWidth={2} />
        </button>

        <span className="eyebrow">Álbum de fotos</span>
        <h3 id="gallery-modal-title">{title}</h3>

        {status === "loading" && <p className="gallery-modal__status">Buscando fotos…</p>}

        {status === "done" && images.length === 0 && (
          <p className="gallery-modal__status">
            Todavía no hay fotos aquí. Colócalas en{" "}
            <code>{`public/images/${category}/`}</code> numeradas como{" "}
            <code>01</code>, <code>02</code>… (acepta .jpg, .jpeg, .png, .webp o .jfif) y
            aparecerán en este orden.
          </p>
        )}

        {status === "done" && images.length > 0 && activeIndex === null && (
          <div className="gallery-modal__grid">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                className="gallery-thumb"
                onClick={() => setActiveIndex(i)}
                aria-label={`Ver foto ${i + 1} de ${images.length}`}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
                />
              </button>
            ))}
          </div>
        )}

        {status === "done" && images.length > 0 && activeIndex !== null && (
          <div className="gallery-viewer">
            <button
              type="button"
              className="gallery-viewer__back"
              onClick={() => setActiveIndex(null)}
            >
              <ArrowLeft size={15} strokeWidth={2} /> Volver a la cuadrícula
            </button>

            <div className="gallery-viewer__stage">
              <button
                type="button"
                className="gallery-viewer__nav gallery-viewer__nav--prev"
                onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
                aria-label="Foto anterior"
              >
                <ChevronLeft size={22} strokeWidth={2} />
              </button>

              <img src={images[activeIndex]} alt="" className="gallery-viewer__image" />

              <button
                type="button"
                className="gallery-viewer__nav gallery-viewer__nav--next"
                onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
                aria-label="Foto siguiente"
              >
                <ChevronRight size={22} strokeWidth={2} />
              </button>
            </div>

            <span className="gallery-viewer__counter">
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
