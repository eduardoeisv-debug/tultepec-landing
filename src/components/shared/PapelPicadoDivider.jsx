import "./PapelPicadoDivider.css";

const COLORS = ["var(--color-terracotta)", "var(--color-gold)", "var(--color-fire-red)"];
const FLAG_COUNT = 26;
const FLAG_WIDTH = 60;
const GAP = 6;
const TOTAL_WIDTH = FLAG_COUNT * (FLAG_WIDTH + GAP);

// Banderitas de papel picado, como las que se cuelgan en las calles durante
// la feria. Puramente decorativo, construido con SVG (sin imágenes).
export default function PapelPicadoDivider() {
  const flags = Array.from({ length: FLAG_COUNT }, (_, i) => {
    const x = i * (FLAG_WIDTH + GAP);
    const color = COLORS[i % COLORS.length];
    const midX = x + FLAG_WIDTH / 2;
    return (
      <g key={i}>
        <path d={`M ${x},10 L ${x + FLAG_WIDTH},10 L ${midX},62 Z`} fill={color} />
        <circle cx={midX} cy={26} r="4.5" fill="var(--color-paper)" />
        <circle cx={midX - 12} cy={36} r="3" fill="var(--color-paper)" />
        <circle cx={midX + 12} cy={36} r="3" fill="var(--color-paper)" />
        <circle cx={midX} cy={44} r="3" fill="var(--color-paper)" />
      </g>
    );
  });

  return (
    <div className="papel-picado" aria-hidden="true">
      <svg
        viewBox={`0 0 ${TOTAL_WIDTH} 66`}
        preserveAspectRatio="xMidYMin meet"
        xmlns="http://www.w3.org/2000/svg"
        className="papel-picado__svg"
      >
        <line x1="0" y1="10" x2={TOTAL_WIDTH} y2="10" stroke="var(--color-terracotta-dark)" strokeWidth="2" />
        {flags}
      </svg>
    </div>
  );
}
