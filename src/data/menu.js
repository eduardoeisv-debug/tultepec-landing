// Datos del menú "Explora": grupos -> categorías (icono + color) ->
// opciones. Lo usan tres sitios con la MISMA data (src/components/
// Header/ExploraMenu.jsx, la sección "Explora Tultepec" en la página y
// los tres botones de atajo del hero) para que agregar o reordenar una
// opción no implique tocar tres archivos distintos.
//
// Cada opción es { id, label (clave i18n en strings.js), href, soon }.
// `href` es siempre un ancla ("#id-real-en-la-página") o un hash que
// alguna pantalla ya escucha para abrirse (ver Hero.jsx y App.jsx):
// "#galeria/imagenes", "#memorias", "#comparte-memoria" ya existían;
// "#historia" y "#relatos-escritos" se agregaron para este menú. Con
// `soon: true`, `href` se ignora (ExploraMenu.jsx no renderiza un
// enlace, solo el nombre atenuado + "Próximamente").
//
// TODO (dato de ejemplo, no confirmado -- ver Prompt_Menu_Explora_20261016.txt):
// - "Calendario por mes", "Fiestas del año", "Cómo llegar" y "Planea tu
//   visita" apuntan los cuatro a "#visita" porque hoy esa sección no
//   tiene sub-anclas propias para el calendario o el mapa por separado
//   (ver VisitInfo.jsx) -- si se agregan, actualizar sus `href` aquí.
// - Confirmar si "Fiestas del año" debe ser una página/lista distinta
//   del calendario o si de verdad es el mismo destino.
// - Los grupos, categorías y textos de las opciones son el ejemplo del
//   prompt; reemplázalos si el pueblo pide otros rubros u otro orden.

import { Flame, BookOpen, CalendarDays, Utensils, MapPinned, Gamepad2 } from "lucide-react";

const MENU = [
  {
    id: "conoce",
    label: "explora.grupo.conoce",
    categorias: [
      {
        id: "pirotecnia",
        label: "explora.categoria.pirotecnia",
        icon: Flame,
        tono: "terracotta",
        opciones: [
          { id: "historia", label: "explora.opcion.historia", href: "#historia", soon: false },
          { id: "galeria", label: "explora.opcion.galeria", href: "#galeria/imagenes", soon: false },
          { id: "videos-tipo", label: "explora.opcion.videosTipo", href: null, soon: true },
          { id: "memorias-oficio", label: "explora.opcion.memoriasOficio", href: null, soon: true },
        ],
      },
      {
        id: "memorias",
        label: "explora.categoria.memorias",
        icon: BookOpen,
        tono: "gold",
        opciones: [
          { id: "memorias-pueblo", label: "explora.opcion.memoriasPueblo", href: "#memorias", soon: false },
          { id: "relatos", label: "explora.opcion.relatos", href: "#relatos-escritos", soon: false },
          { id: "comparte", label: "explora.opcion.comparte", href: "#comparte-memoria", soon: false },
        ],
      },
    ],
  },
  {
    id: "vive",
    label: "explora.grupo.vive",
    categorias: [
      {
        id: "eventos",
        label: "explora.categoria.eventos",
        icon: CalendarDays,
        tono: "fire",
        opciones: [
          { id: "calendario", label: "explora.opcion.calendario", href: "#visita", soon: false },
          { id: "fiestas-ano", label: "explora.opcion.fiestasAno", href: "#visita", soon: false },
          { id: "ficha-evento", label: "explora.opcion.fichaEvento", href: null, soon: true },
        ],
      },
      {
        id: "gastronomia",
        label: "explora.categoria.gastronomia",
        icon: Utensils,
        tono: "night",
        opciones: [
          { id: "platillos", label: "explora.opcion.platillos", href: null, soon: true },
          { id: "donde-probarlos", label: "explora.opcion.dondeProbarlos", href: null, soon: true },
        ],
      },
    ],
  },
  {
    id: "planea",
    label: "explora.grupo.planea",
    categorias: [
      {
        id: "visitanos",
        label: "explora.categoria.visitanos",
        icon: MapPinned,
        tono: "terracotta",
        opciones: [
          { id: "como-llegar", label: "explora.opcion.comoLlegar", href: "#visita", soon: false },
          { id: "mapa-recorridos", label: "explora.opcion.mapaRecorridos", href: null, soon: true },
          { id: "planea-visita", label: "explora.opcion.planeaVisita", href: "#visita", soon: false },
        ],
      },
      {
        id: "juegos",
        label: "explora.categoria.juegos",
        icon: Gamepad2,
        tono: "gold",
        opciones: [
          { id: "torito", label: "explora.opcion.torito", href: "#juegos", soon: false },
          { id: "memorama", label: "explora.opcion.memorama", href: "#juegos", soon: false },
          { id: "sopa", label: "explora.opcion.sopa", href: "#juegos", soon: false },
        ],
      },
    ],
  },
];

export default MENU;
