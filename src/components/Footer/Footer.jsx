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
        {/* Aviso de privacidad vivía como botón aparte en .footer__bottom
            (junto a "Hecho por EA" y el copyright) -- se suma aquí mismo,
            después de Agradecimientos/Acerca de, para que las tres salidas
            del pie queden en una sola fila. Es <button> (abre el modal in-
            línea, no navega), no <a> como sus dos vecinos, pero comparte el
            mismo estilo -- ver footer__links en Footer.css. */}
        <nav className="footer__links" aria-label={t("footer.linksAriaLabel")}>
          {ENLACES_PIE.map((item) => (
            <a key={item.id} href={rutaHash(item.id)}>
              {t(item.label)}
            </a>
          ))}
          <button type="button" onClick={onOpenPrivacy}>
            {t("footer.privacyLink")}
          </button>
        </nav>
      </div>

      <div className="container footer__bottom">
        <span className="footer__signature">
          {/* alt="" (decorativo): el lema de abajo ya dice en texto real
              lo que antes solo estaba en el alt de la imagen -- con los
              dos, un lector de pantalla anunciaría la misma frase dos
              veces seguidas. */}
          <span className="footer__signature-seal">
            <img className="footer__signature-seal-icono" src="/images/brand/logo-ea.svg" alt="" width="72" height="72" />
            {/* Reflejo decorativo: ver footer__signature-seal-reflejo en
                Footer.css para por qué usa background-image en vez de
                <img> (evita que el pulso de los nodos del SVG se repita
                también aquí, en espejo). */}
            <span className="footer__signature-seal-reflejo" aria-hidden="true" />
          </span>
          <span className="footer__signature-text">
            <span className="footer__signature-madeby">
              {t("footer.madeBy")} <strong>EA</strong>
            </span>
            <span className="footer__signature-tagline">{t("footer.sealTagline")}</span>
          </span>
        </span>
        <span className="footer__copyright">
          © {anio} {t("footer.copyright")}
        </span>
      </div>
    </footer>
  );
}
