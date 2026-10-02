import { History, Flame, Users, Hammer } from "lucide-react";
import { stats } from "../../data/content.js";
import useReveal from "../../hooks/useReveal.js";
import "./Stats.css";

const ICONS = [History, Flame, Users, Hammer];
const TONES = ["terracotta", "fire", "gold", "terracotta-dark"];

export default function Stats() {
  const ref = useReveal();

  return (
    <section className="stats" ref={ref}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow">De un vistazo</span>
          <h2>Una tradición que se mide en generaciones</h2>
          <p>
            Antes de contarte la historia completa, estas son las cifras que explican por qué
            Tultepec se ganó su nombre.
          </p>
        </div>

        <div className="stats__grid">
          {stats.map((stat, i) => {
            const Icon = ICONS[i % ICONS.length];
            const tone = TONES[i % TONES.length];
            return (
              <div
                className={`stat-card stat-card--${tone} reveal`}
                style={{ transitionDelay: `${i * 90}ms` }}
                key={stat.label}
              >
                {stat.illustrative && <span className="tag-illustrative">Cifra referencial</span>}
                <span className="stat-card__icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.8} />
                </span>
                <span className="stat-card__value">{stat.value}</span>
                <span className="stat-card__label">{stat.label}</span>
                <p className="stat-card__detail">{stat.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
