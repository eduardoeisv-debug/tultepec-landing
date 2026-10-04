import { useState } from "react";
import { Play, Flame } from "lucide-react";
import SparkField from "../shared/SparkField.jsx";
import "./Hero.css";

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
          <ul className="hero__list hero__enter hero__enter--4">
            <li className="hero__list-item">
              <a className="hero__list-link" href="#tradiciones">
                <Play className="hero__list-bullet hero__list-bullet--fire" size={14} strokeWidth={0} fill="currentColor" aria-hidden="true" />
                <span>Explora la historia</span>
              </a>
            </li>
            <li className="hero__list-item">
              <a className="hero__list-link" href="#voces">
                <Play className="hero__list-bullet hero__list-bullet--gold" size={14} strokeWidth={0} fill="currentColor" aria-hidden="true" />
                <span>Conoce los textos de "Memorias de mi pueblo"</span>
              </a>
            </li>
            <li className="hero__list-item">
              <span className="hero__tooltip-wrap">
                <button type="button" className="hero__list-link" onClick={onOpenBooks}>
                  <Play className="hero__list-bullet hero__list-bullet--terracotta" size={14} strokeWidth={0} fill="currentColor" aria-hidden="true" />
                  <span>Compendios</span>
                </button>
                <span className="hero__tooltip" role="tooltip">
                  Conoce los 3 libros ya publicados sobre la historia de Tultepec
                </span>
              </span>
            </li>
          </ul>
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
