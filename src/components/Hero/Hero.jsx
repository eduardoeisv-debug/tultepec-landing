import { useState } from "react";
import { ScrollText } from "lucide-react";
import SparkField from "../shared/SparkField.jsx";
import MosaicTile from "../shared/MosaicTile.jsx";
import GalleryModal from "../shared/GalleryModal.jsx";
import { GALLERY_CATEGORIES, coverImage } from "../../data/galleries.js";
import "./Hero.css";

const BookIcon = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M4 5c2-1 5-1 7 .5V19c-2-1.5-5-1.5-7-.5V5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M20 5c-2-1-5-1-7 .5V19c2-1.5 5-1.5 7-.5V5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

const TILE_ICONS = {
  "castillos-monumentales": "castillo",
  "san-juan-de-dios": "fuego",
  "talleres-familiares": "taller",
  toritos: "torito",
  mojigangas: "mojiganga",
};

const TILE_TONES = {
  "castillos-monumentales": "fire",
  "san-juan-de-dios": "gold",
  "talleres-familiares": "night",
  toritos: "terracotta",
  mojigangas: "gold",
};

export default function Hero({ onOpenBooks }) {
  const [activeGallery, setActiveGallery] = useState(null);
  const activeCategory = GALLERY_CATEGORIES.find((c) => c.slug === activeGallery);

  return (
    <section className="hero" id="inicio">
      <SparkField />
      <div className="container hero__grid">
        <div className="hero__copy">
          <span className="eyebrow eyebrow--light">Tultepec, Estado de México</span>
          <h1 className="hero__title">
            Capital de la <span>Pirotecnia</span>
          </h1>
          <p className="hero__subtitle">
            Tultepec, reconocido como la capital mundial de la pirotecnia, no fabrica pólvora:
            transforma el fuego en arte multicolor. Sus tradicionales castillos y toritos son
            parte de un oficio artesanal que las familias de la comunidad han preservado y
            transmitido por generaciones.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#tradiciones">
              Explora la historia
            </a>
          </div>

          <div className="hero__links">
            <a className="hero__link" href="#voces">
              <span className="hero__link-icon">
                <ScrollText size={16} strokeWidth={1.8} />
              </span>
              <span className="hero__link-text">Conoce los textos de "Memorias de mi pueblo"</span>
            </a>
            <span className="hero__links-divider" aria-hidden="true" />
            <span className="hero__tooltip-wrap">
              <button type="button" className="hero__link" onClick={onOpenBooks}>
                <span className="hero__link-icon">{BookIcon}</span>
                <span className="hero__link-text">Compendios</span>
              </button>
              <span className="hero__tooltip" role="tooltip">
                Conoce los 3 libros ya publicados sobre la historia de Tultepec
              </span>
            </span>
          </div>
        </div>

        <div className="hero__visual" aria-label="Mosaico ilustrado de la tradición pirotécnica de Tultepec">
          {GALLERY_CATEGORIES.map((cat, i) => (
            <MosaicTile
              key={cat.slug}
              icon={TILE_ICONS[cat.slug]}
              label={cat.label}
              tone={TILE_TONES[cat.slug]}
              large={i === 0}
              image={coverImage(cat.slug)}
              onClick={() => setActiveGallery(cat.slug)}
            />
          ))}
        </div>
      </div>

      <GalleryModal
        open={Boolean(activeCategory)}
        onClose={() => setActiveGallery(null)}
        category={activeCategory?.slug}
        title={activeCategory?.label}
      />
    </section>
  );
}
