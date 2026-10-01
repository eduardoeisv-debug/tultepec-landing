import { useEffect, useState } from "react";
import { login, logout, fetchMemories, updateMemoryStatus } from "../lib/moderationClient.js";
import { fetchAllTestimonials, saveTestimonial, deleteTestimonial } from "../lib/testimonialsAdminClient.js";
import { RELATIONSHIP_DISPLAY_LABELS } from "../data/relationships.js";
import "./Moderation.css";

const TABS = [
  { key: "pending", label: "Pendientes" },
  { key: "approved", label: "Aprobadas" },
  { key: "rejected", label: "Rechazadas" },
  { key: "all", label: "Todas" },
];

const SECTIONS = [
  { key: "memories", label: "Memorias de la comunidad" },
  { key: "testimonials", label: "Voces del pueblo" },
];

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function LoginForm({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    const { ok } = await login(password);
    if (ok) {
      onSuccess();
    } else {
      setStatus("error");
    }
  };

  return (
    <div className="moderation-login">
      <form onSubmit={handleSubmit}>
        <span className="eyebrow">Panel privado</span>
        <h1>Moderación de memorias</h1>
        <label>
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setStatus("idle");
            }}
            autoFocus
          />
        </label>
        {status === "error" && <p className="moderation-login__error">Contraseña incorrecta.</p>}
        <button type="submit" className="btn btn--primary" disabled={status === "loading"}>
          {status === "loading" ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function MemoryRow({ memory, onUpdate }) {
  const [busy, setBusy] = useState(false);

  const handleAction = async (status) => {
    setBusy(true);
    await onUpdate(memory.id, status);
    setBusy(false);
  };

  return (
    <article className={`moderation-card moderation-card--${memory.status}`}>
      <div className="moderation-card__meta">
        <span className={`moderation-card__status moderation-card__status--${memory.status}`}>
          {memory.status}
        </span>
        <span>{dateFormatter.format(new Date(memory.created_at))}</span>
      </div>

      <p className="moderation-card__text">"{memory.memory_text}"</p>

      <div className="moderation-card__details">
        <span>
          <strong>{memory.display_name || "Anónimo"}</strong> ·{" "}
          {RELATIONSHIP_DISPLAY_LABELS[memory.relationship] || memory.relationship}
        </span>
        {memory.contact_email && <span>Correo: {memory.contact_email}</span>}
        <span>{memory.consent_public ? "Autorizó mostrarse públicamente" : "No autorizó mostrarse públicamente"}</span>
      </div>

      <div className="moderation-card__actions">
        {memory.status !== "approved" && (
          <button
            type="button"
            className="btn btn--primary"
            disabled={busy}
            onClick={() => handleAction("approved")}
          >
            Aprobar
          </button>
        )}
        {memory.status !== "rejected" && (
          <button
            type="button"
            className="btn btn--ghost btn--on-light"
            disabled={busy}
            onClick={() => handleAction("rejected")}
          >
            Rechazar
          </button>
        )}
        {memory.status !== "pending" && (
          <button
            type="button"
            className="moderation-card__revert"
            disabled={busy}
            onClick={() => handleAction("pending")}
          >
            Volver a pendiente
          </button>
        )}
      </div>
    </article>
  );
}

function MemoriesSection() {
  const [memories, setMemories] = useState([]);
  const [tab, setTab] = useState("pending");
  const [status, setStatus] = useState("loading"); // loading | ready | error

  const load = async () => {
    setStatus("loading");
    const { ok, memories: data } = await fetchMemories();
    if (!ok) {
      setStatus("error");
      return;
    }
    setMemories(data);
    setStatus("ready");
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpdate = async (id, newStatus) => {
    await updateMemoryStatus(id, newStatus);
    setMemories((prev) => prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
  };

  const filtered = tab === "all" ? memories : memories.filter((m) => m.status === tab);
  const counts = Object.fromEntries(
    TABS.map((t) => [t.key, t.key === "all" ? memories.length : memories.filter((m) => m.status === t.key).length])
  );

  return (
    <>
      <nav className="moderation-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`moderation-tabs__item ${tab === t.key ? "moderation-tabs__item--active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label} ({counts[t.key]})
          </button>
        ))}
      </nav>

      {status === "loading" && <p>Cargando memorias…</p>}
      {status === "error" && <p>No se pudieron cargar las memorias. Recarga la página.</p>}

      {status === "ready" && filtered.length === 0 && <p>No hay memorias en esta categoría.</p>}

      {status === "ready" && filtered.length > 0 && (
        <div className="moderation-list">
          {filtered.map((m) => (
            <MemoryRow key={m.id} memory={m} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </>
  );
}

const emptyTestimonialForm = { quote: "", name: "", role: "", published: true };

function TestimonialForm({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState(initial || emptyTestimonialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    const value = field === "published" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.quote.trim().length < 10 || !form.name.trim() || !form.role.trim()) {
      setError("Completa la cita (mínimo 10 caracteres), el nombre y el rol.");
      return;
    }
    setBusy(true);
    setError("");
    const { ok } = await saveTestimonial(form);
    setBusy(false);
    if (!ok) {
      setError("No se pudo guardar. Intenta de nuevo.");
      return;
    }
    onSaved();
  };

  return (
    <form className="testimonial-form" onSubmit={handleSubmit}>
      <label>
        <span>Cita</span>
        <textarea value={form.quote} onChange={handleChange("quote")} rows={3} maxLength={600} required />
      </label>
      <div className="testimonial-form__row">
        <label>
          <span>Nombre</span>
          <input type="text" value={form.name} onChange={handleChange("name")} required />
        </label>
        <label>
          <span>Rol / relación con Tultepec</span>
          <input type="text" value={form.role} onChange={handleChange("role")} required />
        </label>
      </div>
      <label className="testimonial-form__checkbox">
        <input type="checkbox" checked={form.published} onChange={handleChange("published")} />
        <span>Publicado (visible en la landing)</span>
      </label>

      {error && <p className="moderation-login__error">{error}</p>}

      <div className="testimonial-form__actions">
        <button type="button" className="btn btn--ghost btn--on-light" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary" disabled={busy}>
          {busy ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}

function TestimonialsSection() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [editing, setEditing] = useState(null); // null | "new" | testimonial object

  const load = async () => {
    setStatus("loading");
    const { ok, testimonials } = await fetchAllTestimonials();
    if (!ok) {
      setStatus("error");
      return;
    }
    setItems(testimonials);
    setStatus("ready");
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaved = () => {
    setEditing(null);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Borrar este testimonio? No se puede deshacer.")) return;
    await deleteTestimonial(id);
    load();
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const a = items[index];
    const b = items[target];
    await Promise.all([
      saveTestimonial({ ...a, display_order: b.display_order }),
      saveTestimonial({ ...b, display_order: a.display_order }),
    ]);
    load();
  };

  if (editing) {
    return (
      <TestimonialForm
        initial={editing === "new" ? null : editing}
        onCancel={() => setEditing(null)}
        onSaved={handleSaved}
      />
    );
  }

  return (
    <>
      <div className="testimonials-admin__header">
        <p>Estas tarjetas alimentan el carrusel de "Voces del pueblo" en la landing, en este orden.</p>
        <button type="button" className="btn btn--primary" onClick={() => setEditing("new")}>
          + Agregar nueva voz
        </button>
      </div>

      {status === "loading" && <p>Cargando testimonios…</p>}
      {status === "error" && <p>No se pudieron cargar. Recarga la página.</p>}
      {status === "ready" && items.length === 0 && <p>Todavía no hay testimonios.</p>}

      {status === "ready" && items.length > 0 && (
        <div className="moderation-list">
          {items.map((t, i) => (
            <article className="moderation-card" key={t.id}>
              <div className="moderation-card__meta">
                <span
                  className={`moderation-card__status ${
                    t.published ? "moderation-card__status--approved" : "moderation-card__status--pending"
                  }`}
                >
                  {t.published ? "publicado" : "oculto"}
                </span>
              </div>

              <p className="moderation-card__text">"{t.quote}"</p>

              <div className="moderation-card__details">
                <span>
                  <strong>{t.name}</strong> · {t.role}
                </span>
              </div>

              <div className="moderation-card__actions">
                <button type="button" className="btn btn--ghost btn--on-light" onClick={() => setEditing(t)}>
                  Editar
                </button>
                <button type="button" className="moderation-card__revert" onClick={() => move(i, -1)} disabled={i === 0}>
                  ↑ Subir
                </button>
                <button
                  type="button"
                  className="moderation-card__revert"
                  onClick={() => move(i, 1)}
                  disabled={i === items.length - 1}
                >
                  ↓ Bajar
                </button>
                <button type="button" className="moderation-card__revert" onClick={() => handleDelete(t.id)}>
                  Borrar
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}

function Panel() {
  const [section, setSection] = useState("memories");

  const handleLogout = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <div className="moderation-panel">
      <header className="moderation-panel__header">
        <div>
          <span className="eyebrow">Panel privado</span>
          <h1>Moderación</h1>
        </div>
        <button type="button" className="btn btn--ghost btn--on-light" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <nav className="moderation-sections">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`moderation-sections__item ${section === s.key ? "moderation-sections__item--active" : ""}`}
            onClick={() => setSection(s.key)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {section === "memories" ? <MemoriesSection /> : <TestimonialsSection />}
    </div>
  );
}

export default function Moderation() {
  const [authenticated, setAuthenticated] = useState(null); // null = checking

  useEffect(() => {
    fetchMemories().then(({ ok }) => {
      setAuthenticated(ok);
    });
  }, []);

  if (authenticated === null) return null;

  return authenticated ? <Panel /> : <LoginForm onSuccess={() => setAuthenticated(true)} />;
}
