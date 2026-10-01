import useReveal from "../../hooks/useReveal.js";
import "./TimelineItem.css";

export default function TimelineItem({ year, title, text, align = "left" }) {
  const ref = useReveal();

  return (
    <div className={`timeline-item timeline-item--${align}`} ref={ref}>
      <div className="timeline-item__marker" aria-hidden="true">
        <span className="timeline-item__dot" />
      </div>
      <article className="timeline-item__card reveal">
        <span className="timeline-item__year">{year}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </article>
    </div>
  );
}
