import { Home, Menu as MenuIcon, Volume2, VolumeX } from "lucide-react";
import { rutaHash } from "../../hooks/useHashRoute.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useSound } from "../../hooks/useSound.jsx";
import "./BottomNav.css";

// Barra de navegación fija del celular (oculta en escritorio por CSS,
// ver el @media de BottomNav.css): Inicio, Menú (abre ColumnaCristal,
// el mismo menú que la hamburguesa de TopBarCristal.jsx) y Sonido.
// Siempre montada -- igual que SegmentedTabs y el resto de ajustes
// "solo celular" de este proyecto, se oculta por CSS en vez de no
// renderizarse, para no depender de un media query en JS para algo
// que no cambia el comportamiento, solo el aspecto.
export default function BottomNav({ enInicio, onAbrirMenu, menuAbierto }) {
  const { t } = useLanguage();
  const { enabled, toggle, playTap } = useSound();

  const irAInicio = () => {
    playTap();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const abrirMenu = () => {
    playTap();
    onAbrirMenu();
  };

  const alternarSonido = () => {
    playTap();
    toggle();
  };

  return (
    <nav className="cristal-bottomnav" aria-label={t("bottomnav.ariaLabel")}>
      <a
        className={`cristal-bottomnav__boton${enInicio ? " is-activo" : ""}`}
        href={rutaHash(null)}
        onClick={irAInicio}
        aria-current={enInicio ? "page" : undefined}
      >
        <Home size={22} strokeWidth={1.8} aria-hidden="true" />
        <span>{t("menu.inicio")}</span>
      </a>

      <button
        type="button"
        className={`cristal-bottomnav__boton${menuAbierto ? " is-activo" : ""}`}
        onClick={abrirMenu}
        aria-expanded={menuAbierto}
      >
        <MenuIcon size={22} strokeWidth={1.8} aria-hidden="true" />
        <span>{t("bottomnav.menu")}</span>
      </button>

      <button
        type="button"
        className={`cristal-bottomnav__boton${enabled ? " is-activo" : ""}`}
        onClick={alternarSonido}
        aria-pressed={enabled}
        aria-label={enabled ? t("sonido.desactivar") : t("sonido.activar")}
      >
        {enabled ? (
          <Volume2 size={22} strokeWidth={1.8} aria-hidden="true" />
        ) : (
          <VolumeX size={22} strokeWidth={1.8} aria-hidden="true" />
        )}
        <span aria-hidden="true">{t("bottomnav.sonido")}</span>
      </button>
    </nav>
  );
}
