import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { LIBROS, CONTACTOS } from "../../data/libros.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import useArrowNavigation from "../../hooks/useArrowNavigation.js";
import OverlayPapelPicado from "./OverlayPapelPicado.jsx";
import SegmentedTabs from "./SegmentedTabs.jsx";
import QuienesSomosTab from "./QuienesSomosTab.jsx";
import { TabPersonasIcon, TabLibrosIcon } from "./GaleriaIcons.jsx";
import "./SegmentedTabs.css";
import "./RelatosModal.css";

const CLOSE_ANIM_MS = 220;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function tabFromHash() {
  return window.location.hash === "#relatos/libros" ? "libros" : "historia";
}

const WhatsAppIcon = (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.4.7 4.7 1.9 6.7L3 29l7-2.1c1.9 1 4.1 1.6 6 1.6 7 0 12.7-5.6 12.7-12.5S23 3 16 3Zm0 22.7c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.2 1.3 1.3-4-.3-.4a10.3 10.3 0 0 1-1.9-6c0-5.7 4.7-10.4 10.5-10.4S26.5 9.8 26.5 15.5 21.8 25.7 16 25.7Zm5.7-7.8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6.1a8.4 8.4 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z" />
  </svg>
);

// Ventana "Relatos Escritos": dos pestañas -- "Quiénes somos" (la
// historia de cómo se formó el grupo "Memorias de mi Pueblo", en
// QuienesSomosTab.jsx) y "Los libros" (las 3 portadas + WhatsApp, lo que
// antes era toda esta ventana). Mismo lenguaje visual y mismo componente
// de pestañas (SegmentedTabs) que GaleriaOverlay.
export default function RelatosModal({ open, onClose, triggerRef }) {
  const { t, pick, language } = useLanguage();
  const [tab, setTab] = useState("historia");
  const [closing, setClosing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef({});
  const { register: registerDot, onKeyDown: dotKeyDown } = useArrowNavigation({
    count: LIBROS.length,
    orientation: "horizontal",
  });

  useFocusTrap(dialogRef, open);

  useEffect(() => {
    if (!open) return;
    setTab(tabFromHash());
    setClosing(false);
    setActiveIndex(0);
  }, [open]);

  // Al cambiar de pestaña con clic, el foco se queda en el botón de la
  // pestaña, no en el cuerpo -- ahí las flechas ya no mueven el
  // contenido. Se regresa el foco al cuerpo scrolleable cada vez.
  useEffect(() => {
    if (!open) return;
    bodyRef.current?.focus();
  }, [tab, open]);

  // Mantiene el hash sincronizado con la pestaña activa, igual que
  // GaleriaOverlay, para poder compartir el enlace directo a una pestaña.
  useEffect(() => {
    if (!open || closing) return;
    const newHash = `#relatos/${tab}`;
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
    // Foco inicial al cuerpo scrolleable, no al panel (que no tiene
    // scroll propio) -- así las flechas mueven el contenido de entrada,
    // sin depender de arrastrar la barra de scroll con el mouse.
    bodyRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Indicador de puntos del carrusel móvil de portadas: observa qué
  // portada ocupa más la zona visible del track, en vez de calcular a
  // mano con scrollLeft.
  useEffect(() => {
    if (!open || tab !== "libros") return undefined;
    const track = trackRef.current;
    if (!track || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries.reduce((best, entry) => (entry.intersectionRatio > (best?.intersectionRatio || 0) ? entry : best), null);
        if (mostVisible && mostVisible.intersectionRatio > 0.5) {
          const idx = Number(mostVisible.target.dataset.index);
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        }
      },
      { root: track, threshold: [0.5, 0.75] }
    );

    LIBROS.forEach((libro) => {
      const el = cardRefs.current[libro.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [open, tab]);

  if (!open) return null;

  const goToCard = (index) => {
    const libro = LIBROS[index];
    const el = cardRefs.current[libro?.id];
    const track = trackRef.current;
    if (!el || !track) return;
    track.scrollTo({
      left: el.offsetLeft - (track.clientWidth - el.clientWidth) / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const waLink = (libro, numero) => {
    const tomoLabel = language === "en" ? `volume ${libro.tomo}` : `tomo ${libro.tomo}`;
    const message =
      language === "en"
        ? `Hi, I'm interested in the book ${pick(libro.titulo)}, ${tomoLabel}.`
        : `Hola, me interesa el libro ${pick(libro.titulo)}, ${tomoLabel}.`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
  };

  // Primer nombre de pila, para que quepa como texto del botón -- el
  // nombre completo y el rol van en el aria-label.
  const primerNombre = (nombre) => nombre.split(" ")[0];

  return (
    <div className={`relatos-overlay__backdrop ${closing ? "is-closing" : ""}`} onMouseDown={requestClose}>
      <div
        className={`relatos-overlay ${closing ? "is-closing" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="relatos-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <OverlayPapelPicado />

        <button type="button" className="relatos-overlay__close" onClick={requestClose} aria-label={t("common.cerrar")}>
          <X size={20} strokeWidth={2.2} />
        </button>

        <header className="relatos-overlay__head">
          <span className="eyebrow eyebrow--light">{t("hero.card.books.title")}</span>
          <h2 id="relatos-title">{t("relatos.title")}</h2>
        </header>

        <SegmentedTabs
          idPrefix="relatos"
          ariaLabel={t("relatos.tabs.ariaLabel")}
          activeId={tab}
          onChange={setTab}
          tabs={[
            { id: "historia", icon: TabPersonasIcon, label: t("relatos.tabs.historia") },
            { id: "libros", icon: TabLibrosIcon, label: t("relatos.tabs.libros") },
          ]}
        />

        <div className="relatos-overlay__body" tabIndex={-1} ref={bodyRef}>
          {tab === "historia" && (
            <div role="tabpanel" id="relatos-panel-historia" aria-labelledby="relatos-tab-historia">
              <QuienesSomosTab onGoToLibros={() => setTab("libros")} />
            </div>
          )}

          {tab === "libros" && (
            <div role="tabpanel" id="relatos-panel-libros" aria-labelledby="relatos-tab-libros">
              <div className="libros-panel__head">
                <h3>{t("booksModal.title")}</h3>
                <p>{t("booksModal.intro")}</p>
              </div>

              <div className="books-grid" ref={trackRef}>
                {LIBROS.map((libro, i) => (
                  <article
                    className="book-card"
                    key={libro.id}
                    data-index={i}
                    ref={(el) => (cardRefs.current[libro.id] = el)}
                  >
                    <div className="book-card__cover">
                      <img
                        src={libro.portada}
                        alt={t("booksModal.portadaAlt", { tomo: libro.tomo })}
                        loading="lazy"
                        width="900"
                        height="1200"
                      />
                    </div>
                    <div className="book-card__info">
                      <h3>
                        {pick(libro.titulo)} <span className="book-card__tomo">{libro.tomo}</span>
                      </h3>
                      {libro.subtitulo && <span className="book-card__subtitle">{pick(libro.subtitulo)}</span>}
                      {libro.autor && <span className="book-card__author">{pick(libro.autor)}</span>}
                      {libro.descripcion && <p className="book-card__description">{pick(libro.descripcion)}</p>}
                      {libro.precio && <span className="book-card__price">{libro.precio}</span>}

                      <div className="book-card__contactos">
                        {CONTACTOS.map((contacto) =>
                          contacto.numero ? (
                            <a
                              key={contacto.nombre}
                              className="book-card__whatsapp"
                              href={waLink(libro, contacto.numero)}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={t("booksModal.preguntarA", { nombre: contacto.nombre })}
                            >
                              <span className="book-card__whatsapp-icon">{WhatsAppIcon}</span>
                              {primerNombre(contacto.nombre)}
                            </a>
                          ) : (
                            <span
                              key={contacto.nombre}
                              className="book-card__whatsapp book-card__whatsapp--pendiente"
                              title={`${contacto.nombre} — ${t("booksModal.numeroPendiente")}`}
                            >
                              <span className="book-card__whatsapp-icon">{WhatsAppIcon}</span>
                              {primerNombre(contacto.nombre)}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {LIBROS.length > 1 && (
                <div
                  className="books-dots"
                  role="group"
                  aria-label={t("booksModal.dotsAriaLabel")}
                  onKeyDown={dotKeyDown(activeIndex, (i) => {
                    setActiveIndex(i);
                    goToCard(i);
                  })}
                >
                  {LIBROS.map((libro, i) => (
                    <button
                      key={libro.id}
                      type="button"
                      ref={registerDot(i)}
                      tabIndex={activeIndex === i ? 0 : -1}
                      aria-current={activeIndex === i ? "true" : undefined}
                      aria-label={t("booksModal.verTomo", { tomo: libro.tomo })}
                      className={`books-dots__dot ${activeIndex === i ? "is-active" : ""}`}
                      onClick={() => {
                        setActiveIndex(i);
                        goToCard(i);
                      }}
                    />
                  ))}
                </div>
              )}

              <p className="relatos-overlay__note">{t("booksModal.note")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
