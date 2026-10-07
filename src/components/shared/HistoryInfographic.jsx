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
import { useLanguage } from "../../i18n/LanguageContext.jsx";
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
  const { t, pick } = useLanguage();
  return (
    <div className="history-infographic">
      {/* 1. Cifras clave */}
      <section className="hi-block">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--gold">{t("hi.stats.eyebrow")}</span>
          <h3>{t("hi.stats.title")}</h3>
        </div>
        <div className="hi-stats">
          {stats.map((s, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length];
            const tone = STAT_TONES[i % STAT_TONES.length];
            return (
              <div className={`hi-stat hi-stat--${tone}`} key={s.label.es}>
                <span className="hi-stat__icon">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <span className="hi-stat__value">{pick(s.value)}</span>
                <span className="hi-stat__label">{pick(s.label)}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Línea de tiempo */}
      <section className="hi-block hi-block--timeline">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--gold">{t("hi.timeline.eyebrow")}</span>
          <h3>{t("hi.timeline.title")}</h3>
        </div>
        <ol className="hi-timeline">
          {timeline.map((item, i) => {
            const Icon = TIMELINE_ICONS[i % TIMELINE_ICONS.length];
            const tone = TIMELINE_TONES[i % TIMELINE_TONES.length];
            const side = i % 2 === 0 ? "left" : "right";
            return (
              <li
                className={`hi-timeline__item hi-timeline__item--${tone} hi-timeline__item--${side}`}
                key={item.title.es}
              >
                <span className="hi-timeline__node">
                  <Icon size={16} strokeWidth={1.8} />
                </span>
                <div className="hi-timeline__card">
                  <span className="hi-timeline__year">{pick(item.year)}</span>
                  <h4>{pick(item.title)}</h4>
                  <p>{pick(item.text)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* 3. Por qué esta historia importa */}
      <section className="hi-block hi-block--dark">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--light">{t("hi.why.eyebrow")}</span>
          <h3>{t("hi.why.title")}</h3>
        </div>
        <div className="hi-why">
          {tensionPoints.map((point, i) => {
            const Icon = WHY_ICONS[i % WHY_ICONS.length];
            const tone = WHY_TONES[i % WHY_TONES.length];
            return (
              <article className={`hi-why__card hi-why__card--${tone}`} key={point.title.es}>
                <span className="hi-why__icon">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <h4>{pick(point.title)}</h4>
                <p>{pick(point.text)}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Qué vas a encontrar */}
      <section className="hi-block">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--gold">{t("hi.benefits.eyebrow")}</span>
          <h3>{t("hi.benefits.title")}</h3>
        </div>
        <div className="hi-benefits">
          {benefits.map((b, i) => {
            const Icon = BENEFIT_ICONS[i % BENEFIT_ICONS.length];
            return (
              <article className="hi-benefit" key={b.title.es}>
                <span className="hi-benefit__icon">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <h4>{pick(b.title)}</h4>
                <p>{pick(b.text)}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. Preguntas frecuentes */}
      <section className="hi-block">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--gold">{t("hi.faq.eyebrow")}</span>
          <h3>{t("hi.faq.title")}</h3>
        </div>
        <div className="hi-faq">
          {faqs.map((item) => (
            <div className="hi-faq__item" key={item.question.es}>
              <span className="hi-faq__icon">
                <HelpCircle size={16} strokeWidth={1.8} />
              </span>
              <div>
                <h4>{pick(item.question)}</h4>
                <p>{pick(item.answer)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
