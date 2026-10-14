// Lógica del memorama sin dependencias ni DOM. Cada función devuelve un estado nuevo.
//
// estado = { cartas: [{ uid, id, abierta, par }], abiertas: [índices], intentos, pares,
//            total, bloqueado, terminado }

export function barajar(lista, azar = Math.random) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export function nuevoJuego(ids, azar = Math.random) {
  const cartas = barajar([...ids, ...ids], azar).map((id, uid) => ({ uid, id, abierta: false, par: false }));
  return { cartas, abiertas: [], intentos: 0, pares: 0, total: ids.length, bloqueado: false, terminado: false };
}

// Voltea la carta i. Si no se puede voltear, devuelve el mismo estado.
export function voltear(e, i) {
  const carta = e.cartas[i];
  if (!carta || e.bloqueado || e.terminado || carta.abierta || carta.par) return e;

  const cartas = e.cartas.map((c, k) => (k === i ? { ...c, abierta: true } : c));
  const abiertas = [...e.abiertas, i];
  if (abiertas.length < 2) return { ...e, cartas, abiertas };

  const [a, b] = abiertas;
  const intentos = e.intentos + 1;

  if (cartas[a].id === cartas[b].id) {
    const marcadas = cartas.map((c, k) => (k === a || k === b ? { ...c, par: true } : c));
    const pares = e.pares + 1;
    return { ...e, cartas: marcadas, abiertas: [], intentos, pares, terminado: pares === e.total };
  }

  // No coinciden: el tablero se bloquea hasta llamar a ocultarFallo().
  return { ...e, cartas, abiertas, intentos, bloqueado: true };
}

// Vuelve a tapar las dos cartas que no coincidieron.
export function ocultarFallo(e) {
  if (!e.bloqueado) return e;
  const cartas = e.cartas.map((c, k) => (e.abiertas.includes(k) ? { ...c, abierta: false } : c));
  return { ...e, cartas, abiertas: [], bloqueado: false };
}

export function formatoTiempo(segundos) {
  const m = Math.floor(segundos / 60);
  return `${m}:${String(segundos % 60).padStart(2, '0')}`;
}

// Mejor marca: menos intentos, y si empatan, menos tiempo.
export function esMejor(nueva, previa) {
  if (!previa) return true;
  return nueva.intentos < previa.intentos || (nueva.intentos === previa.intentos && nueva.segundos < previa.segundos);
}
