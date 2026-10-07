import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { BOOKS, WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from "../../data/books.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import HeroPapelPicado from "./HeroPapelPicado.jsx";
import "./BooksModal.css";

const CLOSE_ANIM_MS = 220;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const WhatsAppIcon = (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.4.7 4.7 1.9 6.7L3 29l7-2.1c1.9 1 4.1 1.6 6 1.6 7 0 12.7-5.6 12.7-12.5S23 3 16 3Zm0 22.7c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.2 1.3 1.3-4-.3-.4a10.3 10.3 0 0 1-1.9-6c0-5.7 4.7-10.4 10.5-10.4S26.5 9.8 26.5 15.5 21.8 25.7 16 25.7Zm5.7-7.8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6.1a8.4 8.4 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z" />
  </svg>
);

// Pantalla de los libros de la antología "Memorias de mi Pueblo", con el
// mismo lenguaje visual que GaleriaOverlay (overlay a pantalla completa,
// degradado noche/morado, papel picado, bottom sheet en celular).
export default function BooksModal({ open, onClose, triggerRef }) {
  const { t, pick, language } = useLanguage();
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setClosing(false);

    const onKeyDown = (e) => {
      if (e.key === "Escape") requestClose();
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

  const finishClose = () => {
    onClose();
    triggerRef?.current?.focus();
  };

  const requestClose = () => {
    if (prefersReducedMotion()) {
      finishClose();
      return;
    }
    setClosing(true);
    setTimeout(finishClose, CLOSE_ANIM_MS);
  };

  const waLink = (book) => {
    const interested = language === "en" ? `I'm interested in: "${pick(book.title)}".` : `Me interesa: "${pick(book.title)}".`;
    const message = `${pick(WHATSAPP_DEFAULT_MESSAGE)} ${interested}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className={`books-overlay__backdrop ${closing ? "is-closing" : ""}`} onMouseDown={requestClose}>
      <div
        className={`books-overlay ${closing ? "is-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="books-modal-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <HeroPapelPicado />

        <button type="button" className="books-overlay__close" onClick={requestClose} aria-label={t("common.cerrar")}>
          <X size={20} strokeWidth={2.2} />
        </button>

        <header className="books-overlay__head">
          <span className="eyebrow eyebrow--light">{t("booksModal.eyebrow")}</span>
          <h2 id="books-modal-title">{t("booksModal.title")}</h2>
          <p>{t("booksModal.intro")}</p>
        </header>

        <div className="books-overlay__body">
          <div className="books-grid">
            {BOOKS.map((book) => (
              <article className="book-card" key={book.id}>
                <div className="book-card__cover">
                  <img src={book.cover} alt="" loading="lazy" />
                </div>
                <div className="book-card__info">
                  <h3>{pick(book.title)}</h3>
                  {book.subtitle && <span className="book-card__subtitle">{pick(book.subtitle)}</span>}
                  {book.placeholder && <span className="tag-illustrative">{t("booksModal.datosDeEjemplo")}</span>}
                  <span className="book-card__author">{pick(book.author)}</span>
                  <p className="book-card__description">{pick(book.description)}</p>
                  <span className="book-card__price">{book.price}</span>
                </div>
              </article>
            ))}
          </div>

          <a className="books-overlay__whatsapp" href={waLink(BOOKS[0])} target="_blank" rel="noopener noreferrer">
            <span className="books-overlay__whatsapp-icon">{WhatsAppIcon}</span>
            {t("booksModal.whatsapp")}
          </a>
          <p className="books-overlay__note">{t("booksModal.note")}</p>
        </div>
      </div>
    </div>
  );
}
