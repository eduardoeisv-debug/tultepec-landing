import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { submitComment } from "../../lib/submitComment.js";
import Turnstile from "./Turnstile.jsx";
import useScrollLock from "../../hooks/useScrollLock.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
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
  const { t } = useLanguage();
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
      setErrorMessage(t("commentModal.errorEmpty"));
      return;
    }

    if (TURNSTILE_ENABLED && !turnstileToken) {
      setStatus("error");
      setErrorMessage(t("commentModal.errorTurnstile"));
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
      setErrorMessage(t("commentModal.errorSubmit"));
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
        <button className="comment-modal__close" onClick={handleClose} aria-label={t("common.cerrar")}>
          <X size={18} strokeWidth={2} />
        </button>

        {status === "success" ? (
          <div className="comment-modal__success">
            <h3>{t("commentModal.successTitle")}</h3>
            <p>{t("commentModal.successText")}</p>
            <button className="btn btn--primary" onClick={handleClose}>
              {t("common.cerrar")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <span className="eyebrow">{t("commentModal.eyebrow")}</span>
            <h3 id="comment-modal-title">{t("commentModal.title")}</h3>
            <p className="comment-modal__intro">{t("commentModal.intro")}</p>

            <label className="comment-modal__field">
              <span>{t("commentModal.nameLabel")}</span>
              <input
                type="text"
                value={form.display_name}
                onChange={handleChange("display_name")}
                placeholder={t("commentModal.namePlaceholder")}
                maxLength={80}
              />
            </label>

            <label className="comment-modal__field">
              <span>{t("commentModal.commentLabel")}</span>
              <textarea
                value={form.comment_text}
                onChange={handleChange("comment_text")}
                placeholder={t("commentModal.commentPlaceholder")}
                rows={4}
                maxLength={MAX_LENGTH}
                required
              />
              <span className="comment-modal__counter">{t("commentModal.charsRemaining", { n: remaining })}</span>
            </label>

            <label className="comment-modal__field">
              <span>{t("commentModal.emailLabel")}</span>
              <input
                type="email"
                value={form.contact_email}
                onChange={handleChange("contact_email")}
                placeholder={t("commentModal.emailPlaceholder")}
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
                {t("commentModal.cancelar")}
              </button>
              <button type="submit" className="btn btn--primary" disabled={status === "submitting"}>
                {status === "submitting" ? t("commentModal.enviando") : t("commentModal.enviarComentario")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
