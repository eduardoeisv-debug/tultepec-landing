import { useEffect, useRef, useState } from "react";
import { MapPinned, ExternalLink, Navigation } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./ComoLlegarBlock.css";

// Coordenadas del centro del municipio de Tultepec, Estado de México
// (cabecera municipal), según Wikipedia/INEGI, como par lat/lon para el
// embed de OpenStreetMap (que no requiere clave de pago).
const LAT = 19.6787;
const LON = -99.1135;
const BBOX = "-99.155,19.655,-99.075,19.705";
const OSM_EMBED_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik&marker=${LAT}%2C${LON}`;
const GOOGLE_MAPS_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=Tultepec,+Estado+de+M%C3%A9xico";

// TODO: "En auto" y "En transporte público" se ocultaron (solo tenían
// "Próximamente", sin dato real) -- cuando haya info real de rutas y
// tiempos, vuelve a agregarlas aquí con su Icon (Car / Bus de
// lucide-react) y quita el `grid-template-columns` de una sola columna
// en ComoLlegarBlock.css. "Desde la Ciudad de México" sí tiene dato
// real y se deja sola, a ancho completo.
const LLEGAR_CARDS = [
  { Icon: MapPinned, titleKey: "comoLlegar.card.cdmx.title", textKey: "comoLlegar.card.cdmx.text" },
];

export default function ComoLlegarBlock() {
  const { t } = useLanguage();
  const mapWrapRef = useRef(null);
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    const el = mapWrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setMapVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMapVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="como-llegar">
      <div className="visit-info__block-head">
        <span className="visit-info__block-icon visit-info__block-icon--alt" aria-hidden="true">
          <Navigation size={20} strokeWidth={1.8} />
        </span>
        <h3>{t("comoLlegar.heading")}</h3>
      </div>
      <p className="como-llegar__intro">{t("comoLlegar.intro")}</p>

      <div className="como-llegar__map" ref={mapWrapRef}>
        {mapVisible ? (
          <iframe
            title={t("comoLlegar.mapTitle")}
            src={OSM_EMBED_SRC}
            loading="lazy"
          />
        ) : (
          <div className="como-llegar__map-placeholder" aria-hidden="true" />
        )}
      </div>

      <div className="como-llegar__actions">
        <a
          className="btn btn--gold"
          href={GOOGLE_MAPS_DIRECTIONS}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("comoLlegar.comoLlegar")}
          <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
        </a>
      </div>

      <div className="como-llegar__cards">
        {LLEGAR_CARDS.map(({ Icon, titleKey, textKey }) => (
          <div className="como-llegar__card" key={titleKey}>
            <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
            <h4>{t(titleKey)}</h4>
            <p>{t(textKey)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
