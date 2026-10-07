import "./Header.css";

// Ícono de torito dibujado a mano, el mismo trazo que ya se usa en
// MosaicTile.jsx (src/components/shared/MosaicTile.jsx) para mantener un
// solo estilo de ícono "torito" en todo el sitio.
function ToritoIcon() {
  return (
    <svg
      className="site-header__torito"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 40 C14 30 22 24 32 24 C42 24 50 30 50 40 C50 46 44 50 32 50 C20 50 14 46 14 40 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M20 26 L14 16 M44 26 L50 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="24" cy="36" r="2" fill="currentColor" />
      <circle cx="40" cy="36" r="2" fill="currentColor" />
      <path d="M28 44 Q32 47 36 44" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#inicio">
          <ToritoIcon />
          <span className="site-header__brand-text">
            <span>Tultepec</span>
            <span className="site-header__subtitle">· Pueblo Pirotécnico</span>
          </span>
        </a>
      </div>
    </header>
  );
}
