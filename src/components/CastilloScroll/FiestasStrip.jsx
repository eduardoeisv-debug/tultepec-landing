import { useState } from "react";
import fiestas from "../../data/fiestas.js";
import "./FiestasStrip.css";

const firstWithEvents = fiestas.find((m) => m.eventos.length > 0);

// Franja horizontal de los 12 meses (con scroll-snap en celular); los
// meses con fiestas se ven resaltados en dorado. Al tocar un mes se
// muestra su lista de eventos debajo. Datos en src/data/fiestas.js.
export default function FiestasStrip() {
  const [selectedMonth, setSelectedMonth] = useState(firstWithEvents ? firstWithEvents.mes : 1);
  const active = fiestas.find((m) => m.mes === selectedMonth);

  return (
    <div className="fiestas-strip">
      <div className="fiestas-strip__months" role="tablist" aria-label="Meses del año">
        {fiestas.map((m) => {
          const hasEvents = m.eventos.length > 0;
          return (
            <button
              key={m.mes}
              type="button"
              role="tab"
              aria-selected={m.mes === selectedMonth}
              className={`fiestas-strip__month${hasEvents ? " has-events" : ""}${
                m.mes === selectedMonth ? " is-selected" : ""
              }`}
              onClick={() => setSelectedMonth(m.mes)}
            >
              {m.mesNombre}
            </button>
          );
        })}
      </div>

      <div className="fiestas-strip__events" role="tabpanel">
        {active.eventos.length === 0 ? (
          <p className="fiestas-strip__empty">
            Sin eventos confirmados para {active.mesNombre.toLowerCase()} — POR VERIFICAR.
          </p>
        ) : (
          <ul className="fiestas-strip__list">
            {active.eventos.map((ev) => (
              <li className="fiestas-strip__event" key={ev.nombre}>
                <span className="fiestas-strip__event-name">{ev.nombre}</span>
                <span className="fiestas-strip__event-date">{ev.fecha}</span>
                <span className="fiestas-strip__event-desc">{ev.descripcion}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
