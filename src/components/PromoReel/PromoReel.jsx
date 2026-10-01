import { useState } from "react";
import PapelPicadoDivider from "../shared/PapelPicadoDivider.jsx";
import useReveal from "../../hooks/useReveal.js";
import "./PromoReel.css";

// Posiciones fijas (no aleatorias en cada render) para que la escena no
// "salte" entre renders de React.
const STARS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: 4 + ((i * 61) % 92),
  y: 3 + ((i * 37) % 50),
  delay: (i * 0.55) % 5,
  size: 1.4 + (i % 3) * 0.7,
}));

const FIREWORKS = [
  { id: 0, x: 190, y: 100, color: "var(--color-gold)", delay: 0 },
  { id: 1, x: 650, y: 72, color: "var(--color-fire-red)", delay: 1.6 },
  { id: 2, x: 990, y: 118, color: "var(--color-gold-light)", delay: 3.1 },
];

function FireworkBurst({ x, y, color, delay }) {
  const rays = Array.from({ length: 10 }, (_, i) => {
    const angle = (i / 10) * Math.PI * 2;
    const x2 = Math.cos(angle) * 34;
    const y2 = Math.sin(angle) * 34;
    return (
      <line key={i} x1={0} y1={0} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeLinecap="round" />
    );
  });

  return (
    <g transform={`translate(${x},${y})`}>
      <g className="promo-reel__burst" style={{ animationDelay: `${delay}s` }}>
        {rays}
        <circle r="5" fill={color} />
      </g>
    </g>
  );
}

