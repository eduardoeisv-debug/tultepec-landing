import { lazy, Suspense, useState } from "react";
import { Gamepad2 } from "lucide-react";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";
import SegmentedTabs from "../../shared/SegmentedTabs.jsx";
import "../../shared/SegmentedTabs.css";
import "./JuegosSeccion.css";

// El selector entre los 3 juegos vivía antes en Juegos.jsx (se quitó
// en una tarea previa de este proyecto al volverse cada juego su
// propia ruta del menú lateral) -- Menú Cristal pide "Juegos... sin
// subopciones" en la columna, así que aquí se reconstruye con el
// mismo patrón de pestañas (SegmentedTabs) que ya usan Galería,
// Relatos y Memorias, para no inventar un control nuevo. Cada juego
// se carga diferido: nadie descarga los 3 solo por abrir esta vista.
const ToritoPirotecnico = lazy(() => import("../../Juegos/ToritoPirotecnico.jsx"));
const MemoramaTultepec = lazy(() => import("../../Juegos/MemoramaTultepec.jsx"));
const SopaDeLetras = lazy(() => import("../../Juegos/SopaDeLetras.jsx"));

// Mismos 3 import() de arriba, sueltos de lazy() -- llamarlos aparte
// no descarga nada de más (el navegador/Vite deduplica por URL del
// chunk): solo adelanta la descarga para que, cuando el usuario de
// verdad entra a Juegos (o cambia de pestaña), el chunk ya esté en
// caché. Lo llaman ColumnaCristal.jsx (al pasar el mouse/tocar la fila
// "Juegos" del menú) y CristalShell.jsx (en idle, tras el primer
// render) -- ver el historial de esta tarea para el porqué.
export function preloadJuegos() {
  import("../../Juegos/ToritoPirotecnico.jsx");
  import("../../Juegos/MemoramaTultepec.jsx");
  import("../../Juegos/SopaDeLetras.jsx");
}

export default function JuegosSeccion() {
  const { t } = useLanguage();
  const [juego, setJuego] = useState("torito");

  return (
    <div className="cristal-juegos">
      <SegmentedTabs
        idPrefix="juegos"
        ariaLabel={t("menu.item.juegos")}
        activeId={juego}
        onChange={setJuego}
        // Corta/larga (.segmented-tabs__label-corta/-larga, ver
        // SegmentedTabs.css): "Laberinto del torito" no cabía en su
        // óvalo en celular (las 3 pestañas reparten el ancho por
        // igual) y el texto se salía -- abajo de 480px se ve el
        // nombre corto, arriba el completo.
        tabs={[
          {
            id: "torito",
            icon: Gamepad2,
            label: (
              <>
                <span className="segmented-tabs__label-corta">{t("menu.opcion.toritoCorto")}</span>
                <span className="segmented-tabs__label-larga">{t("menu.opcion.torito")}</span>
              </>
            ),
          },
          {
            id: "memorama",
            icon: Gamepad2,
            label: (
              <>
                <span className="segmented-tabs__label-corta">{t("menu.opcion.memoramaCorto")}</span>
                <span className="segmented-tabs__label-larga">{t("menu.opcion.memorama")}</span>
              </>
            ),
          },
          {
            id: "sopa",
            icon: Gamepad2,
            label: (
              <>
                <span className="segmented-tabs__label-corta">{t("menu.opcion.sopaCorto")}</span>
                <span className="segmented-tabs__label-larga">{t("menu.opcion.sopa")}</span>
              </>
            ),
          },
        ]}
      />

      <Suspense fallback={<div className="cristal-juegos__cargando" aria-hidden="true" />}>
        <div role="tabpanel" id="juegos-panel-torito" aria-labelledby="juegos-tab-torito" hidden={juego !== "torito"}>
          {juego === "torito" && <ToritoPirotecnico />}
        </div>
        <div role="tabpanel" id="juegos-panel-memorama" aria-labelledby="juegos-tab-memorama" hidden={juego !== "memorama"}>
          {juego === "memorama" && <MemoramaTultepec />}
        </div>
        <div role="tabpanel" id="juegos-panel-sopa" aria-labelledby="juegos-tab-sopa" hidden={juego !== "sopa"}>
          {juego === "sopa" && <SopaDeLetras />}
        </div>
      </Suspense>
    </div>
  );
}
