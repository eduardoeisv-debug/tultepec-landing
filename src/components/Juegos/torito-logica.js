// Lógica del juego del torito: laberinto, movimiento, persecución, puntos y niveles.
// No usa DOM ni canvas, así que se puede probar sola.
//
// Todo se mide en casillas. Una entidad está en la casilla (c, r) y avanza hacia
// (c + dc, r + dr) con un progreso p entre 0 y 1. Si dc = dr = 0 está quieta.

export const COLS = 15;
export const FILAS = 15;

// # muro   . chispa   o castillo (poder)   espacio vacío
const MITAD = [
  '###############',
  '#o.....#.....o#',
  '#.##.#.#.#.##.#',
  '#.............#',
  '#.##.#####.##.#',
  '#....#...#....#',
  '####.#.#.#.####',
  '#.............#',
];
// La mitad de arriba se refleja hacia abajo: 15 filas.
export const MAPA = [...MITAD, ...MITAD.slice(0, 7).reverse()];

export const INICIO_JUGADOR = { c: 7, r: 11 };
const INICIO_ENEMIGOS = [
  { c: 5, r: 7 },
  { c: 7, r: 7 },
  { c: 9, r: 7 },
];

// velJ / velE: casillas por segundo. susto: segundos que dura el castillo.
// salidas: segundos (tras empezar) en que sale cada cohete. azar: qué tanto se desvía al perseguir.
export const NIVELES = [
  { velJ: 5.4, velE: 4.2, susto: 7, salidas: [0.8, 4, 8], azar: [0.18, 0.25, 0.45] },
  { velJ: 5.5, velE: 4.7, susto: 5, salidas: [0.5, 3, 6], azar: [0.12, 0.2, 0.4] },
  { velJ: 5.6, velE: 5.1, susto: 3.5, salidas: [0.4, 2, 4], azar: [0.08, 0.15, 0.3] },
];

const VECS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

export function libre(m, c, r) {
  return c >= 0 && c < COLS && r >= 0 && r < FILAS && m.grid[r][c] !== '#';
}

export function posicion(e) {
  return [e.c + e.dc * e.p, e.r + e.dr * e.p];
}

function invertir(e) {
  if (e.dc === 0 && e.dr === 0) return;
  e.c += e.dc;
  e.r += e.dr;
  e.p = 1 - e.p;
  e.dc = -e.dc;
  e.dr = -e.dr;
}

function colocar(m) {
  const cfg = m.cfg;
  m.jugador = {
    c: INICIO_JUGADOR.c,
    r: INICIO_JUGADOR.r,
    dc: 0,
    dr: 0,
    p: 0,
    q: null,
    qt: 0,
    cara: 0,
    vel: cfg.velJ,
  };
  m.enemigos = INICIO_ENEMIGOS.map((s, id) => ({
    id,
    c0: s.c,
    r0: s.r,
    c: s.c,
    r: s.r,
    dc: 0,
    dr: 0,
    p: 0,
    estado: 'espera', // espera | activo | asustado
    salida: m.tiempo + cfg.salidas[id],
    azar: cfg.azar[id],
    velE: cfg.velE,
  }));
  m.susto = 0;
  m.cadena = 0;
  m.fase = 'jugando'; // jugando | muerte | nivel
}

export function nuevoMundo(nivel = 1, puntos = 0, vidas = 3) {
  const cfg = NIVELES[Math.min(nivel, NIVELES.length) - 1];
  const grid = MAPA.map((fila) => fila.split(''));
  grid[INICIO_JUGADOR.r][INICIO_JUGADOR.c] = ' ';
  let chispas = 0;
  for (const fila of grid) for (const ch of fila) if (ch === '.' || ch === 'o') chispas++;
  const m = { nivel, cfg, grid, chispas, puntos, vidas, tiempo: 0, eventos: [], jugador: null, enemigos: [] };
  colocar(m);
  return m;
}

// Después de perder una vida: todos vuelven a su lugar, las chispas comidas se quedan comidas.
export function reiniciarPosiciones(m) {
  colocar(m);
}

export function dirigir(m, dc, dr) {
  m.jugador.q = [dc, dr];
  m.jugador.qt = m.tiempo;
}

function comer(m, c, r) {
  const ch = m.grid[r][c];
  if (ch === '.') {
    m.grid[r][c] = ' ';
    m.puntos += 10;
    m.chispas--;
    m.eventos.push({ tipo: 'chispa', c, r });
  } else if (ch === 'o') {
    m.grid[r][c] = ' ';
    m.puntos += 50;
    m.chispas--;
    m.susto = m.cfg.susto;
    m.cadena = 0;
    for (const e of m.enemigos) {
      if (e.estado === 'activo') {
        e.estado = 'asustado';
        invertir(e);
      }
    }
    m.eventos.push({ tipo: 'castillo', c, r });
  }
}

