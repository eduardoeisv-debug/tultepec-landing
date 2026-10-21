// Comunica "quiero volver a la cuadrícula de accesos de Inicio, y de
// paso resaltar tal ícono" entre quien pide la vuelta (el enlace/botón
// "Secciones" de Seccion.jsx, en una vista completamente distinta del
// árbol) y quien la resuelve (InicioCristal.jsx, al montar). Un módulo
// con una sola variable -- no Context/estado de React -- porque vive
// un instante (se pide justo antes de cambiar el hash a "#/" y se
// consume en el próximo montaje de InicioCristal, nunca hay más de un
// lector) y porque CristalShell.jsx también necesita verla de forma
// SÍNCRONA, antes del primer render del nuevo árbol, para decidir si
// se salta su propio scroll-to-top (ver el useLayoutEffect ahí) --
// algo que un useState/Context no puede garantizar sin una carrera.
let pendiente = null;

export function pedirVolverASecciones(seccionId) {
  pendiente = { seccionId: seccionId ?? null };
}

// Para CristalShell.jsx: solo necesita saber si hay algo pendiente
// (para no pisarlo con su propio scroll-to-top), no consumirlo -- eso
// le toca a InicioCristal.jsx, el único que de verdad actúa sobre el
// valor.
export function hayVueltaPendiente() {
  return pendiente !== null;
}

export function consumirVueltaPendiente() {
  const valor = pendiente;
  pendiente = null;
  return valor;
}
