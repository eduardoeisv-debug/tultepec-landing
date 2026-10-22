// Comunica, entre partes del árbol que no son ancestro/descendiente
// directo, lo necesario para que el enlace/botón "Volver" de
// Seccion.jsx sepa a dónde ir y qué dejar pedido para cuando llegue:
//
// 1. Vuelta a la cuadrícula de Inicio (origen "icons"):
//    pedirVolverASecciones/hayVueltaPendiente/consumirVueltaPendiente
//    -- consumido por InicioCristal.jsx al montar (scroll + resaltado
//    de un ícono puntual). Sin cambios respecto a como ya funcionaba.
//
// 2. Vuelta al panel del menú (origen "menu"):
//    marcarVueltaAlMenu/hayVueltaAlMenuPendiente/consumirVueltaAlMenu
//    -- consumido por ColumnaCristal.jsx al montar (scroll + resaltado
//    de una fila puntual, en vez de la cuadrícula).
//
// 3. Aviso "la próxima sección que se monte viene del menú":
//    marcarProximaDesdeMenu/consumirProximaDesdeMenu -- lo deja
//    ColumnaCristal.jsx justo antes de navegar (con la ruta de la que
//    se sale y el scroll del panel en ese momento) y lo consume
//    CristalShell.jsx en su efecto de cambio de ruta, para fijar su
//    propio estado `origen` ("menu" | "icons" | null).
//
// El ORIGEN en sí NO vive aquí como variable de módulo -- CristalShell.jsx
// lo guarda como estado de React porque Seccion.jsx necesita que
// CAMBIE visualmente (el texto del botón) cada vez que cambia, y una
// variable de módulo leída durante el render no puede disparar un
// re-render por sí sola. Todo lo de aquí sí puede seguir siendo
// variables de módulo: se consume siempre dentro de un efecto, nunca
// durante un render.

// ---- Vuelta a la cuadrícula de Inicio ----
let pendienteSecciones = null;

export function pedirVolverASecciones(seccionId) {
  pendienteSecciones = { seccionId: seccionId ?? null };
}

export function hayVueltaPendiente() {
  return pendienteSecciones !== null;
}

export function consumirVueltaPendiente() {
  const valor = pendienteSecciones;
  pendienteSecciones = null;
  return valor;
}

// ---- Aviso "la próxima sección viene del menú" ----
let pendienteOrigenMenu = null;

export function marcarProximaDesdeMenu({ ruta, scrollMenu }) {
  pendienteOrigenMenu = { ruta, scrollMenu };
}

export function consumirProximaDesdeMenu() {
  const valor = pendienteOrigenMenu;
  pendienteOrigenMenu = null;
  return valor;
}

// ---- Vuelta al panel del menú ----
let pendienteMenu = null;

export function marcarVueltaAlMenu({ scrollMenu, seccionId }) {
  pendienteMenu = { scrollMenu, seccionId: seccionId ?? null };
}

export function hayVueltaAlMenuPendiente() {
  return pendienteMenu !== null;
}

export function consumirVueltaAlMenu() {
  const valor = pendienteMenu;
  pendienteMenu = null;
  return valor;
}

// ---- Última subopción visitada, por grupo ----
// Para que el menú pueda resaltar "lo último que elegiste dentro de
// este grupo" (ColumnaCristal.jsx) aunque la página visible en ese
// momento sea el resumen del grupo (sin hijo en la ruta) -- un solo
// par {itemId, hijoId} basta: lo único que importa es si coincide con
// el grupo que el menú tiene desplegado en ese momento, nunca hace
// falta comparar contra ningún otro. CristalShell.jsx lo actualiza en
// su efecto de cambio de ruta (el único punto que ve TODAS las
// navegaciones, vengan del menú o no) cada vez que la ruta cae sobre
// una subopción real -- entrar al resumen del grupo (sin hijo) no lo
// toca, para no perder el recuerdo de cuál fue la última elegida.
let ultimaSubopcion = null;

export function recordarUltimaSubopcion(itemId, hijoId) {
  ultimaSubopcion = { itemId, hijoId };
}

export function obtenerUltimaSubopcion() {
  return ultimaSubopcion;
}
