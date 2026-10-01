import { useEffect, useRef } from "react";
import { BOOKS, WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from "../../data/books.js";
import "./BooksModal.css";

const BookIcon = (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8 10c4-2 10-2 14 1v25c-4-3-10-3-14-1V10Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
    <path
      d="M40 10c-4-2-10-2-14 1v25c4-3 10-3 14-1V10Z"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinejoin="round"
    />
  </svg>
);

const WhatsAppIcon = (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.4.7 4.7 1.9 6.7L3 29l7-2.1c1.9 1 4.1 1.6 6 1.6 7 0 12.7-5.6 12.7-12.5S23 3 16 3Zm0 22.7c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.2 1.3 1.3-4-.3-.4a10.3 10.3 0 0 1-1.9-6c0-5.7 4.7-10.4 10.5-10.4S26.5 9.8 26.5 15.5 21.8 25.7 16 25.7Zm5.7-7.8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6.1a8.4 8.4 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z" />
  </svg>
);

export default function BooksModal({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const waLink = (book) => {
    const message = `${WHATSAPP_DEFAULT_MESSAGE} Me interesa: "${book.title}".`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="books-modal__backdrop" onMouseDown={onClose}>
      <div
        className="books-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="books-modal-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="books-modal__close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        <span className="eyebrow">Memorias de mi pueblo</span>
        <h3 id="books-modal-title">Libros sobre la historia de Tultepec</h3>
        <p className="books-modal__intro">
          Tres publicaciones ya disponibles para quien quiera llevarse la memoria del pueblo más
          allá de esta página.
        </p>

        <div className="books-modal__grid">
          {BOOKS.map((book) => (
            <article className="book-card" key={book.id}>
              {book.placeholder && <span className="tag-illustrative">Datos de ejemplo</span>}
              <span className="book-card__icon">{BookIcon}</span>
              <h4>{book.title}</h4>
              <span className="book-card__author">{book.author}</span>
              <p className="book-card__description">{book.description}</p>
              <span className="book-card__price">{book.price}</span>
            </article>
          ))}
        </div>

        <a className="books-modal__whatsapp" href={waLink(BOOKS[0])} target="_blank" rel="noopener noreferrer">
          <span className="books-modal__whatsapp-icon">{WhatsAppIcon}</span>
          Preguntar por WhatsApp
        </a>
        <p className="books-modal__note">
          Número y datos de contacto pendientes de configurar — ver src/data/books.js.
        </p>
      </div>
    </div>
  );
}
