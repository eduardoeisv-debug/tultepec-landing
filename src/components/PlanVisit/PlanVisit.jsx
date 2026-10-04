import { useEffect, useRef, useState } from "react";
import { CalendarDays, MapPinned } from "lucide-react";
import FestivalCalendar from "../FestivalCalendar/FestivalCalendar.jsx";
import Location from "../Location/Location.jsx";
import ContentModal from "../shared/ContentModal.jsx";
import "./PlanVisit.css";

const TABS = [
  { key: "ubicacion", label: "Cómo llegar", icon: MapPinned },
  { key: "calendario", label: "Calendario de fiestas", icon: CalendarDays },
];

// Dos botones que abren "Cómo llegar" y "Calendario de fiestas" cada uno en
// su propia pantalla (modal), en vez de tenerlos siempre desplegados en la
// página -- misma información, página más corta.
//
// El botón "Planea tu visita" del header solo lleva a esta sección (con
// las 2 opciones a la vista) -- ya no abre "Cómo llegar" directamente, para
// que la persona elija cuál de las dos quiere explorar. Cerrar cualquiera
// de los 2 modales siempre regresa a esta misma pantalla con ambas
// opciones, listas para seguir explorando.
//
// El hash no cambia de valor si el usuario ya había hecho scroll aquí
// antes (sigue siendo "#ubicacion"), y sin un cambio de valor el evento
// "hashchange" nunca se dispara -- un segundo clic no hacía nada. Por eso
// Header.jsx además dispara un evento "plan-visit:open" en cada clic, sin
// importar el hash: ese evento sí funciona siempre.
export default function PlanVisit() {
  const [openModal, setOpenModal] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const scrollToSection = () => {
      requestAnimationFrame(() => sectionRef.current?.scrollIntoView());
    };
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash !== "#ubicacion" && hash !== "#calendario") return;
      scrollToSection();
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("plan-visit:open", scrollToSection);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("plan-visit:open", scrollToSection);
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
                className="plan-visit__tab"
                onClick={() => setOpenModal(t.key)}
              >
                <Icon size={17} strokeWidth={1.8} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <ContentModal
        open={openModal === "ubicacion"}
        onClose={() => setOpenModal(null)}
        eyebrow="Cómo llegar"
        title="Tultepec está más cerca de lo que crees"
      >
        <Location embedded />
      </ContentModal>

      <ContentModal
        open={openModal === "calendario"}
        onClose={() => setOpenModal(null)}
        eyebrow="Calendario de fiestas"
        title="¿Cuándo vienes?"
      >
        <FestivalCalendar embedded />
      </ContentModal>
    </section>
  );
}
