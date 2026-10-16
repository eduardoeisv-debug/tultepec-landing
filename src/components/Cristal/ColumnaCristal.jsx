import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Home, Shield, Share2, Check, ChevronRight } from "lucide-react";
import MENU from "../../data/menu.js";
import { rutaHash } from "../../hooks/useHashRoute.js";
import useArrowNavigation from "../../hooks/useArrowNavigation.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./ColumnaCristal.css";

// Columna izquierda fija de "Menú Cristal": marca, lista de filas
// (Inicio + las 9 del menú) y la caja de herramientas (privacidad,
// compartir, idioma) abajo. Un grupo con subopciones es un <button>
// que abre un flyout a su derecha (una sola fila activa a la vez,
// `grupoAbierto`) -- nunca navega por sí mismo, solo despliega; un
// grupo sin subopciones es un <a> real, igual que Inicio. La posición
// del flyout se calcula a partir del rectángulo real de la fila (ver
// Flyout más abajo), así que funciona igual en escritorio y celular
// sin necesitar distinguir el ancho de pantalla aquí.
//
// `oculta`/`overlay` (CristalShell.jsx): en celular, al entrar a una
// sección la columna se oculta por completo (`oculta`) para que el
// contenido use toda la pantalla; el botón "Menú" de Seccion.jsx la
// trae de vuelta como una capa a pantalla completa (`overlay`) -- ahí
// los flyouts ya no tienen a dónde desplegarse a la derecha (la
// columna ocupa todo el ancho), así que se abren en línea, empujando
// el resto de filas hacia abajo, en vez de como panel flotante.
export default function ColumnaCristal({ ruta, onCompartir, oculta = false, overlay = false, onSeleccionar }) {
  const { t } = useLanguage();
  const [grupoAbierto, setGrupoAbierto] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const colRef = useRef(null);
  // Un nodo de fila por cada grupo con hijos -- Flyout.jsx los usa para
  // calcular dónde dibujarse (ver el comentario de .cristal-col__flyout
  // en ColumnaCristal.css sobre por qué es un portal en vez de vivir
  // dentro de esta columna).
  const filaRefs = useRef({});

  const compartir = () => {
    onCompartir();
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const cerrarFlyout = () => setGrupoAbierto(null);

  // Escape o un clic fuera de la columna cierran el flyout abierto.
  useEffect(() => {
    if (!grupoAbierto) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") cerrarFlyout();
    };
    const onPointerDown = (e) => {
      // El flyout vive en un portal fuera de colRef (ver Flyout más
      // abajo) -- un clic dentro de él también cuenta como "dentro".
      const dentro = colRef.current?.contains(e.target) || e.target.closest(".cristal-col__flyout");
      if (!dentro) cerrarFlyout();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [grupoAbierto]);

  // Cambiar de ruta por cualquier otro medio (atrás/adelante, enlace
  // directo) cierra cualquier flyout que hubiera quedado abierto.
  useEffect(() => {
    cerrarFlyout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruta.itemId, ruta.hijoId]);

  const alSeleccionar = () => {
    cerrarFlyout();
    onSeleccionar?.();
  };

  const claseColumna = `cristal-col${oculta ? " cristal-col--oculta" : ""}${overlay ? " cristal-col--overlay" : ""}`;

  return (
    <nav ref={colRef} className={claseColumna} aria-label={t("menu.ariaLabel")} inert={oculta || undefined}>
      <a className="cristal-col__logo" href={rutaHash(null)} onClick={alSeleccionar}>
        <h1>Tultepec</h1>
        <p>{t("cristal.marca.sub")}</p>
      </a>

      <ul className="cristal-col__menu">
        <li className="cristal-col__item">
          <a
            className="cristal-col__fila"
            href={rutaHash(null)}
            aria-current={!ruta.itemId ? "page" : undefined}
            onClick={alSeleccionar}
          >
            <span className="cristal-col__texto">{t("menu.inicio")}</span>
            <span className="cristal-col__icono" aria-hidden="true">
              <Home size={14} strokeWidth={1.8} />
            </span>
          </a>
        </li>

        {MENU.map((item) => {
          const Icono = item.icon;
          const activo = ruta.itemId === item.id;
          const abierto = grupoAbierto === item.id;

          return (
            <li className="cristal-col__item" key={item.id}>
              {item.hijos ? (
                <button
                  type="button"
                  ref={(el) => {
                    filaRefs.current[item.id] = el;
                  }}
                  className="cristal-col__fila"
                  aria-expanded={abierto}
                  aria-haspopup="true"
                  onClick={() => setGrupoAbierto((actual) => (actual === item.id ? null : item.id))}
                >
                  <span className="cristal-col__texto">
                    {t(item.label)}
                    <ChevronRight className={`cristal-col__flecha${abierto ? " is-abierta" : ""}`} size={14} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="cristal-col__icono" aria-hidden="true">
                    <Icono size={14} strokeWidth={1.8} />
                  </span>
                </button>
              ) : (
                <a
                  className={`cristal-col__fila${item.soon ? " is-proximamente" : ""}`}
                  href={rutaHash(item.id)}
                  aria-current={activo ? "page" : undefined}
                  onClick={alSeleccionar}
                >
                  <span className="cristal-col__texto">
                    {t(item.label)}
                    {item.soon && <span className="cristal-col__badge">{t("menu.proximamente.badge")}</span>}
                  </span>
                  <span className="cristal-col__icono" aria-hidden="true">
                    <Icono size={14} strokeWidth={1.8} />
                  </span>
                </a>
              )}

              {item.hijos && (
                <Flyout
                  item={item}
                  ruta={ruta}
                  abierto={abierto}
                  inline={overlay}
                  filaRefs={filaRefs}
                  colRef={colRef}
                  onElegir={alSeleccionar}
                  onCerrar={cerrarFlyout}
                />
              )}
            </li>
          );
        })}
      </ul>

      <div className="cristal-col__herramientas">
        <a className="cristal-col__boton" href={rutaHash("privacidad")} aria-label={t("footer.privacyLink")} title={t("footer.privacyLink")}>
          <Shield size={18} strokeWidth={1.8} />
        </a>
        <button
          type="button"
          className="cristal-col__boton"
          onClick={compartir}
          aria-label={copiado ? t("shareButtons.copied") : t("shareButtons.label")}
          title={copiado ? t("shareButtons.copied") : t("shareButtons.label")}
        >
          {copiado ? <Check size={18} strokeWidth={2.2} /> : <Share2 size={18} strokeWidth={1.8} />}
        </button>
        <LanguageToggle />
      </div>
    </nav>
  );
}

function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <span className="cristal-col__lang" role="group" aria-label={t("languageSwitcher.ariaLabel")}>
      <button type="button" aria-pressed={language === "es"} onClick={() => setLanguage("es")}>
        ES
      </button>
      <button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")}>
        EN
      </button>
    </span>
  );
}

