import { stats } from "../../data/content.js";
import useReveal from "../../hooks/useReveal.js";
import "./Stats.css";

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
          {stats.map((stat, i) => (
            <div className="stat-card reveal" style={{ transitionDelay: `${i * 90}ms` }} key={stat.label}>
              {stat.illustrative && <span className="tag-illustrative">Cifra referencial</span>}
              <span className="stat-card__value">{stat.value}</span>
              <span className="stat-card__label">{stat.label}</span>
              <p className="stat-card__detail">{stat.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
