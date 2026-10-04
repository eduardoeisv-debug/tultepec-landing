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
        {/* Casas del lado izquierdo */}
        <rect x="0" y="140" width="90" height="80" />
        <rect x="95" y="110" width="70" height="110" />
        <rect x="170" y="150" width="100" height="70" />
        <rect x="275" y="125" width="60" height="95" />

        {/* Castillo pirotécnico (torre con anillos) */}
        <rect x="355" y="70" width="10" height="150" />
        <rect x="330" y="80" width="60" height="8" />
        <rect x="336" y="110" width="48" height="6" />
        <rect x="340" y="140" width="40" height="6" />
        <rect x="344" y="170" width="32" height="6" />
        <circle cx="360" cy="60" r="6" fill="var(--town-window)" opacity="0.85" />

        {/* Iglesia: nave, cúpula y dos torres */}
        <rect x="450" y="130" width="180" height="90" />
        <rect x="430" y="90" width="36" height="130" />
        <path d="M430 90 Q448 62 466 90 Z" />
        <rect x="614" y="90" width="36" height="130" />
        <path d="M614 90 Q632 62 650 90 Z" />
        <path d="M500 130 Q540 55 580 130 Z" />
        <rect x="533" y="36" width="14" height="22" />
        <path d="M534 36 L540 22 L546 36 Z" />

        {/* Casas del lado derecho */}
        <rect x="690" y="135" width="75" height="85" />
        <rect x="770" y="105" width="65" height="115" />
        <rect x="840" y="150" width="110" height="70" />
        <rect x="955" y="120" width="70" height="100" />
        <rect x="1030" y="145" width="90" height="75" />
        <rect x="1125" y="115" width="75" height="105" />
      </g>

      {/* Ventanitas doradas encendidas */}
      <g fill="var(--town-window)">
        <rect x="20" y="165" width="8" height="10" />
        <rect x="55" y="165" width="8" height="10" />
        <rect x="118" y="135" width="8" height="10" />
        <rect x="118" y="165" width="8" height="10" />
        <rect x="200" y="175" width="8" height="10" />
        <rect x="235" y="175" width="8" height="10" />
        <rect x="295" y="150" width="8" height="10" />
        <rect x="460" y="155" width="9" height="11" />
        <rect x="495" y="155" width="9" height="11" />
        <rect x="585" y="155" width="9" height="11" />
        <rect x="610" y="155" width="9" height="11" />
        <circle cx="540" cy="115" r="7" />
        <rect x="443" y="115" width="7" height="9" />
        <rect x="625" y="115" width="7" height="9" />
        <rect x="715" y="160" width="8" height="10" />
        <rect x="793" y="135" width="8" height="10" />
        <rect x="793" y="165" width="8" height="10" />
        <rect x="865" y="175" width="8" height="10" />
        <rect x="900" y="175" width="8" height="10" />
        <rect x="980" y="150" width="8" height="10" />
        <rect x="1055" y="175" width="8" height="10" />
        <rect x="1150" y="145" width="8" height="10" />
        <rect x="1150" y="175" width="8" height="10" />
      </g>
    </svg>
  );
}
