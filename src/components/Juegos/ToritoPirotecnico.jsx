// Laberinto del torito para la landing de Tultepec: el torito recorre el
// mapa recogiendo chispas, esquivando cohetes locos y comiéndoselos
// cuando un castillo lo vuelve invencible por unos segundos. Lógica de
// juego sin DOM en torito-logica.js, dibujo/controles en torito-motor.js
// (sus colores de canvas se quedan como están). Textos vía i18n
// (src/i18n/strings.js, claves "juegos.torito.*").

import { useEffect, useRef, useState } from "react";
import { createTorito } from "./torito-motor.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./ToritoPirotecnico.css";

const INICIAL = { status: "idle", puntos: 0, vidas: 3, nivel: 1, niveles: 3, mejor: 0, nuevoRecord: false };

const DIRECCIONES = [
  { dir: "arr", clave: "flechaArriba", trazo: "M6 15l6-6 6 6" },
  { dir: "izq", clave: "flechaIzquierda", trazo: "M15 6l-6 6 6 6" },
  { dir: "aba", clave: "flechaAbajo", trazo: "M6 9l6 6 6-6" },
  { dir: "der", clave: "flechaDerecha", trazo: "M9 6l6 6-6 6" },
];

export default function ToritoPirotecnico() {
  const { t } = useLanguage();
  const seccionRef = useRef(null);
  const lienzoRef = useRef(null);
  const motorRef = useRef(null);
  const [info, setInfo] = useState(INICIAL);

  useEffect(() => {
    const motor = createTorito(lienzoRef.current, { onInfo: setInfo });
    motorRef.current = motor;

    // Si la sección sale de pantalla, el juego se pausa solo.
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) motor.pause();
      },
      { threshold: 0.35 }
    );
    observador.observe(seccionRef.current);

    return () => {
      observador.disconnect();
      motor.destroy();
      motorRef.current = null;
    };
  }, []);

  const { status, puntos, vidas, nivel, niveles, mejor, nuevoRecord } = info;
  const jugar = () => motorRef.current?.start();
  const seguir = () => motorRef.current?.resume();
  const mover = (dir) => motorRef.current?.setDir(dir);

  return (
    <section className="torito" ref={seccionRef} aria-labelledby="torito-titulo">
      <header className="torito__cabecera">
        <h2 className="torito__titulo" id="torito-titulo">
          {t("juegos.torito.titulo")}
        </h2>
        <p className="torito__texto">{t("juegos.torito.texto")}</p>
      </header>

      <div className="torito__barra">
        <dl className="torito__datos">
          <div className="torito__dato">
            <dt>{t("juegos.torito.puntos")}</dt>
            <dd>{puntos}</dd>
          </div>
          <div className="torito__dato">
            <dt>{t("juegos.torito.vidas")}</dt>
            <dd aria-label={t("juegos.torito.vidasAriaLabel", { n: vidas })}>
              {[0, 1, 2].map((i) => (
                <span key={i} className={`torito__vida${i < vidas ? "" : " is-perdida"}`} />
              ))}
            </dd>
          </div>
          <div className="torito__dato">
            <dt>{t("juegos.torito.nivel")}</dt>
            <dd>
              {nivel}/{niveles}
            </dd>
          </div>
          <div className="torito__dato">
            <dt>{t("juegos.torito.mejor")}</dt>
            <dd>{mejor || "—"}</dd>
          </div>
        </dl>
        {status !== "idle" && (
          <button type="button" className="torito__reiniciar" onClick={jugar}>
            {t("juegos.torito.reiniciar")}
          </button>
        )}
      </div>

      <div className="torito__mapa">
        <canvas
          ref={lienzoRef}
          className="torito__lienzo"
          data-no-fireworks
          role="img"
          aria-label={t("juegos.torito.mapaAriaLabel")}
        />

        {status === "idle" && (
          <div className="torito__velo">
            <p className="torito__velo-titulo">{t("juegos.torito.idleTitulo")}</p>
            <p className="torito__velo-texto">{t("juegos.torito.idleTexto")}</p>
            <button type="button" className="torito__boton" onClick={jugar}>
              {t("juegos.torito.jugar")}
            </button>
          </div>
        )}

        {status === "paused" && (
          <div className="torito__velo">
            <p className="torito__velo-titulo">{t("juegos.torito.pausaTitulo")}</p>
            <button type="button" className="torito__boton" onClick={seguir}>
              {t("juegos.torito.seguir")}
            </button>
          </div>
        )}

        {status === "ready" && (
          <div className="torito__velo torito__velo--suave" role="status">
            <p className="torito__pildora">{t("juegos.torito.listo")}</p>
          </div>
        )}

        {status === "clear" && (
          <div className="torito__velo torito__velo--suave" role="status">
            <p className="torito__pildora">{t("juegos.torito.nivelCompleto")}</p>
          </div>
        )}

        {status === "over" && (
          <div className="torito__velo" role="status">
            <p className="torito__velo-titulo">{t("juegos.torito.overTitulo")}</p>
            <p className="torito__velo-texto">
              {t("juegos.torito.overTexto", { puntos })}
              {nuevoRecord ? t("juegos.torito.esMejorMarca") : ""}
            </p>
            <button type="button" className="torito__boton" onClick={jugar}>
              {t("juegos.torito.jugarOtraVez")}
            </button>
          </div>
        )}

        {status === "won" && (
          <div className="torito__velo" role="status">
            <p className="torito__velo-titulo">{t("juegos.torito.ganasteTitulo")}</p>
            <p className="torito__velo-texto">
              {t("juegos.torito.ganasteTexto", { niveles, puntos })}
              {nuevoRecord ? t("juegos.torito.esMejorMarca") : ""}
            </p>
            <button type="button" className="torito__boton" onClick={jugar}>
              {t("juegos.torito.jugarOtraVez")}
            </button>
          </div>
        )}
      </div>

      <div className="torito__flechas" role="group" aria-label={t("juegos.torito.controlesAriaLabel")}>
        {DIRECCIONES.map((f) => (
          <button
            key={f.dir}
            type="button"
            className={`torito__flecha torito__flecha--${f.dir}`}
            aria-label={t(`juegos.torito.${f.clave}`)}
            onPointerDown={(e) => {
              e.preventDefault();
              mover(f.dir);
            }}
            onClick={(e) => {
              // Con teclado (Enter o espacio) el clic llega sin puntero.
              if (e.detail === 0) mover(f.dir);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={f.trazo} />
            </svg>
          </button>
        ))}
      </div>

      <p className="torito__ayuda torito__ayuda--teclado">{t("juegos.torito.ayudaTeclado")}</p>
      <p className="torito__ayuda torito__ayuda--tactil">{t("juegos.torito.ayudaTactil")}</p>
    </section>
  );
}
