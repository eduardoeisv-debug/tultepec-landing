import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { submitMemory } from "../../lib/submitMemory.js";
import { RELATIONSHIP_OPTIONS } from "../../data/relationships.js";
import Turnstile from "./Turnstile.jsx";
import useScrollLock from "../../hooks/useScrollLock.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./ShareMemoryModal.css";

const MIN_LENGTH = 20;
const MAX_LENGTH = 1200;
const TURNSTILE_ENABLED = Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

const initialForm = {
  display_name: "",
  relationship: "otro",
  memory_text: "",
  contact_email: "",
  consent_public: true,
  website: "", // honeypot: campo trampa, invisible para personas
};

export default function ShareMemoryModal({ open, onClose, onOpenPrivacy }) {
  const { t, pick } = useLanguage();
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
    dialogRef.current?.querySelector("input, textarea, select")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const remaining = MAX_LENGTH - form.memory_text.length;
  const isTooShort = form.memory_text.trim().length > 0 && form.memory_text.trim().length < MIN_LENGTH;

  const handleChange = (field) => (e) => {
    const value = field === "consent_public" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setStatus("idle");
    setErrorMessage("");
    setForm(initialForm);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.memory_text.trim().length < MIN_LENGTH) {
      setStatus("error");
      setErrorMessage(t("shareMemoryModal.errorTooShort", { n: MIN_LENGTH }));
      return;
    }

    if (TURNSTILE_ENABLED && !turnstileToken) {
      setStatus("error");
      setErrorMessage(t("shareMemoryModal.errorTurnstile"));
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const { error } = await submitMemory({
      display_name: form.display_name.trim() || null,
      relationship: form.relationship,
      memory_text: form.memory_text.trim(),
      contact_email: form.contact_email.trim() || null,
      consent_public: form.consent_public,
      honeypot: form.website,
      turnstileToken,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(t("shareMemoryModal.errorSubmit"));
      return;
    }

    setStatus("success");
  };

  return (
    <div className="memory-modal__backdrop" onMouseDown={handleClose}>
      <div
        className="memory-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="memory-modal-title"
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="memory-modal__close" onClick={handleClose} aria-label={t("common.cerrar")}>
          <X size={18} strokeWidth={2} />
        </button>

        {status === "success" ? (
          <div className="memory-modal__success">
            <h3>{t("shareMemoryModal.successTitle")}</h3>
            <p>{t("shareMemoryModal.successText")}</p>
            <button className="btn btn--primary" onClick={handleClose}>
              {t("common.cerrar")}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <span className="eyebrow">{t("shareMemoryModal.eyebrow")}</span>
            <h3 id="memory-modal-title">{t("shareMemoryModal.title")}</h3>
            <p className="memory-modal__intro">{t("shareMemoryModal.intro")}</p>

            <label className="memory-modal__field">
              <span>{t("shareMemoryModal.nameLabel")}</span>
              <input
                type="text"
                value={form.display_name}
                onChange={handleChange("display_name")}
                placeholder={t("shareMemoryModal.namePlaceholder")}
                maxLength={80}
              />
            </label>

            <label className="memory-modal__field">
              <span>{t("shareMemoryModal.relationshipLabel")}</span>
              <select value={form.relationship} onChange={handleChange("relationship")}>
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {pick(opt.label)}
                  </option>
                ))}
              </select>
            </label>

            <label className="memory-modal__field">
              <span>{t("shareMemoryModal.memoryLabel")}</span>
              <textarea
                value={form.memory_text}
                onChange={handleChange("memory_text")}
                placeholder={t("shareMemoryModal.memoryPlaceholder")}
                rows={5}
                maxLength={MAX_LENGTH}
                required
              />
              <span className={`memory-modal__counter ${isTooShort ? "memory-modal__counter--warn" : ""}`}>
                {isTooShort ? t("shareMemoryModal.minChars", { n: MIN_LENGTH }) : ""}
                {t("commentModal.charsRemaining", { n: remaining })}
              </span>
            </label>

            <label className="memory-modal__field">
              <span>{t("shareMemoryModal.emailLabel")}</span>
              <input
                type="email"
                value={form.contact_email}
                onChange={handleChange("contact_email")}
                placeholder={t("shareMemoryModal.emailPlaceholder")}
              />
            </label>

            {/* Honeypot: invisible para personas, pero los bots que auto-llenan
                formularios suelen rellenarlo. Si viene lleno, se descarta el
                envío en el servidor. */}
            <label className="memory-modal__honeypot" aria-hidden="true">
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

            <label className="memory-modal__checkbox">
              <input type="checkbox" checked={form.consent_public} onChange={handleChange("consent_public")} />
              <span>
                {t("shareMemoryModal.consentPre")}{" "}
                <button type="button" className="memory-modal__privacy-link" onClick={onOpenPrivacy}>
                  {t("shareMemoryModal.consentLink")}
                </button>
                .
              </span>
            </label>

            {TURNSTILE_ENABLED && (
              <div className="memory-modal__turnstile">
                <Turnstile onToken={setTurnstileToken} />
              </div>
            )}

            {status === "error" && <p className="memory-modal__error">{errorMessage}</p>}

            <div className="memory-modal__actions">
              <button type="button" className="btn btn--ghost btn--on-light" onClick={handleClose}>
                {t("commentModal.cancelar")}
              </button>
              <button type="submit" className="btn btn--primary" disabled={status === "submitting"}>
                {status === "submitting" ? t("shareMemoryModal.enviando") : t("shareMemoryModal.enviarMemoria")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
