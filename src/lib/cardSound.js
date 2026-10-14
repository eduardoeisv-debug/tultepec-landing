// Tono corto tipo "gota de agua" al voltear una carta del memorama --
// sintetizado con Web Audio (sin archivo de audio que descargar ni
// dependencias nuevas): una nota que cae de tono rápido con un
// decaimiento corto, como un "plin" de gota cayendo.
let ctx = null;

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!ctx) ctx = new AudioContextClass();
  // Los navegadores crean el AudioContext suspendido hasta el primer gesto
  // del usuario -- esta función solo se llama desde un clic, así que
  // reanudarlo aquí siempre cumple con esa política.
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

export function playCardFlipSound() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  } catch {
    /* Web Audio no disponible o bloqueado -- el juego sigue sin sonido. */
  }
}
