import { useEffect, useRef, useState } from "react";
import { BookOpen, MessageSquareText, PenLine } from "lucide-react";
import MEMORIAS from "../../../data/memorias.json";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";
import useArrowNavigation from "../../../hooks/useArrowNavigation.js";
import SegmentedTabs from "../../shared/SegmentedTabs.jsx";
import Testimonials from "../../Testimonials/Testimonials.jsx";
import ShareMemoryForm from "../../shared/ShareMemoryForm.jsx";
import "../../shared/SegmentedTabs.css";
import "../../shared/MemoriesModal.css";

const LIBROS = [1, 2, 3];
const LIBRO_ROMANO = { 1: "I", 2: "II", 3: "III" };
const LONG_FRAGMENT_THRESHOLD = 350;

// Lo que antes era el cuerpo de MemoriesModal.jsx (mismas 3 pestañas:
// Memorias, Voces, Comparte), reubicado sin la ventana modal alrededor.
// Atiende dos opciones del menú a la vez -- "Memorias de mi pueblo" y
// "Comparte tu historia" -- con el mismo contenido, solo cambia qué
// pestaña arranca abierta (`initialTab`), igual que antes cambiaba
// según el hash (#memorias / #voces / #comparte-memoria).
export default function MemoriasContenido({ initialTab = "memorias", onOpenPrivacy }) {
  const { t, language } = useLanguage();
  const [tab, setTab] = useState(initialTab);
  const [libroFiltro, setLibroFiltro] = useState(1);
  const [expanded, setExpanded] = useState({});
  const [filtroIndex, setFiltroIndex] = useState(0);
  const bodyRef = useRef(null);
  const { register: registerFiltro, onKeyDown: filtroKeyDown } = useArrowNavigation({
    count: LIBROS.length,
    orientation: "horizontal",
  });
  const memoriasDelLibro = MEMORIAS.filter((m) => m.libro === libroFiltro);

  // Si se navega de "Memorias de mi pueblo" a "Comparte tu historia" (o
  // viceversa) sin desmontar el componente -- no debería pasar porque
  // ContentPanel.jsx remonta la vista en cada ruta, pero por si acaso --
  // la pestaña inicial se vuelve a aplicar.
  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  const toggleExpanded = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const changeFiltro = (index) => {
    setFiltroIndex(index);
    setLibroFiltro(LIBROS[index]);
  };

  return (
    <div className="panel-view panel-view--anidada">
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

      <div ref={bodyRef}>
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
                  {t("memoriesModal.libroBtn", { n: LIBRO_ROMANO[n] })}
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
  );
}
