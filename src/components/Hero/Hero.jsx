import { useState } from "react";
import { ScrollText, Play, Flame } from "lucide-react";
import SparkField from "../shared/SparkField.jsx";
import "./Hero.css";

const BookIcon = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M4 5c2-1 5-1 7 .5V19c-2-1.5-5-1.5-7-.5V5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <path
      d="M20 5c-2-1-5-1-7 .5V19c2-1.5 5-1.5 7-.5V5Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Hero({ onOpenBooks }) {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="hero" id="inicio">
      <SparkField />
      <div className="container hero__grid">
        <div className="hero__copy">
          <span className="eyebrow eyebrow--light hero__enter hero__enter--1">
            Tultepec, Estado de México
          </span>
          <h1 className="hero__title hero__enter hero__enter--2">
            Capital de la <span>Pirotecnia</span>
          </h1>
          <p className="hero__subtitle hero__enter hero__enter--3">
            Tultepec, reconocido como la capital mundial de la pirotecnia, no fabrica pólvora:
            transforma el fuego en arte multicolor. Sus tradicionales castillos y toritos son
            parte de un oficio artesanal que las familias de la comunidad han preservado y
            transmitido por generaciones.
          </p>
          <div className="hero__actions hero__enter hero__enter--4">
            <a className="btn btn--primary" href="#tradiciones">
              Explora la historia
            </a>
          </div>

          <div className="hero__links hero__enter hero__enter--5">
            <a className="hero__link" href="#voces">
              <span className="hero__link-icon">
                <ScrollText size={16} strokeWidth={1.8} />
              </span>
              <span className="hero__link-text">Conoce los textos de "Memorias de mi pueblo"</span>
            </a>
            <span className="hero__links-divider" aria-hidden="true" />
            <span className="hero__tooltip-wrap">
              <button type="button" className="hero__link" onClick={onOpenBooks}>
                <span className="hero__link-icon">{BookIcon}</span>
                <span className="hero__link-text">Compendios</span>
              </button>
              <span className="hero__tooltip" role="tooltip">
                Conoce los 3 libros ya publicados sobre la historia de Tultepec
              </span>
            </span>
          </div>
        </div>

        <div className="hero__visual hero__visual--enter">
          <div className="hero__video">
            {playing ? (
              <video
                className="hero__video-el"
                src="/video/bienvenida.mp4"
                controls
                autoPlay
                playsInline
                preload="none"
              />
            ) : (
              <button
                type="button"
                className="hero__video-poster"
                onClick={() => setPlaying(true)}
                aria-label="Reproducir video de bienvenida a Tultepec"
              >
                <span className="hero__video-ring hero__video-ring--1" aria-hidden="true" />
                <span className="hero__video-ring hero__video-ring--2" aria-hidden="true" />
                <Flame className="hero__video-flame" size={22} strokeWidth={1.5} aria-hidden="true" />
                <span className="hero__video-play" aria-hidden="true">
                  <Play size={26} strokeWidth={0} fill="currentColor" />
                </span>
                <span className="hero__video-label">Dale play</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
