import { useLanguage } from "../../i18n/LanguageContext.jsx";

// El párrafo de agradecimiento al grupo Memorias de mi pueblo -- vivía
// también en el recuadro de Footer.jsx (quitado: ya lo tiene la vista
// "Agradecimientos" del menú, único lugar que lo usa ahora). Se
// extrajo tal cual (mismo texto, mismo <strong> en el nombre) para no
// duplicarlo.
export default function AgradecimientoEspecial({ className = "panel-view__texto" }) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  return (
    <p className={className}>
      {isEn ? "A special thanks to the " : "Un agradecimiento especial al "}
      <strong>{t("footer.thanksName")}</strong>
      {isEn
        ? ", for generously sharing their knowledge and memories — the true heart of this archive."
        : ", por compartir con generosidad su conocimiento y sus recuerdos — el verdadero corazón de este archivo."}
    </p>
  );
}
