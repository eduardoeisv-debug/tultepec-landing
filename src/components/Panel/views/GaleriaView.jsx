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

// Cuántas fotos se montan de entrada (y cuántas más por cada tanda) --
// no las 45 de un jalón: bajo red lenta, 45 <img> compitiendo a la vez
// por ancho de banda es justo lo que se sentía como "llegan
// desordenadas, con huecos". El centinela de abajo del todo (ver
// IntersectionObserver más abajo) pide la siguiente tanda solo cuando
// de verdad se acerca al borde de la pantalla.
const PAGE_SIZE = 12;

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
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const bodyRef = useRef(null);
  const touchStartX = useRef(null);
  const lightboxCloseRef = useRef(null);
  const lightboxRef = useRef(null);
  const centinelaRef = useRef(null);

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
  const visiblePhotos = useMemo(() => filteredPhotos.slice(0, visibleCount), [filteredPhotos, visibleCount]);

  useEffect(() => {
    setPhotoIndex(0);
    setVisibleCount(PAGE_SIZE);
  }, [chip]);

  // Centinela: en cuanto entra al viewport (rootMargin la adelanta un
  // poco, antes de que de verdad se vea), pide PAGE_SIZE fotos más --
  // mismo patrón de "cargar conforme se necesita" que loading="lazy" en
  // las imágenes, pero para las propias <button>/<img> de la cuadrícula.
  useEffect(() => {
    const nodo = centinelaRef.current;
    if (!nodo || visibleCount >= filteredPhotos.length) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisibleCount((n) => Math.min(n + PAGE_SIZE, filteredPhotos.length));
      },
      { rootMargin: "400px" }
    );
    obs.observe(nodo);
    return () => obs.disconnect();
  }, [visibleCount, filteredPhotos.length]);

  const { register: registerChip, onKeyDown: chipKeyDown } = useArrowNavigation({
    count: CHIPS.length,
    orientation: "horizontal",
  });
  const { register: registerPhoto, onKeyDown: photoKeyDown, focusAt: focusPhotoAt } = useArrowNavigation({
    count: visiblePhotos.length,
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

  // Adelanta la foto siguiente y la anterior (tamaño completo, no la
  // miniatura) en cuanto se abre el visor o se navega dentro de él -- el
  // click en las flechas/el swipe ya las encuentra en caché HTTP, sin
  // esperar a que empiecen a bajar justo en ese momento.
  useEffect(() => {
    if (lightboxIndex === null || filteredPhotos.length < 2) return;
    const siguiente = filteredPhotos[(lightboxIndex + 1) % filteredPhotos.length];
    const anterior = filteredPhotos[(lightboxIndex - 1 + filteredPhotos.length) % filteredPhotos.length];
    new Image().src = siguiente.src;
    new Image().src = anterior.src;
  }, [lightboxIndex, filteredPhotos]);

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
            count: imgStatus === "done" || imgStatus === "partial" ? photos.length : null,
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

            {imgStatus === "loading" && filteredPhotos.length === 0 && (
              <p className="galeria-status">{t("galeria.cargandoFotos")}</p>
            )}

            {imgStatus === "done" && filteredPhotos.length === 0 && (
              <div className="galeria-empty">
                <p>{t("galeria.vacio.titulo")}</p>
                <p className="galeria-empty__sub">{t("galeria.vacio.fotos")}</p>
              </div>
            )}

            {filteredPhotos.length > 0 && (
              <>
                {/* visiblePhotos (de PAGE_SIZE en PAGE_SIZE, ver el centinela de
                    abajo), no las filteredPhotos completas -- bajo red lenta, montar
                    las 45 <img> de un jalón es justo lo que se sentía como "llegan
                    desordenadas, con huecos": todas compitiendo a la vez por ancho
                    de banda. */}
                <div className="galeria-grid" onKeyDown={photoKeyDown(photoIndex, setPhotoIndex)}>
                  {visiblePhotos.map((photo, i) => (
                    <button
                      key={photo.id}
                      type="button"
                      ref={registerPhoto(i)}
                      tabIndex={photoIndex === i ? 0 : -1}
                      className="galeria-thumb"
                      onClick={() => goToLightbox(i)}
                      aria-label={t("galeria.verFoto", { n: i + 1, total: filteredPhotos.length })}
                    >
                      {/* thumbSrc/thumb2xSrc (400/800px, ver useGaleriaImages.js) en vez
                          de photo.src (hasta 1280px, para el visor ampliado) -- cargar
                          el tamaño completo en una celda de 130px era puro desperdicio.
                          Las primeras 9 (las 3 filas que ya se ven sin hacer scroll en
                          casi cualquier ancho) van "eager" para que no esperen a que el
                          navegador decida que "ya casi están en pantalla"; el resto,
                          "lazy" de verdad. Solo la primera pide fetchpriority alto -- es
                          la única candidata real a LCP de esta vista. */}
                      <img
                        src={photo.thumbSrc}
                        srcSet={`${photo.thumbSrc} 400w, ${photo.thumb2xSrc} 800w`}
                        sizes="130px"
                        width={400}
                        height={400}
                        alt=""
                        loading={i < 9 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={i === 0 ? "high" : undefined}
                        onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
                      />
                    </button>
                  ))}
                </div>

                {visibleCount < filteredPhotos.length && (
                  <div className="galeria-cargar-mas" ref={centinelaRef}>
                    <button type="button" onClick={() => setVisibleCount((n) => Math.min(n + PAGE_SIZE, filteredPhotos.length))}>
                      {t("galeria.cargarMas")}
                    </button>
                  </div>
                )}
              </>
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
            {/* photo.src ya es la versión "completa" (hasta 1200px, ver
                useGaleriaImages.js/optimize-images.mjs) -- no la miniatura de la
                cuadrícula. decoding="async" para no bloquear el hilo principal
                decodificando mientras se monta el visor; no lleva loading="lazy"
                (este <img> solo existe en el DOM mientras el visor está abierto, así
                que "diferir su carga" no tendría a qué esperar). */}
            <img
              key={activeLightboxPhoto.id}
              src={activeLightboxPhoto.src}
              alt=""
              decoding="async"
              onLoad={(e) => e.currentTarget.classList.add("is-loaded")}
            />
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
