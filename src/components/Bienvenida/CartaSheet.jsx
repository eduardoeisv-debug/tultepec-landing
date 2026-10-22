import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import useFocusTrap from "../../hooks/useFocusTrap.js";
import useScrollLock from "../../hooks/useScrollLock.js";
import CartaInfografia from "./CartaInfografia.jsx";
import "./CartaSheet.css";

const UMBRAL_DESLIZAR_PX = 70;
// Tolerancia de redondeo (subpíxeles de scrollHeight/clientHeight en
// algunos navegadores) para decidir "ya se ve el final" -- sin esto el
// degradado de abajo podía quedar visible un pelo después de llegar
// al fondo de verdad.
const TOLERANCIA_FINAL_PX = 2;

// "Una carta para ti" en celular: ya no vive como tarjeta en Inicio
// (ver Bienvenida.css/InicioCristal.css) -- se abre desde el botón
// "Carta" de la barra inferior (BottomNav.jsx) como esta hoja. Su
// contenido (CartaInfografia.jsx) es el MISMO componente que usa el
// acordeón de escritorio (Bienvenida.jsx) -- ver el comentario grande
// al inicio de ese archivo. Ya no trae la solapa en V ni la asa de
// arrastre visibles (rediseño al estilo de las secciones del sitio,
// ver el historial) -- el sello circular de la llama (dentro de
// CartaInfografia.jsx, montado sobre el borde superior) es ahora la
// única pieza que corona la hoja.
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
  const tituloRef = useRef(null);
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

  // Al abrir: scroll del cuerpo a 0 y foco al encabezado (el título,
  // tituloRef -- ver CartaInfografia.jsx) -- las dos cosas juntas, SOLO
  // al abrir, nunca al cerrar (si corrieran también al cerrar se
  // vería un salto del contenido durante la animación de salida, que
  // sigue viéndose un rato con la hoja ya "cerrada" en React).
  // useLayoutEffect (no useEffect) para el scroll: corre antes de que
  // el navegador pinte el siguiente frame, así el reinicio ya pasó
  // cuando la hoja se hace visible -- con useEffect alcanzaba a verse
  // un instante en la posición vieja (p.ej. a mitad de la carta, si
  // así se había quedado la vez anterior) antes de saltar a 0.
  useLayoutEffect(() => {
    if (abierta && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [abierta]);

  useEffect(() => {
    if (abierta) tituloRef.current?.focus();
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

  // Deslizar hacia abajo para cerrar -- solo desde la franja superior
  // (.carta-sheet__gesto, invisible, ver más abajo -- ya no hay
  // solapa/asa visibles que sirvan de zona de arrastre), nunca desde
  // el contenido, para no competir con su scroll interno. Versión
  // sencilla: un umbral al soltar, sin seguir el dedo en vivo.
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
        {/* Franja invisible solo para el gesto de deslizar -- angosta y
            centrada (no llega hasta la esquina del botón de cerrar, ver
            CartaSheet.css) para no competir por los toques con él. */}
        <div className="carta-sheet__gesto" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} aria-hidden="true" />
        <button type="button" className="carta-sheet__cerrar" onClick={onCerrar} aria-label={t("common.cerrar")}>
          <X size={18} strokeWidth={2} />
        </button>
        <div className="carta-sheet__scroll" ref={scrollRef} onScroll={actualizarDesvanecido}>
          <CartaInfografia tituloId="carta-sheet-titulo" tituloRef={tituloRef} />
        </div>
        {/* Decorativo nada más: pointer-events:none + aria-hidden (ver
            CSS) -- solo indica que hay más texto debajo, no es un
            control. */}
        <div className={`carta-sheet__desvanecido${quedaContenidoPorVer ? " is-visible" : ""}`} aria-hidden="true" />
      </div>
    </div>
  );
}
