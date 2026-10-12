import { useEffect, useRef, useState } from "react";
import fiestas from "../../data/fiestas.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import useArrowNavigation from "../../hooks/useArrowNavigation.js";
import "./FiestasStrip.css";

const currentMonth = new Date().getMonth() + 1;

// Franja horizontal de los 12 meses (con scroll-snap en celular); los
// meses con fiestas se ven resaltados en dorado. Al tocar un mes se
// muestra su lista de eventos debajo. Datos en src/data/fiestas.js.
// Abre de entrada en el mes en curso (tenga o no eventos confirmados),
// no en el primer mes con eventos del arreglo.
export default function FiestasStrip({ children }) {
  const { t, pick } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const active = fiestas.find((m) => m.mes === selectedMonth);
  const selectedIndex = fiestas.findIndex((m) => m.mes === selectedMonth);

  const trackRef = useRef(null);
  const isFirstCenter = useRef(true);
  const { register: registerMonth, onKeyDown: monthKeyDown, itemRefs: monthRefs } = useArrowNavigation({
    count: fiestas.length,
    orientation: "horizontal",
  });

  const selectMonth = (index) => setSelectedMonth(fiestas[index].mes);

  // Un clic en cualquier parte del marco (fuera de los botones de mes,
  // que ya enfocan por su cuenta al hacer clic) manda el foco al mes
  // activo, así las flechas quedan listas de inmediato sin tener que
  // acertarle al botón exacto. Llegar aquí con Tab ya funcionaba antes:
  // el botón del mes activo es el único con tabIndex 0 del grupo
  // (roving tabindex), así que el foco natural ya cae ahí.
  const handleFrameClick = (e) => {
    if (e.target.closest(".fiestas-strip__month")) return;
    monthRefs.current[selectedIndex]?.focus();
  };

  useEffect(() => {
    // Centra el mes seleccionado (al cargar, al hacer clic o al navegar
    // con flechas), moviendo solo el scroll horizontal de esta franja
    // (nunca el de la página). Se calcula con getBoundingClientRect (no
    // offsetLeft) porque offsetLeft es relativo al ancestro posicionado
    // más cercano -- que aquí es .visit-info, no el propio track -- y da
    // un desfase incorrecto. Al cargar la página no se anima (para que
    // no se sienta como un salto); los cambios posteriores (clic o
    // flechas) sí se animan, para que se note que la franja se movió.
    const track = trackRef.current;
    const btn = monthRefs.current[selectedIndex];
    if (!track || !btn) return;
    const trackRect = track.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const btnOffsetWithinTrack = btnRect.left - trackRect.left + track.scrollLeft;
    // El navegador recorta esto a 0 si el mes seleccionado está muy
    // cerca del inicio (como marzo, el 3º de 12) y no hay espacio a su
    // izquierda para centrarlo del todo -- se queda con algo de
    // contexto a los lados en vez de pegado al borde, que es lo que
    // importa en la práctica.
    track.scrollTo({
      left: btnOffsetWithinTrack - track.clientWidth / 2 + btn.clientWidth / 2,
      behavior: isFirstCenter.current ? "auto" : "smooth",
    });
    isFirstCenter.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth]);

  return (
    <div className="visit-info__calendar-frame" onClick={handleFrameClick}>
      {children}
      <div className="fiestas-strip">
        <div className="fiestas-strip__months-wrap">
          <div
            className="fiestas-strip__months"
            role="tablist"
            aria-label={t("fiestasStrip.mesesAriaLabel")}
            ref={trackRef}
            onKeyDown={monthKeyDown(selectedIndex, selectMonth)}
          >
            {fiestas.map((m, i) => {
              const hasEvents = m.eventos.length > 0;
              const isSelected = m.mes === selectedMonth;
              return (
                <button
                  key={m.mes}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  ref={registerMonth(i)}
                  className={`fiestas-strip__month${hasEvents ? " has-events" : ""}${
                    isSelected ? " is-selected" : ""
                  }`}
                  onClick={() => selectMonth(i)}
                >
                  {pick(m.mesNombre)}
                </button>
              );
            })}
          </div>
        </div>

        <div className="fiestas-strip__events" role="tabpanel">
          {active.eventos.length === 0 ? (
            <p className="fiestas-strip__empty">{t("fiestasStrip.sinEventos")}</p>
          ) : (
            <ul className="fiestas-strip__list">
              {active.eventos.map((ev) => (
                <li className="fiestas-strip__event" key={ev.nombre.es}>
                  <span className="fiestas-strip__event-name">{pick(ev.nombre)}</span>
                  {ev.fecha && <span className="fiestas-strip__event-date">{pick(ev.fecha)}</span>}
                  {ev.descripcion && <span className="fiestas-strip__event-desc">{pick(ev.descripcion)}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
