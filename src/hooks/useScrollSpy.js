import { useEffect, useRef, useState } from "react";

// A diferencia de useReveal (que dispara una sola vez y deja de observar),
// este hook vigila varios bloques todo el tiempo y reporta cuál está más
// visible ahora mismo -- para iluminar el piso del castillo que
// corresponde al bloque que se está leyendo. Usa IntersectionObserver,
// nunca el evento scroll.
export default function useScrollSpy(count) {
  const refs = useRef([]);
  const ratios = useRef(new Array(count).fill(0));
  const [activeIndex, setActiveIndex] = useState(0);

  refs.current = refs.current.slice(0, count);

  useEffect(() => {
    const elements = refs.current.filter(Boolean);
    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const idx = refs.current.indexOf(entry.target);
          if (idx !== -1) ratios.current[idx] = entry.intersectionRatio;
        }
        let bestIdx = 0;
        let bestRatio = -1;
        ratios.current.forEach((ratio, idx) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIdx = idx;
          }
        });
        if (bestRatio > 0) setActiveIndex(bestIdx);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [count]);

  const setRef = (index) => (el) => {
    refs.current[index] = el;
  };

  const scrollToIndex = (index) => {
    const el = refs.current[index];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return { activeIndex, setRef, scrollToIndex };
}
