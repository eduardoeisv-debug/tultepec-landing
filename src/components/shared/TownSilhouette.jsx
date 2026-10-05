import "./TownSilhouette.css";

// Silueta del pueblo al pie del hero: iglesia con cúpula y torres, casas y
// un castillo pirotécnico, en morado muy oscuro con ventanitas doradas
// encendidas. SVG puro para que se vea nítido en cualquier pantalla.
export default function TownSilhouette() {
  return (
    <svg
      className="town-silhouette"
      viewBox="0 0 1200 220"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g fill="var(--town-fill)">
        {/* Casas bajas, techo plano, del lado izquierdo */}
        <rect x="0" y="150" width="90" height="70" />
        <rect x="95" y="130" width="70" height="90" />
        <rect x="170" y="155" width="100" height="65" />
        <rect x="275" y="140" width="60" height="80" />

        {/* Iglesia: nave, cúpula y dos torres con cruz, al centro */}
        <rect x="450" y="130" width="180" height="90" />
        <rect x="430" y="90" width="36" height="130" />
        <path d="M430 90 Q448 62 466 90 Z" />
        <rect x="614" y="90" width="36" height="130" />
        <path d="M614 90 Q632 62 650 90 Z" />
        <path d="M500 130 Q540 55 580 130 Z" />
        <rect x="533" y="36" width="14" height="22" />
        <path d="M534 36 L540 22 L546 36 Z" />

        {/* Casitas bajas, techo plano, del lado derecho */}
        <rect x="690" y="150" width="75" height="70" />
        <rect x="775" y="135" width="65" height="85" />

        {/* Castillo pirotécnico, a la derecha de la iglesia: torre de varas
            con ruedas. Se mantiene cerca del centro del viewBox (no en el
            borde) para que no quede recortado en pantallas angostas, donde
            preserveAspectRatio="slice" solo muestra la franja central. */}
        <rect x="895" y="55" width="8" height="165" />
        <rect x="870" y="68" width="58" height="6" />
        <rect x="876" y="100" width="46" height="5" />
        <rect x="880" y="132" width="38" height="5" />
        <rect x="883" y="164" width="32" height="5" />

        <rect x="955" y="155" width="110" height="65" />
        <rect x="1075" y="140" width="70" height="80" />
      </g>

      {/* Ventanitas doradas encendidas */}
      <g fill="var(--town-window)">
        <rect x="20" y="175" width="8" height="10" />
        <rect x="55" y="175" width="8" height="10" />
        <rect x="118" y="155" width="8" height="10" />
        <rect x="118" y="185" width="8" height="10" />
        <rect x="200" y="180" width="8" height="10" />
        <rect x="235" y="180" width="8" height="10" />
        <rect x="295" y="165" width="8" height="10" />
        <rect x="460" y="155" width="9" height="11" />
        <rect x="495" y="155" width="9" height="11" />
        <rect x="585" y="155" width="9" height="11" />
        <rect x="610" y="155" width="9" height="11" />
        <circle cx="540" cy="115" r="7" />
        <rect x="443" y="115" width="7" height="9" />
        <rect x="625" y="115" width="7" height="9" />
        <rect x="715" y="175" width="8" height="10" />
        <rect x="798" y="155" width="8" height="10" />
        <rect x="798" y="185" width="8" height="10" />
        <rect x="980" y="180" width="8" height="10" />
        <rect x="1100" y="165" width="8" height="10" />
      </g>

      {/* Ruedas giratorias del castillo pirotécnico, con sus rayos */}
      <g stroke="var(--town-window)" strokeWidth="1.6" fill="none" opacity="0.9">
        <circle cx="899" cy="80" r="13" />
        <circle cx="899" cy="80" r="2.4" fill="var(--town-window)" stroke="none" />
        <line x1="899" y1="67" x2="899" y2="93" />
        <line x1="886" y1="80" x2="912" y2="80" />
        <line x1="890" y1="71" x2="908" y2="89" />
        <line x1="890" y1="89" x2="908" y2="71" />

        <circle cx="899" cy="116" r="11" />
        <circle cx="899" cy="116" r="2.2" fill="var(--town-window)" stroke="none" />
        <line x1="899" y1="105" x2="899" y2="127" />
        <line x1="888" y1="116" x2="910" y2="116" />
        <line x1="891" y1="108" x2="907" y2="124" />
        <line x1="891" y1="124" x2="907" y2="108" />

        <circle cx="899" cy="148" r="9" />
        <circle cx="899" cy="148" r="2" fill="var(--town-window)" stroke="none" />
        <line x1="899" y1="139" x2="899" y2="157" />
        <line x1="890" y1="148" x2="908" y2="148" />
      </g>
    </svg>
  );
}
