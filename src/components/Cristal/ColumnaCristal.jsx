import { useEffect, useRef, useState } from "react";
import { Home, Shield, Share2, Check, X } from "lucide-react";
import SECTIONS from "../../data/sections.js";
import { rutaHash } from "../../hooks/useHashRoute.js";
import useArrowNavigation from "../../hooks/useArrowNavigation.js";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { useSound } from "../../hooks/useSound.jsx";
import { marcarProximaDesdeMenu, consumirVueltaAlMenu } from "../../hooks/useVolverASecciones.js";
import { preloadJuegos } from "../Panel/views/JuegosSeccion.jsx";
import { preloadGaleriaThumbnails } from "../../hooks/useGaleriaImages.js";
import BrandSparkles from "../shared/BrandSparkles.jsx";
import "./ColumnaCristal.css";

// Dispara el chunk de PrivacidadContenido (React.lazy en
// CristalShell.jsx) apenas el dedo/mouse roza el escudo del pie del
// menú -- mismo propósito que preloadJuegos (ver más abajo), ruta
// idéntica a la de CristalShell.jsx así que Vite resuelve al mismo
// chunk sin descargarlo dos veces.
const preloadPrivacidad = () => import("../Panel/views/PrivacidadContenido.jsx");

// Todo SECTIONS salvo "inicio" (que ya tiene su propia fila fija,
// primera, justo abajo) -- calculado una sola vez al cargar el
// módulo, no en cada render.
const SECCIONES_MENU = SECTIONS.filter((s) => s.showInMenu && s.id !== "inicio");

// Variable de módulo (no estado de React, mismo patrón que
// useVolverASecciones.js): sobrevive a que CristalShell.jsx desmonte
// y vuelva a montar este panel cada vez que se cierra/abre el menú.
// Sin esto, tocar "Memorias" para explorar sus subopciones (sin llegar
// a elegir ninguna) se veía bien AL MOMENTO -- pero cerrar el menú y
// volver a abrirlo lo hacía recalcular `grupoAbierto` desde cero a
// partir de la ruta activa (que nunca cambió, seguía en
// "pirotecnia/historia"), mostrando Pirotecnia desplegada otra vez,
// como si la exploración de Memorias nunca hubiera pasado. `undefined`
// = sin preferencia explícita todavía (usa la ruta activa, como
// siempre); cualquier otro valor (incluido `null`, grupo colapsado a
// propósito) gana sobre la ruta hasta la próxima navegación real.
let ultimoGrupoExplorado;

