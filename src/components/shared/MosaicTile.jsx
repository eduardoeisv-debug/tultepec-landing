import useCoverImage from "../../hooks/useCoverImage.js";
import "./MosaicTile.css";

const ICONS = {
  castillo: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 6 L36 20 L28 20 Z" fill="currentColor" />
      <rect x="29" y="20" width="6" height="30" fill="currentColor" />
      <path d="M18 50 L32 24 L46 50 Z" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="32" cy="34" r="3" fill="currentColor" />
      <circle cx="24" cy="44" r="2.4" fill="currentColor" />
      <circle cx="40" cy="44" r="2.4" fill="currentColor" />
      <line x1="8" y1="58" x2="56" y2="58" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  torito: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 40 C14 30 22 24 32 24 C42 24 50 30 50 40 C50 46 44 50 32 50 C20 50 14 46 14 40 Z"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <path d="M20 26 L14 16 M44 26 L50 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="36" r="2" fill="currentColor" />
      <circle cx="40" cy="36" r="2" fill="currentColor" />
      <path d="M28 44 Q32 47 36 44" stroke="currentColor" strokeWidth="2" fill="none" />
      <line x1="8" y1="58" x2="56" y2="58" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  fuego: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M32 8c3 8 10 12 10 22a10 10 0 0 1-20 0c0-4 2-6 3-9-1 3-3 4.6-3 8.4a7 7 0 0 0 14 0c0-6-3-9-5-14-.6 3-2 4.6-3 6.4C27 18 30 12 32 8z"
        fill="currentColor"
      />
    </svg>
  ),
  taller: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 30 L32 14 L54 30" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      <rect x="16" y="30" width="32" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <rect x="28" y="38" width="8" height="16" stroke="currentColor" strokeWidth="2.2" fill="none" />
    </svg>
  ),
  mojiganga: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="20" r="9" stroke="currentColor" strokeWidth="2.5" />
      <path d="M18 54 C18 38 24 30 32 30 C40 30 46 38 46 54" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M12 44 L18 52 M52 44 L46 52" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
};

const CameraBadge = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M4 8h2.5l1-2h5l1 2H16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle cx="11" cy="13" r="3" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

// El ícono ilustrado siempre se mantiene visible (no se reemplaza por una
// foto de fondo, para no restarle legibilidad al título). `image`, si se
// pasa y existe, solo se usa para mostrar una pequeña insignia de cámara en
// la esquina, indicando que esa categoría ya tiene álbum. `onClick`, si se
// pasa, vuelve la tarjeta un botón que abre el álbum completo.
export default function MosaicTile({ icon, label, tone = "terracotta", large = false, image, onClick }) {
  const hasPhotos = useCoverImage(image);
  const Tag = onClick ? "button" : "div";

  return (
    <Tag
      type={onClick ? "button" : undefined}
      className={`mosaic-tile mosaic-tile--${tone} ${large ? "mosaic-tile--large" : ""} ${
        onClick ? "mosaic-tile--clickable" : ""
      }`}
      onClick={onClick}
    >
      {hasPhotos && (
        <span className="mosaic-tile__badge" aria-hidden="true">
          {CameraBadge}
        </span>
      )}
      <span className="mosaic-tile__icon">{ICONS[icon]}</span>
      <span className="mosaic-tile__label">{label}</span>
    </Tag>
  );
}
