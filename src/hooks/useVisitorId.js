import { useState } from "react";

const STORAGE_KEY = "tultepec_visitor_id";

function getOrCreateVisitorId() {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // Sin acceso a localStorage (modo privado, etc.): id de solo esta
    // sesión, el like simplemente no persistirá entre visitas.
    return crypto.randomUUID();
  }
}

// Id anónimo y estable por navegador (no es personal, solo evita que el
// mismo visitante le dé like varias veces).
export default function useVisitorId() {
  const [id] = useState(getOrCreateVisitorId);
  return id;
}
