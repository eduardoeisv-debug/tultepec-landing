// Fuente única de las secciones del sitio -- antes el menú lateral
// (menu.js) y las tarjetas de Inicio (ACCESOS, dentro de
// InicioCristal.jsx) eran dos listas separadas y podían desincronizarse
// (p.ej. agregar algo al menú sin acordarse de sumarlo en Inicio, o al
// revés). Ahora todo sale de aquí: useHashRoute.js, ColumnaCristal.jsx
// y CristalShell.jsx leen esta misma lista para el menú/las rutas, e
// InicioCristal.jsx filtra por showInHome para sus tarjetas, y
// Footer.jsx por showInFooter para sus enlaces.
//
// Cada sección:
//   id          -- también la ruta por hash: "#/<id>" o "#/<id>/<hijo.id>"
//   label       -- clave i18n del título (src/i18n/strings.js)
//   estado      -- "activa" | "proximamente"
//   showInMenu/showInHome/showInFooter -- en qué lugares aparece
//   menuIcon    -- ícono de lucide-react para la fila del menú lateral
//   homeIcon    -- ícono de lucide-react para la tarjeta de Inicio (el
//                  mismo componente en casi todas, pero es un campo
//                  aparte porque menú y Inicio son círculos/estilos
//                  distintos y podrían diverger el día de mañana)
//   homeColor/homeInk -- --icon-color/--icon-ink de la tarjeta de
//                  Inicio (el círculo pseudo-3D, ver .icono-3d en
//                  global.css) -- el menú no usa color por ítem, así
//                  que no hace falta un "menuColor" aparte
//   homeSub     -- clave i18n de la bajada opcional de la tarjeta de
//                  Inicio (solo "juegos" la tiene hoy); si no existe,
//                  la tarjeta se queda solo con el título
//   hijos       -- subopciones (mismo shape que antes: id, label,
//                  soon), o null si la sección no tiene
//
// "inicio" está documentada aquí (para que la lista refleje las 11
// secciones completas, en el mismo orden) pero NO se recorre con
// .map() en ningún lado: su fila en el menú es estructuralmente
// distinta a las demás (siempre primera, nunca "próximamente", sin
// hijos, sin color propio) y ya vivía como un caso aparte en
// ColumnaCristal.jsx desde antes -- forzarla por el mismo .map() que
// el resto no simplificaba nada, solo metía un if/else disfrazado.
import {
  Home,
  Flame,
  BookOpen,
  Landmark,
  Amphora,
  Ticket,
  CalendarDays,
  Utensils,
  Music,
  Gamepad2,
  MapPinned,
  HeartHandshake,
  Info,
} from "lucide-react";

