import { useLanguage } from "./LanguageContext.jsx";
import "./LanguageSwitcher.css";

// Botón ES/EN del encabezado. Cambia todo el sitio al vuelo (sin recargar
// la página) y recuerda la preferencia para la próxima visita. El globo a
// la izquierda y el texto completo ("Español"/"English") en pantallas
// anchas dejan claro de un vistazo que esto cambia el idioma, no solo dos
// siglas sueltas.
export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const etiqueta = t("languageSwitcher.ariaLabel");

  return (
    <div className="lang-switch-wrap">
      <svg
        className="lang-switch__globe"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18M4.5 7.5h15M4.5 16.5h15" />
      </svg>

      <div className="lang-switch" role="group" aria-label={etiqueta}>
        <button
          type="button"
          className={`lang-switch__option${language === "es" ? " is-active" : ""}`}
          onClick={() => setLanguage("es")}
          aria-pressed={language === "es"}
          lang="es"
          title={etiqueta}
        >
          <span className="lang-switch__short">ES</span>
          <span className="lang-switch__full">Español</span>
        </button>
        <button
          type="button"
          className={`lang-switch__option${language === "en" ? " is-active" : ""}`}
          onClick={() => setLanguage("en")}
          aria-pressed={language === "en"}
          lang="en"
          title={etiqueta}
        >
          <span className="lang-switch__short">EN</span>
          <span className="lang-switch__full">English</span>
        </button>
      </div>
    </div>
  );
}
