import {
  History,
  Flame,
  Users,
  Hammer,
  Sparkles,
  Landmark,
  PartyPopper,
  HeartHandshake,
  Mic,
  HeartCrack,
  ShieldCheck,
  MessageSquareText,
  Clock,
  Church,
  HelpCircle,
} from "lucide-react";
import { stats, timeline, tensionPoints, benefits, faqs } from "../../data/content.js";
import "./HistoryInfographic.css";

const STAT_ICONS = [History, Flame, Users, Hammer];
const STAT_TONES = ["terracotta", "fire", "gold", "terracotta"];

const TIMELINE_ICONS = [Sparkles, Church, PartyPopper, Hammer, Landmark, Flame, HeartHandshake];
const TIMELINE_TONES = ["gold", "terracotta", "fire", "gold", "terracotta", "fire", "night"];

const WHY_ICONS = [Mic, HeartCrack, ShieldCheck];
const WHY_TONES = ["terracotta", "fire", "gold"];

const BENEFIT_ICONS = [MessageSquareText, Clock, Flame, Users];

// Infografía única y auto-contenida que resume todo el contenido de
// "Explora la historia": cifras clave, línea de tiempo, por qué importa,
// qué vas a encontrar y preguntas frecuentes -- pensada para leerse de
// corrido, no como 5 secciones sueltas apiladas.
export default function HistoryInfographic() {
  return (
    <div className="history-infographic">
      {/* 1. Cifras clave */}
      <section className="hi-block">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--gold">De un vistazo</span>
          <h3>Una tradición que se mide en generaciones</h3>
        </div>
        <div className="hi-stats">
          {stats.map((s, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length];
            const tone = STAT_TONES[i % STAT_TONES.length];
            return (
              <div className={`hi-stat hi-stat--${tone}`} key={s.label}>
                <span className="hi-stat__icon">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <span className="hi-stat__value">{s.value}</span>
                <span className="hi-stat__label">{s.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Línea de tiempo */}
      <section className="hi-block hi-block--timeline">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--gold">Momentos y tradiciones</span>
          <h3>La línea de tiempo del oficio</h3>
        </div>
        <ol className="hi-timeline">
          {timeline.map((t, i) => {
            const Icon = TIMELINE_ICONS[i % TIMELINE_ICONS.length];
            const tone = TIMELINE_TONES[i % TIMELINE_TONES.length];
            const side = i % 2 === 0 ? "left" : "right";
            return (
              <li
                className={`hi-timeline__item hi-timeline__item--${tone} hi-timeline__item--${side}`}
                key={t.title}
              >
                <span className="hi-timeline__node">
                  <Icon size={16} strokeWidth={1.8} />
                </span>
                <div className="hi-timeline__card">
                  <span className="hi-timeline__year">{t.year}</span>
                  <h4>{t.title}</h4>
                  <p>{t.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 3. Por qué esta historia importa */}
      <section className="hi-block hi-block--dark">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--light">Por qué esta historia importa</span>
          <h3>Entre el orgullo y el riesgo de olvidar</h3>
        </div>
        <div className="hi-why">
          {tensionPoints.map((point, i) => {
            const Icon = WHY_ICONS[i % WHY_ICONS.length];
            const tone = WHY_TONES[i % WHY_TONES.length];
            return (
              <article className={`hi-why__card hi-why__card--${tone}`} key={point.title}>
                <span className="hi-why__icon">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <h4>{point.title}</h4>
                <p>{point.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Qué vas a encontrar */}
      <section className="hi-block">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--gold">Lo que vas a encontrar</span>
          <h3>Un álbum de memorias, no un folleto</h3>
        </div>
        <div className="hi-benefits">
          {benefits.map((b, i) => {
            const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
            return (
              <article className="hi-benefit" key={b.title}>
                <span className="hi-benefit__icon">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <h4>{b.title}</h4>
                <p>{b.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. Preguntas frecuentes */}
      <section className="hi-block">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--gold">Preguntas frecuentes</span>
          <h3>Para entender mejor la tradición</h3>
        </div>
        <div className="hi-faq">
          {faqs.map((item) => (
            <div className="hi-faq__item" key={item.question}>
              <span className="hi-faq__icon">
                <HelpCircle size={16} strokeWidth={1.8} />
              </span>
              <div>
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
