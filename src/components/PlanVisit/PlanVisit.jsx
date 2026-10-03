import { useEffect, useRef, useState } from "react";
import { CalendarDays, MapPinned } from "lucide-react";
import FestivalCalendar from "../FestivalCalendar/FestivalCalendar.jsx";
import Location from "../Location/Location.jsx";
import "./PlanVisit.css";

const TABS = [
  { key: "ubicacion", label: "Cómo llegar", icon: MapPinned },
  { key: "calendario", label: "Calendario de fiestas", icon: CalendarDays },
];

// Agrupa el calendario y "cómo llegar" bajo un solo bloque con pestañas,
// en vez de dos secciones grandes apiladas una tras otra -- misma
// información, página más corta.
//
// El botón "Planea tu visita" del header apunta a #ubicacion, pero el
// hash no cambia de valor si el usuario ya había hecho clic antes (sigue
// siendo "#ubicacion"), y sin un cambio de valor el evento "hashchange"
// nunca se dispara -- un segundo clic no hacía nada. Por eso Header.jsx
// además dispara un evento "plan-visit:open" en cada clic, sin importar
// el hash: ese evento sí funciona siempre.
export default function PlanVisit() {
  const [tab, setTab] = useState(() => (window.location.hash === "#calendario" ? "calendario" : "ubicacion"));
  const sectionRef = useRef(null);

  useEffect(() => {
    const openTab = (key) => {
      setTab(key);
      requestAnimationFrame(() => sectionRef.current?.scrollIntoView());
    };
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash !== "#ubicacion" && hash !== "#calendario") return;
      openTab(hash === "#calendario" ? "calendario" : "ubicacion");
    };
    const onOpenEvent = () => openTab("ubicacion");

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("plan-visit:open", onOpenEvent);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("plan-visit:open", onOpenEvent);
    };
  }, []);

  return (
    <section className="plan-visit" id="ubicacion" ref={sectionRef}>
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
