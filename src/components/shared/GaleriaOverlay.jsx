import { useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import useScrollLock from "../../hooks/useScrollLock.js";
import useGaleriaImages from "../../hooks/useGaleriaImages.js";
import useGaleriaVideos from "../../hooks/useGaleriaVideos.js";
import { CHIPS } from "../../data/galeria.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import OverlayPapelPicado from "./OverlayPapelPicado.jsx";
import { TabImagenesIcon, TabVideosIcon } from "./GaleriaIcons.jsx";
import "./GaleriaOverlay.css";

const TABS = ["imagenes", "videos"];
const CLOSE_ANIM_MS = 220;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function tabFromHash() {
  return window.location.hash === "#galeria/videos" ? "videos" : "imagenes";
}

// Pantalla única de galería (Imágenes + Videos) abierta desde la tarjeta
// "Imágenes y videos" del hero. Sustituye a los antiguos MediaHubModal +
// GalleryModal + VideoGalleryModal -- un solo overlay con pestañas en vez
// de una cadena de 2-3 modales distintos.
export default function GaleriaOverlay({ open, onClose, triggerRef }) {
  const { t, pick } = useLanguage();
  const [tab, setTab] = useState("imagenes");
  const [chip, setChip] = useState("todas");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef(null);
  const tabRefs = useRef({});
  const touchStartX = useRef(null);

  const { status: imgStatus, photos } = useGaleriaImages(open);
  const { status: vidStatus, videos } = useGaleriaVideos(open);

  useScrollLock(open);

  // Al abrir: toma la pestaña del hash si hay uno (#galeria/videos),
  // reinicia filtros/visor, y limpia cualquier cierre pendiente.
  useEffect(() => {
    if (!open) return;
    setTab(tabFromHash());
    setChip("todas");
    setLightboxIndex(null);
    setPlayingId(null);
    setClosing(false);
  }, [open]);

  // Mantiene el hash sincronizado con la pestaña activa mientras está
  // abierto, para que la URL se pueda compartir directo a una pestaña.
  useEffect(() => {
    if (!open || closing) return;
    const newHash = `#galeria/${tab}`;
    if (window.location.hash !== newHash) {
      history.replaceState(null, "", newHash);
    }
  }, [tab, open, closing]);

  // Cambiar de pestaña pausa cualquier video que estuviera reproduciéndose.
  useEffect(() => {
    setPlayingId(null);
  }, [tab]);

  const finishClose = () => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    onClose();
    triggerRef?.current?.focus();
  };

  const requestClose = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(null);
      return;
    }
    if (prefersReducedMotion()) {
      finishClose();
      return;
    }
    setClosing(true);
    setTimeout(finishClose, CLOSE_ANIM_MS);
  };

  const filteredPhotos = useMemo(
    () => (chip === "todas" ? photos : photos.filter((p) => p.chip === chip)),
    [photos, chip]
  );

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        requestClose();
        return;
      }
      if (lightboxIndex !== null) {
        if (e.key === "ArrowRight") setLightboxIndex((i) => (i + 1) % filteredPhotos.length);
        else if (e.key === "ArrowLeft") setLightboxIndex((i) => (i - 1 + filteredPhotos.length) % filteredPhotos.length);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    if (lightboxIndex === null) dialogRef.current?.focus();

    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lightboxIndex, filteredPhotos.length]);

  if (!open) return null;

  const goToTab = (nextTab) => {
    setTab(nextTab);
    setLightboxIndex(null);
    tabRefs.current[nextTab]?.focus();
  };

  const onTabsKeyDown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const idx = TABS.indexOf(tab);
      const nextIdx = e.key === "ArrowRight" ? (idx + 1) % TABS.length : (idx - 1 + TABS.length) % TABS.length;
      goToTab(TABS[nextIdx]);
    }
  };

  const onLightboxTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onLightboxTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) setLightboxIndex((i) => (i + 1) % filteredPhotos.length);
    else setLightboxIndex((i) => (i - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const activeLightboxPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <div
      className={`galeria-overlay__backdrop ${closing ? "is-closing" : ""}`}
      onMouseDown={requestClose}
    >
      <div
        className={`galeria-overlay ${closing ? "is-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="galeria-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <OverlayPapelPicado />

        <button type="button" className="galeria-overlay__close" onClick={requestClose} aria-label={t("common.cerrar")}>
          <X size={20} strokeWidth={2.2} />
        </button>

        <header className="galeria-overlay__head">
          <h2 id="galeria-title">{t("galeria.title")}</h2>
          <p>{t("galeria.subtitle")}</p>
        </header>

        <div className="galeria-tabs" role="tablist" aria-label={t("galeria.tabs.ariaLabel")} onKeyDown={onTabsKeyDown}>
          <span className={`galeria-tabs__indicator ${tab === "videos" ? "is-videos" : ""}`} aria-hidden="true" />
          <button
            type="button"
            role="tab"
            id="galeria-tab-imagenes"
            aria-selected={tab === "imagenes"}
            aria-controls="galeria-panel-imagenes"
            tabIndex={tab === "imagenes" ? 0 : -1}
            ref={(el) => (tabRefs.current.imagenes = el)}
            className={`galeria-tab ${tab === "imagenes" ? "is-active" : ""}`}
            onClick={() => goToTab("imagenes")}
          >
            <TabImagenesIcon width={18} height={18} />
            {t("galeria.tabs.imagenes")}
            {imgStatus === "done" && <span className="galeria-tab__count">· {photos.length}</span>}
          </button>
          <button
            type="button"
            role="tab"
            id="galeria-tab-videos"
            aria-selected={tab === "videos"}
            aria-controls="galeria-panel-videos"
            tabIndex={tab === "videos" ? 0 : -1}
            ref={(el) => (tabRefs.current.videos = el)}
            className={`galeria-tab ${tab === "videos" ? "is-active" : ""}`}
            onClick={() => goToTab("videos")}
          >
            <TabVideosIcon width={18} height={18} />
            {t("galeria.tabs.videos")}
            {vidStatus === "done" && <span className="galeria-tab__count">· {videos.length}</span>}
          </button>
        </div>

        <div className="galeria-overlay__body">
          {tab === "imagenes" && (
            <div className="galeria-panel" role="tabpanel" id="galeria-panel-imagenes" aria-labelledby="galeria-tab-imagenes">
              <div className="galeria-chips" role="group" aria-label={t("galeria.chips.ariaLabel")}>
                {CHIPS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`galeria-chip ${chip === c.id ? "is-active" : ""}`}
                    aria-pressed={chip === c.id}
                    onClick={() => setChip(c.id)}
                  >
                    {pick(c.label)}
                  </button>
                ))}
              </div>

              {imgStatus === "loading" && <p className="galeria-status">{t("galeria.cargandoFotos")}</p>}

              {imgStatus === "done" && filteredPhotos.length === 0 && (
                <div className="galeria-empty">
                  <p>{t("galeria.vacio.titulo")}</p>
                  <p className="galeria-empty__sub">{t("galeria.vacio.fotos")}</p>
                </div>
              )}

              {imgStatus === "done" && filteredPhotos.length > 0 && (
                <div className="galeria-grid">
                  {filteredPhotos.map((photo, i) => (
                    <button
                      key={photo.id}
                      type="button"
                      className="galeria-thumb"
                      onClick={() => setLightboxIndex(i)}
                      aria-label={t("galeria.verFoto", { n: i + 1, total: filteredPhotos.length })}
                    >
                      <img src={photo.src} alt="" loading="lazy" onLoad={(e) => e.currentTarget.classList.add("is-loaded")} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "videos" && (
            <div className="galeria-panel" role="tabpanel" id="galeria-panel-videos" aria-labelledby="galeria-tab-videos">
              {vidStatus === "loading" && <p className="galeria-status">{t("galeria.cargandoVideos")}</p>}

              {vidStatus === "done" && videos.length === 0 && (
                <div className="galeria-empty">
                  <p>{t("galeria.vacio.titulo")}</p>
                  <p className="galeria-empty__sub">{t("galeria.vacio.videos")}</p>
                </div>
              )}

              {vidStatus === "done" && videos.length > 0 && (
                <div className="galeria-video-grid">
                  {videos.map((v) => {
                    const title = v.meta?.titulo ? pick(v.meta.titulo) : pick(v.categoryLabel);
                    const desc = v.meta?.descripcion ? pick(v.meta.descripcion) : null;
                    return (
                      <div className="galeria-video-card" key={v.id}>
                        {playingId === v.id ? (
                          <video
                            className="galeria-video-el"
                            src={v.src}
                            controls
                            autoPlay
                            playsInline
                            onEnded={() => setPlayingId(null)}
                          />
                        ) : (
                          <button
                            type="button"
                            className="galeria-video-poster"
                            onClick={() => setPlayingId(v.id)}
                            aria-label={t("galeria.reproducir", { titulo: title })}
                          >
                            <span className="galeria-video-play">
                              <Play size={24} strokeWidth={0} fill="currentColor" />
                            </span>
                            <span className="galeria-video-info">
                              <span className="galeria-video-title">{title}</span>
                              {desc && <span className="galeria-video-desc">{desc}</span>}
                              {v.meta?.duracion && <span className="galeria-video-duration">{v.meta.duracion}</span>}
                            </span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {activeLightboxPhoto && (
          <div
            className="galeria-lightbox"
            onMouseDown={() => setLightboxIndex(null)}
            onTouchStart={onLightboxTouchStart}
            onTouchEnd={onLightboxTouchEnd}
          >
            <button
              type="button"
              className="galeria-lightbox__close"
              onClick={() => setLightboxIndex(null)}
              aria-label={t("common.cerrar")}
            >
              <X size={20} strokeWidth={2.2} />
            </button>

            {filteredPhotos.length > 1 && (
              <button
                type="button"
                className="galeria-lightbox__nav galeria-lightbox__nav--prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i - 1 + filteredPhotos.length) % filteredPhotos.length);
                }}
                aria-label={t("galeria.fotoAnterior")}
              >
                <ChevronLeft size={24} strokeWidth={2.2} />
              </button>
            )}

            <figure className="galeria-lightbox__stage" onMouseDown={(e) => e.stopPropagation()}>
              <img src={activeLightboxPhoto.src} alt="" />
              <figcaption>
                {activeLightboxPhoto.meta?.titulo ? pick(activeLightboxPhoto.meta.titulo) : pick(activeLightboxPhoto.categoryLabel)}
                {activeLightboxPhoto.meta?.descripcion && <span> — {pick(activeLightboxPhoto.meta.descripcion)}</span>}
                {activeLightboxPhoto.meta?.creditos && (
                  <span className="galeria-lightbox__credit"> · {pick(activeLightboxPhoto.meta.creditos)}</span>
                )}
              </figcaption>
              <span className="galeria-lightbox__counter">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
            </figure>

            {filteredPhotos.length > 1 && (
              <button
                type="button"
                className="galeria-lightbox__nav galeria-lightbox__nav--next"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((i) => (i + 1) % filteredPhotos.length);
                }}
                aria-label={t("galeria.fotoSiguiente")}
              >
                <ChevronRight size={24} strokeWidth={2.2} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
