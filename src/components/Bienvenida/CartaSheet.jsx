import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import useScrollLock from "../../hooks/useScrollLock.js";
import { SobreSolapa } from "./Bienvenida.jsx";
import CartaContenido from "./CartaContenido.jsx";
import "./CartaSheet.css";

const UMBRAL_DESLIZAR_PX = 70;

// "Una carta para ti" en celular: ya no vive como tarjeta en Inicio
// (ver Bienvenida.css/InicioCristal.css) -- se abre desde el botón
// "Carta" de la barra inferior (BottomNav.jsx) como esta hoja, con el
// mismo contenido (CartaContenido.jsx) y la misma solapa en V
// (SobreSolapa, exportada de Bienvenida.jsx) que ya traía el acordeón
// de escritorio.
//
// SIEMPRE montada (oculta por CSS en vez de desmontada condicionalmente,
// como ya hace .bienvenida__acordeon en Bienvenida.jsx) -- es lo que
// deja animar tanto la entrada como la SALIDA (al cerrar "baja y se
// oculta", pedido explícito); con un montaje condicional no habría
// tiempo de reproducir la transición de cierre antes de que el nodo
// desapareciera. `inert` en el panel cuando está cerrada lo saca del
// foco y de lectores de pantalla sin necesidad de desmontarlo.
export default function CartaSheet({ abierta, onCerrar }) {
  const { t } = useLanguage();
  const sheetRef = useRef(null);
  const cerrarRef = useRef(null);
  const inicioDeslizarRef = useRef(null);

  useFocusTrap(sheetRef, abierta);
  useScrollLock(abierta);

  useEffect(() => {
    if (!abierta) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [abierta, onCerrar]);

  // Autofoco al abrir, igual que ColumnaCristal.jsx: el botón de
  // cerrar, no el título (es el control que se espera recibir el foco
  // al abrir un diálogo).
  useEffect(() => {
    if (abierta) cerrarRef.current?.focus();
  }, [abierta]);

  // Deslizar hacia abajo para cerrar -- solo desde la solapa/encabezado
  // (no desde el contenido, para no competir con su scroll interno).
  // Versión sencilla: un umbral al soltar, sin seguir el dedo en vivo.
  const onTouchStart = (e) => {
    inicioDeslizarRef.current = e.touches[0]?.clientY ?? null;
  };
  const onTouchEnd = (e) => {
    const inicio = inicioDeslizarRef.current;
    inicioDeslizarRef.current = null;
    if (inicio === null) return;
    const fin = e.changedTouches[0]?.clientY ?? inicio;
    if (fin - inicio > UMBRAL_DESLIZAR_PX) onCerrar();
  };

  return (
    <div
      className={`carta-sheet__backdrop${abierta ? " is-abierta" : ""}`}
      aria-hidden="true"
      onClick={onCerrar}
    >
      <div
        ref={sheetRef}
        className={`carta-sheet${abierta ? " is-abierta" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="carta-sheet-titulo"
        id="carta-sheet"
        inert={!abierta}
        // Evita que un toque dentro de la hoja misma burbujee hasta el
        // backdrop (que la cerraría de más).
        onClick={(e) => e.stopPropagation()}
      >
        <div className="carta-sheet__encabezado" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {/* Asa de arrastre: puramente decorativa (el gesto de
              verdad lo maneja el touchstart/touchend de arriba, en
              todo el encabezado) -- la señal visual de "esto se
              desliza" que un bottom sheet trae siempre. */}
          <span className="carta-sheet__asa" aria-hidden="true" />
          <SobreSolapa />
        </div>
        <button
          type="button"
          ref={cerrarRef}
          className="carta-sheet__cerrar"
          onClick={onCerrar}
          aria-label={t("common.cerrar")}
        >
          <X size={20} strokeWidth={2} />
        </button>
        <div className="carta-sheet__scroll">
          <CartaContenido tituloId="carta-sheet-titulo" />
        </div>
      </div>
    </div>
  );
}
