import { useEffect, useRef, useState } from "react";
import { submitMemory } from "../../lib/submitMemory.js";
import { RELATIONSHIP_OPTIONS } from "../../data/relationships.js";
import Turnstile from "./Turnstile.jsx";
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
  const [form, setForm] = useState(initialForm);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector("input, textarea, select")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
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
      setErrorMessage(`Cuéntanos un poco más: al menos ${MIN_LENGTH} caracteres.`);
      return;
    }

    if (TURNSTILE_ENABLED && !turnstileToken) {
      setStatus("error");
      setErrorMessage("Completa la verificación de seguridad antes de enviar.");
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
      setErrorMessage("No se pudo guardar tu memoria. Intenta de nuevo en unos minutos.");
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
        <button className="memory-modal__close" onClick={handleClose} aria-label="Cerrar">
          ×
        </button>

        {status === "success" ? (
          <div className="memory-modal__success">
            <h3>Gracias por compartir tu memoria</h3>
            <p>
              La recibimos y pasará por una breve revisión antes de sumarse al archivo del pueblo.
              Apreciamos que hayas dedicado un momento a contarla.
            </p>
            <button className="btn btn--primary" onClick={handleClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <span className="eyebrow">Comparte tu memoria</span>
            <h3 id="memory-modal-title">Tu historia también es parte de Tultepec</h3>
            <p className="memory-modal__intro">
              Cuéntanos un recuerdo, una anécdota o algo que quieras que se sepa sobre el pueblo del
              fuego. Antes de publicarse, cada memoria pasa por una revisión.
            </p>

            <label className="memory-modal__field">
              <span>Tu nombre (opcional)</span>
              <input
                type="text"
                value={form.display_name}
                onChange={handleChange("display_name")}
                placeholder="Déjalo en blanco para compartir de forma anónima"
                maxLength={80}
              />
            </label>

            <label className="memory-modal__field">
              <span>¿Cuál es tu relación con Tultepec?</span>
              <select value={form.relationship} onChange={handleChange("relationship")}>
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="memory-modal__field">
              <span>Tu memoria</span>
              <textarea
                value={form.memory_text}
                onChange={handleChange("memory_text")}
                placeholder="Por ejemplo: lo que se siente ver un castillo encendido por primera vez, una historia de tu familia, un aprendizaje del taller..."
                rows={5}
                maxLength={MAX_LENGTH}
                required
              />
              <span className={`memory-modal__counter ${isTooShort ? "memory-modal__counter--warn" : ""}`}>
                {isTooShort ? `Mínimo ${MIN_LENGTH} caracteres · ` : ""}
                {remaining} caracteres restantes
              </span>
            </label>

            <label className="memory-modal__field">
              <span>Correo (opcional, no se hace público)</span>
              <input
                type="email"
                value={form.contact_email}
                onChange={handleChange("contact_email")}
                placeholder="Solo por si queremos contactarte sobre tu memoria"
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
                Autorizo que esta memoria pueda mostrarse públicamente en este archivo (de forma
                anónima si no dejo mi nombre). Consulta nuestro{" "}
                <button type="button" className="memory-modal__privacy-link" onClick={onOpenPrivacy}>
                  aviso de privacidad
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
                Cancelar
              </button>
              <button type="submit" className="btn btn--primary" disabled={status === "submitting"}>
                {status === "submitting" ? "Enviando…" : "Enviar mi memoria"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
