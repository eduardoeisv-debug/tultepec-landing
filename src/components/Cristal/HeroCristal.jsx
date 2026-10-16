import { useRef, useState } from "react";
import { Sparkles, Play } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import VideoBienvenidaModal from "../shared/VideoBienvenidaModal.jsx";
import "./HeroCristal.css";

// Pantalla principal de Inicio: el mismo relato de siempre (eyebrow +
// título + párrafo de presentación, hero.bienvenidosEyebrow/title/
// subtitle -- textos que ya existían en i18n, sin usarse desde que el
// Hero.jsx viejo se dejó de montar) más una portada grande del video
// de bienvenida en vez del acceso chico de antes. Abre el mismo
// VideoBienvenidaModal.jsx que usa el acceso rápido de abajo.
export default function HeroCristal({ titleRef }) {
  const { t } = useLanguage();
  const [videoAbierto, setVideoAbierto] = useState(false);
  const triggerRef = useRef(null);

  return (
    <div className="cristal-hero">
      <div className="cristal-hero__texto">
        <p className="cristal-hero__eyebrow">
          <Sparkles size={18} strokeWidth={1.8} aria-hidden="true" />
          {t("hero.bienvenidosEyebrow")}
        </p>
        <h1 className="cristal-hero__titulo" tabIndex={-1} ref={titleRef}>
          {t("hero.title.line1")} <span>{t("hero.title.line2")}</span>
        </h1>
        <p className="cristal-hero__subtitulo">{t("hero.subtitle")}</p>
      </div>

      <button
        type="button"
        ref={triggerRef}
        className="cristal-hero__video"
        onClick={() => setVideoAbierto(true)}
        aria-label={t("hero.video.ariaLabel")}
      >
        <span className="cristal-hero__video-play" aria-hidden="true">
          <Play size={28} strokeWidth={0} fill="currentColor" />
        </span>
        <span className="cristal-hero__video-texto">
          <span className="cristal-hero__video-titulo">{t("hero.verBienvenida")}</span>
          <span className="cristal-hero__video-caption">{t("hero.videoCaption")}</span>
        </span>
      </button>

      <VideoBienvenidaModal open={videoAbierto} onClose={() => setVideoAbierto(false)} triggerRef={triggerRef} />
    </div>
  );
}
