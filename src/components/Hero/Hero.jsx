import { useEffect, useRef, useState } from "react";
import { Play, X, ChevronRight, Flame, MessageSquareText, BookOpen, RotateCcw, Landmark, Sparkles } from "lucide-react";
import MENU from "../../data/menu.js";
import SparkField from "../shared/SparkField.jsx";
import HeroFireworks from "../shared/HeroFireworks.jsx";
import HeroPapelPicado from "../shared/HeroPapelPicado.jsx";
import ScrollCue from "../shared/ScrollCue.jsx";
import GaleriaOverlay from "../shared/GaleriaOverlay.jsx";
import { GaleriaCardIcon } from "../shared/GaleriaIcons.jsx";
import { preloadGaleriaImages } from "../../hooks/useGaleriaImages.js";
import { preloadGaleriaVideos } from "../../hooks/useGaleriaVideos.js";
import HistoryModal from "../shared/HistoryModal.jsx";
import MemoriesModal from "../shared/MemoriesModal.jsx";
import MuseosModal from "../shared/MuseosModal.jsx";
import useScrollLock from "../../hooks/useScrollLock.js";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Hero.css";

export default function Hero({ onOpenBooks, onOpenPrivacy, booksTriggerRef }) {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [mobileVideoOpen, setMobileVideoOpen] = useState(false);
  const [mobileEnded, setMobileEnded] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [memoriesOpen, setMemoriesOpen] = useState(false);
  const [galeriaOpen, setGaleriaOpen] = useState(false);
  const [museosOpen, setMuseosOpen] = useState(false);
  const historyTriggerRef = useRef(null);
  const memoriesTriggerRef = useRef(null);
  const galeriaTriggerRef = useRef(null);
  const museosTriggerRef = useRef(null);
  const videoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const posterTriggerRef = useRef(null);
  const mobileVideoTriggerRef = useRef(null);
  const mobileVideoModalRef = useRef(null);
  const mobileCloseRef = useRef(null);

  useScrollLock(mobileVideoOpen);
  useFocusTrap(mobileVideoModalRef, mobileVideoOpen);

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

  // Cerrar en los dos reproductores desmonta el <video> (el condicional
  // playing/mobileVideoOpen dejan de renderizarlo), así que no hace
  // falta pausar ni resetear currentTime a mano -- la próxima vez que se
  // abra es un elemento <video> nuevo, ya en el segundo 0. Lo que sí hay
  // que hacer a mano es devolver el foco al botón que lo abrió.
  const closeDesktopVideo = () => {
    setPlaying(false);
    setEnded(false);
    posterTriggerRef.current?.focus();
  };

  const closeMobileVideo = () => {
    setMobileVideoOpen(false);
    setMobileEnded(false);
    mobileVideoTriggerRef.current?.focus();
  };

  // Escape cierra el video en computadora mientras se está reproduciendo
  // (terminado o no) -- el móvil usa su propio modal con backdrop, que
  // ya maneja Escape por separado más abajo.
  useEffect(() => {
    if (!playing) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeDesktopVideo();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  // El modal del video en móvil no tenía ningún manejo de teclado propio
  // (ni Escape) -- el foco inicial va al botón de cerrar, que es lo
  // primero interactivo y además siempre visible, terminado el video o no.
  useEffect(() => {
    if (!mobileVideoOpen) return undefined;
    mobileCloseRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMobileVideo();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileVideoOpen]);

  // Soporta enlaces directos a la galería (#galeria/imagenes,
  // #galeria/videos) y a las pestañas de "Memorias de mi pueblo"
  // (#memorias, #voces, #comparte-memoria) -- cada overlay lee el hash
  // para elegir su pestaña inicial. Se revisa el hash tanto al montar
  // (enlace directo a la página) como en cada "hashchange" posterior: la
  // carta de bienvenida enlaza a "#comparte-memoria"/"#memorias" con
  // anclas normales, y como ninguna de esas rutas tiene un elemento real
  // con ese id en la página, solo cambian el hash (sin saltar a ningún
  // lado) -- este listener es lo que realmente abre el modal en ese caso.
  //
  // El ref que se enfoca al cerrar (memoriesTriggerRef) normalmente
  // apunta fijo a la tarjeta "Memorias de mi pueblo" del hero (ver
  // ref={item.ref} más abajo) -- pero si el modal se abrió por hash desde
  // otro lado de la página (como estos enlaces de la carta), enfocar esa
  // tarjeta de vuelta hace que el navegador salte hasta el hero para
  // mostrarla, aunque quien abrió el modal esté mucho más abajo. Por eso
  // aquí se sobreescribe el ref con el elemento que de verdad tenía el
  // foco (el enlace recién clicado) justo antes de abrir -- mismo truco
  // que ya usa openPrivacy en App.jsx para el mismo problema.
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#galeria/")) {
        galeriaTriggerRef.current = document.activeElement;
        setGaleriaOpen(true);
      }
      if (hash === "#memorias" || hash === "#voces" || hash === "#comparte-memoria") {
        memoriesTriggerRef.current = document.activeElement;
        setMemoriesOpen(true);
      }
      // "Historia" del menú "Explora" (src/data/menu.js) enlaza con
      // "#historia" -- mismo mecanismo que arriba, no hay una sección
      // real con ese id, así que el único efecto del enlace es este.
      if (hash === "#historia") {
        historyTriggerRef.current = document.activeElement;
        setHistoryOpen(true);
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const listItems = [
    {
      key: "history",
      Icon: Flame,
      label: t("hero.card.history.title"),
      caption: t("hero.card.history.caption"),
      onClick: () => setHistoryOpen(true),
      ref: historyTriggerRef,
    },
    {
      key: "memories",
      Icon: MessageSquareText,
      label: t("hero.card.memories.title"),
      caption: t("hero.card.memories.caption"),
      onClick: () => setMemoriesOpen(true),
      ref: memoriesTriggerRef,
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
      key: "museos",
      Icon: Landmark,
      label: t("hero.card.museos.title"),
      caption: t("hero.card.museos.caption"),
      onClick: () => setMuseosOpen(true),
      ref: museosTriggerRef,
      // Módulo en construcción (ver MuseosModal) -- la tarjeta se ve
      // sombreada/pendiente en vez de lista como las demás, aunque sigue
      // siendo clicable (abre el aviso explicándolo).
      pendiente: true,
    },
  ];

  return (
    <section className="hero" id="inicio">
      <HeroFireworks />
      <SparkField />
      <HeroPapelPicado />
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__welcome-line hero__enter hero__enter--1">
            <Sparkles size={20} strokeWidth={1.8} aria-hidden="true" />
            {t("hero.bienvenidosEyebrow")}
          </p>
          <h1 className="hero__title hero__enter hero__enter--1">
            {t("hero.title.line1")} <span>{t("hero.title.line2")}</span>
          </h1>
          <button
            type="button"
            className="hero__title-video-trigger"
            ref={mobileVideoTriggerRef}
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
                <button
                  type="button"
                  className={`hero__card${item.pendiente ? " hero__card--pendiente" : ""}`}
                  onClick={item.onClick}
                  ref={item.ref}
                >
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

          <nav className="hero__atajos hero__enter hero__enter--3" aria-label={t("explora.seccion.title")}>
            {MENU.map((grupo) => (
              <a
                className="hero__atajo"
                key={grupo.id}
                href={`#explora-${grupo.id}`}
                aria-label={t("explora.atajoAriaLabel", { grupo: t(grupo.label) })}
              >
                {t(grupo.label)}
                <ChevronRight size={14} strokeWidth={2.4} aria-hidden="true" />
              </a>
            ))}
          </nav>
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
                  <>
                    <button
                      type="button"
                      className="hero__video-close hero__video-close--desktop"
                      onClick={closeDesktopVideo}
                      aria-label={t("common.cerrar")}
                      title={t("common.cerrar")}
                    >
                      <X size={18} strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      className="hero__video-restart"
                      onClick={() => restartVideo(videoRef, setEnded)}
                      aria-label={t("video.restart")}
                      title={t("video.restart")}
                    >
                      <RotateCcw size={18} strokeWidth={2} />
                    </button>
                  </>
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
                    <button type="button" className="hero__video-ended-close" onClick={closeDesktopVideo}>
                      {t("common.cerrar")}
                    </button>
                    <p className="hero__video-ended-sub">{t("video.endedSub")}</p>
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                className="hero__video-poster"
                ref={posterTriggerRef}
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
                <span className="hero__video-label-group">
                  <span className="hero__video-label">{t("hero.verBienvenida")}</span>
                  <span className="hero__video-caption">{t("hero.videoCaption")}</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <ScrollCue
        label={t("hero.scrollCueHistoria")}
        onClick={() => document.getElementById("bienvenida")?.scrollIntoView({ block: "start" })}
      />

      <HistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} triggerRef={historyTriggerRef} />
      <MemoriesModal
        open={memoriesOpen}
        onClose={() => setMemoriesOpen(false)}
        triggerRef={memoriesTriggerRef}
        onOpenPrivacy={onOpenPrivacy}
      />
      <GaleriaOverlay open={galeriaOpen} onClose={() => setGaleriaOpen(false)} triggerRef={galeriaTriggerRef} />
      <MuseosModal open={museosOpen} onClose={() => setMuseosOpen(false)} triggerRef={museosTriggerRef} />

      {mobileVideoOpen && (
        <div className="hero__mobile-video-backdrop" onMouseDown={closeMobileVideo}>
          <div
            className="hero__mobile-video-modal"
            role="dialog"
            aria-modal="true"
            aria-label={t("hero.verVideo")}
            tabIndex={-1}
            ref={mobileVideoModalRef}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="hero__mobile-video-close"
              ref={mobileCloseRef}
              onClick={closeMobileVideo}
              aria-label={t("common.cerrar")}
            >
              <X size={20} strokeWidth={2.2} />
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
                <button type="button" className="hero__video-ended-close" onClick={closeMobileVideo}>
                  {t("common.cerrar")}
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
