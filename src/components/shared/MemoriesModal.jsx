import { useEffect, useRef, useState } from "react";
import { X, BookOpen, MessageSquareText, PenLine } from "lucide-react";
import { LIBRO_FILTROS, MEMORIAS } from "../../data/memorias.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import OverlayPapelPicado from "./OverlayPapelPicado.jsx";
import SegmentedTabs from "./SegmentedTabs.jsx";
import Testimonials from "../Testimonials/Testimonials.jsx";
import ShareMemoryForm from "./ShareMemoryForm.jsx";
import "./SegmentedTabs.css";
import "./MemoriesModal.css";

const CLOSE_ANIM_MS = 220;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const HASH_BY_TAB = { memorias: "#memorias", voces: "#voces", comparte: "#comparte-memoria" };

function tabFromHash() {
  if (window.location.hash === "#comparte-memoria") return "comparte";
  if (window.location.hash === "#voces") return "voces";
  return "memorias";
}

// Ventana "Memorias de mi pueblo": tres pestañas -- fragmentos de los 3
// libros (MEMORIAS, filtrables por libro), el carrusel de voces de la
// comunidad (Testimonials.jsx, ya existente) y "Comparte tu memoria"
// (ShareMemoryForm.jsx). Mismo lenguaje visual y mismo componente de
// pestañas (SegmentedTabs) que RelatosModal/GaleriaOverlay.
export default function MemoriesModal({ open, onClose, triggerRef, onOpenPrivacy }) {
  const { t, pick, language } = useLanguage();
  const [tab, setTab] = useState("memorias");
  const [closing, setClosing] = useState(false);
  const [libroFiltro, setLibroFiltro] = useState("todos");
  const [expanded, setExpanded] = useState({});
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setTab(tabFromHash());
    setClosing(false);
  }, [open]);

  // Mantiene el hash sincronizado con la pestaña activa, igual que
  // RelatosModal/GaleriaOverlay, para soportar los enlaces directos
  // #memorias y #comparte-memoria.
  useEffect(() => {
    if (!open || closing) return;
    const newHash = HASH_BY_TAB[tab];
    if (window.location.hash !== newHash) {
      history.replaceState(null, "", newHash);
    }
  }, [tab, open, closing]);

  const finishClose = () => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
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

  useEffect(() => {
    if (!open) return undefined;

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

  const toggleExpanded = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const fragmentos = libroFiltro === "todos" ? MEMORIAS : MEMORIAS.filter((m) => m.libro === libroFiltro);
  const libroLabel = (id) => LIBRO_FILTROS.find((f) => f.id === id);

  return (
    <div className={`memories-overlay__backdrop ${closing ? "is-closing" : ""}`} onMouseDown={requestClose}>
      <div
        className={`memories-overlay ${closing ? "is-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="memories-overlay-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <OverlayPapelPicado />

        <button type="button" className="memories-overlay__close" onClick={requestClose} aria-label={t("common.cerrar")}>
          <X size={20} strokeWidth={2.2} />
        </button>

        <header className="memories-overlay__head">
          <span className="eyebrow eyebrow--light">{t("memoriesModal.eyebrow")}</span>
          <h2 id="memories-overlay-title">{t("memoriesModal.title")}</h2>
        </header>

        <SegmentedTabs
          idPrefix="memories"
          ariaLabel={t("memoriesModal.tabs.ariaLabel")}
          activeId={tab}
          onChange={setTab}
          tabs={[
            { id: "memorias", icon: BookOpen, label: t("memoriesModal.tabs.memorias") },
            { id: "voces", icon: MessageSquareText, label: t("memoriesModal.tabs.voces") },
            { id: "comparte", icon: PenLine, label: t("memoriesModal.tabs.comparte") },
          ]}
        />

        <div className="memories-overlay__body">
          {tab === "memorias" && (
            <div role="tabpanel" id="memories-panel-memorias" aria-labelledby="memories-tab-memorias">
              {language === "en" && <p className="memories-overlay__note">{t("memoriesModal.notaIdioma")}</p>}

              <div className="memorias-filtros" role="group" aria-label={t("memoriesModal.filtroAriaLabel")}>
                {LIBRO_FILTROS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`memorias-filtro ${libroFiltro === f.id ? "is-active" : ""}`}
                    aria-pressed={libroFiltro === f.id}
                    onClick={() => setLibroFiltro(f.id)}
                  >
                    {pick(f.label)}
                  </button>
                ))}
              </div>

              <div className="memorias-grid">
                {fragmentos.map((m) => {
                  const isOpen = Boolean(expanded[m.id]);
                  return (
                    <article className="memoria-card" key={m.id}>
                      {m.titulo && <h4>{m.titulo}</h4>}
                      <p className={`memoria-card__texto ${isOpen ? "is-expanded" : ""}`}>{m.texto}</p>
                      <button
                        type="button"
                        className="memoria-card__more"
                        onClick={() => toggleExpanded(m.id)}
                        aria-expanded={isOpen}
                      >
                        {isOpen ? t("hi.timeline.leerMenos") : t("hi.timeline.leerMas")}
                      </button>
                      <footer className="memoria-card__meta">
                        <span className="memoria-card__autor">{m.autor}</span>
                        <span className="memoria-card__libro">{pick(libroLabel(m.libro)?.label)}</span>
                      </footer>
                    </article>
                  );
                })}
              </div>

              <p className="memories-overlay__credit">{t("memoriesModal.creditoAutorizacion")}</p>

              <div className="memories-overlay__cta">
                <button type="button" className="btn btn--ghost" onClick={() => setTab("comparte")}>
                  {t("testimonials.comparteTuMemoria")}
                </button>
              </div>
            </div>
          )}

          {tab === "voces" && (
            <div role="tabpanel" id="memories-panel-voces" aria-labelledby="memories-tab-voces">
              <Testimonials embedded onShareClick={() => setTab("comparte")} />
            </div>
          )}

          {tab === "comparte" && (
            <div role="tabpanel" id="memories-panel-comparte" aria-labelledby="memories-tab-comparte">
              <ShareMemoryForm onOpenPrivacy={onOpenPrivacy} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
