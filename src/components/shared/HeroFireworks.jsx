import { useEffect, useRef } from "react";
import "./HeroFireworks.css";

// Colores de las ráfagas: dorado, rosa mexicano, turquesa y blanco cálido.
const COLORS = ["#f3cd7a", "#e3ab3d", "#ff2d8a", "#2fd3c8", "#fbf1e2"];

const MIN_BURST_MS = 1000;
const MAX_BURST_MS = 2000;
const GRAVITY = 0.025;
const DRAG = 0.985;

function randomBurstDelay() {
  return MIN_BURST_MS + Math.random() * (MAX_BURST_MS - MIN_BURST_MS);
}

// Explosiones de fuegos artificiales sutiles e infrecuentes, dibujadas en
// <canvas> detrás del contenido del hero. Respeta prefers-reduced-motion
// (no se monta nada), reduce partículas en pantallas chicas, se pausa
// cuando la pestaña no está visible, y usa requestAnimationFrame.
export default function HeroFireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let rafId = null;
    let lastBurstAt = 0;
    let nextDelay = randomBurstDelay();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawnBurst = () => {
      const isSmall = width < 640;
      const particleCount = isSmall ? 12 : 22;

      // Sobre todo en los costados y arriba, evitando la franja central
      // donde vive el texto, para no competir visualmente con él.
      const zone = Math.random();
      let x;
      let y;
      if (zone < 0.38) {
        x = width * (0.04 + Math.random() * 0.16);
        y = height * (0.12 + Math.random() * 0.38);
      } else if (zone < 0.76) {
        x = width * (0.8 + Math.random() * 0.17);
        y = height * (0.1 + Math.random() * 0.4);
      } else {
        x = width * (0.3 + Math.random() * 0.4);
        y = height * (0.04 + Math.random() * 0.1);
      }

      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      for (let i = 0; i < particleCount; i += 1) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.4;
        const speed = 0.9 + Math.random() * 1.6;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.014 + Math.random() * 0.012,
          color,
          size: (isSmall ? 1.1 : 1.4) + Math.random() * 1.3,
        });
      }

      // Tope de seguridad por si varias ráfagas se acumulan.
      const maxParticles = isSmall ? 160 : 320;
      if (particles.length > maxParticles) {
        particles = particles.slice(particles.length - maxParticles);
      }
    };

    const tick = (time) => {
      if (time - lastBurstAt > nextDelay) {
        spawnBurst();
        lastBurstAt = time;
        nextDelay = randomBurstDelay();
      }

      ctx.clearRect(0, 0, width, height);

      const next = [];
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += GRAVITY;
        p.vx *= DRAG;
        p.vy *= DRAG;
        p.life -= p.decay;
        if (p.life <= 0) continue;

        ctx.globalAlpha = Math.max(p.life, 0);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        next.push(p);
      }
      particles = next;
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (rafId) return;
      lastBurstAt = performance.now();
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-fireworks" aria-hidden="true" />;
}
