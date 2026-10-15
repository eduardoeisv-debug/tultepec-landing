// Dibujo, controles y ciclo de juego del torito sobre <canvas>. Sin dependencias.
//
//   const juego = createTorito(canvas, { onInfo });
//   juego.start() / juego.pause() / juego.resume() / juego.setDir('izq'|'der'|'arr'|'aba') / juego.destroy()
//
// onInfo recibe { status, puntos, vidas, nivel, niveles, mejor, nuevoRecord } cada vez que algo cambia.
// status: idle | ready | playing | paused | dying | clear | over | won

import { COLS, FILAS, NIVELES, nuevoMundo, reiniciarPosiciones, dirigir, avanzar, posicion } from './torito-logica.js';
import { playSparkSound, playPowerUpSound, playDeathSound } from '../../lib/toritoSound.js';
import { playVictorySound } from '../../lib/victorySound.js';

const CLAVE_MEJOR = 'tultepec:torito-mejor';
// Nombres reales de calles de Tultepec (16 de Septiembre, Hidalgo y
// Benito Juárez), uno por cada pasillo horizontal totalmente abierto del
// mapa (filas 3, 7 y 11 de torito-logica.js) -- se dibujan como letreros
// tenues de fondo, sin inventar nombres.
const CALLES = [
  { fila: 3, nombre: '16 de Septiembre' },
  { fila: 7, nombre: 'Hidalgo' },
  { fila: 11, nombre: 'Benito Juárez' },
];
const TAU = Math.PI * 2;
const DIRS = { izq: [-1, 0], der: [1, 0], arr: [0, -1], aba: [0, 1] };
const TECLAS = {
  ArrowLeft: 'izq',
  ArrowRight: 'der',
  ArrowUp: 'arr',
  ArrowDown: 'aba',
  a: 'izq',
  d: 'der',
  w: 'arr',
  s: 'aba',
  A: 'izq',
  D: 'der',
  W: 'arr',
  S: 'aba',
};
const COLOR_ENEMIGO = ['#ff5a36', '#ff4fa3', '#38b6ff'];
const COLORES_CHISPA = ['#ff5a36', '#ffb627', '#ffe45e', '#3ddc97', '#38b6ff', '#ff4fa3', '#b78cff', '#ffffff'];
const MAX_PARTICULAS = 280;
const SECS_LISTO = 1.4;
const SECS_MUERTE = 1.0;
const SECS_NIVEL = 2.2;
const SECS_FIESTA = 4.5;

