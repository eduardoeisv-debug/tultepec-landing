import { useEffect, useRef } from "react";
import "./ClickFireworks.css";

// Fuegos artificiales al tocar o hacer clic en cualquier parte vacía de la
// página: un cohete sube desde abajo hasta el punto tocado y ahí explota
// en un círculo de chispas con estela corta, gravedad suave y resplandor
// aditivo. Vive en un <canvas> fijo, independiente del canvas de fondo del
// hero (ese está recortado a la sección del hero, no cubre toda la
// página), pero su bucle de animación solo corre mientras hay algo que
// animar -- arranca con el primer clic y se detiene en cuanto no queda
// nada vivo, así que no añade ningún costo cuando está inactivo.
const COLORS = ["#f3cd7a", "#e3ab3d", "#ff2d8a", "#2fd3c8", "#fbf1e2"];
const MAX_BURSTS = 6;
// Física pensada para un paso de 16.67ms (60fps); tick() la escala por el
// tiempo real transcurrido entre frames para que se vea igual sin
// importar la tasa de refresco del dispositivo.
const GRAVITY = 0.045;
const DRAG_PER_16MS = 0.985;
const PARTICLE_LIFE_MS = 1200;
const ROCKET_MS = 250;
const FLASH_MS = 230;
const REDUCED_FLASH_MS = 300;

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, video, [role="button"], [contenteditable]';

function pickTwoColors() {
  const a = COLORS[Math.floor(Math.random() * COLORS.length)];
  const b = COLORS[Math.floor(Math.random() * COLORS.length)];
  return [a, b];
}

export default function ClickFireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = null;
    let nextBurstId = 1;

    let rockets = [];
    let particles = [];
    let flashes = [];
    const activeBurstIds = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const isSmallScreen = () => window.innerWidth < 768;

    const discardBurst = (id) => {
      rockets = rockets.filter((r) => r.burstId !== id);
      particles = particles.filter((p) => p.burstId !== id);
      flashes = flashes.filter((f) => f.burstId !== id);
    };

    const reserveBurstSlot = () => {
      if (activeBurstIds.length >= MAX_BURSTS) {
        const oldest = activeBurstIds.shift();
        discardBurst(oldest);
      }
      const id = nextBurstId++;
      activeBurstIds.push(id);
      return id;
    };

    const releaseBurstSlot = (id) => {
      const idx = activeBurstIds.indexOf(id);
      if (idx !== -1) activeBurstIds.splice(idx, 1);
    };

    const spawnExplosion = (burstId, x, y, now) => {
      const small = isSmallScreen();
      const count = small
        ? 40 + Math.floor(Math.random() * 21)
        : 60 + Math.floor(Math.random() * 41);
      const [colorA, colorB] = pickTwoColors();

      flashes.push({ burstId, x, y, spawnTime: now, durationMs: FLASH_MS, size: small ? 30 : 46 });

      for (let i = 0; i < count; i += 1) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.35;
        const speed = 1.3 + Math.random() * 2.6;
        particles.push({
          burstId,
          x,
          y,
          px: x,
          py: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          spawnTime: now,
          color: Math.random() < 0.5 ? colorA : colorB,
          size: (small ? 1.3 : 1.7) + Math.random() * 1.6,
        });
      }
    };

    const launchRocket = (x, y, now) => {
      const burstId = reserveBurstSlot();
      rockets.push({
        burstId,
        startX: x,
        startY: height + 16,
        targetX: x,
        targetY: y,
        spawnTime: now,
      });
    };

    const launchReducedFlash = (x, y, now) => {
      const burstId = reserveBurstSlot();
      flashes.push({ burstId, x, y, spawnTime: now, durationMs: REDUCED_FLASH_MS, size: 42, reduced: true });
    };

    let lastTime = null;

    const tick = (now) => {
      const dtMs = lastTime === null ? 16.67 : Math.min(now - lastTime, 48);
      lastTime = now;
      const dtSteps = dtMs / 16.67; // nº de "pasos de 60fps" transcurridos

      ctx.clearRect(0, 0, width, height);

      // Cohetes: suben del punto de origen al punto tocado y, al llegar,
      // detonan la explosión real (partículas + destello).
      const nextRockets = [];
      for (const r of rockets) {
        const t = Math.min((now - r.spawnTime) / ROCKET_MS, 1);
        const ease = 1 - (1 - t) * (1 - t);
        const cx = r.startX + (r.targetX - r.startX) * ease;
        const cy = r.startY + (r.targetY - r.startY) * ease;

        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = "#fbf1e2";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(cx, Math.min(cy + 10, r.startY));
        ctx.lineTo(cx, cy);
        ctx.stroke();

        if (t >= 1) {
          spawnExplosion(r.burstId, r.targetX, r.targetY, now);
        } else {
          nextRockets.push(r);
        }
      }
      rockets = nextRockets;

      // Destellos (incluye el flash estático de prefers-reduced-motion).
      const nextFlashes = [];
      for (const f of flashes) {
        const life = 1 - (now - f.spawnTime) / f.durationMs;
        if (life <= 0) {
          if (f.reduced) releaseBurstSlot(f.burstId);
          continue;
        }
        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size);
        gradient.addColorStop(0, "rgba(255,255,255,0.9)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = Math.max(life, 0) * (f.reduced ? 0.6 : 0.85);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
        nextFlashes.push(f);
      }
      flashes = nextFlashes;

      // Chispas: estela corta (línea del punto anterior al actual) +
      // cabeza brillante, con mezcla aditiva para que se vean luminosas.
      // vx/vy/gravedad/arrastre se escalan por dtSteps para que la
      // trayectoria se vea igual sin importar los fps reales.
      const nextParticles = [];
      for (const p of particles) {
        p.px = p.x;
        p.py = p.y;
        p.x += p.vx * dtSteps;
        p.y += p.vy * dtSteps;
        p.vy += GRAVITY * dtSteps;
        const drag = DRAG_PER_16MS ** dtSteps;
        p.vx *= drag;
        p.vy *= drag;

        const life = 1 - (now - p.spawnTime) / PARTICLE_LIFE_MS;
        if (life <= 0) continue;

        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = Math.max(life, 0);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
        ctx.fill();

        nextParticles.push(p);
      }
      particles = nextParticles;

      // Un burst se libera (deja de contar para el límite de 6) en cuanto
      // ya no le quedan partículas vivas y su cohete ya detonó.
      for (const id of [...activeBurstIds]) {
        const stillHasRocket = rockets.some((r) => r.burstId === id);
        const stillHasParticles = particles.some((p) => p.burstId === id);
        if (!stillHasRocket && !stillHasParticles) releaseBurstSlot(id);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      if (rockets.length || particles.length || flashes.length) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
        lastTime = null;
      }
    };

    const ensureLoopRunning = () => {
      if (rafId === null && !document.hidden) {
        lastTime = null;
        rafId = requestAnimationFrame(tick);
      }
    };

    const onPointerDown = (event) => {
      if (event.button > 0) return;
      if (event.target.closest(INTERACTIVE_SELECTOR)) return;

      const x = event.clientX;
      const y = event.clientY;
      if (typeof x !== "number" || typeof y !== "number") return;

      const now = performance.now();
      if (reducedMotion) {
        launchReducedFlash(x, y, now);
      } else {
        launchRocket(x, y, now);
      }
      ensureLoopRunning();
    };

    document.addEventListener("pointerdown", onPointerDown, { passive: true });

    const onVisibility = () => {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        ensureLoopRunning();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="click-fireworks" aria-hidden="true" />;
}
