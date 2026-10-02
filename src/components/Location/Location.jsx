import { MapPin, Car, Navigation, ExternalLink } from "lucide-react";
import useReveal from "../../hooks/useReveal.js";
import "./Location.css";

const MAP_EMBED_SRC = "https://www.google.com/maps?q=Tultepec,+Estado+de+M%C3%A9xico&output=embed";
const MAP_DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Tultepec,+Estado+de+M%C3%A9xico";

export default function Location() {
  const ref = useReveal();

  return (
    <section className="location" id="ubicacion" ref={ref}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">Cómo llegar</span>
          <h2>Tultepec está más cerca de lo que crees</h2>
          <p>
            A menos de una hora de la Ciudad de México, en el norte del Estado de México.
            Perfecto para una visita de un día.
          </p>
        </div>

        <div className="location__layout reveal">
          <div className="location__map">
            <iframe
              src={MAP_EMBED_SRC}
              title="Mapa de ubicación de Tultepec, Estado de México"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="location__facts">
            <div className="location-fact">
              <span className="location-fact__icon" aria-hidden="true">
                <MapPin size={20} strokeWidth={1.8} />
              </span>
              <div>
                <strong>Dónde está</strong>
                <p>
                  Tultepec es un municipio del Estado de México, dentro de la zona metropolitana
                  norte del Valle de México.
                </p>
              </div>
            </div>

            <div className="location-fact">
              <span className="location-fact__icon" aria-hidden="true">
                <Car size={20} strokeWidth={1.8} />
              </span>
              <div>
                <strong>En coche desde la Ciudad de México</strong>
                <p>
                  Alrededor de 40 km, aproximadamente 1 hora por la Autopista México-Pachuca o el
                  Circuito Exterior Mexiquense, según el tráfico.
                </p>
              </div>
            </div>

            <div className="location-fact">
              <span className="location-fact__icon" aria-hidden="true">
                <Navigation size={20} strokeWidth={1.8} />
              </span>
              <div>
                <strong>Antes de salir</strong>
                <p>
                  Usa tu GPS el día de tu visita: durante la feria pirotécnica algunas calles
                  cambian de sentido o se cierran al tráfico.
                </p>
              </div>
            </div>

            <a
              className="btn btn--primary location__cta"
              href={MAP_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cómo llegar en Google Maps
              <ExternalLink size={16} strokeWidth={2} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
