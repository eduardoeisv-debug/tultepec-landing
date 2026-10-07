import { useEffect, useRef, useState } from "react";
import fiestas from "../../data/fiestas.js";
import "./FiestasStrip.css";

const firstWithEvents = fiestas.find((m) => m.eventos.length > 0);

// Franja horizontal de los 12 meses (con scroll-snap en celular); los
// meses con fiestas se ven resaltados en dorado. Al tocar un mes se
// muestra su lista de eventos debajo. Datos en src/data/fiestas.js.
export default function FiestasStrip() {
  const [selectedMonth, setSelectedMonth] = useState(firstWithEvents ? firstWithEvents.mes : 1);
  const active = fiestas.find((m) => m.mes === selectedMonth);

  const trackRef = useRef(null);
  const selectedRef = useRef(null);

  useEffect(() => {
    // Centra el mes seleccionado al cargar, moviendo solo el scroll
    // horizontal de esta franja (nunca el de la página) y sin animación,
    // para que no se sienta como un salto. Se calcula con
    // getBoundingClientRect (no offsetLeft) porque offsetLeft es
    // relativo al ancestro posicionado más cercano -- que aquí es
    // .visit-info, no el propio track -- y da un desfase incorrecto.
    const track = trackRef.current;
    const btn = selectedRef.current;
    if (!track || !btn) return;
    const trackRect = track.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const btnOffsetWithinTrack = btnRect.left - trackRect.left + track.scrollLeft;
    // El navegador recorta esto a 0 si el mes seleccionado está muy
    // cerca del inicio (como marzo, el 3º de 12) y no hay espacio a su
    // izquierda para centrarlo del todo -- se queda con algo de
    // contexto a los lados en vez de pegado al borde, que es lo que
    // importa en la práctica.
    track.scrollLeft = btnOffsetWithinTrack - track.clientWidth / 2 + btn.clientWidth / 2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fiestas-strip">
      <div className="fiestas-strip__months-wrap">
        <div className="fiestas-strip__months" role="tablist" aria-label="Meses del año" ref={trackRef}>
          {fiestas.map((m) => {
            const hasEvents = m.eventos.length > 0;
            const isSelected = m.mes === selectedMonth;
            return (
              <button
                key={m.mes}
                type="button"
                role="tab"
                aria-selected={isSelected}
                ref={isSelected ? selectedRef : null}
                className={`fiestas-strip__month${hasEvents ? " has-events" : ""}${
                  isSelected ? " is-selected" : ""
                }`}
                onClick={() => setSelectedMonth(m.mes)}
              >
                {m.mesNombre}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fiestas-strip__events" role="tabpanel">
        {active.eventos.length === 0 ? (
          <p className="fiestas-strip__empty">
            Aún no hay eventos confirmados para {active.mesNombre.toLowerCase()}.
          </p>
        ) : (
          <ul className="fiestas-strip__list">
            {active.eventos.map((ev) => (
              <li className="fiestas-strip__event" key={ev.nombre}>
                <span className="fiestas-strip__event-name">{ev.nombre}</span>
                {ev.fecha && <span className="fiestas-strip__event-date">{ev.fecha}</span>}
                {ev.descripcion && <span className="fiestas-strip__event-desc">{ev.descripcion}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
