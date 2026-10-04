import { useState } from "react";
import { Play, Flame } from "lucide-react";
import SparkField from "../shared/SparkField.jsx";
import MediaHubModal from "../shared/MediaHubModal.jsx";
import GalleryModal from "../shared/GalleryModal.jsx";
import VideoGalleryModal from "../shared/VideoGalleryModal.jsx";
import { GALLERY_CATEGORIES, VIDEO_CATEGORIES, coverImage, coverVideo } from "../../data/galleries.js";
import "./Hero.css";

const BULLET_STOPS = {
  fire: ["#ff9a86", "#d7263d", "#8f1522"],
  gold: ["#fde7b8", "#e3ab3d", "#a6771d"],
  terracotta: ["#e8a473", "#c1592f", "#7a3216"],
};

function TriangleBullet({ tone }) {
  const id = `hero-bullet-${tone}`;
  const [from, mid, to] = BULLET_STOPS[tone];
  return (
    <svg
      className="hero__list-bullet"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="10%" y1="5%" x2="90%" y2="95%">
          <stop offset="0%" stopColor={from} />
          <stop offset="55%" stopColor={mid} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <path d="M5 3 L20 12 L5 21 Z" fill={`url(#${id})`} />
      <path
        d="M6.5 5.8 L12.5 9.6"
        stroke="rgba(255,255,255,0.65)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const IMAGE_TILE_ICONS = {
  "castillos-monumentales": "castillo",
  "san-juan-de-dios": "fuego",
  "talleres-familiares": "taller",
  toritos: "torito",
  mojigangas: "mojiganga",
};

const IMAGE_TILE_TONES = {
  "castillos-monumentales": "fire",
  "san-juan-de-dios": "gold",
  "talleres-familiares": "night",
  toritos: "terracotta",
  mojigangas: "gold",
};

const VIDEO_TILE_ICONS = {
  toritos: "torito",
  "castillos-monumentales": "castillo",
  piromusicales: "piromusical",
};

const VIDEO_TILE_TONES = {
  toritos: "terracotta",
  "castillos-monumentales": "fire",
  piromusicales: "night",
};

export default function Hero({ onOpenBooks }) {
  const [playing, setPlaying] = useState(false);
  const [imagesHubOpen, setImagesHubOpen] = useState(false);
  const [videosHubOpen, setVideosHubOpen] = useState(false);
  const [activeImageCategory, setActiveImageCategory] = useState(null);
  const [activeVideoCategory, setActiveVideoCategory] = useState(null);

  const activeImage = GALLERY_CATEGORIES.find((c) => c.slug === activeImageCategory);
  const activeVideo = VIDEO_CATEGORIES.find((c) => c.slug === activeVideoCategory);

  return (
    <section className="hero" id="inicio">
      <SparkField />
      <div className="container hero__grid">
        <div className="hero__copy">
          <span className="eyebrow eyebrow--light hero__enter hero__enter--1">
            Tultepec, Estado de México
          </span>
          <h1 className="hero__title hero__enter hero__enter--2">
            Capital de la <span>Pirotecnia</span>
          </h1>
          <p className="hero__subtitle hero__enter hero__enter--3">
            Tultepec, reconocido como la capital mundial de la pirotecnia, no fabrica pólvora:
            transforma el fuego en arte multicolor. Sus tradicionales castillos y toritos son
            parte de un oficio artesanal que las familias de la comunidad han preservado y
            transmitido por generaciones.
          </p>
          <ul className="hero__list hero__enter hero__enter--4">
            <li className="hero__list-item">
              <span className="hero__tooltip-wrap">
                <a className="hero__list-link" href="#tradiciones">
                  <TriangleBullet tone="fire" />
                  <span>Explora la historia</span>
                </a>
                <span className="hero__tooltip" role="tooltip">
                  Explora los momentos y tradiciones
                </span>
              </span>
            </li>
            <li className="hero__list-item">
              <span className="hero__tooltip-wrap">
                <a className="hero__list-link" href="#voces">
                  <TriangleBullet tone="gold" />
                  <span>Memorias de mi pueblo</span>
                </a>
                <span className="hero__tooltip" role="tooltip">
                  Conoce los textos de "Memorias de mi pueblo"
                </span>
              </span>
            </li>
            <li className="hero__list-item">
              <span className="hero__tooltip-wrap">
                <button type="button" className="hero__list-link" onClick={onOpenBooks}>
                  <TriangleBullet tone="terracotta" />
                  <span>Compendios</span>
                </button>
                <span className="hero__tooltip" role="tooltip">
                  Conoce los 3 libros ya publicados sobre la historia de Tultepec
                </span>
              </span>
            </li>
            <li className="hero__list-item">
              <a className="hero__list-link" href="#" onClick={(e) => { e.preventDefault(); setImagesHubOpen(true); }}>
                <TriangleBullet tone="gold" />
                <span>Imágenes - tradiciones del pueblo</span>
              </a>
            </li>
            <li className="hero__list-item">
              <a className="hero__list-link" href="#" onClick={(e) => { e.preventDefault(); setVideosHubOpen(true); }}>
                <TriangleBullet tone="terracotta" />
                <span>Videos - tradiciones del pueblo</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="hero__visual hero__visual--enter">
          <div className="hero__video">
            {playing ? (
              <video
                className="hero__video-el"
                src="/video/bienvenida.mp4"
                controls
                autoPlay
                playsInline
                preload="none"
              />
            ) : (
              <button
                type="button"
                className="hero__video-poster"
                onClick={() => setPlaying(true)}
                aria-label="Reproducir video de bienvenida a Tultepec"
              >
                <span className="hero__video-ring hero__video-ring--1" aria-hidden="true" />
                <span className="hero__video-ring hero__video-ring--2" aria-hidden="true" />
                <Flame className="hero__video-flame" size={22} strokeWidth={1.5} aria-hidden="true" />
                <span className="hero__video-play" aria-hidden="true">
                  <Play size={26} strokeWidth={0} fill="currentColor" />
                </span>
                <span className="hero__video-label">Dale play</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <MediaHubModal
        open={imagesHubOpen}
        onClose={() => setImagesHubOpen(false)}
        eyebrow="Imágenes"
        title="Tradiciones del pueblo en fotos"
        description="Elige una categoría para ver su álbum completo."
        categories={GALLERY_CATEGORIES}
        icons={IMAGE_TILE_ICONS}
        tones={IMAGE_TILE_TONES}
        coverFn={coverImage}
        mediaType="image"
        onSelect={(slug) => {
          setImagesHubOpen(false);
          setActiveImageCategory(slug);
        }}
      />

      <MediaHubModal
        open={videosHubOpen}
        onClose={() => setVideosHubOpen(false)}
        eyebrow="Videos"
        title="Tradiciones del pueblo en video"
        description="Elige una categoría para ver sus videos."
        categories={VIDEO_CATEGORIES}
        icons={VIDEO_TILE_ICONS}
        tones={VIDEO_TILE_TONES}
        coverFn={coverVideo}
        mediaType="video"
        onSelect={(slug) => {
          setVideosHubOpen(false);
          setActiveVideoCategory(slug);
        }}
      />

      <GalleryModal
        open={Boolean(activeImage)}
        onClose={() => setActiveImageCategory(null)}
        category={activeImage?.slug}
        title={activeImage?.label}
      />

      <VideoGalleryModal
        open={Boolean(activeVideo)}
        onClose={() => setActiveVideoCategory(null)}
        category={activeVideo?.slug}
        title={activeVideo?.label}
      />
    </section>
  );
}
