import { useEffect, useRef, useState } from "react";
import { X, BookOpen, MessageSquareText, PenLine } from "lucide-react";
import MEMORIAS from "../../data/memorias.json";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import useArrowNavigation from "../../hooks/useArrowNavigation.js";
import OverlayPapelPicado from "./OverlayPapelPicado.jsx";
import SegmentedTabs from "./SegmentedTabs.jsx";
import Testimonials from "../Testimonials/Testimonials.jsx";
import ShareMemoryForm from "./ShareMemoryForm.jsx";
import "./SegmentedTabs.css";
import "./MemoriesModal.css";

const CLOSE_ANIM_MS = 220;

// src/data/memorias.json lo genera scripts/build-memorias.mjs a partir de
// Documentos/Memorias_Libros.docx (ver "prebuild"/"predev" en
// package.json) -- siempre son exactamente 3 libros con 2 memorias cada
// uno, validado por el propio script al compilar.
const LIBROS = [1, 2, 3];

// Un fragmento "largo" se recorta a un resumen con "Leer más"; uno corto
// se muestra completo de entrada, sin botón (no tendría nada que hacer).
const LONG_FRAGMENT_THRESHOLD = 350;

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
  const { t, language } = useLanguage();
  const [tab, setTab] = useState("memorias");
  const [closing, setClosing] = useState(false);
  const [libroFiltro, setLibroFiltro] = useState(1);
  const [expanded, setExpanded] = useState({});
  const [filtroIndex, setFiltroIndex] = useState(0);
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  const { register: registerFiltro, onKeyDown: filtroKeyDown } = useArrowNavigation({
    count: LIBROS.length,
    orientation: "horizontal",
  });
  const memoriasDelLibro = MEMORIAS.filter((m) => m.libro === libroFiltro);

  useFocusTrap(dialogRef, open);

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

  // Al cambiar de pestaña (ya sea con el control de arriba o con el botón
  // "Comparte tu memoria" al final de las otras dos), el cuerpo scrolleable
  // se regresa al inicio -- si no, quien venía leyendo hasta abajo de
  // "Voces" llegaba a la pestaña de "Comparte" a la mitad del formulario
  // en vez de ver el título desde arriba. También recupera el foco: tras
  // cambiar de pestaña con clic, el foco se queda en el botón de la
  // pestaña (no en el cuerpo), y ahí las flechas ya no mueven nada.
  useEffect(() => {
    if (!open) return;
    bodyRef.current?.scrollTo({ top: 0, behavior: "auto" });
    bodyRef.current?.focus();
  }, [tab, open]);

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
    // Foco inicial al cuerpo scrolleable, no al panel (sin scroll
    // propio) -- así las flechas mueven el contenido desde que se abre.
    bodyRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  // Clave por memoria + índice de fragmento: cada fragmento expande o
  // contrae por separado (una memoria puede tener más de uno largo).
  const toggleExpanded = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const changeFiltro = (index) => {
    setFiltroIndex(index);
    setLibroFiltro(LIBROS[index]);
  };

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

        <div className="memories-overlay__body" tabIndex={-1} ref={bodyRef}>
          {tab === "memorias" && (
            <div role="tabpanel" id="memories-panel-memorias" aria-labelledby="memories-tab-memorias">
              {language === "en" && <p className="memories-overlay__note">{t("memoriesModal.notaIdioma")}</p>}

              <div
                className="memorias-filtros"
                role="group"
                aria-label={t("memoriesModal.filtroAriaLabel")}
                onKeyDown={filtroKeyDown(filtroIndex, changeFiltro)}
              >
                {LIBROS.map((n, i) => (
                  <button
                    key={n}
                    type="button"
                    ref={registerFiltro(i)}
                    tabIndex={filtroIndex === i ? 0 : -1}
                    className={`memorias-filtro ${libroFiltro === n ? "is-active" : ""}`}
                    aria-pressed={libroFiltro === n}
                    onClick={() => changeFiltro(i)}
                  >
                    {t("memoriesModal.libroBtn", { n })}
                  </button>
                ))}
              </div>

              <div className="memorias-grid">
                {memoriasDelLibro.map((m) => (
                  <article className="memoria-card" key={m.id}>
                    <div className="memoria-card__meta-top">
                      <span className="memoria-card__genero">{m.genero}</span>
                      <span className="memoria-card__fragmentos-label">Fragmentos:</span>
                    </div>
                    <h3 className="memoria-card__titulo">{m.titulo}</h3>
                    {m.subtitulo && <p className="memoria-card__subtitulo">{m.subtitulo}</p>}
                    <p className="memoria-card__autor">
                      {m.autor}
                      {m.autorNota && <span className="memoria-card__autor-nota"> · {m.autorNota}</span>}
                    </p>

                    {m.fragmentos.map((f, i) => {
                      const key = `${m.id}-${i}`;
                      const isLong = f.texto.length > LONG_FRAGMENT_THRESHOLD;
                      const isOpen = Boolean(expanded[key]);
                      return (
                        <div className="memoria-card__fragmento" key={key}>
                          {f.subtitulo && <h4 className="memoria-card__frag-subtitulo">{f.subtitulo}</h4>}
                          <p className={`memoria-card__texto ${isLong && !isOpen ? "is-clamped" : ""}`}>{f.texto}</p>
                          {isLong && (
                            <button
                              type="button"
                              className="memoria-card__more"
                              onClick={() => toggleExpanded(key)}
                              aria-expanded={isOpen}
                            >
                              {isOpen ? t("hi.timeline.leerMenos") : t("hi.timeline.leerMas")}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </article>
                ))}
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
