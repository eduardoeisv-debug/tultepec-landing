import { useEffect, useRef, useState } from "react";
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

// "Carta de bienvenida": va justo después del hero y antes de la silueta
// del pueblo (que cierra la sección -- ver TownSilhouette). Empieza
// compacta, como una nota con solapa de papel picado: al tocarla se abre
// y muestra el mensaje completo (dos columnas desde 860px); al salir la
// sección de la pantalla (scroll hacia otra parte de la página) se vuelve
// a compactar sola, igual que el laberinto del torito se pausa solo al
// salir de vista -- así no queda desplegada todo el tiempo, solo mientras
// alguien la está viendo.
export default function Bienvenida() {
  const { t } = useLanguage();
  const [abierta, setAbierta] = useState(false);
  const [resaltar, setResaltar] = useState(false);
  const seccionRef = useRef(null);
  // Espejo de `abierta` legible dentro del observer sin tener que
  // reconstruirlo cada vez que cambia (su efecto solo se monta una vez).
  const abiertaRef = useRef(false);
  // Para no repetir la animación de aviso ni siquiera si la sección
  // vuelve a entrar en pantalla más tarde en la misma visita.
  const yaAvisadoRef = useRef(false);

  useEffect(() => {
    abiertaRef.current = abierta;
  }, [abierta]);

  useEffect(() => {
    const el = seccionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const reduceMotion =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) {
          setAbierta(false);
          return;
        }
        // Primera vez que la nota entra en pantalla: un aviso breve (ícono
        // + brillo del borde), una sola vez por visita, y solo si todavía
        // está cerrada -- si ya la abrieron no hace falta llamar la
        // atención hacia algo que ya vieron.
        if (!reduceMotion && !yaAvisadoRef.current && !abiertaRef.current) {
          yaAvisadoRef.current = true;
          setResaltar(true);
          setTimeout(() => setResaltar(false), 1200);
        }
      },
      { threshold: 0 }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <section className="bienvenida" id="bienvenida" aria-labelledby="bienvenida-nota-titulo" ref={seccionRef}>
      <div className="container bienvenida__inner">
        <button
          type="button"
          className={`bienvenida__nota${abierta ? " is-abierta" : ""}${resaltar ? " is-resaltada" : ""}`}
          onClick={() => {
            setResaltar(false);
            setAbierta((a) => !a);
          }}
          aria-expanded={abierta}
          aria-controls="bienvenida-contenido"
        >
          <CartaEdge />
          <span className="bienvenida__nota-cuerpo">
            <span className="bienvenida__nota-icono" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M4 7l8 6 8-6" />
              </svg>
            </span>
            <span className="bienvenida__nota-texto">
              <span className="bienvenida__nota-titulo" id="bienvenida-nota-titulo">
                {t("bienvenida.nota.titulo")}
              </span>
              <span className="bienvenida__nota-hint">{t(abierta ? "bienvenida.ocultarNota" : "bienvenida.leerNota")}</span>
            </span>
            <svg
              className="bienvenida__nota-chevron"
              viewBox="0 0 24 24"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>

        <div className={`bienvenida__acordeon${abierta ? " is-abierta" : ""}`} id="bienvenida-contenido">
          <div className="bienvenida__acordeon-inner" inert={!abierta}>
            <div className="bienvenida__grid">
              <div className="bienvenida__copy">
                <span className="eyebrow eyebrow--light">{t("bienvenida.eyebrow")}</span>
                <h2>{t("bienvenida.title")}</h2>
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
          </div>
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
