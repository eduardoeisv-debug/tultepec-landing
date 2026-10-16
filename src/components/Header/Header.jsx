import { useLanguage } from "../../i18n/LanguageContext.jsx";
import LanguageSwitcher from "../../i18n/LanguageSwitcher.jsx";
import ExploraMenu from "./ExploraMenu.jsx";
import "./Header.css";

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#inicio">
          <span className="site-header__brand-text">
            <span>Tultepec</span>
            <span className="site-header__subtitle">· {t("header.subtitle")}</span>
          </span>
        </a>
        <div className="site-header__actions">
          <ExploraMenu />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
