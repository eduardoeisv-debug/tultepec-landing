import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { rutaHash } from "../../hooks/useHashRoute.js";
import SECTIONS from "../../data/sections.js";
import "./Footer.css";

// Agradecimientos y Acerca de: en el pie, no como tarjeta de Inicio ni
// fila aparte -- showInFooter en sections.js (la misma lista que lee
// el menú lateral, ver ColumnaCristal.jsx) es la única fuente, así que
// no hay una lista propia de este componente que se pueda desincronizar.
const ENLACES_PIE = SECTIONS.filter((s) => s.showInFooter);

export default function Footer({ onOpenPrivacy }) {
  const { t } = useLanguage();
  const anio = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <span className="footer__brand">Tultepec · {t("header.subtitle")}</span>
        <p className="footer__tagline">{t("footer.tagline")}</p>
        <p className="footer__disclaimer">{t("footer.disclaimer")}</p>
        <nav className="footer__links" aria-label={t("footer.linksAriaLabel")}>
          {ENLACES_PIE.map((item) => (
            <a key={item.id} href={rutaHash(item.id)}>
              {t(item.label)}
            </a>
          ))}
        </nav>
      </div>

      <div className="container footer__bottom">
        <span className="footer__signature">
          <span className="footer__signature-seal">
            <img src="/images/brand/ea-seal.jpg" alt={t("footer.sealAlt")} width="52" height="52" />
          </span>
          <span className="footer__signature-text">
            {t("footer.madeBy")} <strong>EA</strong>
          </span>
        </span>
        <span className="footer__copyright">
          © {anio} {t("footer.copyright")}
        </span>
        <button type="button" className="footer__privacy-link" onClick={onOpenPrivacy}>
          {t("footer.privacyLink")}
        </button>
      </div>
    </footer>
  );
}
