import { useState } from "react";
import {
  History,
  Flame,
  Church,
  PartyPopper,
  Hammer,
  Landmark,
  Sparkles,
  ShieldCheck,
  Mic,
  HeartCrack,
  MessageSquareText,
  Clock,
  Users,
  HelpCircle,
  Plus,
  Minus,
} from "lucide-react";
import { CIFRAS, CITA, HITOS, FAQS, CIERRE } from "../../data/historia.js";
import { tensionPoints, benefits } from "../../data/content.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import useReveal from "../../hooks/useReveal.js";
import "./HistoryInfographic.css";

const TIMELINE_ICONS = [History, Flame, Church, PartyPopper, Hammer, Landmark, Sparkles, ShieldCheck];
const TIMELINE_TONES = ["gold", "terracotta", "fire", "night", "gold", "terracotta", "fire", "night"];

const WHY_ICONS = [Mic, HeartCrack, ShieldCheck];
const WHY_TONES = ["terracotta", "fire", "gold"];

const BENEFIT_ICONS = [MessageSquareText, Clock, Flame, Users];

// Infografía de "Explora la historia": cifras y cita tomadas del
// documento del pueblo, línea de tiempo con "Leer más" para los hitos más
// largos, por qué esta historia importa, qué vas a encontrar y preguntas
// frecuentes (también del documento). Pensada para vivir dentro del
// overlay nocturno de HistoryModal, no como página suelta.
export default function HistoryInfographic() {
  const { t, pick } = useLanguage();
  const revealRef = useReveal();
  const [expanded, setExpanded] = useState({});

  const toggleExpanded = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="history-infographic" ref={revealRef}>
      {/* Cifras clave */}
      <div className="hi-cifras reveal">
        {CIFRAS.map((c) => (
          <div className="hi-cifra" key={c.value.es}>
            <span className="hi-cifra__value">{pick(c.value)}</span>
            <span className="hi-cifra__label">{pick(c.label)}</span>
          </div>
        ))}
      </div>

      {/* Cita */}
      <blockquote className="hi-cita reveal">“{pick(CITA)}”</blockquote>

      {/* Línea de tiempo */}
      <section className="hi-block hi-block--timeline">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--light">{t("hi.timeline.eyebrow")}</span>
          <h3>{t("hi.timeline.title")}</h3>
        </div>
        <ol className="historia-timeline">
          {HITOS.map((item, i) => {
            const Icon = TIMELINE_ICONS[i % TIMELINE_ICONS.length];
            const tone = TIMELINE_TONES[i % TIMELINE_TONES.length];
            const isOpen = Boolean(expanded[item.titulo.es]);
            return (
              <li className={`historia-timeline__item historia-timeline__item--${tone} reveal`} key={item.titulo.es}>
                <span className="historia-timeline__node">
                  <Icon size={17} strokeWidth={1.7} />
                </span>
                <div className="historia-timeline__card">
                  <span className="historia-timeline__era">{pick(item.etapa)}</span>
                  <h4>{pick(item.titulo)}</h4>
                  <p>{pick(item.texto)}</p>
                  {item.detalle && (
                    <>
                      {isOpen && <p className="historia-timeline__detail">{pick(item.detalle)}</p>}
                      <button
                        type="button"
                        className="historia-timeline__more"
                        onClick={() => toggleExpanded(item.titulo.es)}
                        aria-expanded={isOpen}
                      >
                        {isOpen ? <Minus size={14} strokeWidth={2} /> : <Plus size={14} strokeWidth={2} />}
                        {isOpen ? t("hi.timeline.leerMenos") : t("hi.timeline.leerMas")}
                      </button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="hi-cierre reveal">{pick(CIERRE)}</p>
      </section>

      {/* Por qué esta historia importa */}
      <section className="hi-block hi-block--dark">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--light">{t("hi.why.eyebrow")}</span>
          <h3>{t("hi.why.title")}</h3>
        </div>
        <div className="hi-why reveal">
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

      {/* Qué vas a encontrar */}
      <section className="hi-block">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--light">{t("hi.benefits.eyebrow")}</span>
          <h3>{t("hi.benefits.title")}</h3>
        </div>
        <div className="hi-benefits reveal">
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

      {/* Preguntas frecuentes */}
      <section className="hi-block">
        <div className="hi-block__head">
          <span className="hi-eyebrow hi-eyebrow--light">{t("hi.faq.eyebrow")}</span>
          <h3>{t("hi.faq.title")}</h3>
        </div>
        <div className="hi-faq reveal">
          {FAQS.map((item) => (
            <div className="hi-faq__item" key={item.pregunta.es}>
              <span className="hi-faq__icon">
                <HelpCircle size={16} strokeWidth={1.8} />
              </span>
              <div>
                <h4>{pick(item.pregunta)}</h4>
                <p>{pick(item.respuesta)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
