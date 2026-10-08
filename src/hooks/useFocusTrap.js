import { useEffect } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "iframe",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

// Atrapa el foco dentro de `containerRef` mientras `active` sea true: Tab
// en el último elemento enfocable vuelve al primero, y Shift+Tab en el
// primero va al último -- para que, con una tarjeta abierta, Tab nunca
// se escape hacia el contenido de la página de atrás (que además ya
// queda con el scroll bloqueado por useScrollLock). No mueve el foco al
// activarse -- cada modal ya hace su propio autofocus al abrir.
export default function useFocusTrap(containerRef, active) {
  useEffect(() => {
    if (!active) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const onKeyDown = (e) => {
      if (e.key !== "Tab") return;

      const focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", onKeyDown);
    return () => container.removeEventListener("keydown", onKeyDown);
  }, [active, containerRef]);
}
