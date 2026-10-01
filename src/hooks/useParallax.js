import { useEffect, useRef } from "react";

// Aplica un desplazamiento vertical suave a un elemento en función de su
// posición en el viewport, para un efecto de parallax ligero al hacer scroll.
export default function useParallax(strength = 18) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return undefined;

    let frame = null;

    const update = () => {
      frame = null;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
      const offset = Math.max(-1, Math.min(1, progress)) * strength;
      el.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
    };

    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return ref;
}
