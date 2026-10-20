import { useEffect, useState } from "react";
import SECTIONS from "../data/sections.js";

// Lee "#/pirotecnia/historia" -> { itemId: "pirotecnia", hijoId: "historia" }
// o "#/museos" -> { itemId: "museos", hijoId: null". Sin hash, o un hash
// que no coincide con nada de SECTIONS, cae en Inicio ({ itemId: null,
// hijoId: null }) -- nunca un enlace roto, nunca una pantalla en blanco.
function leerRuta() {
  const hash = window.location.hash;
  if (!hash || hash === "#" || hash === "#/") return { itemId: null, hijoId: null };

  const partes = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [itemId, hijoId] = partes;

  // "#/inicio" es un alias explícito del hash vacío (el prompt de
  // Menú Cristal lo pide en su lista de rutas) -- misma vista, mismo
  // itemId null.
  if (itemId === "inicio") return { itemId: null, hijoId: null };
  // El aviso de privacidad no vive en SECTIONS (no es una fila del
  // menú, es el botón de escudo de la columna) pero sí es una ruta real.
  if (itemId === "privacidad") return { itemId: "privacidad", hijoId: null };

  const item = SECTIONS.find((i) => i.id === itemId);
  if (!item) return { itemId: null, hijoId: null };

  if (item.hijos) {
    const hijo = item.hijos.find((h) => h.id === hijoId);
    // "#/pirotecnia" a secas (o un hijo que ya no existe) no es un
    // enlace roto -- se queda en el grupo con hijoId null, y
    // CristalShell.jsx muestra ahí el resumen del grupo
    // (GrupoResumen.jsx) con el abanico completo de subopciones, en
    // vez de adivinar la primera y esconder las demás.
    return { itemId, hijoId: hijo ? hijoId : null };
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
