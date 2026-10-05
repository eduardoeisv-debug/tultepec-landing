import { useState } from "react";
import { Play, X, ChevronRight } from "lucide-react";
import SparkField from "../shared/SparkField.jsx";
import HeroFireworks from "../shared/HeroFireworks.jsx";
import TownSilhouette from "../shared/TownSilhouette.jsx";
import HeroPapelPicado from "../shared/HeroPapelPicado.jsx";
import MediaHubModal from "../shared/MediaHubModal.jsx";
import GalleryModal from "../shared/GalleryModal.jsx";
import VideoGalleryModal from "../shared/VideoGalleryModal.jsx";
import HistoryModal from "../shared/HistoryModal.jsx";
import MemoriesModal from "../shared/MemoriesModal.jsx";
import VisitModal from "../shared/VisitModal.jsx";
import { GALLERY_CATEGORIES, VIDEO_CATEGORIES, coverImage, coverVideo } from "../../data/galleries.js";
import useScrollLock from "../../hooks/useScrollLock.js";
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

export default function Hero({ onOpenBooks, onShareClick }) {
  const [playing, setPlaying] = useState(false);
  const [mobileVideoOpen, setMobileVideoOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [memoriesOpen, setMemoriesOpen] = useState(false);
  const [visitOpen, setVisitOpen] = useState(false);
  const [imagesHubOpen, setImagesHubOpen] = useState(false);
  const [videosHubOpen, setVideosHubOpen] = useState(false);
  const [activeImageCategory, setActiveImageCategory] = useState(null);
  const [activeVideoCategory, setActiveVideoCategory] = useState(null);

  const activeImage = GALLERY_CATEGORIES.find((c) => c.slug === activeImageCategory);
  const activeVideo = VIDEO_CATEGORIES.find((c) => c.slug === activeVideoCategory);

  useScrollLock(mobileVideoOpen);

  const listItems = [
    {
      key: "history",
      tone: "fire",
      label: "Explora la historia",
      tooltip: "Explora los momentos y tradiciones",
      onClick: () => setHistoryOpen(true),
    },
    {
      key: "memories",
      tone: "gold",
      label: "Memorias de mi pueblo",
      tooltip: 'Conoce los textos de "Memorias de mi pueblo"',
      onClick: () => setMemoriesOpen(true),
    },
    {
      key: "books",
      tone: "terracotta",
      label: "Compendios",
      tooltip: "Conoce los 3 libros ya publicados sobre la historia de Tultepec",
      onClick: onOpenBooks,
    },
    {
      key: "images",
      tone: "gold",
      label: "Imágenes",
      tooltip: "Imágenes de Toritos, castillos, talleres, Mojigangas y Religión",
      onClick: () => setImagesHubOpen(true),
    },
    {
      key: "videos",
      tone: "terracotta",
      label: "Videos",
      tooltip: "Videos de Toritos, castillos, piromusicales",
      onClick: () => setVideosHubOpen(true),
    },
    {
      key: "visit",
      tone: "gold",
      label: "Visítanos",
      tooltip: "Tu visita a Tultepec",
      onClick: () => setVisitOpen(true),
    },
  ];

  return (
    <section className="hero" id="inicio">
      <HeroFireworks />
      <SparkField />
      <HeroPapelPicado />
      <TownSilhouette />
      <div className="container hero__grid">
        <div className="hero__copy">
          <span className="eyebrow eyebrow--light hero__enter hero__enter--1">
            Tultepec, Estado de México
          </span>
          <h1 className="hero__title hero__enter hero__enter--2">
            Capital de la <span>Pirotecnia</span>
          </h1>
          <button
            type="button"
            className="hero__title-video-trigger"
            onClick={() => setMobileVideoOpen(true)}
          >
            <span className="hero__title-video-trigger-icon" aria-hidden="true">
              <Play size={14} strokeWidth={0} fill="currentColor" />
            </span>
            Ver video
          </button>
          <p className="hero__subtitle hero__enter hero__enter--3">
            Tultepec convierte el fuego en arte: castillos y toritos que sus familias han
            heredado por generaciones.
          </p>
          <ul className="hero__list hero__enter hero__enter--4">
            {listItems.map((item) => (
              <li className="hero__list-item" key={item.key}>
                <span className="hero__tooltip-wrap">
                  <button type="button" className="hero__list-link" onClick={item.onClick}>
                    <TriangleBullet tone={item.tone} />
                    <span>{item.label}</span>
                    <ChevronRight className="hero__list-chevron" size={16} strokeWidth={2} aria-hidden="true" />
                  </button>
                  <span className="hero__tooltip" role="tooltip">
                    {item.tooltip}
                  </span>
                </span>
              </li>
            ))}
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
                <img
                  className="hero__video-cover"
                  src="/img/portada.jpg"
                  alt=""
                  aria-hidden="true"
                />
                <span className="hero__video-cover-tint" aria-hidden="true" />
                <SparkField count={7} />
                <span className="hero__video-ring hero__video-ring--1" aria-hidden="true" />
                <span className="hero__video-ring hero__video-ring--2" aria-hidden="true" />
                <span className="hero__video-play" aria-hidden="true">
                  <Play size={26} strokeWidth={0} fill="currentColor" />
                </span>
                <span className="hero__video-label">Dale play</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <MemoriesModal open={memoriesOpen} onClose={() => setMemoriesOpen(false)} onShareClick={onShareClick} />
      <VisitModal open={visitOpen} onClose={() => setVisitOpen(false)} />

      <MediaHubModal
        open={imagesHubOpen}
        onClose={() => {
          setImagesHubOpen(false);
          setActiveImageCategory(null);
        }}
        eyebrow="Imágenes"
        title="Tradiciones del pueblo en fotos"
        description="Elige una categoría para ver su álbum completo."
        categories={GALLERY_CATEGORIES}
        icons={IMAGE_TILE_ICONS}
        tones={IMAGE_TILE_TONES}
        coverFn={coverImage}
        mediaType="image"
        onSelect={(slug) => setActiveImageCategory(slug)}
      />

      <MediaHubModal
        open={videosHubOpen}
        onClose={() => {
          setVideosHubOpen(false);
          setActiveVideoCategory(null);
        }}
        eyebrow="Videos"
        title="Tradiciones del pueblo en video"
        description="Elige una categoría para ver sus videos."
        categories={VIDEO_CATEGORIES}
        icons={VIDEO_TILE_ICONS}
        tones={VIDEO_TILE_TONES}
        coverFn={coverVideo}
        mediaType="video"
        onSelect={(slug) => setActiveVideoCategory(slug)}
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

      {mobileVideoOpen && (
        <div className="hero__mobile-video-backdrop" onMouseDown={() => setMobileVideoOpen(false)}>
          <div className="hero__mobile-video-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hero__mobile-video-close"
              onClick={() => setMobileVideoOpen(false)}
              aria-label="Cerrar"
            >
              <X size={18} strokeWidth={2} />
            </button>
            <video
              className="hero__mobile-video-el"
              src="/video/bienvenida.mp4"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}
    </section>
  );
}