function leerMejor() {
  try {
    const n = Number(localStorage.getItem(CLAVE_MEJOR));
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function guardarMejor(n) {
  try {
    localStorage.setItem(CLAVE_MEJOR, String(n));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

export function createTorito(canvas, opciones = {}) {
  const onInfo = opciones.onInfo || function () {};
  const ctx = canvas.getContext('2d');
  const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w = 0;
  let h = 0;
  let dpr = 1;
  let cell = 0;
  let ox = 0;
  let oy = 0;
  let muros = null;
  let murosOro = null;
  let fuenteTexto = 'sans-serif';

  let m = nuevoMundo(1);
  let status = 'idle';
  let tEstado = 0;
  let reloj = 0;
  let nivel = 1;
  let mejor = leerMejor();
  let nuevoRecord = false;
  let particulas = [];
  let raf = 0;
  let last = 0;
  let enMarcha = false;
  let ultimaInfo = '';
  let proximaFiesta = 0;
  let toque = null;

  const rand = (a, b) => a + Math.random() * (b - a);
  const px = (x) => ox + (x + 0.5) * cell;
  const py = (y) => oy + (y + 0.5) * cell;

  // ---------- estado ----------
  function emitir() {
    const info = {
      status,
      puntos: m.puntos,
      vidas: m.vidas,
      nivel,
      niveles: NIVELES.length,
      mejor,
      nuevoRecord,
    };
    const llave = JSON.stringify(info);
    if (llave === ultimaInfo) return;
    ultimaInfo = llave;
    onInfo(info);
  }

  function activo() {
    return (
      status === 'ready' ||
      status === 'playing' ||
      status === 'dying' ||
      status === 'clear' ||
      (status === 'won' && tEstado < SECS_FIESTA) ||
      particulas.length > 0
    );
  }

  function cambiar(nuevo) {
    status = nuevo;
    tEstado = 0;
    proximaFiesta = 0;
    canvas.style.touchAction = nuevo === 'ready' || nuevo === 'playing' ? 'none' : 'pan-y';
    if (nuevo === 'dying') playDeathSound();
    else if (nuevo === 'clear' || nuevo === 'won') playVictorySound();
    emitir();
    if (activo()) arrancar();
    else dibujar();
  }

  function terminar(final) {
    if (m.puntos > mejor) {
      mejor = m.puntos;
      nuevoRecord = true;
      guardarMejor(mejor);
    }
    if (final === 'won') fiesta(3);
    cambiar(final);
  }

  // ---------- partículas ----------
  function chispazo(x, y, n, colores) {
    const total = reduce ? Math.ceil(n / 2) : n;
    for (let i = 0; i < total && particulas.length < MAX_PARTICULAS; i++) {
      const a = rand(0, TAU);
      const v = cell * rand(1.5, 5.5);
      particulas.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        vida: rand(0.5, 1.1),
        max: 1.1,
        color: colores ? colores[(Math.random() * colores.length) | 0] : COLORES_CHISPA[(Math.random() * COLORES_CHISPA.length) | 0],
      });
    }
  }

  function fiesta(cuantos) {
    for (let i = 0; i < cuantos; i++) {
      chispazo(ox + rand(0.15, 0.85) * cell * COLS, oy + rand(0.1, 0.6) * cell * FILAS, 34);
    }
  }

  function procesarEventos() {
    for (const ev of m.eventos.splice(0)) {
      if (ev.tipo === 'castillo') {
        chispazo(px(ev.c), py(ev.r), 30, ['#ffb627', '#ffe45e', '#ffffff']);
        playPowerUpSound();
      } else if (ev.tipo === 'chispa') playSparkSound();
      else if (ev.tipo === 'come') chispazo(px(ev.x), py(ev.y), 22, [COLOR_ENEMIGO[ev.id], '#ffffff', '#ffe45e']);
      else if (ev.tipo === 'muerte') chispazo(px(ev.x), py(ev.y), 18, ['#ff5a36', '#8b5a3c', '#ffb627']);
    }
  }

  // ---------- ciclo ----------
  function paso(dt) {
    tEstado += dt;
    reloj += dt;

    if (status === 'ready') {
      if (tEstado >= SECS_LISTO) cambiar('playing');
    } else if (status === 'playing') {
      avanzar(m, dt);
      procesarEventos();
      if (m.fase === 'muerte') cambiar('dying');
      else if (m.fase === 'nivel') cambiar('clear');
      else emitir();
    } else if (status === 'dying') {
      if (tEstado >= SECS_MUERTE) {
        if (m.vidas > 0) {
          reiniciarPosiciones(m);
          cambiar('ready');
        } else {
          terminar('over');
        }
      }
    } else if (status === 'clear') {
      if (tEstado >= proximaFiesta) {
        fiesta(1);
        proximaFiesta = tEstado + 0.45;
      }
      if (tEstado >= SECS_NIVEL) {
        if (nivel >= NIVELES.length) {
          terminar('won');
        } else {
          nivel += 1;
          m = nuevoMundo(nivel, m.puntos, m.vidas);
          cambiar('ready');
        }
      }
    } else if (status === 'won' && tEstado < SECS_FIESTA && tEstado >= proximaFiesta) {
      fiesta(1);
      proximaFiesta = tEstado + 0.5;
    }

    for (let i = particulas.length - 1; i >= 0; i--) {
      const p = particulas[i];
      p.vida -= dt;
      if (p.vida <= 0) {
        particulas.splice(i, 1);
        continue;
      }
      p.vy += cell * 5 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  function bucle(ahora) {
    if (!enMarcha) return;
    const dt = Math.min(0.05, (ahora - last) / 1000 || 0.016);
    last = ahora;
    paso(dt);
    dibujar();
    if (!activo()) {
      enMarcha = false;
      return;
    }
    raf = requestAnimationFrame(bucle);
  }

  function arrancar() {
    if (enMarcha) return;
    enMarcha = true;
    last = performance.now();
    raf = requestAnimationFrame(bucle);
  }

  // ---------- tamaño y muros ----------
  function hacerMuros(borde, nucleo) {
    const lienzo = document.createElement('canvas');
    lienzo.width = canvas.width;
    lienzo.height = canvas.height;
    const g = lienzo.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.lineCap = 'round';
    g.lineJoin = 'round';
    const esMuro = (c, r) => c >= 0 && c < COLS && r >= 0 && r < FILAS && m.grid[r][c] === '#';
    g.beginPath();
    for (let r = 0; r < FILAS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!esMuro(c, r)) continue;
        const x = px(c);
        const y = py(r);
        g.moveTo(x, y);
        g.lineTo(x, y);
        if (esMuro(c + 1, r)) {
          g.moveTo(x, y);
          g.lineTo(x + cell, y);
        }
        if (esMuro(c, r + 1)) {
          g.moveTo(x, y);
          g.lineTo(x, y + cell);
        }
      }
    }
    g.shadowColor = borde;
    g.shadowBlur = cell * 0.35;
    g.strokeStyle = borde;
    g.lineWidth = cell * 0.4;
    g.stroke();
    g.shadowBlur = 0;
    g.strokeStyle = nucleo;
    g.lineWidth = cell * 0.2;
    g.stroke();
    return lienzo;
  }

  function ajustar() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = Math.floor(Math.min(w / COLS, h / FILAS));
    ox = (w - cell * COLS) / 2;
    oy = (h - cell * FILAS) / 2;
    // Misma tipografía del cuerpo del sitio (Work Sans) para los letreros
    // de calle -- se lee del canvas en vez de repetir el nombre a mano,
    // así sigue cualquier cambio futuro de fuente del sitio.
    fuenteTexto = getComputedStyle(canvas).fontFamily || 'sans-serif';
    muros = hacerMuros('#6b57c9', '#120b33');
    murosOro = hacerMuros('#ffb627', '#3b2300');
    dibujar();
  }

  // ---------- dibujo ----------
  // Letreros de calle: se dibujan después de las chispas (para que los
  // puntitos del camino no corten las letras) pero antes de los cohetes,
  // el torito y las partículas, que van encima por ser lo que se mueve.
  function dibujarCalles() {
    if (!cell) return;
    ctx.save();
    ctx.font = `600 ${Math.max(11, cell * 0.34)}px ${fuenteTexto}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 246, 224, 0.5)';
    ctx.shadowColor = 'rgba(8, 3, 28, 0.9)';
    ctx.shadowBlur = 3;
    for (const calle of CALLES) {
      ctx.fillText(calle.nombre.toUpperCase(), px(COLS / 2 - 0.5), py(calle.fila));
    }
    ctx.restore();
  }

  function dibujarChispas() {
    for (let r = 0; r < FILAS; r++) {
      for (let c = 0; c < COLS; c++) {
        const ch = m.grid[r][c];
        if (ch === '.') {
          ctx.fillStyle = '#ffd98a';
          ctx.beginPath();
          ctx.arc(px(c), py(r), cell * 0.085, 0, TAU);
          ctx.fill();
        } else if (ch === 'o') {
          const pulso = reduce ? 1 : 1 + 0.12 * Math.sin(reloj * 6);
          const x = px(c);
          const y = py(r);
          ctx.save();
          ctx.translate(x, y);
          ctx.strokeStyle = '#ffb627';
          ctx.lineWidth = cell * 0.07;
          ctx.lineCap = 'round';
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const a = (i / 8) * TAU + reloj * (reduce ? 0 : 1.2);
            ctx.moveTo(Math.cos(a) * cell * 0.12 * pulso, Math.sin(a) * cell * 0.12 * pulso);
            ctx.lineTo(Math.cos(a) * cell * 0.34 * pulso, Math.sin(a) * cell * 0.34 * pulso);
          }
          ctx.stroke();
          ctx.fillStyle = '#fff4d6';
          ctx.beginPath();
          ctx.arc(0, 0, cell * 0.11, 0, TAU);
          ctx.fill();
          ctx.restore();
        }
      }
    }
  }

  function dibujarTorito(escala, giro) {
    const j = m.jugador;
    const [x, y] = posicion(j);
    const r = cell * 0.4 * escala;
    ctx.save();
    ctx.translate(px(x), py(y));
    ctx.rotate(j.cara + giro);
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#f5e6c8';
    ctx.lineWidth = r * 0.3;
    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(r * 0.3, lado * r * 0.7);
      ctx.quadraticCurveTo(r * 1.0, lado * r * 1.05, r * 1.3, lado * r * 0.4);
      ctx.stroke();
    }
    ctx.fillStyle = '#8b5a3c';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#f1c7a0';
    ctx.beginPath();
    ctx.ellipse(r * 0.5, 0, r * 0.45, r * 0.52, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = '#ff5a36';
    ctx.lineWidth = r * 0.12;
    ctx.beginPath();
    ctx.arc(r * 0.82, 0, r * 0.16, 0, TAU);
    ctx.stroke();
    ctx.fillStyle = '#1a1038';
    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(r * 0.1, lado * r * 0.46, r * 0.13, 0, TAU);
      ctx.fill();
    }
    // chispa en el lomo, como la mecha del torito
    if (!reduce || escala === 1) {
      const t = reduce ? 0.5 : 0.5 + 0.5 * Math.sin(reloj * 25);
      ctx.fillStyle = t > 0.5 ? '#ffe45e' : '#ff8a3c';
      ctx.beginPath();
      ctx.arc(-r * 0.85, 0, r * (0.14 + 0.08 * t), 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function dibujarCohete(e) {
    const [x, y] = posicion(e);
    const ang = e.dc || e.dr ? Math.atan2(e.dr, e.dc) : -Math.PI / 2;
    const c = cell;
    const asustado = e.estado === 'asustado';
    const parpadeo = asustado && m.susto < 2 && Math.floor(reloj * 5) % 2 === 0 && !reduce;
    const cuerpo = asustado ? (parpadeo ? '#f4eefc' : '#4b57b3') : COLOR_ENEMIGO[e.id];
    const punta = asustado ? (parpadeo ? '#4b57b3' : '#c9d1ff') : '#fff1cf';
    ctx.save();
    ctx.translate(px(x), py(y));
    ctx.rotate(ang);
    if (e.estado === 'espera') ctx.globalAlpha = reduce ? 0.6 : 0.5 + 0.25 * Math.sin(reloj * 8 + e.id);
    // llama
    const largo = c * (0.26 + (reduce ? 0.06 : 0.1 * Math.sin(reloj * 30 + e.id * 2)));
    ctx.fillStyle = '#ffb627';
    ctx.beginPath();
    ctx.moveTo(-c * 0.36, -c * 0.12);
    ctx.lineTo(-c * 0.36 - largo, 0);
    ctx.lineTo(-c * 0.36, c * 0.12);
    ctx.closePath();
    ctx.fill();
    // aletas
    ctx.fillStyle = asustado ? '#2e3880' : '#1a1038';
    for (const lado of [-1, 1]) {
      ctx.beginPath();
      ctx.moveTo(-c * 0.34, lado * c * 0.2);
      ctx.lineTo(-c * 0.5, lado * c * 0.4);
      ctx.lineTo(-c * 0.14, lado * c * 0.22);
      ctx.closePath();
      ctx.fill();
    }
    // cuerpo
    ctx.fillStyle = cuerpo;
    const rad = c * 0.2;
    ctx.beginPath();
    ctx.moveTo(-c * 0.38 + rad, -c * 0.24);
    ctx.lineTo(c * 0.18, -c * 0.24);
    ctx.lineTo(c * 0.18, c * 0.24);
    ctx.lineTo(-c * 0.38 + rad, c * 0.24);
    ctx.arcTo(-c * 0.38, c * 0.24, -c * 0.38, c * 0.24 - rad, rad);
    ctx.lineTo(-c * 0.38, -c * 0.24 + rad);
    ctx.arcTo(-c * 0.38, -c * 0.24, -c * 0.38 + rad, -c * 0.24, rad);
    ctx.closePath();
    ctx.fill();
    // punta
    ctx.fillStyle = punta;
    ctx.beginPath();
    ctx.moveTo(c * 0.18, -c * 0.24);
    ctx.lineTo(c * 0.48, 0);
    ctx.lineTo(c * 0.18, c * 0.24);
    ctx.closePath();
    ctx.fill();
    // ojos
    for (const lado of [-1, 1]) {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(c * 0.02, lado * c * 0.11, c * 0.075, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#1a1038';
      ctx.beginPath();
      ctx.arc(c * 0.04, lado * c * 0.11, c * 0.037, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function dibujarParticulas() {
    if (!particulas.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineWidth = Math.max(1.5, cell * 0.07);
    for (const p of particulas) {
      ctx.globalAlpha = Math.min(1, (p.vida / p.max) * 1.6);
      ctx.strokeStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 0.04, p.y - p.vy * 0.04);
      ctx.stroke();
    }
    ctx.restore();
  }

  function dibujar() {
    if (!w || !cell) return;
    ctx.clearRect(0, 0, w, h);
    const oro = status === 'clear' && Math.floor(tEstado * 4) % 2 === 0 && !reduce;
    ctx.drawImage(oro ? murosOro : muros, 0, 0, w, h);
    dibujarChispas();
    dibujarCalles();
    for (const e of m.enemigos) dibujarCohete(e);
    if (status === 'dying') {
      const t = Math.min(1, tEstado / SECS_MUERTE);
      dibujarTorito(Math.max(0.05, 1 - t), reduce ? 0 : t * TAU * 2);
    } else {
      dibujarTorito(1, 0);
    }
    dibujarParticulas();
  }

  // ---------- controles ----------
  function setDir(nombre) {
    const d = DIRS[nombre];
    if (!d) return;
    dirigir(m, d[0], d[1]);
  }

  function jugando() {
    return status === 'ready' || status === 'playing';
  }

  // Más amplio que jugando(): también cubre los estados de fin de ronda
  // (muerte, nivel completo, se acabó la mecha, ganaste) -- en esos
  // momentos la persona sigue viendo el tablero y suele seguir
  // presionando flechas por costumbre aunque ya no muevan al torito. Sin
  // absorber esas teclas aquí, al no haber jugando() el navegador recupera
  // su scroll nativo de flechas y la página salta lejos del tablero justo
  // cuando acaba de perder. En idle/paused si se dejan pasar: ahí sí tiene
  // sentido que las flechas sigan haciendo scroll normal de la página.
  function enPantalla() {
    return status !== 'idle' && status !== 'paused';
  }

  function alTeclear(e) {
    const nombre = TECLAS[e.key];
    if (!nombre || !enPantalla()) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    e.preventDefault();
    if (jugando()) setDir(nombre);
  }

  function alBajar(e) {
    if (!jugando()) return;
    toque = { x: e.clientX, y: e.clientY };
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* algunos navegadores no lo permiten */
    }
  }

  function alMover(e) {
    if (!toque || !jugando()) return;
    const dx = e.clientX - toque.x;
    const dy = e.clientY - toque.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    setDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'der' : 'izq') : dy > 0 ? 'aba' : 'arr');
    toque = { x: e.clientX, y: e.clientY };
  }

  function alSoltar() {
    toque = null;
  }

  function alOcultar() {
    if (document.hidden) pause();
  }

  // ---------- API ----------
  function start() {
    nivel = 1;
    nuevoRecord = false;
    particulas = [];
    m = nuevoMundo(1, 0, 3);
    cambiar('ready');
  }

  function pause() {
    if (status !== 'ready' && status !== 'playing') return;
    cambiar('paused');
  }

  function resume() {
    if (status !== 'paused') return;
    cambiar('ready');
  }

  function destroy() {
    enMarcha = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('keydown', alTeclear);
    document.removeEventListener('visibilitychange', alOcultar);
    canvas.removeEventListener('pointerdown', alBajar);
    canvas.removeEventListener('pointermove', alMover);
    canvas.removeEventListener('pointerup', alSoltar);
    canvas.removeEventListener('pointercancel', alSoltar);
    if (ro) ro.disconnect();
    else window.removeEventListener('resize', ajustar);
  }

  window.addEventListener('keydown', alTeclear);
  document.addEventListener('visibilitychange', alOcultar);
  canvas.addEventListener('pointerdown', alBajar);
  canvas.addEventListener('pointermove', alMover);
  canvas.addEventListener('pointerup', alSoltar);
  canvas.addEventListener('pointercancel', alSoltar);
  canvas.style.touchAction = 'pan-y';

  let ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(ajustar);
    ro.observe(canvas);
  } else {
    window.addEventListener('resize', ajustar);
  }
  ajustar();
  emitir();

  return { start, pause, resume, setDir, destroy };
}
