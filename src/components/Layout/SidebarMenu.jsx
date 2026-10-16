import { useEffect, useState } from "react";
import { Menu as MenuIcon, ChevronDown } from "lucide-react";
import MENU from "../../data/menu.js";
import { rutaHash } from "../../hooks/useHashRoute.js";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./SidebarMenu.css";

const BREAKPOINT = "(min-width: 860px)";
const LISTA_ID = "sidebar-menu-lista";

// Menú lateral: en escritorio (>= 860px) es una lista siempre visible,
// fija al hacer scroll (sticky, ver SidebarMenu.css); en celular la
// misma barra dorada "Menú" es el botón que la pliega y despliega.
// Acordeón de un solo nivel (una fila con hijos abierta a la vez,
// `grupoAbierto`) independiente del plegado general en celular
// (`abiertoMovil`) -- cambiar de idioma no toca ninguno de los dos,
// porque ambos viven en estado de React, no en algo que LanguageContext
// reinicie.
export default function SidebarMenu({ ruta }) {
  const { t } = useLanguage();
  const esEscritorio = useMediaQuery(BREAKPOINT);
  const [abiertoMovil, setAbiertoMovil] = useState(false);
  const [grupoAbierto, setGrupoAbierto] = useState(() => {
    const item = MENU.find((i) => i.id === ruta.itemId);
    return item?.hijos ? item.id : null;
  });

  // Si la ruta cambia por navegación directa, enlace con hash o el
  // botón atrás/adelante, abre el acordeón del grupo correspondiente
  // para que la opción activa quede visible sin tener que buscarla.
  useEffect(() => {
    const item = MENU.find((i) => i.id === ruta.itemId);
    if (item?.hijos) setGrupoAbierto(item.id);
  }, [ruta.itemId]);

  const alternarGrupo = (id) => setGrupoAbierto((actual) => (actual === id ? null : id));

  // Al elegir una opción real (no al abrir/cerrar un acordeón), el menú
  // se pliega en celular -- en escritorio no hay nada que plegar.
  const alElegirOpcion = () => {
    if (!esEscritorio) setAbiertoMovil(false);
  };

  const colapsadoEnMovil = !esEscritorio && !abiertoMovil;

  return (
    <nav className="sidebar-menu" aria-label={t("menu.ariaLabel")}>
      {esEscritorio ? (
        <div className="sidebar-menu__barra">
          <span>{t("menu.header.titulo")}</span>
        </div>
      ) : (
        <button
          type="button"
          className="sidebar-menu__barra sidebar-menu__barra--boton"
          aria-expanded={abiertoMovil}
          aria-controls={LISTA_ID}
          aria-label={abiertoMovil ? t("menu.movil.cerrar") : t("menu.movil.abrir")}
          onClick={() => setAbiertoMovil((a) => !a)}
        >
          <MenuIcon size={18} strokeWidth={2.2} aria-hidden="true" />
          <span>{t("menu.header.titulo")}</span>
        </button>
      )}

      <div className={`sidebar-menu__acordeon${colapsadoEnMovil ? "" : " is-abierta"}`}>
        <div className="sidebar-menu__acordeon-inner" inert={colapsadoEnMovil || undefined}>
          <ul className="sidebar-menu__lista" id={LISTA_ID}>
            {MENU.map((item) => {
              const esActivoDirecto = !item.hijos && ruta.itemId === item.id;
              const estaAbierto = grupoAbierto === item.id;
              const Icono = item.icon;
              const estiloFila = { "--fila-desde": item.degradado[0], "--fila-hasta": item.degradado[1] };

              return (
                <li className="sidebar-menu__item" key={item.id}>
                  {item.hijos ? (
                    <button
                      type="button"
                      className={`sidebar-menu__fila${estaAbierto ? " is-abierta" : ""}`}
                      style={estiloFila}
                      aria-expanded={estaAbierto}
                      aria-controls={`sidebar-submenu-${item.id}`}
                      onClick={() => alternarGrupo(item.id)}
                    >
                      <span className="sidebar-menu__icono" aria-hidden="true">
                        <Icono size={18} strokeWidth={1.8} />
                      </span>
                      <span className="sidebar-menu__texto">{t(item.label)}</span>
                      <ChevronDown
                        className={`sidebar-menu__flecha${estaAbierto ? " is-abierta" : ""}`}
                        size={16}
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                    </button>
                  ) : (
                    <a
                      className={`sidebar-menu__fila${item.soon ? " is-proximamente" : ""}`}
                      style={estiloFila}
                      href={rutaHash(item.id)}
                      aria-current={esActivoDirecto ? "page" : undefined}
                      onClick={alElegirOpcion}
                    >
                      <span className="sidebar-menu__icono" aria-hidden="true">
                        <Icono size={18} strokeWidth={1.8} />
                      </span>
                      <span className="sidebar-menu__texto">{t(item.label)}</span>
                      {item.soon && <span className="sidebar-menu__badge">{t("menu.proximamente.badge")}</span>}
                    </a>
                  )}

                  {item.hijos && (
                    <ul
                      className={`sidebar-menu__submenu${estaAbierto ? " is-abierta" : ""}`}
                      id={`sidebar-submenu-${item.id}`}
                    >
                      {item.hijos.map((hijo) => {
                        const hijoActivo = ruta.itemId === item.id && ruta.hijoId === hijo.id;
                        return (
                          <li key={hijo.id}>
                            <a
                              className={`sidebar-menu__subopcion${hijo.soon ? " is-proximamente" : ""}`}
                              href={rutaHash(item.id, hijo.id)}
                              aria-current={hijoActivo ? "page" : undefined}
                              onClick={alElegirOpcion}
                            >
                              <span className="sidebar-menu__subopcion-texto">{t(hijo.label)}</span>
                              {hijo.soon ? (
                                <span className="sidebar-menu__badge">{t("menu.proximamente.badge")}</span>
                              ) : (
                                <span className="sidebar-menu__punto" aria-hidden="true" />
                              )}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
