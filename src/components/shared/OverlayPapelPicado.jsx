import "./OverlayPapelPicado.css";

const COLORS = ["#e3ab3d", "#ff2d8a", "#2fd3c8", "#c1592f", "#fbf1e2"];
const FLAG_COUNT = 24;
const FLAG_WIDTH = 46;
const GAP = 8;
const TOTAL_WIDTH = FLAG_COUNT * (FLAG_WIDTH + GAP);

// Papel picado para el borde superior de los overlays a pantalla completa
// (GaleriaOverlay, BooksModal). A diferencia de HeroPapelPicado.jsx -- que
// usa un truco de ancho 110% + margen negativo pensado para sangrar fuera
// del hero, que a todo lo ancho del viewport nunca se nota recortado --
// aquí el panel es más angosto que la pantalla, así que ese mismo truco sí
// se notaba: la primera bandera aparecía cortada a la mitad. En vez de eso,
// el svg se dibuja a su tamaño real en píxeles (sin escalar por porcentaje)
// dentro de un contenedor con overflow:hidden, así que siempre arranca con
// una bandera completa a la izquierda y lo que sobra se recorta limpio a
// la derecha -- y el contenedor deja un hueco a la derecha para que nunca
// quede debajo del botón de cerrar.
export default function OverlayPapelPicado() {
  const flags = Array.from({ length: FLAG_COUNT }, (_, i) => {
    const x = i * (FLAG_WIDTH + GAP);
    const color = COLORS[i % COLORS.length];
    const midX = x + FLAG_WIDTH / 2;
    return (
      <g
        key={i}
        className="overlay-papel-picado__flag"
        style={{ transformOrigin: `${midX}px 6px`, animationDelay: `${(i % 6) * 0.3}s` }}
      >
        <path d={`M ${x},8 L ${x + FLAG_WIDTH},8 L ${midX},44 Z`} fill={color} />
        <circle cx={midX} cy={17} r="3" fill="var(--color-paper)" />
        <circle cx={midX - 9} cy={23} r="2.1" fill="var(--color-paper)" />
        <circle cx={midX + 9} cy={23} r="2.1" fill="var(--color-paper)" />
        <circle cx={midX} cy={29} r="2.1" fill="var(--color-paper)" />
      </g>
    );
  });

  return (
    <div className="overlay-papel-picado" aria-hidden="true">
      <svg
        viewBox={`0 0 ${TOTAL_WIDTH} 48`}
        xmlns="http://www.w3.org/2000/svg"
        className="overlay-papel-picado__svg"
      >
        <line x1="0" y1="8" x2={TOTAL_WIDTH} y2="8" stroke="rgba(251, 241, 226, 0.4)" strokeWidth="1.5" />
        {flags}
      </svg>
    </div>
  );
}
