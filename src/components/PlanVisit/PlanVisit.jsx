import { useEffect, useRef, useState } from "react";
import { CalendarDays, MapPinned } from "lucide-react";
import FestivalCalendar from "../FestivalCalendar/FestivalCalendar.jsx";
import Location from "../Location/Location.jsx";
import "./PlanVisit.css";

const TABS = [
  { key: "calendario", label: "Calendario de fiestas", icon: CalendarDays },
  { key: "ubicacion", label: "Cómo llegar", icon: MapPinned },
];

// Agrupa el calendario y "cómo llegar" bajo un solo bloque con pestañas,
// en vez de dos secciones grandes apiladas una tras otra -- misma
// información, página más corta. El botón "Cómo llegar" del header sigue
// apuntando a #ubicacion; este componente escucha el cambio de hash para
// activar la pestaña correcta y llevar el scroll hasta aquí.
export default function PlanVisit() {
  const [tab, setTab] = useState(() => (window.location.hash === "#ubicacion" ? "ubicacion" : "calendario"));
  const sectionRef = useRef(null);

  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash !== "#ubicacion") return;
      setTab("ubicacion");
      requestAnimationFrame(() => sectionRef.current?.scrollIntoView());
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <section className="plan-visit" ref={sectionRef}>
      <div className="container">
        <div className="section-head section-head--center">
          <span className="eyebrow">Planea tu visita</span>
          <h2>¿Cuándo vienes y cómo llegas?</h2>
        </div>

        <div className="plan-visit__tabs" role="tablist">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                className={`plan-visit__tab ${tab === t.key ? "plan-visit__tab--active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                <Icon size={17} strokeWidth={1.8} />
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "calendario" ? <FestivalCalendar embedded /> : <Location embedded />}
      </div>
    </section>
  );
}
