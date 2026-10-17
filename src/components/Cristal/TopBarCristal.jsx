import { Menu as MenuIcon, Home } from "lucide-react";
import { rutaHash } from "../../hooks/useHashRoute.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import LanguageToggle from "./LanguageToggle.jsx";
import "./TopBarCristal.css";

// Barra superior, siempre visible (escritorio y celular por igual):
// hamburguesa para abrir el menú (ColumnaCristal.jsx, que ahora es una
// capa a pantalla completa en vez de una columna fija), la marca, el
// selector ES|EN (antes solo vivía dentro del menú -- había que
// abrirlo para cambiar de idioma) y una casita para volver directo a
// Inicio sin tener que abrir el menú primero. Reemplaza a la columna
// siempre visible de antes -- ver CristalShell.jsx.
export default function TopBarCristal({ enInicio, onAbrirMenu, botonMenuRef }) {
  const { t } = useLanguage();

  // Siempre sube hasta arriba de la página, incluso si ya se estaba
  // en Inicio con scroll hacia abajo -- en ese caso el hash no cambia
  // (ya es "#/"), así que no hay hashchange que dispare el scroll-to-
  // top que ya hace CristalShell.jsx al cambiar de ruta; este clic lo
  // cubre directamente en vez de depender de eso.
  const irAInicio = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="cristal-topbar">
      <button
        type="button"
        ref={botonMenuRef}
        className="cristal-topbar__boton"
        onClick={onAbrirMenu}
        aria-label={t("menu.movil.abrir")}
      >
        <MenuIcon size={20} strokeWidth={2} aria-hidden="true" />
      </button>

      <a className="cristal-topbar__marca" href={rutaHash(null)}>
        Tultepec Digital
      </a>

      <LanguageToggle />

      <a
        className="cristal-topbar__boton cristal-topbar__boton--inicio"
        href={rutaHash(null)}
        onClick={irAInicio}
        aria-label={t("menu.inicio")}
        aria-current={enInicio ? "page" : undefined}
      >
        <Home size={20} strokeWidth={1.8} aria-hidden="true" />
      </a>
    </header>
  );
}
