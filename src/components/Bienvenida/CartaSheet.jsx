import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import useScrollLock from "../../hooks/useScrollLock.js";
import { SobreSolapa } from "./Bienvenida.jsx";
import CartaContenido from "./CartaContenido.jsx";
import "./CartaSheet.css";

const UMBRAL_DESLIZAR_PX = 70;
// Tolerancia de redondeo (subpíxeles de scrollHeight/clientHeight en
// algunos navegadores) para decidir "ya se ve el final" -- sin esto el
// degradado de abajo podía quedar visible un pelo después de llegar
// al fondo de verdad.
const TOLERANCIA_FINAL_PX = 2;

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
  const scrollRef = useRef(null);
  const inicioDeslizarRef = useRef(null);
  // Degradado inferior del área de lectura: visible solo mientras
  // queda contenido por ver debajo, se oculta al llegar al final.
  const [quedaContenidoPorVer, setQuedaContenidoPorVer] = useState(false);

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

  const actualizarDesvanecido = () => {
    const el = scrollRef.current;
    if (!el) return;
    const restante = el.scrollHeight - el.scrollTop - el.clientHeight;
    setQuedaContenidoPorVer(restante > TOLERANCIA_FINAL_PX);
  };

  // Revisa también al abrir (no solo al hacer scroll) -- el contenido
  // puede ya caber sin necesitar scroll, o puede necesitarlo desde el
  // primer momento; el panel sigue montado (ver el comentario grande
  // de arriba), así que sus medidas ya existen aunque esté oculto.
  useEffect(() => {
    if (abierta) actualizarDesvanecido();
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
          {/* Borde a borde, sin recorte propio -- el botón de cerrar
              ya NO vive encima/dentro de esta franja (ver la fila de
              abajo), así que la solapa no necesita ceder ancho. */}
          <SobreSolapa />
          <div className="carta-sheet__fila-cerrar">
            <button
              type="button"
              ref={cerrarRef}
              className="carta-sheet__cerrar"
              onClick={onCerrar}
              aria-label={t("common.cerrar")}
            >
              <X size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
        <div className="carta-sheet__scroll" ref={scrollRef} onScroll={actualizarDesvanecido}>
          <CartaContenido tituloId="carta-sheet-titulo" />
        </div>
        {/* Decorativo nada más: pointer-events:none + aria-hidden (ver
            CSS) -- solo indica que hay más texto debajo, no es un
            control. */}
        <div className={`carta-sheet__desvanecido${quedaContenidoPorVer ? " is-visible" : ""}`} aria-hidden="true" />
      </div>
    </div>
  );
}
