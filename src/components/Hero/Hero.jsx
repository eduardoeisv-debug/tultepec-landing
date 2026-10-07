import { useEffect, useRef, useState } from "react";
import { Play, X, ChevronRight, Flame, MessageSquareText, BookOpen, MapPinned } from "lucide-react";
import SparkField from "../shared/SparkField.jsx";
import HeroFireworks from "../shared/HeroFireworks.jsx";
import TownSilhouette from "../shared/TownSilhouette.jsx";
import HeroPapelPicado from "../shared/HeroPapelPicado.jsx";
import GaleriaOverlay from "../shared/GaleriaOverlay.jsx";
import { GaleriaCardIcon } from "../shared/GaleriaIcons.jsx";
import HistoryModal from "../shared/HistoryModal.jsx";
import MemoriesModal from "../shared/MemoriesModal.jsx";
import useScrollLock from "../../hooks/useScrollLock.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Hero.css";

export default function Hero({ onOpenBooks, onShareClick, booksTriggerRef }) {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [mobileVideoOpen, setMobileVideoOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [memoriesOpen, setMemoriesOpen] = useState(false);
  const [galeriaOpen, setGaleriaOpen] = useState(false);
  const galeriaTriggerRef = useRef(null);

  useScrollLock(mobileVideoOpen);

  // Soporta enlaces directos a la galería: si la página se carga con
  // #galeria/imagenes o #galeria/videos en la URL, la abre directamente
  // (GaleriaOverlay lee el hash para elegir la pestaña inicial).
  useEffect(() => {
    if (window.location.hash.startsWith("#galeria/")) {
      setGaleriaOpen(true);
    }
  }, []);

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
    {
      key: "visit",
      Icon: MapPinned,
      label: t("hero.card.visit.title"),
      caption: t("hero.card.visit.caption"),
      onClick: scrollToVisita,
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
            onClick={() => setMobileVideoOpen(true)}
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

      <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <MemoriesModal open={memoriesOpen} onClose={() => setMemoriesOpen(false)} onShareClick={onShareClick} />
      <GaleriaOverlay open={galeriaOpen} onClose={() => setGaleriaOpen(false)} triggerRef={galeriaTriggerRef} />

      {mobileVideoOpen && (
        <div className="hero__mobile-video-backdrop" onMouseDown={() => setMobileVideoOpen(false)}>
          <div className="hero__mobile-video-modal" onMouseDown={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hero__mobile-video-close"
              onClick={() => setMobileVideoOpen(false)}
              aria-label={t("common.cerrar")}
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
