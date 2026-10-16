import "./HeaderPapelPicado.css";

const FLAG_COUNT = 24;
const FLAG_WIDTH = 46;
const GAP = 8;
const TOTAL_WIDTH = FLAG_COUNT * (FLAG_WIDTH + GAP);

// Tira fina que cuelga bajo el encabezado, visible en todas las vistas
// (no solo Inicio) -- banderitas semitransparentes de papel picado y una
// línea dorada fina arriba. Mismo recurso SVG que HeroPapelPicado.jsx
// (triángulo + línea + vaivén por bandera), pero sin su paleta de
// colores variada: una sola silueta translúcida, para no competir
// visualmente con el contenido del panel justo debajo.
export default function HeaderPapelPicado() {
  const flags = Array.from({ length: FLAG_COUNT }, (_, i) => {
    const x = i * (FLAG_WIDTH + GAP);
    const midX = x + FLAG_WIDTH / 2;
    return (
      <path
        key={i}
        className="header-papel-picado__flag"
        style={{ transformOrigin: `${midX}px 4px`, animationDelay: `${(i % 6) * 0.3}s` }}
        d={`M ${x},6 L ${x + FLAG_WIDTH},6 L ${midX},30 Z`}
      />
    );
  });

  return (
    <div className="header-papel-picado" aria-hidden="true">
      <svg
        viewBox={`0 0 ${TOTAL_WIDTH} 32`}
        preserveAspectRatio="xMidYMin slice"
        xmlns="http://www.w3.org/2000/svg"
        className="header-papel-picado__svg"
      >
        <line x1="0" y1="2" x2={TOTAL_WIDTH} y2="2" className="header-papel-picado__linea" />
        {flags}
      </svg>
    </div>
  );
}
