import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, X, ChevronDown, Home, Heart } from "lucide-react";
import MENU from "../../data/menu.js";
import ExploraOpcionLink from "../shared/ExploraOpcionLink.jsx";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import useScrollLock from "../../hooks/useScrollLock.js";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./ExploraMenu.css";

const CLOSE_ANIM_MS = 220;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// En escritorio (>= 900px) el botón abre un panel ancho de 3 columnas
// bajo el encabezado; en celular abre un cajón lateral con acordeón
// (ver README del prompt en Prompt_Menu_Explora_20261016.txt). Los dos
// comparten el mismo estado de apertura -- lo que cambia es el marcado,
// porque son patrones de interacción distintos (panel no modal vs cajón
// con fondo oscuro), no la misma lista con CSS diferente.
export default function ExploraMenu() {
  const { t } = useLanguage();
  const esEscritorio = useMediaQuery("(min-width: 900px)");
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [grupoAbierto, setGrupoAbierto] = useState(null); // acordeón móvil: id de grupo o null
  const botonRef = useRef(null);
  const panelRef = useRef(null);
  const panelId = "explora-panel";

  useScrollLock(!esEscritorio && open);
  useFocusTrap(panelRef, !esEscritorio && open);

  const finishClose = () => {
    setOpen(false);
    setClosing(false);
    setGrupoAbierto(null);
    botonRef.current?.focus();
  };

  const requestClose = () => {
    if (!open) return;
    if (prefersReducedMotion()) {
      finishClose();
      return;
    }
    setClosing(true);
    setTimeout(finishClose, CLOSE_ANIM_MS);
  };

  const toggle = () => {
    if (open) requestClose();
    else {
      setClosing(false);
      setOpen(true);
    }
  };

  // Si el ancho cruza los 900px mientras el menú está abierto (girar el
  // celular, redimensionar la ventana), no debe quedar un cajón móvil a
  // medio abrir vuelto panel de escritorio ni viceversa -- se cierra
  // directo, sin animación, y listo para abrirse de nuevo ya con el
  // marcado correcto.
  const esEscritorioAnterior = useRef(esEscritorio);
  useEffect(() => {
    if (open && esEscritorioAnterior.current !== esEscritorio) {
      setOpen(false);
      setClosing(false);
      setGrupoAbierto(null);
    }
    esEscritorioAnterior.current = esEscritorio;
  }, [esEscritorio, open]);

  // Foco a la primera opción navegable al abrir.
  useEffect(() => {
    if (!open) return undefined;
    const id = requestAnimationFrame(() => {
      const primera = panelRef.current?.querySelector('a[href], button:not([disabled])');
      primera?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Escape cierra, en escritorio y en celular.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // En escritorio no hay fondo oscuro (es un panel, no un modal), así
  // que un clic fuera del panel y del botón también debe cerrarlo.
  useEffect(() => {
    if (!open || !esEscritorio) return undefined;
    const onPointerDown = (e) => {
      if (panelRef.current?.contains(e.target) || botonRef.current?.contains(e.target)) return;
      requestClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, esEscritorio]);

  const alElegirOpcion = () => requestClose();

  const alternarGrupo = (grupoId) => setGrupoAbierto((actual) => (actual === grupoId ? null : grupoId));

  const mostrar = open || closing;

  // El panel y el cajón se portan a document.body (ver createPortal más
  // abajo) porque viven dentro de .site-header (position: sticky, su
  // propio contexto de apilamiento) -- anidado ahí, un position:fixed
  // queda atrapado dentro de ESE contexto en vez del de toda la página,
  // y el contenido del Hero (que sí pertenece al contexto raíz) termina
  // robándole los clics pese al z-index más alto. Portado a <body>, el
  // panel de escritorio ya no puede anclarse con `top: 100%` relativo a
  // .site-header (ancestro posicionado más cercano, ahora <body>), así
  // que se mide su alto real y se posiciona con position: fixed.
  const [panelTop, setPanelTop] = useState(0);
  useEffect(() => {
    if (!open || !esEscritorio) return undefined;
    const medir = () => {
      const header = document.querySelector(".site-header");
      if (header) setPanelTop(header.getBoundingClientRect().bottom);
    };
    medir();
    window.addEventListener("resize", medir);
    return () => window.removeEventListener("resize", medir);
  }, [open, esEscritorio]);

  return (
    <>
      <button
        type="button"
        className="explora-boton"
        ref={botonRef}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? t("explora.botonCerrarAriaLabel") : t("explora.botonAriaLabel")}
        onClick={toggle}
      >
        <Menu size={18} strokeWidth={2.2} aria-hidden="true" />
        <span className="explora-boton__texto">{t("explora.boton")}</span>
        <ChevronDown className={`explora-boton__flecha${open ? " is-abierta" : ""}`} size={16} strokeWidth={2.4} aria-hidden="true" />
      </button>

      {mostrar && esEscritorio && createPortal(
        <div
          id={panelId}
          className={`explora-panel${closing ? " is-cerrando" : ""}`}
          role="region"
          aria-label={t("explora.panelAriaLabel")}
          ref={panelRef}
          style={{ top: panelTop }}
        >
          <div className="explora-panel__inner">
            {MENU.map((grupo) => (
              <div className="explora-panel__grupo" key={grupo.id}>
                <h3 className="explora-panel__grupo-titulo">{t(grupo.label)}</h3>
                {grupo.categorias.map((categoria) => (
                  <div className="explora-categoria" key={categoria.id}>
                    <div className="explora-categoria__cabecera">
                      <span className={`explora-categoria__icono explora-categoria__icono--${categoria.tono}`} aria-hidden="true">
                        <categoria.icon size={18} strokeWidth={1.8} />
                      </span>
                      <span className="explora-categoria__nombre">{t(categoria.label)}</span>
                    </div>
                    <ul className="explora-categoria__opciones">
                      {categoria.opciones.map((opcion) => (
                        <li key={opcion.id}>
                          <ExploraOpcionLink opcion={opcion} onSelect={alElegirOpcion} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}

      {mostrar && !esEscritorio && createPortal(
        <div
          className={`explora-drawer-backdrop${closing ? " is-cerrando" : ""}`}
          onMouseDown={requestClose}
        >
          <div
            id={panelId}
            className={`explora-drawer${closing ? " is-cerrando" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-label={t("explora.panelAriaLabel")}
            tabIndex={-1}
            ref={panelRef}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="explora-drawer__barra">
              <span className="explora-drawer__titulo">{t("explora.drawer.titulo")}</span>
              <button
                type="button"
                className="explora-drawer__cerrar"
                onClick={requestClose}
                aria-label={t("explora.botonCerrarAriaLabel")}
              >
                <X size={20} strokeWidth={2.2} />
              </button>
            </div>

            <div className="explora-drawer__cuerpo">
              <a className="explora-drawer__fila explora-drawer__fila--simple" href="#inicio" onClick={alElegirOpcion}>
                <Home size={18} strokeWidth={1.8} aria-hidden="true" />
                {t("explora.drawer.inicio")}
              </a>

              {MENU.map((grupo) => {
                const abierto = grupoAbierto === grupo.id;
                return (
                  <div className="explora-drawer__grupo" key={grupo.id}>
                    <button
                      type="button"
                      className={`explora-drawer__fila explora-drawer__fila--grupo${abierto ? " is-abierta" : ""}`}
                      aria-expanded={abierto}
                      aria-controls={`explora-drawer-grupo-${grupo.id}`}
                      onClick={() => alternarGrupo(grupo.id)}
                    >
                      <span className="explora-drawer__fila-titulo">{t(grupo.label)}</span>
                      <ChevronDown
                        className={`explora-drawer__fila-flecha${abierto ? " is-abierta" : ""}`}
                        size={18}
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                    </button>

                    {abierto && (
                      <div className="explora-drawer__contenido" id={`explora-drawer-grupo-${grupo.id}`}>
                        {grupo.categorias.map((categoria) => (
                          <div className="explora-drawer__categoria" key={categoria.id}>
                            <span className="explora-drawer__categoria-nombre">{t(categoria.label)}</span>
                            <ul className="explora-drawer__opciones">
                              {categoria.opciones.map((opcion) => (
                                <li key={opcion.id}>
                                  <ExploraOpcionLink
                                    opcion={opcion}
                                    className="explora-drawer__opcion"
                                    onSelect={alElegirOpcion}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <a
                className="explora-drawer__fila explora-drawer__fila--simple"
                href="#interactua"
                onClick={alElegirOpcion}
              >
                <Heart size={18} strokeWidth={1.8} aria-hidden="true" />
                {t("explora.drawer.interactuar")}
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
