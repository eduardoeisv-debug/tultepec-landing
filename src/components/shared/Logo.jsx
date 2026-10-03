// Insignia de Tultepec: mascota tierna de torito (estilo caricatura,
// dibujada a mano en SVG) con el nombre del pueblo en el borde.
const DOTS = Array.from({ length: 30 }, (_, i) => {
  const angle = (i / 30) * Math.PI * 2;
  return {
    cx: 100 + Math.cos(angle) * 95,
    cy: 100 + Math.sin(angle) * 95,
  };
});

const HIDE = "#2a1c12";
const BODY = "#c98a52";
const MUZZLE = "#e8c192";
const HORN = "#eee6da";

export default function Logo({ size = 44, className }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="logoBg" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="var(--color-paper)" />
          <stop offset="100%" stopColor="var(--color-gold-light)" />
        </radialGradient>
      </defs>

      {/* borde punteado, como una insignia de tela */}
      <circle cx="100" cy="100" r="98" fill="var(--color-night-950)" />
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="3.2" fill="var(--color-gold)" />
      ))}

      {/* fondo cálido */}
      <circle cx="100" cy="100" r="86" fill="url(#logoBg)" />

      {/* cuerpo / hombros */}
      <path
        d="M56 150 C56 128 74 116 100 116 C126 116 144 128 144 150 L144 162 L56 162 Z"
        fill={BODY}
        stroke={HIDE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* paliacate */}
      <path
        d="M72 144 L100 166 L128 144 L121 136 L100 152 L79 136 Z"
        fill="var(--color-fire-red)"
        stroke={HIDE}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* orejas */}
      <ellipse cx="66" cy="94" rx="9" ry="13" fill={BODY} stroke={HIDE} strokeWidth="3" transform="rotate(-25 66 94)" />
      <ellipse cx="134" cy="94" rx="9" ry="13" fill={BODY} stroke={HIDE} strokeWidth="3" transform="rotate(25 134 94)" />

      {/* cabeza */}
      <path
        d="M66 97 C 58 118 64 140 100 144 C 136 140 142 118 134 97 C 124 80 76 80 66 97 Z"
        fill={BODY}
        stroke={HIDE}
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* cuernos: tubo grueso curvado, con contorno negro detrás */}
      <path d="M78 96 Q 38 80 46 32" stroke={HIDE} strokeWidth="20" strokeLinecap="round" fill="none" />
      <path d="M78 96 Q 38 80 46 32" stroke={HORN} strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M122 96 Q 162 80 154 32" stroke={HIDE} strokeWidth="20" strokeLinecap="round" fill="none" />
      <path d="M122 96 Q 162 80 154 32" stroke={HORN} strokeWidth="13" strokeLinecap="round" fill="none" />

      {/* hocico */}
      <ellipse cx="100" cy="130" rx="21" ry="15" fill={MUZZLE} stroke={HIDE} strokeWidth="2.5" />
      <circle cx="92" cy="128" r="2.4" fill={HIDE} />
      <circle cx="108" cy="128" r="2.4" fill={HIDE} />
      <path d="M91 138 Q100 143 109 138" stroke={HIDE} strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* ojos */}
      <ellipse cx="81" cy="108" rx="5" ry="6" fill={HIDE} />
      <ellipse cx="119" cy="108" rx="5" ry="6" fill={HIDE} />
      <circle cx="83" cy="105.5" r="1.6" fill="#fff" />
      <circle cx="121" cy="105.5" r="1.6" fill="#fff" />

      {/* listón con el nombre */}
      <path
        d="M14 150 Q100 176 186 150 L186 168 Q100 192 14 168 Z"
        fill="var(--color-night-950)"
      />
      <text
        x="100"
        y="166"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontStyle="italic"
        fontWeight="700"
        fontSize="26"
        fill="var(--color-paper)"
      >
        Tultepec
      </text>
      <text
        x="100"
        y="182"
        textAnchor="middle"
        fontFamily="var(--font-body)"
        fontWeight="600"
        fontSize="9"
        letterSpacing="0.8"
        fill="var(--color-gold-light)"
      >
        PUEBLO PIROTÉCNICO
      </text>
    </svg>
  );
}
