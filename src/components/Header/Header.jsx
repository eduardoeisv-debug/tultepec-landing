import { useLanguage } from "../../i18n/LanguageContext.jsx";
import LanguageSwitcher from "../../i18n/LanguageSwitcher.jsx";
import HeaderPapelPicado from "./HeaderPapelPicado.jsx";
import "./Header.css";

// Encabezado fijo de ancho completo: marca a la izquierda (lleva a
// Inicio, "#/" en el router de hash -- ver useHashRoute.js) y el
// selector de idioma a la derecha, reutilizado tal cual. El menú
// "Explora" que vivía aquí se reemplazó por el menú lateral
// (SidebarMenu.jsx); el botón de abrir ese menú en celular vive en
// Layout.jsx, no aquí, porque solo tiene sentido junto al panel que
// controla.
export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#/">
          <span className="site-header__brand-text">
            <span>Tultepec</span>
            <span className="site-header__subtitle">· {t("header.subtitle")}</span>
          </span>
        </a>
        <LanguageSwitcher />
      </div>
      <HeaderPapelPicado />
    </header>
  );
}
