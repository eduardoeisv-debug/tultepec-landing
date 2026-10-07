// Íconos SVG propios para la galería unificada, con el mismo trazo (1.7,
// puntas y uniones redondeadas) que el resto de los íconos del sitio
// (MosaicTile.jsx, Header.jsx). No son de lucide-react porque no existe un
// ícono combinado "foto + play" ni uno de "cámara" con ese mismo lenguaje
// visual.

// Tarjeta del hero: una foto (marco + solcito + montaña) con una insignia
// de play superpuesta en la esquina, para representar "Imágenes y videos"
// con un solo ícono.
export function GaleriaCardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2.3" y="4" width="14.4" height="12" rx="2.2" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="6.6" cy="8.2" r="1.25" fill="currentColor" />
      <path
        d="M3.1 14.1 7.4 10.2a1 1 0 0 1 1.3 0L12.8 13.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="17.2" cy="15.3" r="5.6" fill="rgba(10,14,36,0.55)" stroke="currentColor" strokeWidth="1.3" />
      <polygon points="15.5,12.6 15.5,18 19.6,15.3" fill="currentColor" />
    </svg>
  );
}

// Pestaña "Imágenes": marco de foto con solcito y montaña.
export function TabImagenesIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="3" y="4.6" width="18" height="14.8" rx="2.6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="8.4" cy="9.4" r="1.5" fill="currentColor" />
      <path
        d="M4.1 17 9.5 11.3a1.3 1.3 0 0 1 1.7 0L17.2 17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

// Pestaña "Videos": cuerpo de cámara con visor y triángulo de play.
export function TabVideosIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2.6" y="6.3" width="13.4" height="11.4" rx="2.2" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path
        d="M16 10.6 20.4 8a.85.85 0 0 1 1.3.74v6.5a.85.85 0 0 1-1.3.74L16 13.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <polygon points="7.6,9.8 7.6,14.2 11.6,12" fill="currentColor" />
    </svg>
  );
}

// Pestaña "Quiénes somos": dos personas (cabeza + hombros), mismo trazo
// que el resto de los íconos de pestañas.
export function TabPersonasIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="9" cy="8.2" r="2.7" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3.6 18.4c0-3 2.4-5 5.4-5s5.4 2 5.4 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="16.3" cy="9.3" r="2.1" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M14.3 18.4c-.1-2.3 1.7-4 3.9-4 2.1 0 3.9 1.5 4.2 3.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

// Pestaña "Los libros": libro abierto con lomo central.
export function TabLibrosIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 6.2c-1.6-1.1-3.8-1.5-6.3-1.1a1 1 0 0 0-.8 1v11.4a1 1 0 0 0 1.2 1c2.1-.3 4.1 0 5.5 1 .3.2.7.2 1 0 1.4-1 3.4-1.3 5.5-1a1 1 0 0 0 1.2-1V6.1a1 1 0 0 0-.8-1c-2.5-.4-4.7 0-6.3 1.1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 6.2V19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