// Escena animada e ilustrada (SVG + CSS, sin video real ni librerías de
// animación) pensada como una "postal en movimiento" de la feria de
// Tultepec: cohetes, castillo con rueda de fuego, torito corriendo y
// papel picado. Puramente decorativa -- aria-hidden -- con un botón real
// para pausarla, ya que se mueve de forma continua.
export default function PromoReel() {
  const ref = useReveal();
  const [playing, setPlaying] = useState(true);

  return (
    <section className="promo-reel" ref={ref}>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Vívelo en persona</span>
          <h2>El cielo se enciende en cada fiesta</h2>
          <p>
            Castillos que trepan al cielo, toritos que corren entre chispas y calles vestidas de
            papel picado: así se siente Tultepec cuando llega su feria. Ven a verlo con tus
            propios ojos.
          </p>
        </div>
      </div>

      <div className={`promo-reel__stage reveal ${playing ? "" : "is-paused"}`}>
        <span className="promo-reel__tag">Animación ilustrada</span>

        <svg
          className="promo-reel__svg"
          viewBox="0 0 1200 480"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="promoSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-night-950)" />
              <stop offset="65%" stopColor="var(--color-night-900)" />
              <stop offset="100%" stopColor="var(--color-night-800)" />
            </linearGradient>
            <radialGradient id="promoGlow" cx="50%" cy="100%" r="75%">
              <stop offset="0%" stopColor="rgba(227,171,61,0.35)" />
              <stop offset="100%" stopColor="rgba(227,171,61,0)" />
            </radialGradient>
          </defs>

          <rect x="0" y="0" width="1200" height="480" fill="url(#promoSky)" />

          {STARS.map((s) => (
            <circle
              key={s.id}
              className="promo-reel__star"
              cx={(s.x / 100) * 1200}
              cy={(s.y / 100) * 480}
              r={s.size}
              style={{ animationDelay: `${s.delay}s` }}
            />
          ))}

          {FIREWORKS.map((f) => (
            <FireworkBurst key={f.id} {...f} />
          ))}

          <ellipse cx="860" cy="430" rx="280" ry="100" fill="url(#promoGlow)" />

          {/* silueta del pueblo */}
          <g fill="var(--color-night-950)">
            <rect x="0" y="360" width="1200" height="120" />
            <path d="M30,360 L30,318 L86,318 L86,360 Z" />
            <path d="M104,360 L104,296 L168,296 L168,360 Z" />
            <path d="M560,360 L560,260 L600,260 L600,222 L620,222 L620,260 L640,260 L640,360 Z" />
            <rect x="585" y="196" width="10" height="26" />
            <path d="M579,196 L601,196 L590,180 Z" />
            <path d="M995,360 L995,308 L1058,308 L1058,360 Z" />
            <path d="M1078,360 L1078,328 L1122,328 L1122,360 Z" />
          </g>

          {/* castillo monumental */}
          <g transform="translate(850,210) scale(2.6)">
            <path d="M32 6 L36 20 L28 20 Z" fill="var(--color-gold)" />
            <rect x="29" y="20" width="6" height="30" fill="var(--color-gold)" />
            <path
              d="M18 50 L32 24 L46 50 Z"
              stroke="var(--color-gold)"
              strokeWidth="1.8"
              strokeLinejoin="round"
              fill="none"
            />
            <g className="promo-reel__wheel">
              <circle cx="32" cy="34" r="3" fill="var(--color-fire-red)" />
              <line x1="32" y1="34" x2="32" y2="26" stroke="var(--color-fire-red)" strokeWidth="1.4" />
              <line x1="32" y1="34" x2="38" y2="38" stroke="var(--color-fire-red)" strokeWidth="1.4" />
              <line x1="32" y1="34" x2="26" y2="38" stroke="var(--color-fire-red)" strokeWidth="1.4" />
            </g>
            <circle cx="24" cy="44" r="2.4" fill="var(--color-fire-red)" />
            <circle cx="40" cy="44" r="2.4" fill="var(--color-fire-red)" />
            <line x1="8" y1="58" x2="56" y2="58" stroke="var(--color-gold)" strokeWidth="1.8" strokeLinecap="round" />

            {Array.from({ length: 5 }).map((_, i) => (
              <circle
                key={i}
                className="promo-reel__castillo-spark"
                cx="32"
                cy="16"
                r="1.6"
                style={{ animationDelay: `${i * 0.5}s`, "--sx": `${(i - 2) * 10}px` }}
              />
            ))}
          </g>

          {/* multitud de la feria */}
          <g fill="var(--color-night-950)">
            {Array.from({ length: 24 }).map((_, i) => (
              <circle key={i} cx={10 + i * 50} cy={470} r="16" />
            ))}
          </g>

          {/* torito corriendo */}
          <g className="promo-reel__torito-track">
            <g transform="translate(0,385) scale(1.5)">
              <path
                d="M14 40 C14 30 22 24 32 24 C42 24 50 30 50 40 C50 46 44 50 32 50 C20 50 14 46 14 40 Z"
                stroke="var(--color-fire-red)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="var(--color-terracotta-dark)"
              />
              <path
                d="M20 26 L14 16 M44 26 L50 16"
                stroke="var(--color-fire-red)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="24" cy="36" r="2" fill="var(--color-gold)" />
              <circle cx="40" cy="36" r="2" fill="var(--color-gold)" />
              <path
                d="M28 44 Q32 47 36 44"
                stroke="var(--color-fire-red)"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />

              {Array.from({ length: 4 }).map((_, i) => (
                <circle
                  key={i}
                  className="promo-reel__torito-spark"
                  cx={10 - i * 8}
                  cy={40 + (i % 2) * 6}
                  r="2"
                  style={{ animationDelay: `${i * 0.18}s` }}
                />
              ))}
            </g>
          </g>
        </svg>

        <div className="promo-reel__banner">
          <PapelPicadoDivider />
        </div>

        <div className="promo-reel__overlay">
          <a className="btn btn--primary" href="#tradiciones">
            Descubre cómo vivirlo
          </a>
        </div>

        <button
          type="button"
          className="promo-reel__toggle"
          onClick={() => setPlaying((p) => !p)}
          aria-pressed={!playing}
        >
          {playing ? "Pausar animación" : "Reanudar animación"}
        </button>
      </div>
    </section>
  );
}
