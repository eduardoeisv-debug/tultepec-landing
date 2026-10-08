import { useEffect, useRef, useState } from "react";
import { Play, X, ChevronRight, Flame, MessageSquareText, BookOpen, RotateCcw } from "lucide-react";
import SparkField from "../shared/SparkField.jsx";
import HeroFireworks from "../shared/HeroFireworks.jsx";
import TownSilhouette from "../shared/TownSilhouette.jsx";
import HeroPapelPicado from "../shared/HeroPapelPicado.jsx";
import GaleriaOverlay from "../shared/GaleriaOverlay.jsx";
import { GaleriaCardIcon } from "../shared/GaleriaIcons.jsx";
import { preloadGaleriaImages } from "../../hooks/useGaleriaImages.js";
import { preloadGaleriaVideos } from "../../hooks/useGaleriaVideos.js";
import HistoryModal from "../shared/HistoryModal.jsx";
import MemoriesModal from "../shared/MemoriesModal.jsx";
import useScrollLock from "../../hooks/useScrollLock.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Hero.css";

export default function Hero({ onOpenBooks, onShareClick, booksTriggerRef }) {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [mobileVideoOpen, setMobileVideoOpen] = useState(false);
  const [mobileEnded, setMobileEnded] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [memoriesOpen, setMemoriesOpen] = useState(false);
  const [galeriaOpen, setGaleriaOpen] = useState(false);
  const galeriaTriggerRef = useRef(null);
  const videoRef = useRef(null);
  const mobileVideoRef = useRef(null);

  useScrollLock(mobileVideoOpen);

  // Precarga en segundo plano las fotos/videos de la galería un momento
  // después de que el hero ya cargó -- así, para cuando alguien realmente
  // toque la tarjeta "Imágenes y videos", la caché casi siempre ya está
  // lista y el overlay abre con las fotos puestas en vez de en blanco.
  // requestIdleCallback (si existe) espera a que el navegador esté libre;
  // el setTimeout es el respaldo en Safari, que no lo implementa.
  useEffect(() => {
    const run = () => {
      preloadGaleriaImages();
      preloadGaleriaVideos();
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(run, 2000);
    return () => clearTimeout(id);
  }, []);

  // Compartido por el botón de reinicio de esquina y el de "Ver de nuevo"
  // del overlay de fin, en ambos reproductores (escritorio y móvil).
  const restartVideo = (ref, setEndedState) => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = 0;
    const playPromise = el.play();
    // Safari a veces devuelve una promesa que rechaza si el gesto del
    // usuario no se considera "directo" -- el clic en este botón sí lo
    // es, pero igual no dejamos una promesa rechazada sin atrapar.
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
    setEndedState(false);
  };

  const closeMobileVideo = () => {
    setMobileVideoOpen(false);
    setMobileEnded(false);
  };

  // Soporta enlaces directos a la galería: si la página se carga con
  // #galeria/imagenes o #galeria/videos en la URL, la abre directamente
  // (GaleriaOverlay lee el hash para elegir la pestaña inicial).
  useEffect(() => {
    if (window.location.hash.startsWith("#galeria/")) {
      setGaleriaOpen(true);
    }
  }, []);

  // Reutilizado por la indicación de scroll al final del hero -- ya no hay
  // ninguna tarjeta que lleve directo a "visita" (se quitó "Visítanos").
  const scrollToVisita = () => {
    document.getElementById("visita")?.scrollIntoView({ block: "start" });
  };

  const listItems = [
    {
      key: "history",
      Icon: Flame,
      label: t("hero.card.history.title"),
      caption: t("hero.card.history.caption"),
      onClick: () => setHistoryOpen(true),
    },
    {
      key: "memories",
      Icon: MessageSquareText,
      label: t("hero.card.memories.title"),
      caption: t("hero.card.memories.caption"),
      onClick: () => setMemoriesOpen(true),
    },
    {
      key: "books",
      Icon: BookOpen,
      label: t("hero.card.books.title"),
      caption: t("hero.card.books.caption"),
      onClick: onOpenBooks,
      ref: booksTriggerRef,
    },
    {
      key: "galeria",
      Icon: GaleriaCardIcon,
      label: t("hero.card.galeria.title"),
      caption: t("hero.card.galeria.caption"),
      onClick: () => setGaleriaOpen(true),
      ref: galeriaTriggerRef,
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
          <h1 className="hero__title hero__enter hero__enter--1">
            {t("hero.title.line1")} <span>{t("hero.title.line2")}</span>
          </h1>
          <button
            type="button"
            className="hero__title-video-trigger"
            onClick={() => {
              setMobileEnded(false);
              setMobileVideoOpen(true);
            }}
          >
            <span className="hero__title-video-trigger-icon" aria-hidden="true">
              <Play size={14} strokeWidth={0} fill="currentColor" />
            </span>
            {t("hero.verVideo")}
          </button>
          <p className="hero__subtitle hero__enter hero__enter--2">{t("hero.subtitle")}</p>
          <ul className="hero__cards hero__enter hero__enter--3">
            {listItems.map((item) => (
              <li className="hero__card-item" key={item.key}>
                <button type="button" className="hero__card" onClick={item.onClick} ref={item.ref}>
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
              <>
                <video
                  ref={videoRef}
                  className="hero__video-el"
                  src="/video/bienvenida.mp4"
                  controls
                  autoPlay
                  playsInline
                  preload="none"
                  onEnded={() => setEnded(true)}
                  onPlay={() => setEnded(false)}
                />
                {!ended && (
                  <button
                    type="button"
                    className="hero__video-restart"
                    onClick={() => restartVideo(videoRef, setEnded)}
                    aria-label={t("video.restart")}
                    title={t("video.restart")}
                  >
                    <RotateCcw size={18} strokeWidth={2} />
                  </button>
                )}
                {ended && (
                  <div className="hero__video-ended-overlay">
                    <button
                      type="button"
                      className="hero__video-ended-btn"
                      onClick={() => restartVideo(videoRef, setEnded)}
                    >
                      <span className="hero__video-ended-icon" aria-hidden="true">
                        <RotateCcw size={26} strokeWidth={2} />
                      </span>
                      <span className="hero__video-ended-label">{t("video.watchAgain")}</span>
                    </button>
                    <p className="hero__video-ended-sub">{t("video.endedSub")}</p>
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                className="hero__video-poster"
                onClick={() => setPlaying(true)}
                aria-label={t("hero.video.ariaLabel")}
              >
                <span className="hero__video-cover" aria-hidden="true" />
                <span className="hero__video-cover-tint" aria-hidden="true" />
                <SparkField count={7} />
                <span className="hero__video-ring hero__video-ring--1" aria-hidden="true" />
                <span className="hero__video-ring hero__video-ring--2" aria-hidden="true" />
                <span className="hero__video-play" aria-hidden="true">
                  <Play size={26} strokeWidth={0} fill="currentColor" />
                </span>
                <span className="hero__video-label">{t("hero.dalePlay")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <button type="button" className="hero__scroll-cue" onClick={scrollToVisita}>
        <span className="hero__scroll-cue-label">{t("hero.scrollCue")}</span>
        <svg
          className="hero__scroll-cue-arrow"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 4 L12 18 M6 12 L12 18 L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <MemoriesModal open={memoriesOpen} onClose={() => setMemoriesOpen(false)} onShareClick={onShareClick} />
      <GaleriaOverlay open={galeriaOpen} onClose={() => setGaleriaOpen(false)} triggerRef={galeriaTriggerRef} />

      {mobileVideoOpen && (
        <div className="hero__mobile-video-backdrop" onMouseDown={closeMobileVideo}>
          <div className="hero__mobile-video-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hero__mobile-video-close"
              onClick={closeMobileVideo}
              aria-label={t("common.cerrar")}
            >
              <X size={18} strokeWidth={2} />
            </button>
            <video
              ref={mobileVideoRef}
              className="hero__mobile-video-el"
              src="/video/bienvenida.mp4"
              controls
              autoPlay
              playsInline
              onEnded={() => setMobileEnded(true)}
              onPlay={() => setMobileEnded(false)}
            />
            {!mobileEnded && (
              <button
                type="button"
                className="hero__video-restart hero__video-restart--mobile"
                onClick={() => restartVideo(mobileVideoRef, setMobileEnded)}
                aria-label={t("video.restart")}
                title={t("video.restart")}
              >
                <RotateCcw size={18} strokeWidth={2} />
              </button>
            )}
            {mobileEnded && (
              <div className="hero__video-ended-overlay">
                <button
                  type="button"
                  className="hero__video-ended-btn"
                  onClick={() => restartVideo(mobileVideoRef, setMobileEnded)}
                >
                  <span className="hero__video-ended-icon" aria-hidden="true">
                    <RotateCcw size={26} strokeWidth={2} />
                  </span>
                  <span className="hero__video-ended-label">{t("video.watchAgain")}</span>
                </button>
                <p className="hero__video-ended-sub">{t("video.endedSub")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
