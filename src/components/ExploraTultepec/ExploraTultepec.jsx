import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import MENU from "../../data/menu.js";
import ExploraOpcionLink from "../shared/ExploraOpcionLink.jsx";
import useReveal from "../../hooks/useReveal.js";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./ExploraTultepec.css";

// Hash tipo "#explora-conoce" -> "conoce" si coincide con un grupo real
// de MENU, o null. Lo usan los tres botones de atajo del hero
// (Hero.jsx) para bajar hasta aquí Y abrir el grupo correcto a la vez:
// el salto lo hace solo useHashScrollFix.js (el id del grupo ya es un
// elemento real de la página), abrir el acordeón lo hace este efecto.
function grupoDesdeHash() {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace("#", "");
  const grupo = MENU.find((g) => `explora-${g.id}` === hash);
  return grupo?.id ?? null;
}

// Sección "Explora Tultepec": espejo en la página del mismo menú.
// Escritorio (>= 900px): tres columnas, siempre abiertas (no hace
// falta acordeón, ya caben). Celular: tarjeta con acordeón por grupo,
// solo una abierta a la vez -- mismos datos y el mismo componente de
// opción (ExploraOpcionLink) que ExploraMenu.jsx, para que agregar una
// opción nueva no haya que tocar dos archivos.
export default function ExploraTultepec() {
  const { t } = useLanguage();
  const ref = useReveal();
  const esEscritorio = useMediaQuery("(min-width: 900px)");
  const [grupoAbierto, setGrupoAbierto] = useState(() => grupoDesdeHash());

  useEffect(() => {
    const onHashChange = () => {
      const grupo = grupoDesdeHash();
      if (grupo) setGrupoAbierto(grupo);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const alternarGrupo = (id) => setGrupoAbierto((actual) => (actual === id ? null : id));

  return (
    <section className="explora-tultepec" id="explora-tultepec">
      <div className="container explora-tultepec__inner reveal" ref={ref}>
        <div className="section-head">
          <span className="eyebrow eyebrow--light">{t("explora.seccion.eyebrow")}</span>
          <h2>{t("explora.seccion.title")}</h2>
          <p className="explora-tultepec__subtitle">{t("explora.seccion.subtitle")}</p>
        </div>

        <div className="explora-tultepec__grid">
          {MENU.map((grupo) => {
            // En escritorio los tres grupos están siempre expandidos
            // (hay espacio de sobra en tres columnas); en celular manda
            // el acordeón -- un único booleano sencillo en vez de pelear
            // con especificidad CSS para que el media query gane.
            const expandido = esEscritorio || grupoAbierto === grupo.id;
            const contenidoId = `explora-tultepec-contenido-${grupo.id}`;

            return (
              <article className="explora-tultepec__grupo" id={`explora-${grupo.id}`} key={grupo.id}>
                {esEscritorio ? (
                  <h3 className="explora-tultepec__cabecera explora-tultepec__cabecera--fija">{t(grupo.label)}</h3>
                ) : (
                  <button
                    type="button"
                    className={`explora-tultepec__cabecera${expandido ? " is-abierta" : ""}`}
                    aria-expanded={expandido}
                    aria-controls={contenidoId}
                    onClick={() => alternarGrupo(grupo.id)}
                  >
                    <span>{t(grupo.label)}</span>
                    <ChevronDown
                      className={`explora-tultepec__flecha${expandido ? " is-abierta" : ""}`}
                      size={18}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  </button>
                )}

                <div
                  className={`explora-tultepec__contenido${expandido ? " is-abierta" : ""}`}
                  id={contenidoId}
                >
                  <div className="explora-tultepec__contenido-inner">
                    {grupo.categorias.map((categoria) => (
                      <div className="explora-categoria" key={categoria.id}>
                        <div className="explora-categoria__cabecera">
                          <span
                            className={`explora-categoria__icono explora-categoria__icono--${categoria.tono}`}
                            aria-hidden="true"
                          >
                            <categoria.icon size={18} strokeWidth={1.8} />
                          </span>
                          <span className="explora-categoria__nombre">{t(categoria.label)}</span>
                        </div>
                        <ul className="explora-categoria__opciones">
                          {categoria.opciones.map((opcion) => (
                            <li key={opcion.id}>
                              <ExploraOpcionLink opcion={opcion} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