// Menú de "Menú Cristal": ya no es una columna siempre visible al lado
// del contenido -- se abre como una capa a pantalla completa (en
// escritorio y en celular por igual) desde el botón de hamburguesa de
// TopBarCristal.jsx, y solo existe en el DOM mientras está abierta
// (CristalShell.jsx la monta/desmonta con `{menuAbierto && <ColumnaCristal/>}`,
// no con display:none). Un grupo con subopciones es un <button> que
// despliega su lista EN LÍNEA debajo (empuja el resto de filas hacia
// abajo) -- ya no hay columna angosta al lado del contenido para la
// que tuviera sentido un panel flotante aparte.
//
// `is-resaltada` (la tarjeta dorada de abajo) es un estado VISUAL
// aparte de aria-current/aria-expanded, que sí reflejan siempre el
// estado real para lectores de pantalla: la fila dorada "a secas"
// (sin que ningún grupo esté desplegado) es la ruta activa de verdad;
// en cuanto se despliega un grupo, SOLO ese grupo se ve dorado -- la
// ruta activa sigue siéndolo (su aria-current no se toca), pero deja
// de competir visualmente con lo que el usuario está mirando en ese
// momento. Sin esto, abrir "Memorias" mientras se está en Inicio
// dejaba dos filas doradas a la vez.
export default function ColumnaCristal({ ruta, onCompartir, onCerrar }) {
  const { t } = useLanguage();
  const { playTap } = useSound();
  const [grupoAbierto, setGrupoAbierto] = useState(() => {
    if (ultimoGrupoExplorado !== undefined) return ultimoGrupoExplorado;
    const item = SECTIONS.find((i) => i.id === ruta.itemId);
    return item?.hijos ? item.id : null;
  });
  const [copiado, setCopiado] = useState(false);
  const [visitadaId, setVisitadaId] = useState(null);
  const colRef = useRef(null);
  const cerrarRef = useRef(null);
  // Cachea lo leído de consumirVueltaAlMenu() -- StrictMode vuelve a
  // invocar el efecto de montaje una vez en desarrollo (monta, limpia,
  // monta de nuevo) y esa segunda pasada encontraría el valor del
  // módulo ya vacío (lo consumió la primera), perdiendo el scroll
  // restaurado y el temporizador que quita el resaltado. Mismo arreglo
  // que InicioCristal.jsx para su propio resaltado de vuelta.
  const pendienteRef = useRef(undefined);

  const compartir = () => {
    playTap();
    onCompartir();
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Atrapa Tab/Shift+Tab dentro de la tarjeta mientras está montada
  // (siempre "activa": CristalShell.jsx solo la monta mientras el menú
  // está abierto) -- sin esto, Tab se escapaba hacia el contenido de
  // la página de atrás, visible detrás del fondo oscurecido.
  useFocusTrap(colRef, true);

  // Al abrir: si CristalShell.jsx dejó pedida una vuelta al menú (el
  // botón "Volver al menú" de Seccion.jsx, o el botón atrás del
  // navegador saliendo de una sección abierta así -- ver ese mismo
  // archivo), restaura el scroll del panel donde estaba y resalta
  // brevemente la fila de la sección recién visitada, con el foco ahí
  // mismo. Si no hay nada pedido (abrir con la hamburguesa, la barra
  // inferior, etc.), el comportamiento de siempre: foco al botón de
  // cerrar. Al cerrar, CristalShell.jsx devuelve el foco a quien lo
  // abrió.
  useEffect(() => {
    if (pendienteRef.current === undefined) {
      pendienteRef.current = consumirVueltaAlMenu();
    }
    const pendiente = pendienteRef.current;
    if (!pendiente) {
      cerrarRef.current?.focus();
      return undefined;
    }
    const panel = colRef.current;
    if (panel) panel.scrollTop = pendiente.scrollMenu;
    const fila = pendiente.seccionId ? panel?.querySelector(`[data-section-id="${pendiente.seccionId}"]`) : null;
    if (!fila) {
      cerrarRef.current?.focus();
      return undefined;
    }
    if (fila.matches("a, button, [tabindex]")) fila.focus({ preventScroll: true });
    setVisitadaId(pendiente.seccionId);
    const idTimeout = setTimeout(() => setVisitadaId(null), 1800);
    return () => clearTimeout(idTimeout);
  }, []);

  // Clic fuera de la tarjeta del menú (sobre el fondo oscurecido) la
  // cierra -- Escape ya lo maneja CristalShell.jsx, que es quien monta
  // este componente. La barra inferior (BottomNav.jsx) queda exenta a
  // propósito: vive fuera de este panel en el DOM (la monta
  // CristalShell.jsx, no este componente) pero ahora se ve y se puede
  // tocar POR ENCIMA del menú abierto (ver BottomNav.css) -- sin esta
  // excepción, cualquier toque ahí (incluido "Sonido", que no debe
  // cerrar el menú) contaría como "fuera" y lo cerraría de más,
  // compitiendo con la lógica propia de cada botón de esa barra.
  useEffect(() => {
    const onPointerDown = (e) => {
      if (colRef.current && !colRef.current.contains(e.target) && !e.target.closest(".cristal-bottomnav")) {
        onCerrar();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [onCerrar]);

  // marcarProximaDesdeMenu antes de onCerrar/navegar (no después):
  // CristalShell.jsx lo consume en su efecto de cambio de ruta para
  // fijar el origen de la sección a la que se entra -- si llegara
  // tarde, ese efecto ya habría resuelto "icons" por defecto. `ruta`
  // es la prop de este mismo componente, la ruta activa DETRÁS del
  // menú (la que estaba antes de este clic) -- exactamente lo que hay
  // que recordar para volver aquí después.
  //
  // ultimoGrupoExplorado = undefined: cualquier navegación real
  // descarta el "último grupo explorado a mano" (ver la variable de
  // módulo, arriba) -- la próxima vez que se abra el menú debe
  // reflejar la ruta a la que se acaba de llegar, no un grupo que se
  // había quedado desplegado de una exploración anterior sin navegar.
  const alSeleccionar = () => {
    playTap();
    marcarProximaDesdeMenu({ ruta, scrollMenu: colRef.current?.scrollTop ?? 0 });
    ultimoGrupoExplorado = undefined;
    onCerrar();
  };

  return (
    <div className="cristal-col__backdrop">
      <nav ref={colRef} className="cristal-col" aria-label={t("menu.ariaLabel")}>
        <div className="cristal-col__cabecera">
          <a className="cristal-col__logo" href={rutaHash(null)} onClick={alSeleccionar}>
            <h1>
              <span className="brand-mirror">
                Tultepec Digital
                <BrandSparkles />
              </span>
            </h1>
            <p>{t("cristal.marca.sub")}</p>
          </a>
          <button type="button" ref={cerrarRef} className="cristal-col__cerrar" onClick={onCerrar} aria-label={t("menu.movil.cerrar")}>
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <ul className="cristal-col__menu">
          <li className="cristal-col__item">
            <a
              className={`cristal-col__fila${!ruta.itemId && !grupoAbierto ? " is-resaltada" : ""}`}
              href={rutaHash(null)}
              aria-current={!ruta.itemId ? "page" : undefined}
              onClick={alSeleccionar}
            >
              <Home className="cristal-col__icono" size={18} strokeWidth={1.8} aria-hidden="true" />
              <span className="cristal-col__texto">{t("menu.inicio")}</span>
            </a>
          </li>

          {SECCIONES_MENU.map((item) => {
            const Icono = item.menuIcon;
            const activo = ruta.itemId === item.id;
            const abierto = grupoAbierto === item.id;
            const esProximamente = item.estado === "proximamente";
            // Resaltado temporal (is-visitada, ver el efecto de montaje
            // de arriba) aparte de is-resaltada (esa es la RUTA ACTIVA,
            // un estado permanente, no relacionado).
            const claseVisitada = visitadaId === item.id ? " is-visitada" : "";

            return (
              <li className="cristal-col__item" key={item.id}>
                {item.hijos ? (
                  <button
                    type="button"
                    className={`cristal-col__fila${abierto ? " is-resaltada" : ""}${claseVisitada}`}
                    data-section-id={item.id}
                    aria-expanded={abierto}
                    aria-haspopup="true"
                    onClick={() => {
                      playTap();
                      setGrupoAbierto((actual) => {
                        const siguiente = actual === item.id ? null : item.id;
                        // Memoriza este toggle (incluido colapsar a
                        // null) para que sobreviva un cierre/reapertura
                        // del menú sin navegar -- ver la variable de
                        // módulo ultimoGrupoExplorado, arriba.
                        ultimoGrupoExplorado = siguiente;
                        return siguiente;
                      });
                    }}
                    // Pirotecnia es la única fila con hijos cuya
                    // Galería adentro tiene algo que de verdad vale la
                    // pena adelantar: las miniaturas (ver
                    // useGaleriaImages.js). abrirMenu ya las dispara al
                    // abrir el menú completo, pero esto cubre a quien
                    // reabre el menú y SOLO roza esta fila.
                    onMouseEnter={item.id === "pirotecnia" ? preloadGaleriaThumbnails : undefined}
                    onTouchStart={item.id === "pirotecnia" ? preloadGaleriaThumbnails : undefined}
                  >
                    <Icono className="cristal-col__icono" size={18} strokeWidth={1.8} aria-hidden="true" />
                    <span className="cristal-col__texto">{t(item.label)}</span>
                  </button>
                ) : esProximamente ? (
                  // Sin <a>/href: "próximamente" ya no navega a ningún
                  // lado (antes caía en una vista de relleno) -- solo se
                  // ve atenuada, con su etiqueta, sin reaccionar al clic
                  // ni entrar al orden de tabulación.
                  <div className="cristal-col__fila is-proximamente" aria-disabled="true">
                    <Icono className="cristal-col__icono" size={18} strokeWidth={1.8} aria-hidden="true" />
                    <span className="cristal-col__texto">{t(item.label)}</span>
                    <span className="cristal-col__badge">{t("menu.proximamente.badge")}</span>
                  </div>
                ) : (
                  <a
                    className={`cristal-col__fila${activo && !grupoAbierto ? " is-resaltada" : ""}${claseVisitada}`}
                    data-section-id={item.id}
                    href={rutaHash(item.id)}
                    aria-current={activo ? "page" : undefined}
                    onClick={alSeleccionar}
                    // Juegos es la única fila sin hijos que todavía
                    // esconde un React.lazy detrás (los 3 minijuegos,
                    // ver JuegosSeccion.jsx) -- roce de mouse/dedo
                    // adelanta esa descarga antes de que el clic real
                    // la necesite.
                    onMouseEnter={item.id === "juegos" ? preloadJuegos : undefined}
                    onTouchStart={item.id === "juegos" ? preloadJuegos : undefined}
                  >
                    <Icono className="cristal-col__icono" size={18} strokeWidth={1.8} aria-hidden="true" />
                    <span className="cristal-col__texto">{t(item.label)}</span>
                  </a>
                )}

                {item.hijos && <Flyout item={item} ruta={ruta} abierto={abierto} onElegir={alSeleccionar} />}
              </li>
            );
          })}
        </ul>

        <div className="cristal-col__herramientas">
          <a
            className="cristal-col__boton icono-3d"
            href={rutaHash("privacidad")}
            onClick={alSeleccionar}
            onMouseEnter={preloadPrivacidad}
            onTouchStart={preloadPrivacidad}
            aria-label={t("footer.privacyLink")}
            title={t("footer.privacyLink")}
            style={{ "--icon-color": "var(--color-gold-light)", "--icon-ink": "#14163a" }}
          >
            <Shield size={20} strokeWidth={1.8} />
          </a>
          <button
            type="button"
            className="cristal-col__boton icono-3d"
            onClick={compartir}
            aria-label={copiado ? t("shareButtons.copied") : t("shareButtons.label")}
            title={copiado ? t("shareButtons.copied") : t("shareButtons.label")}
            style={{ "--icon-color": "var(--color-turquoise)", "--icon-ink": "#14163a" }}
          >
            {copiado ? <Check size={20} strokeWidth={2.2} /> : <Share2 size={20} strokeWidth={1.8} />}
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
