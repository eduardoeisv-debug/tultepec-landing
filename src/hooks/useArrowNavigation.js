import { useRef } from "react";

// Navegación con flechas + roving tabindex, reutilizada por todas las
// pestañas, cuadrículas, carruseles y listas de las tarjetas del sitio
// (SegmentedTabs, la galería, el carrusel de libros, la línea de tiempo,
// las memorias, el calendario de meses...). No decide qué está "activo":
// cada componente sigue dueño de su propio estado (activeIndex), este
// hook solo calcula el siguiente índice según la tecla y mueve el foco
// de verdad al elemento correspondiente.
//
// orientation: "horizontal" (←/→), "vertical" (↑/↓) o "both" (las 4).
// loop: si el siguiente/anterior del último/primero da la vuelta (true,
// por defecto, como ya hacía SegmentedTabs) o se queda en el borde.
export default function useArrowNavigation({ count, orientation = "horizontal", loop = true }) {
  const itemRefs = useRef([]);

  // Guarda la referencia del elemento en `index` -- se usa como
  // `ref={register(i)}` en cada botón/ítem navegable.
  const register = (index) => (el) => {
    itemRefs.current[index] = el;
  };

  const focusAt = (index) => {
    itemRefs.current[index]?.focus();
  };

  // Se adjunta al onKeyDown del contenedor (el evento burbujea desde el
  // elemento con foco, igual que ya hacía SegmentedTabs) -- así el
  // preventDefault de las flechas solo aplica cuando el foco está
  // realmente dentro de este widget, sin bloquear el scroll de la
  // página en ningún otro caso.
  const onKeyDown = (currentIndex, onNavigate) => (e) => {
    if (count === 0) return;

    const isHorizontal = orientation !== "vertical";
    const isVertical = orientation !== "horizontal";
    const nextKeys = [isHorizontal && "ArrowRight", isVertical && "ArrowDown"].filter(Boolean);
    const prevKeys = [isHorizontal && "ArrowLeft", isVertical && "ArrowUp"].filter(Boolean);

    let targetIndex = null;
    if (nextKeys.includes(e.key)) {
      targetIndex = loop ? (currentIndex + 1) % count : Math.min(count - 1, currentIndex + 1);
    } else if (prevKeys.includes(e.key)) {
      targetIndex = loop ? (currentIndex - 1 + count) % count : Math.max(0, currentIndex - 1);
    } else if (e.key === "Home") {
      targetIndex = 0;
    } else if (e.key === "End") {
      targetIndex = count - 1;
    }

    if (targetIndex === null || targetIndex === currentIndex) return;
    e.preventDefault();
    onNavigate(targetIndex);
    focusAt(targetIndex);
  };

  return { itemRefs, register, focusAt, onKeyDown };
}
