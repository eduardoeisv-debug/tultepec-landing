import { useEffect, useRef } from "react";
import { X, Camera, Video as VideoIcon } from "lucide-react";
import useCoverImage from "../../hooks/useCoverImage.js";
import useCoverVideo from "../../hooks/useCoverVideo.js";
import useScrollLock from "../../hooks/useScrollLock.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import MosaicTile from "./MosaicTile.jsx";
import "./MediaHubModal.css";

function HubTile({ category, icon, tone, large, mediaType, coverPath, onSelect }) {
  const { t, pick } = useLanguage();
  const hasImage = useCoverImage(mediaType === "image" ? coverPath : null);
  const hasVideo = useCoverVideo(mediaType === "video" ? coverPath : null);
  const hasMedia = mediaType === "image" ? hasImage : hasVideo;

  return (
    <MosaicTile
      icon={icon}
      label={pick(category.label)}
      tone={tone}
      large={large}
      hasMedia={hasMedia}
      badgeIcon={mediaType === "video" ? VideoIcon : Camera}
      badgeTitle={mediaType === "video" ? t("mediaHub.badge.verVideos") : t("mediaHub.badge.verFotos")}
      onClick={() => onSelect(category.slug)}
    />
  );
}

// Pantalla con la cuadrícula de categorías (castillos, toritos, etc.) para
// imágenes o para video, según `mediaType`. Al elegir una categoría, llama
// a `onSelect(slug)` -- quien lo use decide qué modal de detalle abrir.
export default function MediaHubModal({
  open,
  onClose,
  eyebrow,
  title,
  description,
  categories,
  icons,
  tones,
  coverFn,
  mediaType,
  onSelect,
}) {
  const { t } = useLanguage();
  const dialogRef = useRef(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="media-hub__backdrop" onMouseDown={onClose}>
      <div
        className="media-hub"
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-hub-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="media-hub__close" onClick={onClose} aria-label={t("common.cerrar")}>
          <X size={18} strokeWidth={2} />
        </button>

        <span className="eyebrow">{eyebrow}</span>
        <h3 id="media-hub-title">{title}</h3>
        {description && <p className="media-hub__description">{description}</p>}

        <div className="media-hub__grid">
          {categories.map((cat, i) => (
            <HubTile
              key={cat.slug}
              category={cat}
              icon={icons[cat.slug]}
              tone={tones[cat.slug]}
              large={i === 0}
              mediaType={mediaType}
              coverPath={coverFn(cat.slug)}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
