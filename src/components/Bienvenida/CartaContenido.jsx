import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Bienvenida.css";

// Contenido real de la carta -- extraído de Bienvenida.jsx para que el
// acordeón de escritorio (Bienvenida.jsx, sin cambios) y la hoja
// inferior de celular (CartaSheet.jsx) muestren EXACTAMENTE lo mismo
// sin duplicar el JSX/las claves de traducción en dos archivos. Mismas
// clases que ya traía (bienvenida__grid/__copy/-carta...), así que
// conserva su estilo actual en los dos contextos sin tocar Bienvenida.css.
//
// `tituloId`/`tituloRef`: opcionales -- CartaSheet.jsx los pasa (su
// <h2> necesita un id para el aria-labelledby del diálogo, y un ref
// para poder enfocarlo al abrir, ver ese archivo); Bienvenida.jsx no
// los manda (no hacen falta ahí, y los dos árboles conviven montados a
// la vez -- uno oculto por CSS según el ancho -- así que un id fijo
// aquí aparecería duplicado en el DOM). tabIndex solo cuando SÍ hay
// tituloRef: sin él, este <h2> no necesita entrar al foco programático
// para nada.
export default function CartaContenido({ tituloId, tituloRef }) {
  const { t } = useLanguage();
  return (
    <div className="bienvenida__grid">
      <div className="bienvenida__copy">
        <span className="eyebrow eyebrow--light">{t("bienvenida.eyebrow")}</span>
        <h2 id={tituloId} ref={tituloRef} tabIndex={tituloRef ? -1 : undefined}>
          {t("bienvenida.title")}
        </h2>
        <p className="bienvenida__subtitle">{t("bienvenida.subtitle")}</p>
      </div>

      <article className="bienvenida-carta">
        <div className="bienvenida-carta__body">
          <p>{t("bienvenida.carta.p1")}</p>
          <p>{t("bienvenida.carta.p2")}</p>
          <p>{t("bienvenida.carta.p3")}</p>

          <div className="bienvenida-carta__firma">
            <span className="bienvenida-carta__despedida">{t("bienvenida.firma.despedida")}</span>
            <span className="bienvenida-carta__nombres">{t("bienvenida.firma.nombres")}</span>
          </div>

          <div className="bienvenida-carta__cierre" aria-hidden="true">
            <img src="/images/brand/logo-ea.svg" alt="" width="34" height="34" />
          </div>
        </div>
      </article>
    </div>
  );
}
