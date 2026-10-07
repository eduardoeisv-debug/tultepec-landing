import { useEffect, useRef, useState } from "react";
import { Car, Bus, MapPinned, Sun, Footprints, ShieldAlert, Navigation, ExternalLink } from "lucide-react";
import "./ComoLlegarBlock.css";

// Coordenadas del centro del municipio de Tultepec, Estado de México
// (cabecera municipal), según Wikipedia/INEGI -- mismo lugar que ya usa
// el mapa de Google en src/components/Location, solo que aquí se
// necesitan como par lat/lon para el embed de OpenStreetMap (que no
// requiere clave de pago).
const LAT = 19.6787;
const LON = -99.1135;
const BBOX = "-99.155,19.655,-99.075,19.705";
const OSM_EMBED_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik&marker=${LAT}%2C${LON}`;
const GOOGLE_MAPS_VIEW = "https://www.google.com/maps?q=Tultepec,+Estado+de+M%C3%A9xico";
const GOOGLE_MAPS_DIRECTIONS =
  "https://www.google.com/maps/dir/?api=1&destination=Tultepec,+Estado+de+M%C3%A9xico";

const LLEGAR_CARDS = [
  { Icon: Car, title: "En auto", text: "POR VERIFICAR" },
  { Icon: Bus, title: "En transporte público", text: "POR VERIFICAR" },
  {
    Icon: MapPinned,
    title: "Desde la Ciudad de México",
    text: "Alrededor de 40 km, aproximadamente 1 hora por la Autopista México-Pachuca o el Circuito Exterior Mexiquense, según el tráfico.",
  },
];

const TIPS = [
  { Icon: Sun, title: "Clima", text: "POR VERIFICAR" },
  { Icon: Footprints, title: "Calzado", text: "POR VERIFICAR" },
  {
    Icon: Navigation,
    title: "Antes de salir",
    text: "Usa tu GPS el día de tu visita: durante la feria pirotécnica algunas calles cambian de sentido o se cierran al tráfico.",
  },
  { Icon: ShieldAlert, title: "Seguridad en las quemas", text: "POR VERIFICAR" },
];

export default function ComoLlegarBlock() {
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
      <p className="como-llegar__intro">
        Tultepec es un municipio del Estado de México, dentro de la zona metropolitana norte del
        Valle de México: a menos de una hora de la Ciudad de México, perfecto para una visita de
        un día.
      </p>

      <div className="como-llegar__map" ref={mapWrapRef}>
        {mapVisible ? (
          <iframe
            title="Mapa de Tultepec, Estado de México"
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
          Cómo llegar
          <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
        </a>
        <a
          className="btn btn--ghost como-llegar__ghost-btn"
          href={GOOGLE_MAPS_VIEW}
          target="_blank"
          rel="noopener noreferrer"
        >
          Abrir en Google Maps
          <ExternalLink size={16} strokeWidth={2} aria-hidden="true" />
        </a>
      </div>

      <div className="como-llegar__cards">
        {LLEGAR_CARDS.map(({ Icon, title, text }) => (
          <div className="como-llegar__card" key={title}>
            <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
            <h4>{title}</h4>
            <p>{text}</p>
          </div>
        ))}
      </div>

      <div className="como-llegar__tips">
        <h4 className="como-llegar__tips-title">Consejos de visita</h4>
        <div className="como-llegar__tips-grid">
          {TIPS.map(({ Icon, title, text }) => (
            <div className="como-llegar__tip" key={title}>
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
