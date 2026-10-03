import { Sparkles, Flower2, Flame, Church, Music, Star, PartyPopper, Flag, Moon, Gift } from "lucide-react";
import { festivalCalendar } from "../../data/content.js";
import useReveal from "../../hooks/useReveal.js";
import "./FestivalCalendar.css";

const ICONS = {
  sparkle: Sparkles,
  flower: Flower2,
  flame: Flame,
  church: Church,
  music: Music,
  star: Star,
  drum: PartyPopper,
  flag: Flag,
  candle: Moon,
  gift: Gift,
};

const TONES = ["terracotta", "fire", "gold", "terracotta-dark"];

export default function FestivalCalendar() {
  const ref = useReveal();

  return (
    <section className="festival-calendar" ref={ref}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">Todo el año hay fiesta</span>
          <h2>Calendario de fiestas en Tultepec</h2>
          <p>
            La Feria Nacional de la Pirotecnia de marzo es la más grande, pero el pueblo celebra
            durante todo el año. Esta es una primera versión de ejemplo del calendario —la
            iremos completando con fechas e información confirmadas por la comunidad.
          </p>
        </div>

        <div className="festival-calendar__grid">
          {festivalCalendar.map((item, i) => {
            const Icon = ICONS[item.icon];
            const tone = TONES[i % TONES.length];
            return (
              <article
                className={`festival-card festival-card--${tone} ${
                  item.highlight ? "festival-card--highlight" : ""
                } reveal`}
                style={{ transitionDelay: `${(i % 4) * 80}ms` }}
                key={item.month}
              >
                {item.illustrative && <span className="tag-illustrative">Ejemplo</span>}
                {item.highlight && <span className="festival-card__badge">Evento principal</span>}
                <span className="festival-card__icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <span className="festival-card__month">{item.month}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
