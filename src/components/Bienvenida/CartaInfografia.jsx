import { Flame, MessageSquare, Landmark, CalendarDays, Image as ImageIcon, Home, Sparkle } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import LogoEaReflejo from "../shared/LogoEaReflejo.jsx";
import "./CartaInfografia.css";

// Contenido de la carta, con el mismo lenguaje visual que las secciones
// del sitio (Pirotecnia/Memorias: fondo --color-night-900, tarjetas
// rgba(255,255,255,.06) con borde dorado, Fraunces/Work Sans) en vez de
// la infografía de línea de tiempo que traía antes -- ver el historial.
// COMPARTIDO entre la hoja de celular (CartaSheet.jsx) y el acordeón de
// escritorio (Bienvenida.jsx): un solo componente, sin duplicar texto
// ni estilos; el modelo de caja se adapta por CSS según el ancestro
// real (ver CartaInfografia.css), no por props.
//
// `tituloId`/`tituloRef`: opcionales -- solo CartaSheet.jsx los pasa
// (su <h2> necesita un id para el aria-labelledby del diálogo, y un
// ref para enfocarlo al abrir); Bienvenida.jsx no los manda.
export default function CartaInfografia({ tituloId, tituloRef }) {
  const { t } = useLanguage();
  return (
    <div className="carta-infografia">
      <div className="carta-infografia__sello" aria-hidden="true">
        <Flame className="carta-infografia__selloIcono" strokeWidth={2} />
      </div>

      <div className="carta-infografia__encabezado">
        <span className="carta-infografia__eyebrow">{t("bienvenida.eyebrow")}</span>
        <h2 id={tituloId} ref={tituloRef} tabIndex={tituloRef ? -1 : undefined} className="carta-infografia__titulo">
          {t("bienvenida.title")}
        </h2>
        <p className="carta-infografia__subtitulo">{t("bienvenida.subtitle")}</p>
      </div>

      <span className="carta-infografia__separador" aria-hidden="true">
        <Sparkle size={14} strokeWidth={1.8} />
      </span>

      <div className="carta-infografia__cuerpo">
        <p className="carta-infografia__parrafo">
          {t("bienvenida.infografia.parrafo1Pre")}
          <strong className="carta-infografia__resaltado">{t("bienvenida.infografia.parrafo1Resaltado")}</strong>
          {t("bienvenida.infografia.parrafo1Post")}
        </p>

        <blockquote className="carta-infografia__cita">{t("bienvenida.infografia.cita")}</blockquote>

        <div className="carta-infografia__seccionLista">
          <span className="carta-infografia__etiquetaFilete">{t("bienvenida.infografia.listaTitulo")}</span>
          <ul className="carta-infografia__lista">
            <li className="carta-infografia__fila">
              <span className="carta-infografia__filaIcono carta-infografia__filaIcono--morado" aria-hidden="true">
                <MessageSquare size={17} strokeWidth={1.8} />
              </span>
              <span>{t("bienvenida.infografia.listaItem1")}</span>
            </li>
            <li className="carta-infografia__fila">
              <span className="carta-infografia__filaIcono carta-infografia__filaIcono--azul" aria-hidden="true">
                <Landmark size={17} strokeWidth={1.8} />
              </span>
              <span>{t("bienvenida.infografia.listaItem2")}</span>
            </li>
            <li className="carta-infografia__fila">
              <span className="carta-infografia__filaIcono carta-infografia__filaIcono--gris" aria-hidden="true">
                <CalendarDays size={17} strokeWidth={1.8} />
              </span>
              <span>{t("bienvenida.infografia.listaItem3")}</span>
            </li>
            <li className="carta-infografia__fila">
              <span className="carta-infografia__filaIcono carta-infografia__filaIcono--rosaOscuro" aria-hidden="true">
                <ImageIcon size={17} strokeWidth={1.8} />
              </span>
              <span>{t("bienvenida.infografia.listaItem4")}</span>
            </li>
          </ul>
        </div>

        <div className="carta-infografia__tarjeta">
          <span className="carta-infografia__etiqueta">{t("bienvenida.infografia.siEresDeAquiEtiqueta")}</span>
          <p className="carta-infografia__tarjetaTexto">{t("bienvenida.infografia.siEresDeAquiTexto")}</p>
        </div>

        <div className="carta-infografia__tarjeta carta-infografia__tarjeta--espaciada">
          <span className="carta-infografia__tarjetaCabecera">
            <span className="carta-infografia__tarjetaIcono" aria-hidden="true">
              <Home size={17} strokeWidth={1.8} />
            </span>
            <span className="carta-infografia__etiqueta">{t("bienvenida.infografia.siVisitasEtiqueta")}</span>
          </span>
          <p className="carta-infografia__tarjetaTextoGrande">{t("bienvenida.infografia.siVisitasTexto")}</p>
        </div>
      </div>

      <div className="carta-infografia__cierre">
        <span className="carta-infografia__separador" aria-hidden="true">
          <Sparkle size={14} strokeWidth={1.8} />
        </span>
        <p className="carta-infografia__despedida">{t("bienvenida.firma.despedida")}</p>
        <p className="carta-infografia__nombres">
          <span className="carta-infografia__nombreParte">{t("bienvenida.firma.nombrePila")}</span>{" "}
          <span className="carta-infografia__nombreParte">{t("bienvenida.firma.apellidos")}</span>
        </p>
        <LogoEaReflejo size={104} className="carta-infografia__logo" />
        <p className="carta-infografia__hechoPor">
          {t("footer.madeBy")} <strong>EA</strong>
        </p>
        <p className="carta-infografia__lema">{t("footer.sealTagline")}</p>
      </div>
    </div>
  );
}
