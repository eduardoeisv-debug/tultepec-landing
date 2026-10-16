import { useEffect, useState } from "react";
import MENU from "../data/menu.js";

// Lee "#/pirotecnia/historia" -> { itemId: "pirotecnia", hijoId: "historia" }
// o "#/museos" -> { itemId: "museos", hijoId: null". Sin hash, o un hash
// que no coincide con nada de MENU, cae en Inicio ({ itemId: null,
// hijoId: null }) -- nunca un enlace roto, nunca una pantalla en blanco.
function leerRuta() {
  const hash = window.location.hash;
  if (!hash || hash === "#" || hash === "#/") return { itemId: null, hijoId: null };

  const partes = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [itemId, hijoId] = partes;
  const item = MENU.find((i) => i.id === itemId);
  if (!item) return { itemId: null, hijoId: null };

  if (item.hijos) {
    const hijo = item.hijos.find((h) => h.id === hijoId);
    if (!hijo) return { itemId: null, hijoId: null };
    return { itemId, hijoId };
  }
  // Item directo (sin hijos): un hijoId en la URL no debería existir,
  // pero si alguien lo escribe a mano no es razón para mandarlo a
  // Inicio -- se ignora y se queda en el item.
  return { itemId, hijoId: null };
}

// Construye el hash de una ruta, para los <a href> del menú y para
// navegar por código (al elegir una opción "Próximamente" no se usa,
// ver SoonView.jsx).
export function rutaHash(itemId, hijoId) {
  if (!itemId) return "#/";
  return hijoId ? `#/${itemId}/${hijoId}` : `#/${itemId}`;
}

// Sincronizado con window.location.hash: hashchange cubre tanto los
// <a href="#/..."> normales como el botón atrás/adelante del navegador
// (que también dispara hashchange cuando el cambio es solo de hash).
export default function useHashRoute() {
  const [ruta, setRuta] = useState(() => leerRuta());

  useEffect(() => {
    const onHashChange = () => setRuta(leerRuta());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return ruta;
}
