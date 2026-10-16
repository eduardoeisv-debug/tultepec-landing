import { useEffect, useRef, useState } from "react";
import { Play, X, RotateCcw, Sparkles } from "lucide-react";
import SparkField from "../shared/SparkField.jsx";
import HeroFireworks from "../shared/HeroFireworks.jsx";
import HeroPapelPicado from "../shared/HeroPapelPicado.jsx";
import useScrollLock from "../../hooks/useScrollLock.js";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Hero.css";

// El hero de siempre (etiqueta + título + subtítulo + video de
// bienvenida), ahora embebido como la primera mitad de la vista Inicio
// del panel (ver src/components/Panel/views/InicioView.jsx) en vez de
// ser su propia sección de ancho completo. Las tarjetas que tenía
// antes (Explora la historia, Memorias, Relatos, Galería, Museos) se
// quitaron: esas pantallas ahora son rutas del menú lateral
// (src/data/menu.js), no modales que este componente abría.
export default function Hero({ titleRef }) {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [mobileVideoOpen, setMobileVideoOpen] = useState(false);
  const [mobileEnded, setMobileEnded] = useState(false);
  const videoRef = useRef(null);
  const mobileVideoRef = useRef(null);
  const posterTriggerRef = useRef(null);
  const mobileVideoTriggerRef = useRef(null);
  const mobileVideoModalRef = useRef(null);
  const mobileCloseRef = useRef(null);

  useScrollLock(mobileVideoOpen);
  useFocusTrap(mobileVideoModalRef, mobileVideoOpen);

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

  return (
    <div className="hero" id="inicio">
      <HeroFireworks />
      <SparkField />
      <HeroPapelPicado />
      <div className="hero__grid">
        <div className="hero__copy">
          <p className="hero__welcome-line hero__enter hero__enter--1">
            <Sparkles size={20} strokeWidth={1.8} aria-hidden="true" />
            {t("hero.bienvenidosEyebrow")}
          </p>
          <h1 className="hero__title hero__enter hero__enter--1" tabIndex={-1} ref={titleRef}>
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
    </div>
  );
}
