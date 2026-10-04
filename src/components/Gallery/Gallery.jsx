import { useState } from "react";
import useReveal from "../../hooks/useReveal.js";
import MosaicTile from "../shared/MosaicTile.jsx";
import GalleryModal from "../shared/GalleryModal.jsx";
import { GALLERY_CATEGORIES, coverImage } from "../../data/galleries.js";
import "./Gallery.css";

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

export default function Gallery() {
  const ref = useReveal();
  const [activeGallery, setActiveGallery] = useState(null);
  const activeCategory = GALLERY_CATEGORIES.find((c) => c.slug === activeGallery);

  return (
    <section className="gallery" ref={ref}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">Un vistazo en imágenes</span>
          <h2>Así se vive la tradición</h2>
          <p>
            Castillos, toritos, talleres familiares y más — explora cada categoría y descubre el
            álbum completo.
          </p>
        </div>

        <div className="gallery__grid reveal">
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