// Panel de subopciones: a la derecha de la fila en escritorio (flyout
// clásico), casi opaco encima del contenido en celular (ver
// ColumnaCristal.css) para que se alcance a leer. Las flechas ↑/↓
// navegan entre sus botones (useArrowNavigation, orientación vertical,
// igual que el resto de listas del sitio).
//
// Con portal a document.body: .cristal-col tiene overflow-y:auto (las
// 10 filas no siempre caben en una pantalla) y, dentro de un
// contenedor con scroll, enfocar un elemento que por left:100% queda
// fuera de sus 300/150px hace que el navegador desplace TODO el
// contenedor para "traerlo a la vista" -- eso tapaba las propias
// filas del menú. Fuera del contenedor (aquí, en el portal), ese
// desplazamiento ya no puede pasar; la posición se calcula a mano a
// partir del rectángulo real de la fila que lo abrió.
function Flyout({ item, ruta, abierto, inline, filaRefs, colRef, onElegir, onCerrar }) {
  const { t } = useLanguage();
  const { register, onKeyDown } = useArrowNavigation({ count: item.hijos.length, orientation: "vertical" });
  const primerBotonRef = useRef(null);
  const [posicion, setPosicion] = useState(null);

  // En modo overlay (celular, columna a pantalla completa) no hay a
  // dónde desplegar un panel a la derecha -- se abre en línea, sin
  // necesitar medir ni portal. Fuera de ahí (escritorio o la columna
  // angosta de Inicio en celular) sigue siendo el panel flotante de
  // siempre, calculado a partir del rectángulo de la fila.
  useEffect(() => {
    if (inline || !abierto) {
      setPosicion(null);
      return undefined;
    }
    const fila = filaRefs.current[item.id];
    if (!fila) return undefined;
    const r = fila.getBoundingClientRect();
    setPosicion({ left: r.right, top: r.top });
    primerBotonRef.current?.focus({ preventScroll: true });

    // Si la columna se desplaza (o la ventana cambia de tamaño)
    // mientras el flyout está abierto, su posición fija ya no
    // coincidiría con la fila -- más simple cerrarlo, igual que un
    // clic fuera.
    const col = colRef.current;
    const onScrollOrResize = () => onCerrar();
    col?.addEventListener("scroll", onScrollOrResize);
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      col?.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto, inline]);

  useEffect(() => {
    if (inline && abierto) primerBotonRef.current?.focus({ preventScroll: true });
  }, [abierto, inline]);

  if (!abierto) return null;
  if (!inline && !posicion) return null;

  const lista = (
    <ul
      className={`cristal-col__flyout${inline ? " cristal-col__flyout--en-linea" : ""}`}
      style={inline ? undefined : { left: posicion.left, top: posicion.top }}
      onKeyDown={onKeyDown(0, () => {})}
    >
      {item.hijos.map((hijo, i) => {
        const hijoActivo = ruta.itemId === item.id && ruta.hijoId === hijo.id;
        return (
          <li key={hijo.id}>
            <a
              href={rutaHash(item.id, hijo.id)}
              ref={(el) => {
                register(i)(el);
                if (i === 0) primerBotonRef.current = el;
              }}
              aria-current={hijoActivo ? "page" : undefined}
              className={hijo.soon ? "is-proximamente" : undefined}
              onClick={onElegir}
            >
              {t(hijo.label)}
              {hijo.soon && <span className="cristal-col__badge">{t("menu.proximamente.badge")}</span>}
            </a>
          </li>
        );
      })}
    </ul>
  );

  return inline ? lista : createPortal(lista, document.body);
}
