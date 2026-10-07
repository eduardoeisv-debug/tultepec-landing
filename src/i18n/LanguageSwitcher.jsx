import { useLanguage } from "./LanguageContext.jsx";
import "./LanguageSwitcher.css";

// Botón ES/EN del encabezado. Cambia todo el sitio al vuelo (sin recargar
// la página) y recuerda la preferencia para la próxima visita.
export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="lang-switch" role="group" aria-label="Elegir idioma / Choose language">
      <button
        type="button"
        className={`lang-switch__option${language === "es" ? " is-active" : ""}`}
        onClick={() => setLanguage("es")}
        aria-pressed={language === "es"}
        lang="es"
      >
        ES
      </button>
      <button
        type="button"
        className={`lang-switch__option${language === "en" ? " is-active" : ""}`}
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        lang="en"
      >
        EN
      </button>
    </div>
  );
}
