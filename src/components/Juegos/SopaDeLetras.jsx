// Sopa de letras de Tultepec: tablero de 12x12 con 10 palabras del
// pueblo (sopa-motor.js), selección en dos toques (primera y última
// letra, sin arrastrar -- funciona igual con dedo, mouse y teclado) y los
// textos vía i18n (claves "juegos.sopa.*"). Cada idioma usa su propia
// lista de palabras, así que al cambiar de idioma se arma una sopa nueva.

import { useMemo, useState } from "react";
import { PALABRAS, generarTablero, trazarLinea, buscarPalabra } from "./sopa-motor.js";
import { playVictorySound } from "../../lib/victorySound.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./SopaDeLetras.css";

function Sopa({ palabras }) {
  const { t } = useLanguage();
  const [tablero, setTablero] = useState(() => generarTablero(palabras));
  const [inicio, setInicio] = useState(null);
  const [halladas, setHalladas] = useState([]); // [{ palabra, celdas }]

  const celdasHalladas = useMemo(() => new Set(halladas.flatMap((h) => h.celdas)), [halladas]);
  const nombresHallados = halladas.map((h) => h.palabra);
  const terminado = halladas.length === palabras.length;

  function alTocar(f, c) {
    if (terminado) return;
    if (!inicio) {
      setInicio({ f, c });
      return;
    }
    // Tocar otra vez la misma letra cancela la selección.
    if (inicio.f === f && inicio.c === c) {
      setInicio(null);
      return;
    }
    const linea = trazarLinea(tablero, inicio, { f, c });
    // Fuera de línea: la letra tocada pasa a ser el nuevo inicio.
    if (!linea) {
      setInicio({ f, c });
      return;
    }
    const palabra = buscarPalabra(linea.texto, palabras, nombresHallados);
    if (palabra) {
      const nuevas = [...halladas, { palabra, celdas: linea.celdas }];
      setHalladas(nuevas);
      if (nuevas.length === palabras.length) playVictorySound();
    }
    setInicio(null);
  }

  function reiniciar() {
    setTablero(generarTablero(palabras));
    setHalladas([]);
    setInicio(null);
  }

  return (
    <section className="sopa" aria-labelledby="sopa-titulo">
      <header className="sopa__cabecera">
        <h2 className="sopa__titulo" id="sopa-titulo">
          {t("juegos.sopa.titulo")}
        </h2>
        <p className="sopa__texto">{t("juegos.sopa.texto")}</p>
      </header>

      <div className="sopa__barra">
        <dl className="sopa__datos">
          <div className="sopa__dato">
            <dt>{t("juegos.sopa.encontradas")}</dt>
            <dd>
              {halladas.length} / {palabras.length}
            </dd>
          </div>
        </dl>
        <button type="button" className="sopa__boton" onClick={reiniciar}>
          {t("juegos.sopa.reiniciar")}
        </button>
      </div>

      <div className="sopa__tablero" role="group" aria-label={t("juegos.sopa.tableroAriaLabel")}>
        {tablero.map((fila, f) =>
          fila.map((letra, c) => {
            const clave = `${f}-${c}`;
            const esInicio = inicio?.f === f && inicio?.c === c;
            const esHallada = celdasHalladas.has(clave);
            const clases = `sopa__celda${esHallada ? " is-hallada" : ""}${esInicio ? " is-inicio" : ""}`;
            return (
              <button
                key={clave}
                type="button"
                className={clases}
                onClick={() => alTocar(f, c)}
                aria-pressed={esInicio}
                aria-label={t("juegos.sopa.celdaAriaLabel", { letra, fila: f + 1, columna: c + 1 })}
              >
                {letra}
              </button>
            );
          }),
        )}
      </div>

      <ul className="sopa__palabras" aria-label={t("juegos.sopa.palabrasAriaLabel")}>
        {palabras.map((p) => (
          <li key={p} className={nombresHallados.includes(p) ? "is-hallada" : ""}>
            {p}
          </li>
        ))}
      </ul>

      {terminado && (
        <div className="sopa__fin" role="status">
          <p className="sopa__fin-titulo">{t("juegos.sopa.finTitulo")}</p>
          <p className="sopa__fin-texto">{t("juegos.sopa.finTexto")}</p>
          <button type="button" className="sopa__boton sopa__boton--fuerte" onClick={reiniciar}>
            {t("juegos.sopa.jugarOtraVez")}
          </button>
        </div>
      )}
    </section>
  );
}

export default function SopaDeLetras() {
  const { language } = useLanguage();
  // key={language}: al cambiar de idioma se descarta el juego en curso y
  // se arma uno con las palabras del idioma nuevo.
  return <Sopa key={language} palabras={PALABRAS[language] ?? PALABRAS.es} />;
}
