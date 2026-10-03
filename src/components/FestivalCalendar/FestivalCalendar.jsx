import { useEffect, useState } from "react";
import { X, Sparkles, Flower2, Flame, Church, Music, Star, PartyPopper, Flag, Moon, Gift } from "lucide-react";
import { fetchFestivalCalendar } from "../../lib/festivalEventsClient.js";
import useReveal from "../../hooks/useReveal.js";
import "./FestivalCalendar.css";

const TONES = ["terracotta", "fire", "gold", "terracotta-dark"];

// Un ícono fijo por mes (no depende del contenido en la base de datos, que
// puede cambiar) -- solo decorativo.
const MONTH_ICONS = [Sparkles, Flower2, Flame, Church, Music, Star, Sparkles, PartyPopper, Flag, Flower2, Moon, Gift];

function MonthModal({ month, onClose }) {
  useEffect(() => {
    if (!month) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [month, onClose]);

  if (!month) return null;

  return (
    <div className="festival-modal__backdrop" onMouseDown={onClose}>
      <div
        className="festival-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="festival-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="festival-modal__close" onClick={onClose} aria-label="Cerrar">
          <X size={18} strokeWidth={2} />
        </button>

        <span className="eyebrow">{month.name}</span>
        <h3 id="festival-modal-title">Eventos de {month.name.toLowerCase()}</h3>

        <ol className="festival-modal__agenda">
          {month.events.map((ev) => (
            <li key={ev.id} className="festival-modal__item">
              <span className="festival-modal__day">{ev.day ? `Día ${ev.day}` : "Fecha por confirmar"}</span>
              <div>
                <h4>
                  {ev.title}
                  {ev.is_example && <span className="tag-illustrative">Ejemplo</span>}
                </h4>
                <p>{ev.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function FestivalCalendar({ embedded = false }) {
  const ref = useReveal();
  const [months, setMonths] = useState(null);
  const [openMonth, setOpenMonth] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetchFestivalCalendar().then(({ months: data }) => {
      if (!cancelled) setMonths(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const Wrapper = embedded ? "div" : "section";

  return (
    <Wrapper className={`festival-calendar ${embedded ? "festival-calendar--embedded" : ""}`} ref={ref}>
      <div className={embedded ? "" : "container"}>
        <div className="section-head section-head--center reveal">
          {!embedded && (
            <>
              <span className="eyebrow">Todo el año hay fiesta</span>
              <h2>Calendario de fiestas en Tultepec</h2>
            </>
          )}
          <p>
            La Feria Nacional de la Pirotecnia de marzo es la más grande, pero el pueblo celebra
            durante todo el año. Esta es una primera versión de ejemplo del calendario —la
            iremos completando con fechas e información confirmadas por la comunidad.
          </p>
        </div>

        {!months && <p className="festival-calendar__status">Cargando calendario…</p>}

        {months && (
          <div className="festival-calendar__grid">
            {months.map((month, i) => {
              const tone = TONES[i % TONES.length];
              const Icon = MONTH_ICONS[i];
              const [primary, ...rest] = month.events;

              if (!primary) {
                return (
                  <article className={`festival-card festival-card--${tone} reveal`} key={month.month}>
                    <span className="festival-card__icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <span className="festival-card__month">{month.name}</span>
                    <p className="festival-card__empty">Aún sin eventos confirmados para este mes.</p>
                  </article>
                );
              }

              const hasMore = rest.length > 0;
              const Tag = hasMore ? "button" : "article";

              return (
                <Tag
                  type={hasMore ? "button" : undefined}
                  className={`festival-card festival-card--${tone} ${
                    primary.is_highlight ? "festival-card--highlight" : ""
                  } ${hasMore ? "festival-card--clickable" : ""} reveal`}
                  style={{ transitionDelay: `${(i % 4) * 80}ms` }}
                  key={month.month}
                  onClick={hasMore ? () => setOpenMonth(month) : undefined}
                >
                  {primary.is_example && <span className="tag-illustrative">Ejemplo</span>}
                  {primary.is_highlight && <span className="festival-card__badge">Evento principal</span>}
                  <span className="festival-card__icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                  <span className="festival-card__month">{month.name}</span>
                  <h3>{primary.title}</h3>
                  <p>{primary.description}</p>
                  {hasMore && (
                    <span className="festival-card__more">+{rest.length} evento{rest.length > 1 ? "s" : ""} este mes</span>
                  )}
                </Tag>
              );
            })}
          </div>
        )}
      </div>

      <MonthModal month={openMonth} onClose={() => setOpenMonth(null)} />
    </Wrapper>
  );
}
