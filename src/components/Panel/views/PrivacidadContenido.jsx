import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";
import contentEs from "../../../content/aviso-de-privacidad.md?raw";
import contentEn from "../../../content/aviso-de-privacidad.en.md?raw";
import "../../shared/PrivacyModal.css";

// Mismo texto que antes vivía en PrivacyModal.jsx (los dos .md de
// src/content/, sin tocar ni una palabra) -- en Menú Cristal el aviso
// es una vista propia (#/privacidad, botón de escudo en la columna)
// en vez de una ventana emergente, así que aquí solo queda el
// contenido: ni fondo, ni botón de cerrar, ni atrapa-foco.
const markdownComponents = {
  table: ({ ...props }) => (
    <div className="privacy-modal__table-wrap">
      <table {...props} />
    </div>
  ),
  h1: () => null,
};

export default function PrivacidadContenido() {
  const { language } = useLanguage();
  const content = language === "en" ? contentEn : contentEs;
  return (
    <div className="privacy-modal__body privacy-modal__body--pagina">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
