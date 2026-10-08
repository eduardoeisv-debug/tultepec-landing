import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import contentEs from "../../content/aviso-de-privacidad.md?raw";
import contentEn from "../../content/aviso-de-privacidad.en.md?raw";
import "./PrivacyModal.css";

// Envuelve cada tabla (la de la sección 3) en un contenedor con scroll
// horizontal propio -- a lo ancho de celular la tabla de 3 columnas no
// cabe, y sin esto se saldría del modal en vez de solo desplazarse.
const markdownComponents = {
  table: ({ node, ...props }) => (
    <div className="privacy-modal__table-wrap">
      <table {...props} />
    </div>
  ),
  // El id lo necesita aria-labelledby del diálogo -- debe apuntar al
  // título real (el "# Aviso de privacidad" del markdown), no a todo el
  // cuerpo del modal.
  h1: ({ node, ...props }) => <h1 id="privacy-modal-title" {...props} />,
};

// El aviso de privacidad vive en dos archivos Markdown (src/content/
// aviso-de-privacidad.md y .en.md) -- este modal solo elige cuál mostrar
// según el idioma activo (el mismo `language` de LanguageContext que usa
// el resto del sitio) y lo renderiza con react-markdown. El texto en sí
// no se toca aquí; para editarlo hay que editar esos archivos.
export default function PrivacyModal({ open, onClose, triggerRef }) {
  const { t, language } = useLanguage();
  const dialogRef = useRef(null);

  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  // `language` ya es reactivo: si cambia mientras el modal está abierto,
  // este componente se vuelve a renderizar con el markdown del otro
  // idioma sin que haga falta cerrar y reabrir nada.
  const content = language === "en" ? contentEn : contentEs;

  const handleClose = () => {
    onClose();
    triggerRef?.current?.focus?.();
  };

  return (
    <div className="privacy-modal__backdrop" onMouseDown={handleClose}>
      <div
        className="privacy-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="privacy-modal__close" onClick={handleClose} aria-label={t("common.cerrar")}>
          <X size={18} strokeWidth={2} />
        </button>

        <div className="privacy-modal__body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
