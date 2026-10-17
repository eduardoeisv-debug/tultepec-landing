import { useLanguage } from "../../i18n/LanguageContext.jsx";
import AgradecimientoEspecial from "../shared/AgradecimientoEspecial.jsx";
import "./Footer.css";

export default function Footer({ onOpenPrivacy }) {
  const { t } = useLanguage();
  const anio = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <span className="footer__brand">Tultepec · {t("header.subtitle")}</span>
          <p className="footer__tagline">{t("footer.tagline")}</p>
          <p className="footer__disclaimer">{t("footer.disclaimer")}</p>
        </div>

        <div className="footer__agradecimiento-card">
          <AgradecimientoEspecial className="footer__thanks" />
        </div>
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
