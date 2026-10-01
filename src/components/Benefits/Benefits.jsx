import { benefits } from "../../data/content.js";
import useReveal from "../../hooks/useReveal.js";
import "./Benefits.css";

const ICONS = [
  // Historia viva: voces / testimonio
  <svg key="voices" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 8h20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H15l-6 5v-5H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M10 14h12M10 18h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>,
  // Línea de tiempo: puntos conectados, igual que el timeline real
  <svg key="timeline" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="5" y1="16" x2="27" y2="16" stroke="currentColor" strokeWidth="1.8" strokeDasharray="1 4" strokeLinecap="round" />
    <circle cx="6" cy="16" r="2.6" fill="currentColor" />
    <circle cx="16" cy="16" r="2.6" fill="currentColor" />
    <circle cx="26" cy="16" r="2.6" fill="currentColor" />
  </svg>,
  // Fiesta patronal: flama
  <svg key="flame" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16 4c1.5 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 1.5-4.5C13 12 12 14 12 16a4 4 0 0 0 8 0c0-3-1.5-4.5-2.5-7-.3 1.5-1 2.3-1.5 3.2C15.4 9.8 15.2 6.8 16 4z"
      fill="currentColor"
    />
  </svg>,
  // Familia: dos siluetas
  <svg key="family" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="10" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="21" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.8" />
    <path d="M6 26c0-4.4 2.7-7.5 6-7.5s6 3.1 6 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 26c0-3.4 1.9-6 4.5-6s4.5 2.6 4.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>,
];

export default function Benefits() {
  const ref = useReveal();

  return (
    <section className="benefits" ref={ref}>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Lo que vas a encontrar</span>
          <h2>Un álbum de memorias, no un folleto</h2>
        </div>

        <div className="benefits__grid">
          {benefits.map((b, i) => (
            <article className="benefit-card reveal" style={{ transitionDelay: `${i * 90}ms` }} key={b.title}>
              <span className="benefit-card__icon">{ICONS[i]}</span>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
