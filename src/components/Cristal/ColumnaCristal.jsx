import { useEffect, useRef, useState } from "react";
import { Home, Shield, Share2, Check, X } from "lucide-react";
import MENU from "../../data/menu.js";
import { rutaHash } from "../../hooks/useHashRoute.js";
import useArrowNavigation from "../../hooks/useArrowNavigation.js";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./ColumnaCristal.css";

// Menú de "Menú Cristal": ya no es una columna siempre visible al lado
// del contenido -- se abre como una capa a pantalla completa (en
// escritorio y en celular por igual) desde el botón de hamburguesa de
// TopBarCristal.jsx, y solo existe en el DOM mientras está abierta
// (CristalShell.jsx la monta/desmonta con `{menuAbierto && <ColumnaCristal/>}`,
// no con display:none). Un grupo con subopciones es un <button> que
// despliega su lista EN LÍNEA debajo (empuja el resto de filas hacia
// abajo) -- ya no hay columna angosta al lado del contenido para la
// que tuviera sentido un panel flotante aparte.
export default function ColumnaCristal({ ruta, onCompartir, onCerrar }) {
  const { t } = useLanguage();
  const [grupoAbierto, setGrupoAbierto] = useState(() => {
    const item = MENU.find((i) => i.id === ruta.itemId);
    return item?.hijos ? item.id : null;
  });
  const [copiado, setCopiado] = useState(false);
  const colRef = useRef(null);
  const cerrarRef = useRef(null);

  const compartir = () => {
    onCompartir();
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Atrapa Tab/Shift+Tab dentro de la tarjeta mientras está montada
  // (siempre "activa": CristalShell.jsx solo la monta mientras el menú
  // está abierto) -- sin esto, Tab se escapaba hacia el contenido de
  // la página de atrás, visible detrás del fondo oscurecido.
  useFocusTrap(colRef, true);

  // Autofoco al abrir: el botón de cerrar (useFocusTrap no mueve el
  // foco por sí solo -- el logo de arriba queda antes en el DOM, pero
  // es solo el enlace a Inicio, no el control que se espera recibir
  // el foco al abrir un menú). Al cerrar, CristalShell.jsx devuelve el
  // foco a la hamburguesa.
  useEffect(() => {
    cerrarRef.current?.focus();
  }, []);

  // Clic fuera de la tarjeta del menú (sobre el fondo oscurecido) la
  // cierra -- Escape ya lo maneja CristalShell.jsx, que es quien monta
  // este componente.
  useEffect(() => {
    const onPointerDown = (e) => {
      if (colRef.current && !colRef.current.contains(e.target)) onCerrar();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [onCerrar]);

  const alSeleccionar = () => onCerrar();

  return (
    <div className="cristal-col__backdrop">
      <nav ref={colRef} className="cristal-col" aria-label={t("menu.ariaLabel")}>
        <div className="cristal-col__cabecera">
          <a className="cristal-col__logo" href={rutaHash(null)} onClick={alSeleccionar}>
            <h1>Tultepec</h1>
            <p>{t("cristal.marca.sub")}</p>
          </a>
          <button type="button" ref={cerrarRef} className="cristal-col__cerrar" onClick={onCerrar} aria-label={t("menu.movil.cerrar")}>
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <ul className="cristal-col__menu">
          <li className="cristal-col__item">
            <a
              className="cristal-col__fila"
              href={rutaHash(null)}
              aria-current={!ruta.itemId ? "page" : undefined}
              onClick={alSeleccionar}
            >
              <Home className="cristal-col__icono" size={18} strokeWidth={1.8} aria-hidden="true" />
              <span className="cristal-col__texto">{t("menu.inicio")}</span>
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
                    <Icono className="cristal-col__icono" size={18} strokeWidth={1.8} aria-hidden="true" />
                    <span className="cristal-col__texto">{t(item.label)}</span>
                  </button>
                ) : (
                  <a
                    className={`cristal-col__fila${item.soon ? " is-proximamente" : ""}`}
                    href={rutaHash(item.id)}
                    aria-current={activo ? "page" : undefined}
                    onClick={alSeleccionar}
                  >
                    <Icono className="cristal-col__icono" size={18} strokeWidth={1.8} aria-hidden="true" />
                    <span className="cristal-col__texto">{t(item.label)}</span>
                    {item.soon && <span className="cristal-col__badge">{t("menu.proximamente.badge")}</span>}
                  </a>
                )}

                {item.hijos && <Flyout item={item} ruta={ruta} abierto={abierto} onElegir={alSeleccionar} />}
              </li>
            );
          })}
        </ul>

        <div className="cristal-col__herramientas">
          <a className="cristal-col__boton" href={rutaHash("privacidad")} onClick={alSeleccionar} aria-label={t("footer.privacyLink")} title={t("footer.privacyLink")}>
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
        </div>
      </nav>
    </div>
  );
}

// Subopciones de un grupo: se abren EN LÍNEA debajo de su fila,
// empujando el resto de la lista hacia abajo -- ya no hay columna
// angosta al lado del contenido para la que tuviera sentido un panel
// flotante aparte (ver el comentario de arriba). Las flechas ↑/↓
// navegan entre sus botones (useArrowNavigation, igual que el resto
// de listas del sitio).
function Flyout({ item, ruta, abierto, onElegir }) {
  const { t } = useLanguage();
  const { register, onKeyDown } = useArrowNavigation({ count: item.hijos.length, orientation: "vertical" });
  const primerBotonRef = useRef(null);

  useEffect(() => {
    if (abierto) primerBotonRef.current?.focus({ preventScroll: true });
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
