import { useState } from "react";
import { Play, Flame } from "lucide-react";
import useReveal from "../../hooks/useReveal.js";
import "./WelcomeVideo.css";

export default function WelcomeVideo() {
  const ref = useReveal();
  const [playing, setPlaying] = useState(false);

  return (
    <section className="welcome-video" ref={ref}>
      <div className="container welcome-video__layout">
        <div className="welcome-video__copy reveal">
          <span className="eyebrow">Tultepec te espera</span>
          <h2>Ven a vivir la fiesta del fuego</h2>
          <p>
            Un vistazo rápido a lo que se siente estar aquí cuando arden los castillos y el
            pueblo entero sale a celebrar. Dale play y entérate de por qué la gente regresa
            año tras año.
          </p>
        </div>

        <div className="welcome-video__player reveal">
          {playing ? (
            <video
              className="welcome-video__video"
              src="/video/bienvenida.mp4"
              controls
              autoPlay
              playsInline
              preload="none"
            />
          ) : (
            <button
              type="button"
              className="welcome-video__poster"
              onClick={() => setPlaying(true)}
              aria-label="Reproducir video de bienvenida a Tultepec"
            >
              <span className="welcome-video__ring welcome-video__ring--1" aria-hidden="true" />
              <span className="welcome-video__ring welcome-video__ring--2" aria-hidden="true" />
              <Flame className="welcome-video__flame" size={22} strokeWidth={1.5} aria-hidden="true" />
              <span className="welcome-video__play" aria-hidden="true">
                <Play size={26} strokeWidth={0} fill="currentColor" />
              </span>
              <span className="welcome-video__cta-label">Dale play</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
