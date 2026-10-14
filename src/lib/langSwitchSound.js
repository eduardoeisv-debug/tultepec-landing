// Tono corto al cambiar entre español e inglés: dos notas breves
// ascendentes, como un interruptor. Web Audio sintetizado, sin archivos
// de audio ni dependencias nuevas -- mismo recurso que ya usan
// cardSound.js y toritoSound.js, con su propio AudioContext.
let ctx = null;

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!ctx) ctx = new AudioContextClass();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

export function playLangSwitchSound() {
  const audioCtx = getContext();
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    [660, 880].forEach((freq, i) => {
      const start = now + i * 0.055;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.14, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.07);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.08);
    });
  } catch {
    /* Web Audio no disponible o bloqueado -- el cambio de idioma sigue funcionando sin sonido. */
  }
}
