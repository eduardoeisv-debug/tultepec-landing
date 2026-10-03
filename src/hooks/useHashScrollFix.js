import { useEffect } from "react";

// Los enlaces de ancla (#tradiciones, #voces...) saltan a su destino usando
// el layout que exista en ese momento. Si se hace clic justo después de
// cargar la página, las fuentes autohospedadas (Fraunces/Work Sans) pueden
// no haber terminado de aplicarse: el salto ocurre con el layout "de
// reserva" (más compacto), y al llegar la fuente real el contenido crece y
// empuja todo hacia abajo, dejando al usuario a mitad de otra sección. Este
// hook vuelve a corregir el scroll en cuanto las fuentes terminan de cargar.
//
// También limpia el hash de la URL después de hacer el scroll: si no, el
// navegador recuerda ese "#tradiciones" y cualquier recarga posterior
// (incluso minutos después, en otra visita) vuelve a saltar ahí en vez de
// ir al inicio de la página.
export default function useHashScrollFix() {
  useEffect(() => {
    const scrollToHashAndClean = () => {
      if (!window.location.hash) return;
      const el = document.querySelector(window.location.hash);
      if (!el) return;
      el.scrollIntoView();
      history.replaceState(null, "", window.location.pathname + window.location.search);
    };

    document.fonts?.ready?.then(scrollToHashAndClean).catch(() => {});
    window.addEventListener("hashchange", scrollToHashAndClean);
    return () => window.removeEventListener("hashchange", scrollToHashAndClean);
  }, []);
}
