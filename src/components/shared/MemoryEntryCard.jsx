import { RELATIONSHIP_DISPLAY_LABELS } from "../../data/relationships.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./MemoryEntryCard.css";

export default function MemoryEntryCard({ displayName, relationship, memoryText, createdAt }) {
  const { t, pick, language } = useLanguage();
  const dateFormatter = new Intl.DateTimeFormat(language === "en" ? "en-US" : "es-MX", {
    month: "long",
    year: "numeric",
  });
  const formattedDate = createdAt ? dateFormatter.format(new Date(createdAt)) : null;

  return (
    <figure className="memory-entry-card">
      <blockquote>&ldquo;{memoryText}&rdquo;</blockquote>
      <figcaption>
        <span className="memory-entry-card__name">{displayName || t("memoryEntryCard.anonimo")}</span>
        <span className="memory-entry-card__meta">
          {pick(RELATIONSHIP_DISPLAY_LABELS[relationship] || RELATIONSHIP_DISPLAY_LABELS.otro)}
          {formattedDate ? ` · ${formattedDate}` : ""}
        </span>
      </figcaption>
    </figure>
  );
}
