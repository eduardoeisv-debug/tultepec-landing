import { RELATIONSHIP_DISPLAY_LABELS } from "../../data/relationships.js";
import "./MemoryEntryCard.css";

const dateFormatter = new Intl.DateTimeFormat("es-MX", { month: "long", year: "numeric" });

export default function MemoryEntryCard({ displayName, relationship, memoryText, createdAt }) {
  const formattedDate = createdAt ? dateFormatter.format(new Date(createdAt)) : null;

  return (
    <figure className="memory-entry-card">
      <blockquote>&ldquo;{memoryText}&rdquo;</blockquote>
      <figcaption>
        <span className="memory-entry-card__name">{displayName || "Anónimo"}</span>
        <span className="memory-entry-card__meta">
          {RELATIONSHIP_DISPLAY_LABELS[relationship] || RELATIONSHIP_DISPLAY_LABELS.otro}
          {formattedDate ? ` · ${formattedDate}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}