function moverJugador(m, dt) {
  const j = m.jugador;
  if (j.q && m.tiempo - j.qt > 1.2) j.q = null;

  // Dar media vuelta se puede en cualquier momento, no solo en una esquina.
  if (j.q && (j.dc || j.dr) && j.q[0] === -j.dc && j.q[1] === -j.dr) {
    invertir(j);
    j.cara = Math.atan2(j.dr, j.dc);
    j.q = null;
  }

  let restante = j.vel * dt;
  let vueltas = 0;
  while (restante > 1e-9 && vueltas++ < 8) {
    if (j.dc === 0 && j.dr === 0) {
      if (j.q && libre(m, j.c + j.q[0], j.r + j.q[1])) {
        j.dc = j.q[0];
        j.dr = j.q[1];
        j.cara = Math.atan2(j.dr, j.dc);
        j.q = null;
      } else {
        break;
      }
    }
    const falta = 1 - j.p;
    if (restante < falta) {
      j.p += restante;
      break;
    }
    restante -= falta;
    j.c += j.dc;
    j.r += j.dr;
    j.p = 0;
    comer(m, j.c, j.r);
    if (j.q && libre(m, j.c + j.q[0], j.r + j.q[1])) {
      j.dc = j.q[0];
      j.dr = j.q[1];
      j.cara = Math.atan2(j.dr, j.dc);
      j.q = null;
    } else if (!libre(m, j.c + j.dc, j.r + j.dr)) {
      j.dc = 0;
      j.dr = 0;
    }
  }
}

function objetivo(m, e) {
  const j = m.jugador;
  const pc = Math.round(j.c + j.dc * j.p);
  const pr = Math.round(j.r + j.dr * j.p);
  // El cohete 1 intenta cortarle el paso, adelantándose tres casillas.
  if (e.id === 1) return [pc + j.dc * 3, pr + j.dr * 3];
  return [pc, pr];
}

function elegirDir(m, e) {
  const avanza = e.dc !== 0 || e.dr !== 0;
  const op = VECS.filter(([dc, dr]) => libre(m, e.c + dc, e.r + dr) && !(avanza && dc === -e.dc && dr === -e.dr));
  if (op.length === 0) return avanza ? [-e.dc, -e.dr] : [0, 0];
  if (op.length === 1) return op[0];
  if (e.estado === 'asustado' || Math.random() < e.azar) return op[Math.floor(Math.random() * op.length)];
  const [tc, tr] = objetivo(m, e);
  let mejor = op[0];
  let mejorD = Infinity;
  for (const o of op) {
    const d = (e.c + o[0] - tc) ** 2 + (e.r + o[1] - tr) ** 2;
    if (d < mejorD) {
      mejorD = d;
      mejor = o;
    }
  }
  return mejor;
}

function moverEnemigo(m, e, dt) {
  if (e.estado === 'espera') {
    if (m.tiempo < e.salida) return;
    e.estado = m.susto > 0 ? 'asustado' : 'activo';
  }
  let restante = (e.estado === 'asustado' ? e.velE * 0.65 : e.velE) * dt;
  let vueltas = 0;
  while (restante > 1e-9 && vueltas++ < 8) {
    if (e.dc === 0 && e.dr === 0) {
      const d = elegirDir(m, e);
      e.dc = d[0];
      e.dr = d[1];
      e.p = 0;
      if (e.dc === 0 && e.dr === 0) break;
    }
    const falta = 1 - e.p;
    if (restante < falta) {
      e.p += restante;
      break;
    }
    restante -= falta;
    e.c += e.dc;
    e.r += e.dr;
    e.p = 0;
    const d = elegirDir(m, e);
    e.dc = d[0];
    e.dr = d[1];
  }
}

function colisiones(m) {
  const j = m.jugador;
  const [jx, jy] = posicion(j);
  for (const e of m.enemigos) {
    if (e.estado === 'espera') continue;
    const [ex, ey] = posicion(e);
    if ((ex - jx) ** 2 + (ey - jy) ** 2 > 0.36) continue;
    if (e.estado === 'asustado') {
      const pts = 200 * 2 ** m.cadena;
      m.cadena = Math.min(m.cadena + 1, 3);
      m.puntos += pts;
      m.eventos.push({ tipo: 'come', x: ex, y: ey, puntos: pts, id: e.id });
      e.estado = 'espera';
      e.c = e.c0;
      e.r = e.r0;
      e.dc = 0;
      e.dr = 0;
      e.p = 0;
      e.salida = m.tiempo + 2.5;
    } else {
      m.fase = 'muerte';
      m.vidas--;
      m.eventos.push({ tipo: 'muerte', x: jx, y: jy });
      return;
    }
  }
}

export function avanzar(m, dt) {
  if (m.fase !== 'jugando') return;
  dt = Math.min(dt, 0.05);
  m.tiempo += dt;

  if (m.susto > 0) {
    m.susto -= dt;
    if (m.susto <= 0) {
      m.susto = 0;
      for (const e of m.enemigos) if (e.estado === 'asustado') e.estado = 'activo';
    }
  }

  moverJugador(m, dt);
  for (const e of m.enemigos) moverEnemigo(m, e, dt);
  colisiones(m);

  if (m.chispas <= 0 && m.fase === 'jugando') {
    m.fase = 'nivel';
    m.eventos.push({ tipo: 'nivel' });
  }
}
