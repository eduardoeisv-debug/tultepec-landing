import { useState } from "react";
import { submitMemory } from "../../lib/submitMemory.js";
import { RELATIONSHIP_OPTIONS } from "../../data/relationships.js";
import Turnstile from "./Turnstile.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./ShareMemoryForm.css";

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

// El formulario de "Comparte tu memoria" en sí -- mismo estado, mismas
// validaciones y el mismo submitMemory() (que llama a
// /api/submit-memory -> Supabase) que tenía ShareMemoryModal.jsx antes de
// esta extracción. Se separó del modal para poder reutilizarlo tal cual
// dentro de la pestaña "Comparte tu memoria" de MemoriesModal, además del
// modal independiente.
//
// `theme`: "dark" (por defecto, para vivir dentro de un overlay nocturno
// como la pestaña) o "light" (para el modal independiente, fondo claro).
// `onClose`: si se pasa (uso en modal), el botón de la pantalla de éxito
// cierra el modal; si no se pasa (uso en pestaña), ese botón solo reinicia
// el formulario para poder compartir otra memoria.
export default function ShareMemoryForm({ onOpenPrivacy, onClose, theme = "dark" }) {
  const { t, pick } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const remaining = MAX_LENGTH - form.memory_text.length;
  const isTooShort = form.memory_text.trim().length > 0 && form.memory_text.trim().length < MIN_LENGTH;

  const handleChange = (field) => (e) => {
    const value = field === "consent_public" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setStatus("idle");
    setErrorMessage("");
    setForm(initialForm);
    setTurnstileToken(null);
  };

  const handleSuccessAction = () => {
    resetForm();
    onClose?.();
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
    <div className={`share-memory-form share-memory-form--${theme}`}>
      {status === "success" ? (
        <div className="share-memory-form__success">
          <h3>{t("shareMemoryModal.successTitle")}</h3>
          <p>{t("shareMemoryModal.successText")}</p>
          <button type="button" className="btn btn--primary" onClick={handleSuccessAction}>
            {onClose ? t("common.cerrar") : t("shareMemoryModal.enviarOtra")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <span className={`eyebrow ${theme === "dark" ? "eyebrow--light" : ""}`}>{t("shareMemoryModal.eyebrow")}</span>
          <h3 id="share-memory-form-title">{t("shareMemoryModal.title")}</h3>
          <p className="share-memory-form__intro">{t("shareMemoryModal.intro")}</p>

          <label className="share-memory-form__field">
            <span>{t("shareMemoryModal.nameLabel")}</span>
            <input
              type="text"
              value={form.display_name}
              onChange={handleChange("display_name")}
              placeholder={t("shareMemoryModal.namePlaceholder")}
              maxLength={80}
            />
          </label>

          <label className="share-memory-form__field">
            <span>{t("shareMemoryModal.relationshipLabel")}</span>
            <select value={form.relationship} onChange={handleChange("relationship")}>
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {pick(opt.label)}
                </option>
              ))}
            </select>
          </label>

          <label className="share-memory-form__field">
            <span>{t("shareMemoryModal.memoryLabel")}</span>
            <textarea
              value={form.memory_text}
              onChange={handleChange("memory_text")}
              placeholder={t("shareMemoryModal.memoryPlaceholder")}
              rows={5}
              maxLength={MAX_LENGTH}
              required
            />
            <span className={`share-memory-form__counter ${isTooShort ? "share-memory-form__counter--warn" : ""}`}>
              {isTooShort ? t("shareMemoryModal.minChars", { n: MIN_LENGTH }) : ""}
              {t("commentModal.charsRemaining", { n: remaining })}
            </span>
          </label>

          <label className="share-memory-form__field">
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
          <label className="share-memory-form__honeypot" aria-hidden="true">
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

          <label className="share-memory-form__checkbox">
            <input type="checkbox" checked={form.consent_public} onChange={handleChange("consent_public")} />
            <span>
              {t("shareMemoryModal.consentPre")}{" "}
              <button type="button" className="share-memory-form__privacy-link" onClick={onOpenPrivacy}>
                {t("shareMemoryModal.consentLink")}
              </button>
              .
            </span>
          </label>

          {TURNSTILE_ENABLED && (
            <div className="share-memory-form__turnstile">
              <Turnstile onToken={setTurnstileToken} />
            </div>
          )}

          {status === "error" && <p className="share-memory-form__error">{errorMessage}</p>}

          <div className="share-memory-form__actions">
            {onClose && (
              <button
                type="button"
                className={`btn btn--ghost ${theme === "light" ? "btn--on-light" : ""}`}
                onClick={onClose}
              >
                {t("commentModal.cancelar")}
              </button>
            )}
            <button type="submit" className="btn btn--primary" disabled={status === "submitting"}>
              {status === "submitting" ? t("shareMemoryModal.enviando") : t("shareMemoryModal.enviarMemoria")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
