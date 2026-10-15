// Sonido de "misión cumplida", compartido entre los dos juegos -- el
// laberinto del torito al limpiar un nivel o ganar, el memorama al
// encontrar las 8 parejas -- para que la sensación de logro sea la misma
// en los dos. Web Audio sintetizado, mismo recurso que cardSound.js y
// toritoSound.js, con su propio AudioContext.
let ctx = null;

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!ctx) ctx = new AudioContextClass();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

// Arpegio mayor ascendente (Do-Mi-Sol-Do, una octava): C5, E5, G5, C6.
const NOTAS = [523.25, 659.25, 783.99, 1046.5];

export function playVictorySound() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    NOTAS.forEach((freq, i) => {
      const inicio = now + i * 0.1;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, inicio);
      gain.gain.setValueAtTime(0.0001, inicio);
      gain.gain.exponentialRampToValueAtTime(0.18, inicio + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(inicio);
      osc.stop(inicio + 0.36);
    });
  } catch {
    /* Web Audio no disponible o bloqueado -- el juego sigue sin sonido. */
  }
}
