import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const SoundContext = createContext(null);
const STORAGE_KEY = "tultepec:sonido";
const VOLUMEN = 0.3;

function leerPreferenciaInicial() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // localStorage puede no estar disponible (modo privado, etc.) -- se
    // sigue apagado por defecto sin romper nada, igual que LanguageContext.jsx.
    return false;
  }
}

// Contexto de sonido para toda la app: un "tap" corto y discreto al
// tocar botones/tarjetas de la navegación -- apagado por defecto, con
// la preferencia guardada en localStorage. El tono se sintetiza con
// Web Audio API en vez de cargar un archivo de audio -- no hay nada
// que precargar ni una ruta que se pueda romper, y de todos modos los
// navegadores exigen crear/retomar el AudioContext dentro de un gesto
// del usuario (un clic), que es justo donde vive playTap().
export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(leerPreferenciaInicial);
  const audioCtxRef = useRef(null);
  const activoRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
    } catch {
      // Ignorado a propósito -- ver nota en leerPreferenciaInicial.
    }
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((prev) => !prev), []);

  // Tono corto tipo "clic" (envolvente de ~90ms: ataque rápido + caída
  // exponencial) en vez de un simple on/off -- así no truena al
  // empezar ni al cortarse. Si ya hay uno sonando, se corta primero en
  // vez de dejar que se encimen -- tocar varias filas del menú rápido
  // seguido sonaba a ruido superpuesto sin esto.
  const playTap = useCallback(() => {
    if (!enabled) return;
    const AudioContextClase = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClase) return;

    if (!audioCtxRef.current) audioCtxRef.current = new AudioContextClase();
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();

    if (activoRef.current) {
      const previo = activoRef.current;
      activoRef.current = null;
      previo.gain.gain.cancelScheduledValues(ctx.currentTime);
      previo.gain.gain.setValueAtTime(0, ctx.currentTime);
      previo.osc.stop(ctx.currentTime);
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(VOLUMEN, ctx.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);

    activoRef.current = { osc, gain };
    osc.onended = () => {
      if (activoRef.current?.osc === osc) activoRef.current = null;
    };
  }, [enabled]);

  const value = useMemo(() => ({ enabled, toggle, playTap }), [enabled, toggle, playTap]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound debe usarse dentro de <SoundProvider>");
  return ctx;
}
