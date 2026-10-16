import { useEffect, useState } from "react";

// Refleja si un media query coincide, actualizándose en vivo (girar el
// celular, redimensionar la ventana) -- useState perezoso para que el
// primer render ya tenga el valor correcto en vez de arrancar siempre
// en `false` y "saltar" en cuanto monta el efecto.
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
