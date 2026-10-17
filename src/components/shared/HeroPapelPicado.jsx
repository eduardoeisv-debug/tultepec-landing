import "./HeroPapelPicado.css";

const COLORS = ["#e3ab3d", "#ff2d8a", "#2fd3c8", "#c1592f", "#fbf1e2"];
const FLAG_COUNT = 16;
const FLAG_WIDTH = 64;
const GAP = 10;
const TOTAL_WIDTH = FLAG_COUNT * (FLAG_WIDTH + GAP);

// Geometría de cada banderín: cuerpo recto colgando de la línea (TOP_Y),
// que se angosta hacia los lados (SIDE_INSET) hasta un remate festoneado
// --varios arcos seguidos, como un fleco de tijera artesanal-- en vez del
// triángulo recto de antes.
const TOP_Y = 8;
const BODY_BOTTOM_Y = 30;
const SIDE_INSET = 7;
const SCALLOP_COUNT = 4;
const SCALLOP_BULGE = 9;
const VIEW_HEIGHT = 44;

function bannerPath(x) {
  const left = x;
  const right = x + FLAG_WIDTH;
  const bottomLeft = x + SIDE_INSET;
  const bottomRight = x + FLAG_WIDTH - SIDE_INSET;
  const scallopWidth = (bottomRight - bottomLeft) / SCALLOP_COUNT;

  let d = `M ${left},${TOP_Y} L ${right},${TOP_Y} L ${bottomRight},${BODY_BOTTOM_Y} `;
  for (let i = 0; i < SCALLOP_COUNT; i++) {
    const nextX = bottomRight - scallopWidth * (i + 1);
    d += `A ${scallopWidth / 2},${SCALLOP_BULGE} 0 0 1 ${nextX},${BODY_BOTTOM_Y} `;
  }
  d += `L ${left},${TOP_Y} Z`;
  return d;
}

// Chispa de 4 puntas (como una estrellita de destello) calada en el
// centro de cada banderín -- antes era un círculo liso; esto recuerda
// más al oficio del pueblo sin volverse una silueta literal de cohete.
function sparklePath(cx, cy, outerR, innerR) {
  const points = 4;
  const step = Math.PI / points;
  const coords = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = i * step - Math.PI / 2;
    coords.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return `M ${coords.join(" L ")} Z`;
}

// Tira de papel picado colgando en la parte de arriba del hero, con un
// vaivén suave por bandera (como si la moviera el aire). Puramente
// decorativo; el movimiento se desactiva con prefers-reduced-motion.
// Diseño "artesanal": remate inferior festoneado (en vez del triángulo
// recto de antes), un calado en forma de chispa de 4 puntas + puntos
// sueltos a los lados (simulando chispas dispersas) y detallitos en
// cada valle del fleco, todo en --color-paper sobre el color de cada
// banderín, que ahora lleva opacidad reducida para que se mezcle con
// el cielo nocturno estrellado del fondo en vez de tapar sus puntitos.
export default function HeroPapelPicado() {
  const flags = Array.from({ length: FLAG_COUNT }, (_, i) => {
    const x = i * (FLAG_WIDTH + GAP);
    const color = COLORS[i % COLORS.length];
    const midX = x + FLAG_WIDTH / 2;
    const bottomRight = x + FLAG_WIDTH - SIDE_INSET;
    const scallopWidth = (FLAG_WIDTH - 2 * SIDE_INSET) / SCALLOP_COUNT;
    const valles = Array.from({ length: SCALLOP_COUNT - 1 }, (_, v) => bottomRight - scallopWidth * (v + 1));

    return (
      <g
        key={i}
        className="hero-papel-picado__flag"
        style={{ transformOrigin: `${midX}px 6px`, animationDelay: `${(i % 6) * 0.3}s` }}
      >
        <path d={bannerPath(x)} fill={color} fillOpacity="0.82" />
        <path d={sparklePath(midX, 17, 7, 2.6)} fill="var(--color-paper)" />
        <circle cx={midX - 12} cy={25} r="1.6" fill="var(--color-paper)" opacity="0.85" />
        <circle cx={midX + 12} cy={25} r="1.6" fill="var(--color-paper)" opacity="0.85" />
        {valles.map((vx, vi) => (
          <circle key={vi} cx={vx} cy={BODY_BOTTOM_Y - 1} r="1.1" fill="var(--color-paper)" opacity="0.7" />
        ))}
      </g>
    );
  });

  return (
    <div className="hero-papel-picado" aria-hidden="true">
      <svg
        viewBox={`0 0 ${TOTAL_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="xMidYMin meet"
        xmlns="http://www.w3.org/2000/svg"
        className="hero-papel-picado__svg"
      >
        <line x1="0" y1={TOP_Y} x2={TOTAL_WIDTH} y2={TOP_Y} stroke="rgba(251, 241, 226, 0.4)" strokeWidth="1.5" />
        {flags}
      </svg>
    </div>
  );
}
