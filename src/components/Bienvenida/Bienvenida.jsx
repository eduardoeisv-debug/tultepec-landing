import TownSilhouette from "../shared/TownSilhouette.jsx";
import ScrollCue from "../shared/ScrollCue.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./Bienvenida.css";

const TOOTH_COUNT = 14;
const TOOTH_WIDTH = 400 / TOOTH_COUNT;

// Borde "picado" del encabezado de la carta: una tira sólida + una fila de
// triángulos, igual que el remate de HeroPapelPicado.jsx pero sin las
// banderitas colgantes (aquí es el borde de una tarjeta, no una guirnalda).
// viewBox fijo + preserveAspectRatio="none" para que se estire al ancho
// real de la tarjeta en cualquier pantalla, sin tener que calcular nada en
// JS según el layout.
function CartaEdge() {
  const teeth = Array.from({ length: TOOTH_COUNT }, (_, i) => {
    const x = i * TOOTH_WIDTH;
    return <path key={i} d={`M${x},10 L${x + TOOTH_WIDTH},10 L${x + TOOTH_WIDTH / 2},20 Z`} />;
  });
  return (
    <svg className="bienvenida-carta__edge" viewBox="0 0 400 20" preserveAspectRatio="none" aria-hidden="true">
      <rect width="400" height="10" />
      {teeth}
    </svg>
  );
}

// Nueva sección "Carta de bienvenida": va justo después del hero y antes
// de la silueta del pueblo (que antes cerraba el hero, ahora cierra esta
// sección -- ver TownSilhouette, movida aquí sin cambios propios). Dos
// columnas desde 860px (texto + carta), apiladas debajo. El ScrollCue de
// abajo retoma el "¿Cuándo vienes?" que antes vivía al final del hero.
export default function Bienvenida() {
  const { t } = useLanguage();

  return (
    <section className="bienvenida" id="bienvenida" aria-labelledby="bienvenida-title">
      <div className="container bienvenida__inner">
        <div className="bienvenida__grid">
          <div className="bienvenida__copy">
            <span className="eyebrow eyebrow--light">{t("bienvenida.eyebrow")}</span>
            <h2 id="bienvenida-title">{t("bienvenida.title")}</h2>
            <p className="bienvenida__subtitle">{t("bienvenida.subtitle")}</p>
          </div>

          <article className="bienvenida-carta">
            <CartaEdge />
            <div className="bienvenida-carta__body">
              <p>{t("bienvenida.carta.p1")}</p>
              <p>{t("bienvenida.carta.p2")}</p>
              <p>{t("bienvenida.carta.p3")}</p>

              <div className="bienvenida-carta__firma">
                <span className="bienvenida-carta__despedida">{t("bienvenida.firma.despedida")}</span>
                <span className="bienvenida-carta__nombres">{t("bienvenida.firma.nombres")}</span>
              </div>

              <div className="bienvenida-carta__cta">
                <p className="bienvenida-carta__pregunta">{t("bienvenida.cta.pregunta")}</p>
                <a href="#comparte-memoria" className="btn btn--dark">
                  {t("bienvenida.cta.compartir")}
                </a>
                <a href="#memorias" className="bienvenida-carta__link">
                  {t("bienvenida.cta.leeMemorias")}
                </a>
              </div>
            </div>
          </article>
        </div>

        <ScrollCue
          label={t("hero.scrollCue")}
          onClick={() => document.getElementById("visita")?.scrollIntoView({ block: "start" })}
        />
      </div>

      <TownSilhouette />
    </section>
  );
}
