import { useState } from "react";
import { CalendarDays, MapPinned } from "lucide-react";
import FestivalCalendar from "../FestivalCalendar/FestivalCalendar.jsx";
import Location from "../Location/Location.jsx";
import ContentModal from "./ContentModal.jsx";
import "./VisitModal.css";

const TABS = [
  { key: "ubicacion", label: "Cómo llegar", icon: MapPinned },
  { key: "calendario", label: "Calendario de fiestas", icon: CalendarDays },
];

// Abierto desde el botón "Visítanos" del hero (y desde "Planea tu visita"
// en el header). Muestra las 2 opciones; cerrar cualquiera de los 2
// modales anidados regresa a esta misma pantalla para seguir explorando.
export default function VisitModal({ open, onClose }) {
  const [openTab, setOpenTab] = useState(null);

  const handleClose = () => {
    setOpenTab(null);
    onClose();
  };

  return (
    <ContentModal open={open} onClose={handleClose} eyebrow="Visítanos" title="¿Cuándo vienes y cómo llegas?">
      <div className="visit-modal__tabs" role="tablist">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              className="visit-modal__tab"
              onClick={() => setOpenTab(t.key)}
            >
              <Icon size={17} strokeWidth={1.8} />
              {t.label}
            </button>
          );
        })}
      </div>

      <ContentModal
        open={openTab === "ubicacion"}
        onClose={() => setOpenTab(null)}
        eyebrow="Cómo llegar"
        title="Tultepec está más cerca de lo que crees"
      >
        <Location embedded />
      </ContentModal>

      <ContentModal
        open={openTab === "calendario"}
        onClose={() => setOpenTab(null)}
        eyebrow="Calendario de fiestas"
        title="¿Cuándo vienes?"
      >
        <FestivalCalendar embedded />
      </ContentModal>
    </ContentModal>
  );
}
