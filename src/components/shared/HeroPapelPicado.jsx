import "./HeroPapelPicado.css";

const COLORS = ["#e3ab3d", "#ff2d8a", "#2fd3c8", "#c1592f", "#fbf1e2"];
const FLAG_COUNT = 16;
const FLAG_WIDTH = 64;
const GAP = 10;
const TOTAL_WIDTH = FLAG_COUNT * (FLAG_WIDTH + GAP);

// Tira de papel picado colgando en la parte de arriba del hero, con un
// vaivén suave por bandera (como si la moviera el aire). Puramente
// decorativo; el movimiento se desactiva con prefers-reduced-motion.
export default function HeroPapelPicado() {
  const flags = Array.from({ length: FLAG_COUNT }, (_, i) => {
    const x = i * (FLAG_WIDTH + GAP);
    const color = COLORS[i % COLORS.length];
    const midX = x + FLAG_WIDTH / 2;
    return (
      <g
        key={i}
        className="hero-papel-picado__flag"
        style={{ transformOrigin: `${midX}px 6px`, animationDelay: `${(i % 6) * 0.3}s` }}
      >
        <path d={`M ${x},8 L ${x + FLAG_WIDTH},8 L ${midX},50 Z`} fill={color} />
        <circle cx={midX} cy={20} r="3.4" fill="var(--color-paper)" />
        <circle cx={midX - 10} cy={27} r="2.4" fill="var(--color-paper)" />
        <circle cx={midX + 10} cy={27} r="2.4" fill="var(--color-paper)" />
        <circle cx={midX} cy={34} r="2.4" fill="var(--color-paper)" />
      </g>
    );
  });

  return (
    <div className="hero-papel-picado" aria-hidden="true">
      <svg
        viewBox={`0 0 ${TOTAL_WIDTH} 54`}
        preserveAspectRatio="xMidYMin meet"
        xmlns="http://www.w3.org/2000/svg"
        className="hero-papel-picado__svg"
      >
        <line x1="0" y1="8" x2={TOTAL_WIDTH} y2="8" stroke="rgba(251, 241, 226, 0.4)" strokeWidth="1.5" />
        {flags}
      </svg>
    </div>
  );
}
