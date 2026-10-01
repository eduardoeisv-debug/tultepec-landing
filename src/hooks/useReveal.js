import { useEffect, useRef } from "react";

// Añade la clase `is-visible` a los elementos `.reveal` dentro del nodo
// referenciado cuando entran en el viewport, usando IntersectionObserver.
// También vigila el DOM con un MutationObserver: secciones como
// CommunityMemories renderizan sus tarjetas `.reveal` después de que
// responde una petición async, mucho después del montaje inicial, y sin
// esto esos elementos quedarían observados nunca y nunca serían visibles.
export default function useReveal() {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;

    const collectTargets = () =>
      root.matches(".reveal") ? [root] : Array.from(root.querySelectorAll(".reveal"));

    if (typeof IntersectionObserver === "undefined") {
      const markAll = () => collectTargets().forEach((el) => el.classList.add("is-visible"));
      markAll();
      const mutationObserver = new MutationObserver(markAll);
      mutationObserver.observe(root, { childList: true, subtree: true });
      return () => mutationObserver.disconnect();
    }

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    // Set en memoria (no un atributo en el DOM): en StrictMode, React monta
    // el efecto, lo limpia y lo vuelve a montar. Un atributo en el DOM
    // sobreviviría a esa limpieza y el segundo montaje (el que de verdad
    // queda activo) pensaría que los elementos ya estaban observados por
    // el IntersectionObserver ya desconectado del primer montaje.
    const observed = new WeakSet();

    const observeNewTargets = () => {
      collectTargets().forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          intersectionObserver.observe(el);
        }
      });
    };

    observeNewTargets();

    const mutationObserver = new MutationObserver(observeNewTargets);
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return containerRef;
}
