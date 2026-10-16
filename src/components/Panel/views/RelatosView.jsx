import { useEffect, useRef, useState } from "react";
import { LIBROS, CONTACTOS } from "../../../data/libros.js";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";
import useArrowNavigation from "../../../hooks/useArrowNavigation.js";
import SegmentedTabs from "../../shared/SegmentedTabs.jsx";
import QuienesSomosTab from "../../shared/QuienesSomosTab.jsx";
import { TabPersonasIcon, TabLibrosIcon } from "../../shared/GaleriaIcons.jsx";
import "../../shared/SegmentedTabs.css";
import "../../shared/RelatosModal.css";

const WhatsAppIcon = (
  <svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.4.7 4.7 1.9 6.7L3 29l7-2.1c1.9 1 4.1 1.6 6 1.6 7 0 12.7-5.6 12.7-12.5S23 3 16 3Zm0 22.7c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.2 1.3 1.3-4-.3-.4a10.3 10.3 0 0 1-1.9-6c0-5.7 4.7-10.4 10.5-10.4S26.5 9.8 26.5 15.5 21.8 25.7 16 25.7Zm5.7-7.8c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-.9 1.2-.3.2-.6.1a8.4 8.4 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1 2.9 1.2 3.1c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3Z" />
  </svg>
);

// Lo que antes era RelatosModal.jsx (dos pestañas -- "Quiénes somos" y
// "Los libros", con sus 3 portadas + contacto de WhatsApp), reubicado
// sin la ventana modal alrededor. Arranca en "Los libros" (es lo que
// pide "Memorias > Relatos escritos" en el menú), pero "Quiénes somos"
// se queda a un clic, igual que antes.
export default function RelatosView({ titleRef }) {
  const { t, pick, language } = useLanguage();
  const [tab, setTab] = useState("libros");
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef(null);
  const cardRefs = useRef({});
  const { register: registerDot, onKeyDown: dotKeyDown } = useArrowNavigation({
    count: LIBROS.length,
    orientation: "horizontal",
  });

  useEffect(() => {
    if (tab !== "libros") return undefined;
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
  }, [tab]);

  const goToCard = (index) => {
    const libro = LIBROS[index];
    const el = cardRefs.current[libro?.id];
    const track = trackRef.current;
    if (!el || !track) return;
    track.scrollTo({ left: el.offsetLeft - (track.clientWidth - el.clientWidth) / 2, behavior: "smooth" });
  };

  const waLink = (libro, numero) => {
    const tomoLabel = language === "en" ? `volume ${libro.tomo}` : `tomo ${libro.tomo}`;
    const message =
      language === "en"
        ? `Hi, I'm interested in the book ${pick(libro.titulo)}, ${tomoLabel}.`
        : `Hola, me interesa el libro ${pick(libro.titulo)}, ${tomoLabel}.`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
  };

  const etiquetaContacto = (contacto) => `${pick(contacto.rol)} ${contacto.nombre.split(" ")[0]}`;

  return (
    <div className="panel-view">
      <header className="panel-view__head">
        <span className="eyebrow eyebrow--light">{t("hero.card.books.title")}</span>
        <h1 className="panel-view__titulo" tabIndex={-1} ref={titleRef}>
          {t("relatos.title")}
        </h1>
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

      <div>
        {tab === "historia" && (
          <div role="tabpanel" id="relatos-panel-historia" aria-labelledby="relatos-tab-historia">
            <QuienesSomosTab onGoToLibros={() => setTab("libros")} />
          </div>
        )}

        {tab === "libros" && (
          <div role="tabpanel" id="relatos-panel-libros" aria-labelledby="relatos-tab-libros">
            <div className="libros-panel__head">
              <h2>{t("booksModal.title")}</h2>
              <p>{t("booksModal.intro")}</p>
            </div>

            <div className="books-grid" ref={trackRef}>
              {LIBROS.map((libro, i) => (
                <article className="book-card" key={libro.id} data-index={i} ref={(el) => (cardRefs.current[libro.id] = el)}>
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
                            {etiquetaContacto(contacto)}
                          </a>
                        ) : (
                          <span
                            key={contacto.nombre}
                            className="book-card__whatsapp book-card__whatsapp--pendiente"
                            title={`${contacto.nombre} — ${t("booksModal.numeroPendiente")}`}
                          >
                            <span className="book-card__whatsapp-icon">{WhatsAppIcon}</span>
                            {etiquetaContacto(contacto)}
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
  );
}
