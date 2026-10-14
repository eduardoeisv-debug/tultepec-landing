// Motor de cohetes y estrellitas sobre <canvas>. Sin dependencias.
// Uso: const fx = createFireworks(canvas, { goal: 10, onProgress, onFinale });
//      fx.start() / fx.stop() / fx.fireRandom() / fx.destroy()

const PALETTE = ['#ff5a36', '#ffb627', '#ffe45e', '#3ddc97', '#38b6ff', '#ff4fa3', '#b78cff', '#ffffff'];
const KINDS = ['peonia', 'anillo', 'doble'];
const MAX_SPARKS = 1100;
const TAU = Math.PI * 2;

export function createFireworks(canvas, options = {}) {
  const goal = options.goal || 10;
  const onProgress = options.onProgress || function () {};
  const onFinale = options.onFinale || function () {};
  const reduce =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');

  let w = 0;
  let h = 0;
  let rockets = [];
  let sparks = [];
  let raf = 0;
  let last = 0;
  let running = false;
  let visible = false;
  let introDone = false;
  let finaleOn = false;
  let count = 0;
  let glow = 0;
  let wheelAngle = 0;
  let down = null;
  const timers = new Set();

  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (list) => list[(Math.random() * list.length) | 0];

  function later(ms, fn) {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  }

  // ---------- tamaño ----------
  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width;
    h = r.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function castle() {
    const ch = Math.min(h * 0.34, 150);
    const cw = ch * 0.5;
    return { cx: w / 2, base: h, top: h - ch, ch, cw };
  }

  // ---------- chispas ----------
  function addSpark(x, y, vx, vy, life, color, size, gravity, drag, dot) {
    if (sparks.length >= MAX_SPARKS) return;
    sparks.push({ x, y, px: x, py: y, vx, vy, life, max: life, color, size, g: gravity, drag, dot: !!dot });
  }

  function explode(r) {
    glow = Math.max(glow, 0.7);
    const n = reduce ? 26 : r.kind === 'doble' ? 90 : 64;
    const speed = rand(110, 170);
    const second = pick(PALETTE);
    addSpark(r.x1, r.y1, 0, 0, 0.22, '#fff4d6', 12, 0, 1, true);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU + rand(-0.04, 0.04);
      let sp;
      let color = r.color;
      if (r.kind === 'anillo') {
        sp = speed;
      } else if (r.kind === 'doble') {
        const inner = i % 2 === 1;
        sp = inner ? speed * 0.55 : speed;
        if (inner) color = second;
      } else {
        sp = speed * (0.35 + 0.65 * Math.random());
      }
      addSpark(r.x1, r.y1, Math.cos(a) * sp, Math.sin(a) * sp, rand(0.9, 1.5), color, rand(1.2, 2.2), 85, 0.985, false);
    }
  }

  // ---------- cohetes ----------
  function launch(tx, ty, opts = {}) {
    if (!w) return;
    const c = castle();
    const x0 = c.cx + rand(-c.cw * 0.3, c.cw * 0.3);
    const y0 = c.top;
    rockets.push({
      x0,
      y0,
      x1: Math.max(24, Math.min(w - 24, tx)),
      y1: Math.max(24, Math.min(ty, y0 - 60)),
      x: x0,
      y: y0,
      t: 0,
      dur: rand(0.55, 0.85),
      kind: opts.kind || pick(KINDS),
      color: opts.color || pick(PALETTE),
    });
    glow = 1;
    kick();
  }

  function finale() {
    onFinale(true);
    const n = 14;
    for (let i = 0; i < n; i++) {
      later(i * 170, () => launch(w * (0.12 + 0.76 * (i / (n - 1))) + rand(-12, 12), rand(h * 0.12, h * 0.45)));
    }
    later(n * 170 + 2200, () => {
      finaleOn = false;
      onFinale(false);
      onProgress(0);
    });
  }

  function fire(x, y) {
    launch(x, y);
    if (finaleOn) return;
    count += 1;
    onProgress(count);
    if (count >= goal) {
      count = 0;
      finaleOn = true;
      later(450, finale);
    }
  }

  function fireRandom() {
    if (!w) return;
    fire(rand(w * 0.15, w * 0.85), rand(h * 0.12, h * 0.5));
  }

  // ---------- simulación ----------
  function step(dt) {
    glow = Math.max(0, glow - dt * 2.2);
    wheelAngle += dt * (0.6 + glow * 7);

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.t += dt / r.dur;
      const k = Math.min(r.t, 1);
      const e = 1 - (1 - k) * (1 - k);
      r.x = r.x0 + (r.x1 - r.x0) * e + Math.sin(r.t * 22) * 1.5 * (1 - k);
      r.y = r.y0 + (r.y1 - r.y0) * e;
      addSpark(r.x, r.y, rand(-8, 8), rand(10, 40), 0.35, '#ffd9a0', 1.4, 0, 0.9, false);
      if (r.t >= 1) {
        explode(r);
        rockets.splice(i, 1);
      }
    }

    let j = 0;
    for (let i = 0; i < sparks.length; i++) {
      const s = sparks[i];
      s.life -= dt;
      if (s.life <= 0) continue;
      const damp = Math.pow(s.drag, dt * 60);
      s.px = s.x;
      s.py = s.y;
      s.vx *= damp;
      s.vy *= damp;
      s.vy += s.g * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      sparks[j++] = s;
    }
    sparks.length = j;
  }

  // ---------- dibujo ----------
  function drawWheel(cx, cy, r, color, alpha) {
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    for (let i = 0; i < 6; i++) {
      const a = wheelAngle + (i * Math.PI) / 3;
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    ctx.stroke();
  }

  function drawCastle() {
    const c = castle();
    const lx = c.cx - c.cw / 2;
    const rx = c.cx + c.cw / 2;
    const levels = 4;
    const seg = c.ch / levels;
    const wr = c.cw * 0.5;
    const yL = c.base - seg * 2;
    const yR = c.base - seg * 3;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#4a3b86';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lx, c.base);
    ctx.lineTo(lx, c.top);
    ctx.moveTo(rx, c.base);
    ctx.lineTo(rx, c.top);
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= levels; i++) {
      const y = c.base - seg * i;
      ctx.moveTo(lx, y);
      ctx.lineTo(rx, y);
    }
    for (let i = 0; i < levels; i++) {
      const y0 = c.base - seg * i;
      const y1 = y0 - seg;
      ctx.moveTo(lx, y0);
      ctx.lineTo(rx, y1);
      ctx.moveTo(rx, y0);
      ctx.lineTo(lx, y1);
    }
    ctx.moveTo(c.cx, c.top);
    ctx.lineTo(c.cx, c.top - 12);
    ctx.stroke();

    drawWheel(lx - wr * 0.9, yL, wr, '#4a3b86', 1);
    drawWheel(rx + wr * 0.9, yR, wr, '#4a3b86', 1);
    if (glow > 0.02) {
      drawWheel(lx - wr * 0.9, yL, wr, '#ffb627', Math.min(1, glow));
      drawWheel(rx + wr * 0.9, yR, wr, '#ffb627', Math.min(1, glow));
    }
    ctx.restore();
  }

  function draw() {
    if (!w) return;
    ctx.clearRect(0, 0, w, h);
    drawCastle();

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (let i = 0; i < sparks.length; i++) {
      const s = sparks[i];
      const a = s.life / s.max;
      if (s.dot) {
        ctx.globalAlpha = a * 0.55;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * (2 - a), 0, TAU);
        ctx.fill();
        continue;
      }
      ctx.globalAlpha = Math.min(1, a * 1.6) * (a < 0.3 ? 0.55 + Math.random() * 0.45 : 1);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size;
      ctx.beginPath();
      ctx.moveTo(s.px, s.py);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff1cf';
    for (let i = 0; i < rockets.length; i++) {
      ctx.beginPath();
      ctx.arc(rockets[i].x, rockets[i].y, 2.2, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  // ---------- ciclo ----------
  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.033, (now - last) / 1000 || 0.016);
    last = now;
    step(dt);
    draw();
    if (!rockets.length && !sparks.length && glow <= 0) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  function kick() {
    if (running || !visible) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    visible = true;
    kick();
    if (!introDone) {
      introDone = true;
      if (!reduce) {
        later(600, () => launch(w * 0.3, h * 0.28, { kind: 'peonia' }));
        later(1250, () => launch(w * 0.7, h * 0.22, { kind: 'anillo' }));
      }
    }
  }

  function stop() {
    visible = false;
    running = false;
    cancelAnimationFrame(raf);
  }

  // ---------- eventos ----------
  function onDown(e) {
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
  }
  function onUp(e) {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    const held = performance.now() - down.t;
    down = null;
    if (moved > 10 || held > 600) return;
    const r = canvas.getBoundingClientRect();
    fire(e.clientX - r.left, e.clientY - r.top);
  }
  function onCancel() {
    down = null;
  }

  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onCancel);

  let ro = null;
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(resize);
    ro.observe(canvas);
  } else {
    window.addEventListener('resize', resize);
  }
  resize();

  function destroy() {
    stop();
    timers.forEach(clearTimeout);
    timers.clear();
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointerup', onUp);
    canvas.removeEventListener('pointercancel', onCancel);
    if (ro) ro.disconnect();
    else window.removeEventListener('resize', resize);
  }

  return { start, stop, fireRandom, destroy };
}
