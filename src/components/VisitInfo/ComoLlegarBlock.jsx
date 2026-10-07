import { useEffect, useRef, useState } from "react";
import { MapPinned, ExternalLink } from "lucide-react";
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
  {
    Icon: MapPinned,
    title: "Desde la Ciudad de México",
    text: "Alrededor de 40 km, aproximadamente 1 hora por la Autopista México-Pachuca o el Circuito Exterior Mexiquense, según el tráfico.",
  },
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
    </div>
  );
}
