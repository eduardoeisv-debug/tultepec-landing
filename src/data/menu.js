// Datos del menú lateral: 9 opciones de nivel superior, algunas con
// submenú (`hijos`) y otras directas (sin `hijos`, van solo a su propia
// vista). Agregar una opción nueva es solo agregar un objeto aquí --
// src/components/Layout/SidebarMenu.jsx y el router de hash
// (useHashRoute.js) leen esta misma lista.
//
// Cada item: { id, label (clave i18n), icon (lucide-react), degradado
// [colorDesde, colorHasta], hijos: [{ id, label, soon }] | null, soon }.
// `soon` en un item sin hijos significa que la opción completa todavía
// no existe (ver src/components/Panel/views/SoonView.jsx). Los colores
// del degradado reutilizan los tokens de variables.css -- ninguno es un
// hex nuevo salvo --color-turquoise, que no existía antes de este menú.
//
// Ruta por hash: "#/<item.id>/<hijo.id>" si tiene hijos, "#/<item.id>"
// si es directo. Sin hash (o uno que no coincide con nada de aquí) cae
// en Inicio -- ver useHashRoute.js.

import { Flame, BookOpen, Landmark, CalendarDays, Utensils, Music, MapPinned, Gamepad2, HeartHandshake, Info } from "lucide-react";

const MENU = [
  {
    id: "pirotecnia",
    label: "menu.item.pirotecnia",
    icon: Flame,
    degradado: ["var(--color-gold-light)", "var(--color-terracotta)"],
    hijos: [
      { id: "historia", label: "menu.opcion.historia", soon: false },
      { id: "galeria", label: "menu.opcion.galeria", soon: false },
      { id: "videos-tipo", label: "menu.opcion.videosTipo", soon: true },
      { id: "memorias-oficio", label: "menu.opcion.memoriasOficio", soon: true },
    ],
  },
  {
    id: "memorias",
    label: "menu.item.memorias",
    icon: BookOpen,
    degradado: ["var(--color-gold)", "var(--color-gold-light)"],
    hijos: [
      { id: "pueblo", label: "menu.opcion.memoriasPueblo", soon: false },
      { id: "relatos", label: "menu.opcion.relatos", soon: false },
      { id: "comparte", label: "menu.opcion.comparte", soon: false },
    ],
  },
  {
    id: "museos",
    label: "menu.item.museos",
    icon: Landmark,
    degradado: ["var(--color-terracotta)", "var(--color-terracotta-dark)"],
    hijos: null,
    soon: true,
  },
  {
    id: "eventos",
    label: "menu.item.eventos",
    icon: CalendarDays,
    degradado: ["var(--color-fire-red)", "var(--color-terracotta)"],
    hijos: [
      { id: "calendario", label: "menu.opcion.calendario", soon: false },
      { id: "fiestas-ano", label: "menu.opcion.fiestasAno", soon: true },
      { id: "ficha-evento", label: "menu.opcion.fichaEvento", soon: true },
    ],
  },
  {
    id: "gastronomia",
    label: "menu.item.gastronomia",
    icon: Utensils,
    degradado: ["var(--color-terracotta)", "var(--color-gold)"],
    hijos: null,
    soon: true,
  },
  {
    id: "musica",
    label: "menu.item.musica",
    icon: Music,
    degradado: ["var(--color-pink)", "var(--color-terracotta-dark)"],
    hijos: null,
    soon: true,
  },
  {
    id: "visitanos",
    label: "menu.item.visitanos",
    icon: MapPinned,
    degradado: ["var(--color-turquoise)", "var(--color-night-700)"],
    hijos: [
      { id: "como-llegar", label: "menu.opcion.comoLlegar", soon: false },
      { id: "planea-visita", label: "menu.opcion.planeaVisita", soon: false },
      { id: "mapa-recorridos", label: "menu.opcion.mapaRecorridos", soon: true },
    ],
  },
  {
    // Sin hijos a propósito en Menú Cristal: el prompt pide "Juegos...
    // sin subopciones" en la columna -- el selector entre los 3 juegos
    // vive DENTRO de la vista (JuegosSeccion.jsx), no como flyout.
    id: "juegos",
    label: "menu.item.juegos",
    icon: Gamepad2,
    degradado: ["var(--color-gold-light)", "var(--color-pink)"],
    hijos: null,
    soon: false,
  },
  {
    id: "agradecimientos",
    label: "menu.item.agradecimientos",
    icon: HeartHandshake,
    degradado: ["var(--color-pink)", "var(--color-gold)"],
    hijos: null,
    soon: false,
  },
  {
    id: "acerca-de",
    label: "menu.item.acercaDe",
    icon: Info,
    degradado: ["var(--color-gold)", "var(--color-night-700)"],
    hijos: null,
    soon: false,
  },
];

export default MENU;
