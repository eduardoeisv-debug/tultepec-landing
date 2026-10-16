import { useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import useFocusTrap from "../../../hooks/useFocusTrap.js";
import useScrollLock from "../../../hooks/useScrollLock.js";
import useArrowNavigation from "../../../hooks/useArrowNavigation.js";
import useGaleriaImages from "../../../hooks/useGaleriaImages.js";
import useGaleriaVideos from "../../../hooks/useGaleriaVideos.js";
import { CHIPS } from "../../../data/galeria.js";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";
import SegmentedTabs from "../../shared/SegmentedTabs.jsx";
import { TabImagenesIcon, TabVideosIcon } from "../../shared/GaleriaIcons.jsx";
import "../../shared/SegmentedTabs.css";
import "../../shared/GaleriaOverlay.css";

// Lo que antes era GaleriaOverlay.jsx, reubicado como vista del panel:
// mismas pestañas (Imágenes/Videos), mismos chips de categoría, misma
// cuadrícula y el mismo visor ampliado (lightbox) -- ese sí se queda
// como una capa propia encima de todo (con su propio atrapa-foco y
// Escape), porque sigue siendo una ventana que se abre y se cierra,
// nada más que ya no está anidada dentro de OTRA ventana modal.
export default function GaleriaView() {
  const { t, pick } = useLanguage();
  const [tab, setTab] = useState("imagenes");
  const [chip, setChip] = useState("todas");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [chipIndex, setChipIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const bodyRef = useRef(null);
  const touchStartX = useRef(null);
  const lightboxCloseRef = useRef(null);
  const lightboxRef = useRef(null);

  const { status: imgStatus, photos } = useGaleriaImages(true);
  const { status: vidStatus, videos } = useGaleriaVideos(true);

  useScrollLock(lightboxIndex !== null);
  useFocusTrap(lightboxRef, lightboxIndex !== null);

  // Cambiar de pestaña pausa cualquier video que estuviera reproduciéndose.
  useEffect(() => {
    setPlayingId(null);
  }, [tab]);

  const filteredPhotos = useMemo(
    () => (chip === "todas" ? photos : photos.filter((p) => p.chip === chip)),
    [photos, chip]
  );

  useEffect(() => {
    setPhotoIndex(0);
  }, [chip]);

  const { register: registerChip, onKeyDown: chipKeyDown } = useArrowNavigation({
    count: CHIPS.length,
    orientation: "horizontal",
  });
  const { register: registerPhoto, onKeyDown: photoKeyDown, focusAt: focusPhotoAt } = useArrowNavigation({
    count: filteredPhotos.length,
    orientation: "both",
  });
  const { register: registerVideo, onKeyDown: videoKeyDown } = useArrowNavigation({
    count: videos.length,
    orientation: "both",
  });

  const goToLightbox = (index) => {
    setLightboxIndex(index);
    setPhotoIndex(index);
  };

  // Escape cierra solo el visor ampliado (no toda la vista -- "cerrar"
  // una vista del panel no tiene sentido, solo se navega a otra).
  useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
        return;
      }
      if (e.key === "ArrowRight") goToLightbox((lightboxIndex + 1) % filteredPhotos.length);
      else if (e.key === "ArrowLeft") goToLightbox((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
      else if (e.key === "Home") goToLightbox(0);
      else if (e.key === "End") goToLightbox(filteredPhotos.length - 1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, filteredPhotos.length]);

  const lightboxWasOpen = useRef(false);
  useEffect(() => {
    const isLightboxOpen = lightboxIndex !== null;
    if (isLightboxOpen && !lightboxWasOpen.current) {
      lightboxCloseRef.current?.focus();
    } else if (!isLightboxOpen && lightboxWasOpen.current) {
      focusPhotoAt(photoIndex);
    }
    lightboxWasOpen.current = isLightboxOpen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex]);

  const onLightboxTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onLightboxTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) goToLightbox((lightboxIndex + 1) % filteredPhotos.length);
    else goToLightbox((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const activeLightboxPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  return (
    <div className="panel-view panel-view--anidada">
      <p className="panel-view__subtitulo-anidado">{t("galeria.subtitle")}</p>

      <SegmentedTabs
        idPrefix="galeria"
        ariaLabel={t("galeria.tabs.ariaLabel")}
        activeId={tab}
        onChange={(nextTab) => {
          setTab(nextTab);
          setLightboxIndex(null);
        }}
        tabs={[
          {
            id: "imagenes",
            icon: TabImagenesIcon,
            label: t("galeria.tabs.imagenes"),
            count: imgStatus === "done" ? photos.length : null,
          },
          {
            id: "videos",
            icon: TabVideosIcon,
            label: t("galeria.tabs.videos"),
            count: vidStatus === "done" ? videos.length : null,
          },
        ]}
      />

      <div ref={bodyRef}>
        {tab === "imagenes" && (
          <div className="galeria-panel" role="tabpanel" id="galeria-panel-imagenes" aria-labelledby="galeria-tab-imagenes">
            <div
              className="galeria-chips"
              role="group"
              aria-label={t("galeria.chips.ariaLabel")}
              onKeyDown={chipKeyDown(chipIndex, (i) => {
                setChipIndex(i);
                setChip(CHIPS[i].id);
              })}
            >
              {CHIPS.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  ref={registerChip(i)}
                  tabIndex={chipIndex === i ? 0 : -1}
                  className={`galeria-chip ${chip === c.id ? "is-active" : ""}`}
                  aria-pressed={chip === c.id}
                  onClick={() => {
                    setChipIndex(i);
                    setChip(c.id);
                  }}
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
              <div className="galeria-grid" onKeyDown={photoKeyDown(photoIndex, setPhotoIndex)}>
                {filteredPhotos.map((photo, i) => (
                  <button
                    key={photo.id}
                    type="button"
                    ref={registerPhoto(i)}
                    tabIndex={photoIndex === i ? 0 : -1}
                    className="galeria-thumb"
                    onClick={() => goToLightbox(i)}
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
              <div className="galeria-video-grid" onKeyDown={videoKeyDown(videoIndex, setVideoIndex)}>
                {videos.map((v, i) => {
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
                          ref={registerVideo(i)}
                          tabIndex={videoIndex === i ? 0 : -1}
                          className="galeria-video-poster"
                          onClick={() => {
                            setVideoIndex(i);
                            setPlayingId(v.id);
                          }}
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
          ref={lightboxRef}
          onMouseDown={() => setLightboxIndex(null)}
          onTouchStart={onLightboxTouchStart}
          onTouchEnd={onLightboxTouchEnd}
        >
          <button
            type="button"
            ref={lightboxCloseRef}
            className="galeria-lightbox__close"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setLightboxIndex(null)}
            aria-label={t("common.cerrar")}
          >
            <X size={20} strokeWidth={2.2} />
          </button>

          {filteredPhotos.length > 1 && (
            <button
              type="button"
              className="galeria-lightbox__nav galeria-lightbox__nav--prev"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                goToLightbox((lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
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
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                goToLightbox((lightboxIndex + 1) % filteredPhotos.length);
              }}
              aria-label={t("galeria.fotoSiguiente")}
            >
              <ChevronRight size={24} strokeWidth={2.2} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
