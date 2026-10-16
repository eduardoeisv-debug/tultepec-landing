import { useEffect, useRef, useState } from "react";
import { Home, Shield, Share2, Check, ChevronRight } from "lucide-react";
import MENU from "../../data/menu.js";
import { rutaHash } from "../../hooks/useHashRoute.js";
import useMediaQuery from "../../hooks/useMediaQuery.js";
import useArrowNavigation from "../../hooks/useArrowNavigation.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./ColumnaCristal.css";

const BREAKPOINT = "(min-width: 701px)";

// Columna izquierda fija de "Menú Cristal": marca, lista de filas
// (Inicio + las 9 del menú) y la caja de herramientas (privacidad,
// compartir, idioma) abajo. Un grupo con subopciones es un <button>
// que abre un flyout a su derecha (una sola fila activa a la vez,
// `grupoAbierto`) -- nunca navega por sí mismo, solo despliega; un
// grupo sin subopciones es un <a> real, igual que Inicio.
export default function ColumnaCristal({ ruta, onCompartir }) {
  const { t } = useLanguage();
  const esEscritorio = useMediaQuery(BREAKPOINT);
  const [grupoAbierto, setGrupoAbierto] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const colRef = useRef(null);

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
      if (colRef.current && !colRef.current.contains(e.target)) cerrarFlyout();
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

  return (
    <nav ref={colRef} className="cristal-col" aria-label={t("menu.ariaLabel")}>
      <a className="cristal-col__logo" href={rutaHash(null)}>
        <h1>Tultepec</h1>
        <p>{t("cristal.marca.sub")}</p>
      </a>

      <ul className="cristal-col__menu">
        <li className="cristal-col__item">
          <a
            className="cristal-col__fila"
            href={rutaHash(null)}
            aria-current={!ruta.itemId ? "page" : undefined}
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
                  esEscritorio={esEscritorio}
                  onElegir={cerrarFlyout}
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
function Flyout({ item, ruta, abierto, onElegir }) {
  const { t } = useLanguage();
  const { register, onKeyDown } = useArrowNavigation({ count: item.hijos.length, orientation: "vertical" });
  const primerBotonRef = useRef(null);

  useEffect(() => {
    if (abierto) primerBotonRef.current?.focus();
  }, [abierto]);

  if (!abierto) return null;

  return (
    <ul className="cristal-col__flyout" onKeyDown={onKeyDown(0, () => {})}>
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
}
