import { useEffect, useRef, useState } from "react";
import { fetchVoices } from "../../lib/testimonialsClient.js";
import useReveal from "../../hooks/useReveal.js";
import "./Testimonials.css";

const AUTOPLAY_MS = 6000;

const QuoteMark = (
  <svg viewBox="0 0 48 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M0 36V21.6C0 9.4 7.6 1.7 19.5 0l2 5.4C13.8 7.4 10 12 10 18h9.5v18H0Zm28.5 0V21.6C28.5 9.4 36 1.7 48 0l2 5.4C42.3 7.4 38.5 12 38.5 18H48v18H28.5Z" />
  </svg>
);

export default function Testimonials({ onShareClick }) {
  const ref = useReveal();
  const [status, setStatus] = useState("loading"); // loading | ready | empty | error
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    fetchVoices().then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        setStatus("error");
        return;
      }
      setItems(data || []);
      setStatus(data && data.length > 0 ? "ready" : "empty");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTimer = (count) => {
    clearTimer();
    if (count < 2) return;
    intervalRef.current = setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    if (status !== "ready") return undefined;
    startTimer(items.length);
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, items.length]);

  const goTo = (i) => {
    setActive((i + items.length) % items.length);
    startTimer(items.length);
  };

  const current = items[active];

  return (
    <section className="testimonials" id="voces" ref={ref}>
      <div className="container">
        <div className="section-head section-head--center reveal">
          <span className="eyebrow eyebrow--light">Voces del pueblo</span>
          <h2 className="testimonials__title">Lo que cuentan quienes lo viven</h2>
          <p className="testimonials__subtitle">
            Testimonios de artesanos y familias, junto con las memorias que la propia comunidad ha
            compartido y ya fueron revisadas.
          </p>
        </div>

        {status === "loading" && <p className="testimonials__status">Cargando voces…</p>}
        {status === "error" && <p className="testimonials__status">No pudimos cargar los testimonios.</p>}
        {status === "empty" && (
          <div className="testimonials__empty reveal">
            <p>Todavía no hay voces publicadas. Sé la primera persona en compartir la tuya.</p>
            <button type="button" className="btn btn--primary" onClick={onShareClick}>
              Comparte tu memoria
            </button>
          </div>
        )}

        {status === "ready" && current && (
          <div className="testimonials__carousel reveal" onMouseEnter={clearTimer} onMouseLeave={() => startTimer(items.length)}>
            <button
              type="button"
              className="testimonials__nav testimonials__nav--prev"
              onClick={() => goTo(active - 1)}
              aria-label="Testimonio anterior"
            >
              ‹
            </button>

            <div className="testimonials__stage">
              <span className="testimonials__quote-mark">{QuoteMark}</span>
              <blockquote key={current.id} className="testimonials__quote">
                "{current.quote}"
              </blockquote>
              <div className="testimonials__attribution">
                <span className="testimonials__name">{current.name}</span>
                <span className="testimonials__role">{current.role}</span>
              </div>
            </div>

            <button
              type="button"
              className="testimonials__nav testimonials__nav--next"
              onClick={() => goTo(active + 1)}
              aria-label="Testimonio siguiente"
            >
              ›
            </button>
          </div>
        )}

        {status === "ready" && items.length > 1 && (
          <div className="testimonials__dots">
            {items.map((t, i) => (
              <button
                key={t.id}
                type="button"
                className={`testimonials__dot ${i === active ? "testimonials__dot--active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Ver testimonio ${i + 1}`}
              />
            ))}
          </div>
        )}

        {status === "ready" && (
          <div className="testimonials__cta">
            <button type="button" className="btn btn--ghost" onClick={onShareClick}>
              Comparte tu memoria
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
