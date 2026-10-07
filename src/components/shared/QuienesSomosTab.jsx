import { Sparkles } from "lucide-react";
import { CITA, HITOS, INTEGRANTES, CIERRE } from "../../data/grupo.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./QuienesSomosTab.css";

// Pestaña "Quiénes somos" de la ventana "Relatos Escritos": la historia
// de cómo se formó el grupo "Memorias de mi Pueblo" (cita + línea de
// tiempo + integrantes + cierre). Todo el contenido viene de
// src/data/grupo.js -- mientras ese archivo siga vacío (ver el TODO ahí),
// esta pestaña muestra solo un estado cuidado, nunca texto inventado.
export default function QuienesSomosTab({ onGoToLibros }) {
  const { t, pick } = useLanguage();
  const hasContent = CITA || HITOS.length > 0 || INTEGRANTES.length > 0 || CIERRE;

  if (!hasContent) {
    return (
      <div className="quienes-somos-empty">
        <Sparkles size={28} strokeWidth={1.6} aria-hidden="true" />
        <p>{t("relatos.historia.vacioTitulo")}</p>
        <p className="quienes-somos-empty__sub">{t("relatos.historia.vacioSub")}</p>
      </div>
    );
  }

  return (
    <div className="quienes-somos">
      {CITA && <blockquote className="quienes-somos__cita">“{pick(CITA)}”</blockquote>}

      {HITOS.length > 0 && (
        <section className="quienes-somos__block">
          <h3>{t("relatos.historia.hitosTitulo")}</h3>
          <ol className="qs-timeline">
            {HITOS.map((hito, i) => (
              <li className={`qs-timeline__item ${i % 2 === 1 ? "qs-timeline__item--right" : ""}`} key={hito.etapa.es}>
                <span className="qs-timeline__node" aria-hidden="true">
                  <Sparkles size={15} strokeWidth={1.8} />
                </span>
                <div className="qs-timeline__card">
                  <span className="qs-timeline__etapa">{pick(hito.etapa)}</span>
                  <h4>{pick(hito.titulo)}</h4>
                  <p>{pick(hito.texto)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {INTEGRANTES.length > 0 && (
        <section className="quienes-somos__block">
          <h3>{t("relatos.historia.integrantesTitulo")}</h3>
          <div className="qs-members">
            {INTEGRANTES.map((persona) => (
              <div className="qs-member" key={persona.nombre}>
                {persona.foto ? (
                  <img className="qs-member__photo" src={persona.foto} alt="" loading="lazy" />
                ) : (
                  <span className="qs-member__placeholder" aria-hidden="true">
                    {persona.nombre.charAt(0)}
                  </span>
                )}
                <span className="qs-member__name">{persona.nombre}</span>
                <span className="qs-member__role">{pick(persona.rol)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {CIERRE && (
        <div className="quienes-somos__closing">
          <p>{pick(CIERRE)}</p>
          <button type="button" className="btn btn--gold" onClick={onGoToLibros}>
            {t("relatos.historia.verLibros")}
          </button>
        </div>
      )}
    </div>
  );
}
