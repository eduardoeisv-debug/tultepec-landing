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
        Tultepec <span className="cristal-topbar__marca-sub">· {t("header.subtitle")}</span>
      </a>

      <LanguageToggle />

      <a
        className="cristal-topbar__boton"
        href={rutaHash(null)}
        aria-label={t("menu.inicio")}
        aria-current={enInicio ? "page" : undefined}
      >
        <Home size={20} strokeWidth={1.8} aria-hidden="true" />
      </a>
    </header>
  );
}
