import { useState } from "react";
import {
  Play,
  X,
  ChevronRight,
  Flame,
  MessageSquareText,
  BookOpen,
  Image,
  Video,
  MapPinned,
} from "lucide-react";
import SparkField from "../shared/SparkField.jsx";
import HeroFireworks from "../shared/HeroFireworks.jsx";
import TownSilhouette from "../shared/TownSilhouette.jsx";
import HeroPapelPicado from "../shared/HeroPapelPicado.jsx";
import MediaHubModal from "../shared/MediaHubModal.jsx";
import GalleryModal from "../shared/GalleryModal.jsx";
import VideoGalleryModal from "../shared/VideoGalleryModal.jsx";
import HistoryModal from "../shared/HistoryModal.jsx";
import MemoriesModal from "../shared/MemoriesModal.jsx";
import { GALLERY_CATEGORIES, VIDEO_CATEGORIES, coverImage, coverVideo } from "../../data/galleries.js";
import useScrollLock from "../../hooks/useScrollLock.js";
import "./Hero.css";

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
  const [imagesHubOpen, setImagesHubOpen] = useState(false);
  const [videosHubOpen, setVideosHubOpen] = useState(false);
  const [activeImageCategory, setActiveImageCategory] = useState(null);
  const [activeVideoCategory, setActiveVideoCategory] = useState(null);

  const activeImage = GALLERY_CATEGORIES.find((c) => c.slug === activeImageCategory);
  const activeVideo = VIDEO_CATEGORIES.find((c) => c.slug === activeVideoCategory);

  useScrollLock(mobileVideoOpen);

  const scrollToComoLlegar = () => {
    document.getElementById("visita")?.scrollIntoView({ block: "start" });
  };

  const listItems = [
    {
      key: "history",
      Icon: Flame,
      label: "Explora la historia",
      caption: "Momentos y tradiciones",
      onClick: () => setHistoryOpen(true),
    },
    {
      key: "memories",
      Icon: MessageSquareText,
      label: "Memorias de mi pueblo",
      caption: "Testimonios del pueblo",
      onClick: () => setMemoriesOpen(true),
    },
    {
      key: "books",
      Icon: BookOpen,
      label: "Compendios",
      caption: "3 libros publicados",
      onClick: onOpenBooks,
    },
    {
      key: "images",
      Icon: Image,
      label: "Imágenes",
      caption: "Toritos, castillos y más",
      onClick: () => setImagesHubOpen(true),
    },
    {
      key: "videos",
      Icon: Video,
      label: "Videos",
      caption: "Castillos y piromusicales",
      onClick: () => setVideosHubOpen(true),
    },
    {
      key: "visit",
      Icon: MapPinned,
      label: "Cómo llegar",
      caption: "Mapa, fechas y consejos",
      onClick: scrollToComoLlegar,
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
          <ul className="hero__cards hero__enter hero__enter--4">
            {listItems.map((item) => (
              <li className="hero__card-item" key={item.key}>
                <button type="button" className="hero__card" onClick={item.onClick}>
                  <span className="hero__card-icon" aria-hidden="true">
                    <item.Icon size={26} strokeWidth={1.7} />
                  </span>
                  <span className="hero__card-title">{item.label}</span>
                  <span className="hero__card-caption">{item.caption}</span>
                  <ChevronRight className="hero__card-arrow" size={16} strokeWidth={2} aria-hidden="true" />
                </button>
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
                onEnded={() => setPlaying(false)}
              />
            ) : (
              <button
                type="button"
                className="hero__video-poster"
                onClick={() => setPlaying(true)}
                aria-label="Reproducir video de bienvenida a Tultepec"
              >
                <span className="hero__video-cover" aria-hidden="true" />
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
              onEnded={(e) => {
                e.currentTarget.currentTime = 0;
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
