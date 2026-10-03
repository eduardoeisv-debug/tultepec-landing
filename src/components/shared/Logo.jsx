// Insignia ilustrada de Tultepec: cielo encendido, castillo monumental
// como figura principal, iglesia pequeña al lado y el nombre del pueblo
// en el borde. Construida a mano en SVG (sin librerías ni imágenes
// externas) para que escale nítida a cualquier tamaño.
const DOTS = Array.from({ length: 30 }, (_, i) => {
  const angle = (i / 30) * Math.PI * 2;
  return {
    cx: 100 + Math.cos(angle) * 95,
    cy: 100 + Math.sin(angle) * 95,
  };
});

function Burst({ x, y, scale = 1, color }) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const x2 = Math.cos(angle) * 10 * scale;
    const y2 = Math.sin(angle) * 10 * scale;
    return <line key={i} x1={0} y1={0} x2={x2} y2={y2} />;
  });
  return (
    <g transform={`translate(${x},${y})`} stroke={color} strokeWidth={1.6 * scale} strokeLinecap="round">
      {rays}
    </g>
  );
}

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
        <radialGradient id="logoSky" cx="50%" cy="36%" r="62%">
          <stop offset="0%" stopColor="var(--color-gold-light)" />
          <stop offset="48%" stopColor="var(--color-gold)" />
          <stop offset="100%" stopColor="var(--color-fire-red-dark)" />
        </radialGradient>
      </defs>

      {/* borde punteado, como una insignia de tela */}
      <circle cx="100" cy="100" r="98" fill="var(--color-night-950)" />
      {DOTS.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r="3.2" fill="var(--color-gold)" />
      ))}

      {/* cielo */}
      <circle cx="100" cy="100" r="86" fill="url(#logoSky)" />

      {/* estrellas */}
      <circle cx="56" cy="46" r="1.6" fill="#fff" opacity="0.9" />
      <circle cx="146" cy="52" r="1.4" fill="#fff" opacity="0.8" />
      <circle cx="70" cy="30" r="1.2" fill="#fff" opacity="0.8" />
      <circle cx="128" cy="34" r="1.6" fill="#fff" opacity="0.9" />
      <circle cx="40" cy="68" r="1.2" fill="#fff" opacity="0.7" />

      {/* cuetes */}
      <Burst x={48} y={48} scale={1} color="var(--color-paper)" />
      <Burst x={150} y={62} scale={0.8} color="var(--color-paper)" />

      {/* iglesia, pequeña y a un lado */}
      <g fill="var(--color-night-950)">
        <path d="M27 140 L27 112 L37 112 L37 104 L44 104 L44 112 L54 112 L54 140 Z" />
        <rect x="38" y="90" width="5" height="14" />
        <path d="M35 90 L46 90 L40.5 79 Z" />
      </g>

      {/* castillo monumental, como figura principal */}
      <g fill="var(--color-night-950)">
        <path d="M100 56 L110 76 L90 76 Z" />
        <rect x="97" y="76" width="6" height="50" />
        <path
          d="M72 150 L100 84 L128 150 Z"
          stroke="var(--color-night-950)"
          strokeWidth="4.5"
          strokeLinejoin="round"
          fill="none"
        />
        <line x1="56" y1="152" x2="144" y2="152" stroke="var(--color-night-950)" strokeWidth="5" strokeLinecap="round" />
      </g>
      <circle cx="100" cy="104" r="4.6" fill="var(--color-fire-red)" />
      <circle cx="84" cy="128" r="3.6" fill="var(--color-fire-red)" />
      <circle cx="116" cy="128" r="3.6" fill="var(--color-fire-red)" />
      <circle cx="100" cy="56" r="2.6" fill="var(--color-gold-light)" />

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
