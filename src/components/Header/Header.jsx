import { useLanguage } from "../../i18n/LanguageContext.jsx";
import LanguageSwitcher from "../../i18n/LanguageSwitcher.jsx";
import "./Header.css";

// Ícono de torito dibujado a mano, el mismo trazo (1.7-1.8, puntas y
// uniones redondeadas) que el resto de los íconos propios del sitio (ver
// GaleriaIcons.jsx) para mantener un solo estilo visual.
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
  const { t } = useLanguage();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#inicio">
          <ToritoIcon />
          <span className="site-header__brand-text">
            <span>Tultepec</span>
            <span className="site-header__subtitle">· {t("header.subtitle")}</span>
          </span>
        </a>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
