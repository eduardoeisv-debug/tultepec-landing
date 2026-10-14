// Sonidos suaves para el laberinto del torito: un "tic" breve al comer
// una chispa (puede repetirse muchas veces por segundo, así que sigue
// siendo corto) y un silbido ascendente al comerse un castillo y
// volverse poderoso. Web Audio sintetizado, sin archivos de audio ni
// dependencias nuevas -- mismo recurso que ya usa src/lib/cardSound.js
// para el memorama, con su propio AudioContext.
let ctx = null;

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!ctx) ctx = new AudioContextClass();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

export function playSparkSound() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(1500, now);
    osc.frequency.exponentialRampToValueAtTime(1150, now + 0.05);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.11, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    /* Web Audio no disponible o bloqueado -- el juego sigue sin sonido. */
  }
}

export function playPowerUpSound() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.28);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.19, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.34);
  } catch {
    /* Web Audio no disponible o bloqueado -- el juego sigue sin sonido. */
  }
}
