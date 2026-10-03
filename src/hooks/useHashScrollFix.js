import { useEffect } from "react";

// Los enlaces de ancla (#tradiciones, #voces...) saltan a su destino usando
// el layout que exista en ese momento. Si se hace clic justo después de
// cargar la página, las fuentes autohospedadas (Fraunces/Work Sans) pueden
// no haber terminado de aplicarse: el salto ocurre con el layout "de
// reserva" (más compacto), y al llegar la fuente real el contenido crece y
// empuja todo hacia abajo, dejando al usuario a mitad de otra sección. Este
// hook vuelve a corregir el scroll en cuanto las fuentes terminan de cargar.
export default function useHashScrollFix() {
  useEffect(() => {
    const scrollToHash = () => {
      if (!window.location.hash) return;
      const el = document.querySelector(window.location.hash);
      el?.scrollIntoView();
    };

    document.fonts?.ready?.then(scrollToHash).catch(() => {});
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);
}
