import { useEffect, useRef } from "react";
import "./HeroFireworks.css";

// Colores de las ráfagas: dorado, rosa mexicano, turquesa y blanco cálido.
const COLORS = ["#f3cd7a", "#e3ab3d", "#ff2d8a", "#2fd3c8", "#fbf1e2"];

const MIN_BURST_MS = 700;
const MAX_BURST_MS = 1400;
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
    let flashes = [];
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
      // Reducido de 90/150 a 65/110 (y las ráfagas ahora salen más
      // espaciadas, ver MIN/MAX_BURST_MS) para bajar el costo promedio de
      // dibujo por cuadro sin perder que siga leyéndose como una
      // explosión real, no un efecto sutil de chispitas.
      const particleCount = isSmall ? 65 : 110;

      // En escritorio (grid de 2 columnas) el texto ocupa toda la mitad
      // izquierda -- no es un "costado angosto" que se pueda esquivar con
      // un margen chico, así que ahí todas las ráfagas se mantienen a la
      // derecha de esa columna (junto y alrededor del video). En
      // celular/tableta (una sola columna) el texto ocupa casi todo el
      // ancho, así que ahí las ráfagas se van muy arriba (por encima del
      // eyebrow) o muy abajo (junto a la silueta), nunca a la altura del
      // título.
      const isDesktop = width >= 900;
      const zone = Math.random();
      let x;
      let y;
      if (isDesktop) {
        if (zone < 0.45) {
          x = width * (0.46 + Math.random() * 0.14);
          y = height * (0.04 + Math.random() * 0.22);
        } else if (zone < 0.8) {
          x = width * (0.78 + Math.random() * 0.19);
          y = height * (0.1 + Math.random() * 0.55);
        } else {
          x = width * (0.5 + Math.random() * 0.46);
          y = height * (0.62 + Math.random() * 0.2);
        }
      } else if (zone < 0.5) {
        x = width * (0.05 + Math.random() * 0.9);
        y = height * (0.015 + Math.random() * 0.035);
      } else {
        x = width * (0.05 + Math.random() * 0.9);
        y = height * (0.92 + Math.random() * 0.06);
      }

      const color = COLORS[Math.floor(Math.random() * COLORS.length)];

      // Destello breve en el punto de origen para que la explosión se
      // sienta con más impacto, no solo las chispas dispersándose.
      flashes.push({ x, y, life: 1, size: isSmall ? 26 : 42, color });

      for (let i = 0; i < particleCount; i += 1) {
        const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.4;
        const speed = 1.1 + Math.random() * 2.1;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: 0.012 + Math.random() * 0.011,
          color,
          size: (isSmall ? 1.3 : 1.7) + Math.random() * 1.5,
        });
      }

      // Tope de seguridad por si varias ráfagas se acumulan.
      const maxParticles = isSmall ? 220 : 400;
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

      const nextFlashes = [];
      for (const f of flashes) {
        f.life -= 0.09;
        if (f.life <= 0) continue;
        const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.size);
        gradient.addColorStop(0, f.color);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = Math.max(f.life, 0) * 0.8;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
        nextFlashes.push(f);
      }
      flashes = nextFlashes;

      // El resplandor (shadowBlur) es costoso en canvas; se omite en
      // pantallas chicas para no afectar el rendimiento en celulares.
      const withGlow = width >= 640;

      const next = [];
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += GRAVITY;
        p.vx *= DRAG;
        p.vy *= DRAG;
        p.life -= p.decay;
        if (p.life <= 0) continue;

        const life = Math.max(p.life, 0);
        ctx.globalAlpha = life;
        ctx.fillStyle = p.color;
        if (withGlow) {
          // El blur se reduce junto con la vida de la partícula -- si se
          // queda fijo en p.size * 2.5, una partícula casi apagada (alfa
          // bajo) sigue proyectando un resplandor del mismo tamaño, y
          // muchas así superpuestas se ven como una mancha borrosa
          // residual flotando después de que la explosión ya se apagó.
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.size * 1.6 * life;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        next.push(p);
      }
      particles = next;
      ctx.globalAlpha = 1;
      if (withGlow) ctx.shadowBlur = 0;

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

    const isOverlayLocked = () => document.body.style.overflow === "hidden";
    let heroInView = true;

    const maybeStart = () => {
      if (!document.hidden && !isOverlayLocked() && heroInView) start();
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else maybeStart();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // La animación es lo más caro que dibuja el hero (shadowBlur en cada
    // partícula); sin esto seguía corriendo en segundo plano aunque el
    // visitante ya hubiera bajado hasta el pie de página y el canvas
    // llevara rato fuera de pantalla -- el motivo real de que la
    // navegación se sintiera lenta después de los primeros segundos, no
    // tanto la cantidad de partículas en sí.
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        heroInView = entry.isIntersecting;
        if (heroInView) maybeStart();
        else stop();
      },
      { threshold: 0 }
    );
    sectionObserver.observe(canvas);

    // Cualquiera de los overlays a pantalla completa del sitio (galería,
    // relatos, libros, privacidad...) queda dibujado ENCIMA del hero, no
    // en vez de él -- el hero nunca se desmonta, solo queda tapado. Sin
    // este freno, el canvas (con su shadowBlur, lo más caro de dibujar
    // aquí) seguía animando sin parar detrás del overlay, sin que se
    // viera, justo mientras el visitante además está esperando a que
    // cargue el contenido de ese overlay -- un desperdicio de CPU en el
    // peor momento posible. Todos los overlays bloquean el scroll del
    // body poniendo overflow:hidden (ver useScrollLock.js y los que lo
    // hacen a mano); un MutationObserver sobre ese estilo evita acoplar
    // este componente a la lista de qué overlays existen.
    const overlayObserver = new MutationObserver(() => {
      if (isOverlayLocked()) stop();
      else maybeStart();
    });
    overlayObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    maybeStart();

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      overlayObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-fireworks" aria-hidden="true" />;
}
