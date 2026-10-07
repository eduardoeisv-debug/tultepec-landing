import "./CastilloSVG.css";

// 4 pisos, de arriba (piso 1) a abajo (piso 4), cada uno con su rueda de
// varas y su propio grupo de chispas. `activeIndex` (0-3) decide qué piso
// está "prendido" ahora; los anteriores quedan con brillo tenue y los
// siguientes, apagados.
const FLOORS = [
  { cy: 90 },
  { cy: 230 },
  { cy: 370 },
  { cy: 510 },
];

const SPARK_COUNT = 12;

function floorState(index, activeIndex) {
  if (index === activeIndex) return "active";
  if (index < activeIndex) return "dim";
  return "off";
}

function Wheel({ cx, cy, state }) {
  return (
    <g
      className={`castillo-svg__wheel castillo-svg__wheel--${state}`}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <circle cx={cx} cy={cy} r="30" />
      <circle cx={cx} cy={cy} r="5" className="castillo-svg__hub" />
      <line x1={cx} y1={cy - 30} x2={cx} y2={cy + 30} />
      <line x1={cx - 30} y1={cy} x2={cx + 30} y2={cy} />
      <line x1={cx - 21} y1={cy - 21} x2={cx + 21} y2={cy + 21} />
      <line x1={cx - 21} y1={cy + 21} x2={cx + 21} y2={cy - 21} />
    </g>
  );
}

function Sparks({ cx, cy, active }) {
  if (!active) return null;
  return (
    <g className="castillo-svg__sparks" aria-hidden="true">
      {Array.from({ length: SPARK_COUNT }, (_, i) => {
        const dx = cx + (((i * 37) % 70) - 35);
        const delay = (i % 6) * 0.22;
        const duration = 1.1 + (i % 4) * 0.18;
        return (
          <circle
            key={i}
            className="castillo-svg__spark"
            cx={dx}
            cy={cy}
            r={1.4 + (i % 3) * 0.5}
            style={{ animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
          />
        );
      })}
    </g>
  );
}

export default function CastilloSVG({ activeIndex }) {
  return (
    <svg
      className="castillo-svg"
      viewBox="0 0 160 560"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect className="castillo-svg__pole" x="76" y="40" width="8" height="500" />

      {FLOORS.map((floor, index) => {
        const state = floorState(index, activeIndex);
        return (
          <g key={index} className={`castillo-svg__floor castillo-svg__floor--${state}`}>
            <rect
              className="castillo-svg__bar"
              x={80 - (34 - index * 4)}
              y={floor.cy - 3}
              width={(34 - index * 4) * 2}
              height="6"
            />
            <Wheel cx={80} cy={floor.cy} state={state} />
            <Sparks cx={80} cy={floor.cy - 34} active={state === "active"} />
          </g>
        );
      })}
    </svg>
  );
}
