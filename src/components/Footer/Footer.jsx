import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Footer.css";

export default function Footer({ onOpenPrivacy }) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <span className="footer__brand">Tultepec · {t("header.subtitle")}</span>
          <p className="footer__tagline">{t("footer.tagline")}</p>
          <p className="footer__thanks">
            {isEn ? "A special thanks to " : "Un agradecimiento especial a "}
            <strong>{t("footer.thanksName1")}</strong>{" "}
            {isEn ? "and " : "y al "}
            <strong>{t("footer.thanksName2")}</strong>
            {isEn
              ? ", for generously sharing their knowledge and memories — the true heart of this archive."
              : ", por compartir con generosidad su conocimiento y sus recuerdos — el verdadero corazón de este archivo."}
          </p>
        </div>

        <div className="footer__meta">
          <p>{t("footer.disclaimer")}</p>
        </div>
      </div>
      <div className="container footer__signature">
        <span className="footer__signature-seal">
          <img src="/images/brand/ea-seal.jpg" alt={t("footer.sealAlt")} />
        </span>
        <span className="footer__signature-text">
          {t("footer.madeBy")} <strong>EA</strong>
        </span>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} {t("footer.copyright")}</span>
        <button type="button" className="footer__privacy-link" onClick={onOpenPrivacy}>
          {t("footer.privacyLink")}
        </button>
      </div>
    </footer>
  );
}
