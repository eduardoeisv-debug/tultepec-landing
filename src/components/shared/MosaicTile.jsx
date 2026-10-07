import { Camera } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./MosaicTile.css";

// Grosor de línea unificado (1.8, con puntas y uniones redondeadas) para que
// combine con el resto de los íconos del sitio, incluyendo los de lucide-react.
const ICONS = {
  castillo: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 6 L36 20 L28 20 Z" fill="currentColor" />
      <rect x="29" y="20" width="6" height="30" fill="currentColor" />
      <path
        d="M18 50 L32 24 L46 50 Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="32" cy="34" r="3" fill="currentColor" />
      <circle cx="24" cy="44" r="2.4" fill="currentColor" />
      <circle cx="40" cy="44" r="2.4" fill="currentColor" />
      <line x1="8" y1="58" x2="56" y2="58" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  torito: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <path
        d="M28 44 Q32 47 36 44"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <line x1="8" y1="58" x2="56" y2="58" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
      <path
        d="M10 30 L32 14 L54 30"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="16" y="30" width="32" height="24" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <rect x="28" y="38" width="8" height="16" stroke="currentColor" strokeWidth="1.8" fill="none" />
    </svg>
  ),
  mojiganga: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="20" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M18 54 C18 38 24 30 32 30 C40 30 46 38 46 54"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M12 44 L18 52 M52 44 L46 52" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  piromusical: (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="46" r="7" fill="currentColor" />
      <path d="M29 46 V14 L46 10 V38" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="39" cy="38" r="7" fill="currentColor" />
      <path d="M52 10 L54 16 M56 14 L50 18 M56 8 L50 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

// El ícono ilustrado siempre se mantiene visible (no se reemplaza por una
// foto de fondo, para no restarle legibilidad al título). `hasMedia`, si es
// true, muestra una pequeña insignia en la esquina (cámara por defecto, o
// `badgeIcon` si se pasa otro), indicando que esa categoría ya tiene
// contenido. `onClick`, si se pasa, vuelve la tarjeta un botón que abre el
// contenido completo.
export default function MosaicTile({
  icon,
  label,
  tone = "terracotta",
  large = false,
  hasMedia = false,
  badgeIcon: BadgeIcon = Camera,
  badgeTitle,
  onClick,
}) {
  const { t } = useLanguage();
  const Tag = onClick ? "button" : "div";
  const resolvedBadgeTitle = badgeTitle ?? t("mediaHub.badge.verFotos");

  return (
    <Tag
      type={onClick ? "button" : undefined}
      className={`mosaic-tile mosaic-tile--${tone} ${large ? "mosaic-tile--large" : ""} ${
        onClick ? "mosaic-tile--clickable" : ""
      }`}
      onClick={onClick}
    >
      {hasMedia && (
        <span className="mosaic-tile__badge" title={resolvedBadgeTitle} aria-hidden="true">
          <BadgeIcon size={14} strokeWidth={1.8} />
        </span>
      )}
      <span className="mosaic-tile__icon">{ICONS[icon]}</span>
      <span className="mosaic-tile__label">{label}</span>
    </Tag>
  );
}
