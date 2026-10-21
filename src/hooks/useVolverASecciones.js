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
