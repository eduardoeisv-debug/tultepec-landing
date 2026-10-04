import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { submitComment } from "../../lib/submitComment.js";
import Turnstile from "./Turnstile.jsx";
import useScrollLock from "../../hooks/useScrollLock.js";
import "./CommentModal.css";

const MAX_LENGTH = 500;
const TURNSTILE_ENABLED = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

const initialForm = {
  display_name: "",
  comment_text: "",
  contact_email: "",
  website: "", // honeypot: campo trampa, invisible para personas
};

export default function CommentModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const dialogRef = useRef(null);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    dialogRef.current?.querySelector("input, textarea")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const remaining = MAX_LENGTH - form.comment_text.length;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleClose = () => {
    setStatus("idle");
    setErrorMessage("");
    setForm(initialForm);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.comment_text.trim().length < 2) {
      setStatus("error");
      setErrorMessage("Escribe un comentario antes de enviarlo.");
      return;
    }

    if (TURNSTILE_ENABLED && !turnstileToken) {
      setStatus("error");
      setErrorMessage("Completa la verificación de seguridad antes de enviar.");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const { error } = await submitComment({
      display_name: form.display_name.trim() || null,
      comment_text: form.comment_text.trim(),
      contact_email: form.contact_email.trim() || null,
      honeypot: form.website,
      turnstileToken,
    });

    if (error) {
      setStatus("error");
      setErrorMessage("No se pudo enviar tu comentario. Intenta de nuevo en unos minutos.");
      return;
    }

    setStatus("success");
  };

  return (
    <div className="comment-modal__backdrop" onMouseDown={handleClose}>
      <div
        className="comment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="comment-modal-title"
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="comment-modal__close" onClick={handleClose} aria-label="Cerrar">
          <X size={18} strokeWidth={2} />
        </button>

        {status === "success" ? (
          <div className="comment-modal__success">
            <h3>Gracias por tu comentario</h3>
            <p>Lo recibimos y pasará por una breve revisión antes de publicarse.</p>
            <button className="btn btn--primary" onClick={handleClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <span className="eyebrow">Deja tu comentario</span>
            <h3 id="comment-modal-title">¿Qué te pareció este archivo?</h3>
            <p className="comment-modal__intro">
              Cuéntanos qué te gustó o qué le agregarías. Antes de publicarse, cada comentario pasa
              por una revisión.
            </p>

            <label className="comment-modal__field">
              <span>Tu nombre (opcional)</span>
              <input
                type="text"
                value={form.display_name}
                onChange={handleChange("display_name")}
                placeholder="Déjalo en blanco para comentar de forma anónima"
                maxLength={80}
              />
            </label>

            <label className="comment-modal__field">
              <span>Tu comentario</span>
              <textarea
                value={form.comment_text}
                onChange={handleChange("comment_text")}
                placeholder="Escribe aquí tu comentario..."
                rows={4}
                maxLength={MAX_LENGTH}
                required
              />
              <span className="comment-modal__counter">{remaining} caracteres restantes</span>
            </label>

            <label className="comment-modal__field">
              <span>Correo (opcional, no se hace público)</span>
              <input
                type="email"
                value={form.contact_email}
                onChange={handleChange("contact_email")}
                placeholder="Solo por si queremos contactarte sobre tu comentario"
              />
            </label>

            {/* Honeypot: invisible para personas, pero los bots que auto-llenan
                formularios suelen rellenarlo. */}
            <label className="comment-modal__honeypot" aria-hidden="true">
              <span>Sitio web</span>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={handleChange("website")}
              />
            </label>

            {TURNSTILE_ENABLED && (
              <div className="comment-modal__turnstile">
                <Turnstile onToken={setTurnstileToken} />
              </div>
            )}

            {status === "error" && <p className="comment-modal__error">{errorMessage}</p>}

            <div className="comment-modal__actions">
              <button type="button" className="btn btn--ghost btn--on-light" onClick={handleClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary" disabled={status === "submitting"}>
                {status === "submitting" ? "Enviando…" : "Enviar comentario"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
