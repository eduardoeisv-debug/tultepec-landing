import { useState } from "react";
import { History, Flame, Church, PartyPopper, Hammer, Landmark, Sparkles, ShieldCheck, HelpCircle, Plus, Minus } from "lucide-react";
import { CITA, HITOS, FAQS, CIERRE } from "../../data/historia.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import useReveal from "../../hooks/useReveal.js";
import "./HistoryInfographic.css";

const TIMELINE_ICONS = [History, Flame, Church, PartyPopper, Hammer, Landmark, Sparkles, ShieldCheck];
const TIMELINE_TONES = ["gold", "terracotta", "fire", "night", "gold", "terracotta", "fire", "night"];

// Infografía de "Explora la historia": todo el contenido (cifras, cita,
// línea de tiempo con "Leer más" para los hitos más largos, cierre y
// preguntas frecuentes) viene únicamente de Documentos/Historia.docx, ver
// src/data/historia.js. Pensada para vivir dentro del overlay nocturno de
// HistoryModal, no como página suelta.
export default function HistoryInfographic() {
  const { t, pick } = useLanguage();
  const revealRef = useReveal();
  const [expanded, setExpanded] = useState({});

  const toggleExpanded = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="history-infographic" ref={revealRef}>
      {/* Cita */}
      <blockquote className="hi-cita hi-cita--lead reveal">“{pick(CITA)}”</blockquote>

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

      {/* Preguntas frecuentes */}
      <section className="hi-block hi-block--dark">
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
