import { useEffect } from "react";

// Bloquea el scroll del body mientras `active` sea true. Lleva un contador
// compartido entre todas las instancias: si dos modales están abiertos a
// la vez (p.ej. un álbum de fotos sobre la cuadrícula de categorías), el
// scroll solo se libera cuando el último de ellos se cierra -- evita que
// cerrar el modal de arriba reactive el scroll mientras el de abajo sigue
// visible.
let lockCount = 0;

export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;

    lockCount += 1;
    document.body.style.overflow = "hidden";

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) document.body.style.overflow = "";
    };
  }, [active]);
}