const SECTIONS = [
  {
    id: "inicio",
    label: "menu.inicio",
    estado: "activa",
    showInMenu: true,
    showInHome: false,
    showInFooter: false,
    menuIcon: Home,
    homeIcon: null,
    hijos: null,
  },
  {
    id: "pirotecnia",
    label: "menu.item.pirotecnia",
    estado: "activa",
    showInMenu: true,
    showInHome: true,
    showInFooter: false,
    menuIcon: Flame,
    homeIcon: Flame,
    homeColor: "var(--color-terracotta)",
    homeInk: "#fff",
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
    estado: "activa",
    showInMenu: true,
    showInHome: true,
    showInFooter: false,
    menuIcon: BookOpen,
    homeIcon: BookOpen,
    homeColor: "var(--color-gold)",
    homeInk: "#14163a",
    hijos: [
      { id: "pueblo", label: "menu.opcion.memoriasPueblo", soon: false },
      { id: "relatos", label: "menu.opcion.relatos", soon: false },
      { id: "comparte", label: "menu.opcion.comparte", soon: false },
    ],
  },
  {
    id: "museos",
    label: "menu.item.museos",
    estado: "proximamente",
    showInMenu: true,
    showInHome: true,
    showInFooter: false,
    menuIcon: Landmark,
    homeIcon: Landmark,
    homeColor: "var(--color-gold)",
    homeInk: "#14163a",
    hijos: null,
  },
  {
    id: "artesanias",
    label: "menu.item.artesanias",
    estado: "proximamente",
    showInMenu: true,
    showInHome: true,
    showInFooter: false,
    menuIcon: Amphora,
    homeIcon: Amphora,
    // --color-turquoise-papel (variables.css), no --color-turquoise
    // (ya la usa Visítanos, ver más abajo) -- mismo turquesa de las
    // banderitas de papel picado (ver COLORS en HeroPapelPicado.jsx),
    // así combina con ellas sin repetir el color de otra tarjeta.
    homeColor: "var(--color-turquoise-papel)",
    homeInk: "#14163a",
    hijos: null,
  },
  {
    id: "eventos",
    label: "menu.item.eventos",
    estado: "activa",
    showInMenu: true,
    showInHome: true,
    showInFooter: false,
    menuIcon: CalendarDays,
    // Ticket, no CalendarDays, en Inicio: antes compartía el mismo
    // ícono que "Calendario por mes" (subopción de esta sección) en la
    // misma rejilla -- ver el historial en InicioCristal.jsx.
    homeIcon: Ticket,
    homeColor: "var(--color-fire-red)",
    homeInk: "#fff",
    hijos: [
      { id: "calendario", label: "menu.opcion.calendario", soon: false },
      { id: "fiestas-ano", label: "menu.opcion.fiestasAno", soon: true },
      { id: "ficha-evento", label: "menu.opcion.fichaEvento", soon: true },
    ],
  },
  {
    id: "gastronomia",
    label: "menu.item.gastronomia",
    estado: "proximamente",
    showInMenu: true,
    showInHome: true,
    showInFooter: false,
    menuIcon: Utensils,
    homeIcon: Utensils,
    homeColor: "var(--color-gold)",
    homeInk: "#14163a",
    hijos: null,
  },
  {
    id: "musica",
    label: "menu.item.musica",
    estado: "proximamente",
    showInMenu: true,
    showInHome: true,
    showInFooter: false,
    menuIcon: Music,
    homeIcon: Music,
    homeColor: "var(--color-gold)",
    homeInk: "#14163a",
    hijos: null,
  },
  {
    // Sin hijos a propósito en Menú Cristal: el selector entre los 3
    // juegos vive DENTRO de la vista (JuegosSeccion.jsx), no como
    // flyout del menú.
    id: "juegos",
    label: "menu.item.juegos",
    estado: "activa",
    showInMenu: true,
    showInHome: true,
    showInFooter: false,
    menuIcon: Gamepad2,
    homeIcon: Gamepad2,
    homeColor: "var(--color-pink)",
    homeInk: "#fff",
    // Único acceso de Inicio con bajada propia (las demás tarjetas no
    // la tienen) -- se conserva tal cual estaba antes de esta lista
    // unificada.
    homeSub: "cristal.novedades.juegosSub",
    hijos: null,
  },
  {
    id: "visitanos",
    label: "menu.item.visitanos",
    estado: "activa",
    showInMenu: true,
    showInHome: true,
    showInFooter: false,
    menuIcon: MapPinned,
    homeIcon: MapPinned,
    homeColor: "var(--color-turquoise)",
    homeInk: "#14163a",
    hijos: [
      { id: "como-llegar", label: "menu.opcion.comoLlegar", soon: false },
      { id: "planea-visita", label: "menu.opcion.planeaVisita", soon: false },
      { id: "mapa-recorridos", label: "menu.opcion.mapaRecorridos", soon: true },
    ],
  },
  {
    id: "agradecimientos",
    label: "menu.item.agradecimientos",
    estado: "activa",
    showInMenu: true,
    showInHome: false,
    showInFooter: true,
    menuIcon: HeartHandshake,
    homeIcon: null,
    hijos: null,
  },
  {
    id: "acerca-de",
    label: "menu.item.acercaDe",
    estado: "activa",
    showInMenu: true,
    showInHome: false,
    showInFooter: true,
    menuIcon: Info,
    homeIcon: null,
    hijos: null,
  },
];

export default SECTIONS;
