import { useLanguage } from "../../i18n/LanguageContext.jsx";

// Selector ES | EN -- misma lógica de siempre (useLanguage/setLanguage,
// sin tocar LanguageContext.jsx). Antes vivía solo dentro del menú
// (ColumnaCristal.jsx, que había que abrir para cambiar de idioma);
// ahora lo usa TopBarCristal.jsx, siempre visible, con sus estilos en
// TopBarCristal.css (.cristal-topbar__lang) en vez de un CSS propio,
// ya que es su único punto de montaje. El óvalo dorado detrás de ES/EN
// (__indicator) se desliza con el mismo truco que ya usa
// SegmentedTabs.jsx en el resto del sitio (traducirlo en transform:
// translateX según qué botón esté activo) en vez de solo cambiar el
// fondo del botón de golpe.
export default function LanguageToggle({ className }) {
  const { language, setLanguage, t } = useLanguage();
  const activeIndex = language === "en" ? 1 : 0;

  return (
    <span
      className={className ? `cristal-topbar__lang ${className}` : "cristal-topbar__lang"}
      role="group"
      aria-label={t("languageSwitcher.ariaLabel")}
    >
      <span
        className="cristal-topbar__lang-indicator"
        aria-hidden="true"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      <button type="button" aria-pressed={language === "es"} onClick={() => setLanguage("es")}>
        ES
      </button>
      <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>
        EN
      </button>
    </span>
  );
}
