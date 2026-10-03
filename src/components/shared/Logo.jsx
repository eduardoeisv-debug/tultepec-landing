// Insignia ilustrada de Tultepec: cielo encendido, silueta de castillo e
// iglesia, torito al frente y el nombre del pueblo en el borde. Construida
// a mano en SVG (sin librerías ni imágenes externas) para que escale nítida
// a cualquier tamaño, desde el favicon hasta un sello grande.
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

      {/* silueta del pueblo (iglesia + castillo), pequeña y detrás del torito */}
      <g fill="var(--color-night-950)">
        <path d="M27 136 L27 108 L37 108 L37 100 L44 100 L44 108 L54 108 L54 136 Z" />
        <rect x="38" y="86" width="5" height="14" />
        <path d="M35 86 L46 86 L40.5 75 Z" />
        <path d="M149 136 L149 102 L156 88 L163 102 L163 136 Z" />
        <rect x="153.5" y="76" width="5" height="12" />
      </g>

      {/* torito: cabeza con cuernos, de frente, como figura principal */}
      <g fill="var(--color-night-950)">
        <path d="M70,125 C 50,118 35,100 32,72 C 55,90 85,110 100,130 Z" />
        <path d="M130,125 C 150,118 165,100 168,72 C 145,90 115,110 100,130 Z" />
        <path d="M66,112 L74,96 L82,114 Z" />
        <path d="M134,112 L126,96 L118,114 Z" />
        <path d="M70,150 L70,128 C70,111 83,99 100,99 C117,99 130,111 130,128 L130,150 Z" />
      </g>
      <circle cx="88" cy="128" r="3.2" fill="var(--color-gold-light)" />
      <circle cx="112" cy="128" r="3.2" fill="var(--color-gold-light)" />
      <path
        d="M90,145 Q100,150 110,145"
        stroke="var(--color-gold-light)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

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
