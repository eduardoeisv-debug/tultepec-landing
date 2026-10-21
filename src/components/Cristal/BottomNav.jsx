import { Home, Menu as MenuIcon, Volume2, VolumeX, X } from "lucide-react";
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
//
// Con el menú abierto, ColumnaCristal.jsx (el panel + su fondo
// oscuro) ya no la tapa -- va por encima en z-index (ver BottomNav.css)
// a propósito, para que sus 3 botones se sigan pudiendo tocar. Por
// eso necesita `onCerrarMenu` (cerrarMenu de CristalShell.jsx, la
// misma función que ya usan Escape/clic-fuera/elegir-una-opción): este
// botón de Menú se convierte en "Cerrar" y lo usa, e Inicio también lo
// llama de paso al salir -- Sonido es el único que NO lo toca, para no
// cerrar el menú sin que el usuario lo haya pedido.
export default function BottomNav({ enInicio, onAbrirMenu, onCerrarMenu, menuAbierto }) {
  const { t } = useLanguage();
  const { enabled, toggle, playTap } = useSound();

  // Solo cubre el caso de ya estar en Inicio con scroll hacia abajo: el
  // hash no cambia (ya es "#/"), así que CristalShell.jsx no vuelve a
  // disparar su propio reinicio de scroll (depende de que la ruta
  // cambie). instant, no smooth -- un salto animado acá se sentía
  // igual de lento que el bug real que se corrigió en CristalShell.jsx.
  // onCerrarMenu() también es unconditional (no solo "si estaba
  // abierto"): barato si ya estaba cerrado, y cubre el caso de
  // entrar a Inicio con el menú abierto desde otra sección -- ahí el
  // cambio de ruta SÍ lo cerraría solo (ver el efecto en
  // CristalShell.jsx), pero si ya se estaba en Inicio esa ruta no
  // cambia y nada más lo habría cerrado.
  const irAInicio = () => {
    playTap();
    onCerrarMenu();
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };

  const alAbrirOCerrarMenu = () => {
    playTap();
    if (menuAbierto) {
      onCerrarMenu();
    } else {
      onAbrirMenu();
    }
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
        onClick={alAbrirOCerrarMenu}
        aria-expanded={menuAbierto}
      >
        {menuAbierto ? (
          <X size={22} strokeWidth={1.8} aria-hidden="true" />
        ) : (
          <MenuIcon size={22} strokeWidth={1.8} aria-hidden="true" />
        )}
        <span>{t(menuAbierto ? "bottomnav.cerrar" : "bottomnav.menu")}</span>
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
