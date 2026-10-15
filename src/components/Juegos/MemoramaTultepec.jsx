// Memorama pirotécnico para la landing de Tultepec: 8 parejas de dibujos
// (memorama-iconos.js), lógica de volteo/emparejado sin DOM
// (memorama-motor.js) y los textos vía i18n (src/i18n/strings.js,
// claves "juegos.memorama.*"), para que funcione en español e inglés.

import { useEffect, useRef, useState } from "react";
import { ICONOS } from "./memorama-iconos.js";
import { nuevoJuego, voltear, ocultarFallo, formatoTiempo, esMejor } from "./memorama-motor.js";
import { playCardFlipSound } from "../../lib/cardSound.js";
import { playVictorySound } from "../../lib/victorySound.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./MemoramaTultepec.css";

const CLAVE = "tultepec:memorama-mejor";
const IDS = ICONOS.map((i) => i.id);
const POR_ID = Object.fromEntries(ICONOS.map((i) => [i.id, i]));

function leerMejor() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE));
  } catch {
    return null;
  }
}

function guardarMejor(marca) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(marca));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

export default function MemoramaTultepec() {
  const { t } = useLanguage();
  const [juego, setJuego] = useState(() => nuevoJuego(IDS));
  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const [mejor, setMejor] = useState(() => leerMejor());
  const [nuevoRecord, setNuevoRecord] = useState(false);
  const segundosRef = useRef(0);

  useEffect(() => {
    segundosRef.current = segundos;
  }, [segundos]);

  // Reloj: cuenta desde la primera carta volteada hasta terminar.
  useEffect(() => {
    if (!corriendo) return undefined;
    const id = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [corriendo]);

  // Si las dos cartas no coinciden, se tapan de nuevo a los 0.8 s.
  useEffect(() => {
    if (!juego.bloqueado) return undefined;
    const id = setTimeout(() => setJuego(ocultarFallo), 800);
    return () => clearTimeout(id);
  }, [juego.bloqueado]);

  // Al terminar: detener reloj y revisar la mejor marca. segundosRef (no
  // `segundos` directo) porque este efecto solo debe correr cuando el
  // juego termina, no en cada segundo que pasa -- juego.intentos sí está
  // en la lista de dependencias, pero la guarda de arriba lo vuelve un
  // no-op mientras el juego sigue en curso.
  useEffect(() => {
    if (!juego.terminado) return;
    setCorriendo(false);
    playVictorySound();
    const marca = { intentos: juego.intentos, segundos: segundosRef.current };
    if (esMejor(marca, leerMejor())) {
      guardarMejor(marca);
      setMejor(marca);
      setNuevoRecord(true);
    }
  }, [juego.terminado, juego.intentos]);

  function alVoltear(i) {
    // Mismas condiciones que voltear() en memorama-motor.js -- solo suena
    // cuando el volteo de verdad va a ocurrir, no en cada clic (p.ej. una
    // carta ya abierta o emparejada, o el tablero bloqueado entre intentos).
    const carta = juego.cartas[i];
    if (!carta || juego.bloqueado || juego.terminado || carta.abierta || carta.par) return;
    playCardFlipSound();
    if (!corriendo && !juego.terminado) setCorriendo(true);
    setJuego((previo) => voltear(previo, i));
  }

  function reiniciar() {
    setJuego(nuevoJuego(IDS));
    setSegundos(0);
    setCorriendo(false);
    setNuevoRecord(false);
  }

  return (
    <section className="mem" aria-labelledby="mem-titulo">
      <header className="mem__cabecera">
        <h2 className="mem__titulo" id="mem-titulo">
          {t("juegos.memorama.titulo")}
        </h2>
        <p className="mem__texto">{t("juegos.memorama.texto")}</p>
      </header>

      <div className="mem__barra">
        <dl className="mem__datos">
          <div className="mem__dato">
            <dt>{t("juegos.memorama.intentos")}</dt>
            <dd>{juego.intentos}</dd>
          </div>
          <div className="mem__dato">
            <dt>{t("juegos.memorama.tiempo")}</dt>
            <dd>{formatoTiempo(segundos)}</dd>
          </div>
          <div className="mem__dato">
            <dt>{t("juegos.memorama.mejor")}</dt>
            <dd>{mejor ? `${mejor.intentos} · ${formatoTiempo(mejor.segundos)}` : "—"}</dd>
          </div>
        </dl>
        <button type="button" className="mem__boton" onClick={reiniciar}>
          {t("juegos.memorama.reiniciar")}
        </button>
      </div>

      <div className="mem__tablero" role="group" aria-label={t("juegos.memorama.cartasAriaLabel")}>
        {juego.cartas.map((carta, i) => {
          const icono = POR_ID[carta.id];
          const nombre = t(`juegos.memorama.carta.${icono.id}`);
          const clases = `mem__carta${carta.abierta ? " is-abierta" : ""}${carta.par ? " is-par" : ""}`;
          return (
            <button
              key={carta.uid}
              type="button"
              className={clases}
              style={{ "--cara": icono.color }}
              onClick={() => alVoltear(i)}
              aria-label={carta.abierta ? nombre : t("juegos.memorama.cartaBocaAbajo", { n: i + 1 })}
            >
              <span className="mem__escena">
                <span className="mem__giro">
                  <span className="mem__dorso" aria-hidden="true" />
                  <span className="mem__frente">
                    <span className="mem__dibujo" dangerouslySetInnerHTML={{ __html: icono.svg }} />
                    <span className="mem__nombre">{nombre}</span>
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {juego.terminado && (
        <div className="mem__fin" role="status">
          <p className="mem__fin-titulo">{t("juegos.memorama.finTitulo")}</p>
          <p className="mem__fin-texto">
            {t("juegos.memorama.finTexto", { intentos: juego.intentos, tiempo: formatoTiempo(segundos) })}
            {nuevoRecord ? t("juegos.memorama.esMejorMarca") : ""}
          </p>
          <button type="button" className="mem__boton mem__boton--fuerte" onClick={reiniciar}>
            {t("juegos.memorama.jugarOtraVez")}
          </button>
        </div>
      )}
    </section>
  );
}
