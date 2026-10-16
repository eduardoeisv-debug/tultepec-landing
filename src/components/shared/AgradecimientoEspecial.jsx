import { useLanguage } from "../../i18n/LanguageContext.jsx";

// El párrafo de agradecimiento a la Profesora Juana Antonieta Zuñiga
// Urban y al Profesor Fernando Manuel Torices Ramírez -- vivía solo en
// Footer.jsx; ahora también lo pide la vista "Agradecimientos" del
// menú. Se extrajo tal cual (mismo texto, mismo <strong> en los
// nombres) para no duplicarlo en dos archivos.
export default function AgradecimientoEspecial({ className = "footer__thanks" }) {
  const { t, language } = useLanguage();
  const isEn = language === "en";

  return (
    <p className={className}>
      {isEn ? "A special thanks to " : "Un agradecimiento especial a "}
      <strong>{t("footer.thanksName1")}</strong>{" "}
      {isEn ? "and " : "y al "}
      <strong>{t("footer.thanksName2")}</strong>
      {isEn
        ? ", for generously sharing their knowledge and memories — the true heart of this archive."
        : ", por compartir con generosidad su conocimiento y sus recuerdos — el verdadero corazón de este archivo."}
    </p>
  );
}
