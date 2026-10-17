import { useEffect, useState } from "react";
import { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./TultepecAhora.css";

// Centro de Tultepec, Estado de México -- el 19.685/-99.128 aproximado
// del encargo cae a ~400m del centro real del municipio; se ajusta al
// valor real (mismo patrón que otros ajustes "aprox. -> real" de este
// proyecto).
const LAT = 19.6886;
const LON = -99.1319;

const CACHE_KEY = "tultepec:clima";
const CACHE_MS = 20 * 60 * 1000;
const TIMEOUT_MS = 5000;

// Código WMO (weather_code de Open-Meteo) -> ícono de lucide-react (ya
// usada en todo el proyecto) + texto corto ES/EN. No cubre literalmente
// los ~30 códigos WMO -- agrupados por apariencia visual (p.ej. todas
// las lluvias ligeras/moderadas/intensas comparten ícono), que es lo
// que de verdad distingue la pastilla.
const CLIMA = {
  0: { icon: Sun, es: "Despejado", en: "Clear" },
  1: { icon: CloudSun, es: "Mayormente despejado", en: "Mostly clear" },
  2: { icon: CloudSun, es: "Parcialmente nublado", en: "Partly cloudy" },
  3: { icon: Cloud, es: "Nublado", en: "Cloudy" },
  45: { icon: CloudFog, es: "Niebla", en: "Fog" },
  48: { icon: CloudFog, es: "Niebla", en: "Fog" },
  51: { icon: CloudDrizzle, es: "Llovizna ligera", en: "Light drizzle" },
  53: { icon: CloudDrizzle, es: "Llovizna", en: "Drizzle" },
  55: { icon: CloudDrizzle, es: "Llovizna densa", en: "Dense drizzle" },
  56: { icon: CloudDrizzle, es: "Llovizna helada", en: "Freezing drizzle" },
  57: { icon: CloudDrizzle, es: "Llovizna helada", en: "Freezing drizzle" },
  61: { icon: CloudRain, es: "Lluvia ligera", en: "Light rain" },
  63: { icon: CloudRain, es: "Lluvia", en: "Rain" },
  65: { icon: CloudRain, es: "Lluvia intensa", en: "Heavy rain" },
  66: { icon: CloudRain, es: "Lluvia helada", en: "Freezing rain" },
  67: { icon: CloudRain, es: "Lluvia helada", en: "Freezing rain" },
  71: { icon: CloudSnow, es: "Nieve ligera", en: "Light snow" },
  73: { icon: CloudSnow, es: "Nieve", en: "Snow" },
  75: { icon: CloudSnow, es: "Nieve intensa", en: "Heavy snow" },
  77: { icon: CloudSnow, es: "Granizo fino", en: "Snow grains" },
  80: { icon: CloudRain, es: "Chubascos ligeros", en: "Light showers" },
  81: { icon: CloudRain, es: "Chubascos", en: "Showers" },
  82: { icon: CloudRain, es: "Chubascos intensos", en: "Violent showers" },
  85: { icon: CloudSnow, es: "Chubascos de nieve", en: "Snow showers" },
  86: { icon: CloudSnow, es: "Chubascos de nieve intensos", en: "Heavy snow showers" },
  95: { icon: CloudLightning, es: "Tormenta", en: "Thunderstorm" },
  96: { icon: CloudLightning, es: "Tormenta con granizo", en: "Thunderstorm with hail" },
  99: { icon: CloudLightning, es: "Tormenta con granizo", en: "Thunderstorm with hail" },
};

function formatearHora(idioma) {
  try {
    return new Intl.DateTimeFormat(idioma === "en" ? "en-US" : "es-MX", {
      timeZone: "America/Mexico_City",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date());
  } catch {
    return "";
  }
}

function leerCache() {
  try {
    const crudo = sessionStorage.getItem(CACHE_KEY);
    if (!crudo) return null;
    const datos = JSON.parse(crudo);
    if (Date.now() - datos.ts > CACHE_MS) return null;
    return datos;
  } catch {
    // sessionStorage puede no estar disponible (modo privado, etc.) --
    // se sigue sin cache, solo se pide de nuevo cada vez.
    return null;
  }
}

function guardarCache(datos) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ...datos, ts: Date.now() }));
  } catch {
    // Ignorado a propósito, igual que leerCache.
  }
}

// Pastilla "Tultepec ahora": hora local (siempre, vía Intl.DateTimeFormat
// con timeZone fijo -- no depende de la zona horaria del dispositivo)
// + clima actual (Open-Meteo, sin API key, con cache de 20min en
// sessionStorage). Si el clima falla (sin red, timeout, respuesta
// rara), se queda mostrando solo la hora -- nunca un error visible.
export default function TultepecAhora() {
  const { language, t, pick } = useLanguage();
  const [hora, setHora] = useState(() => formatearHora(language));
  const [clima, setClima] = useState(() => leerCache());
  const [cargando, setCargando] = useState(() => !leerCache());

  useEffect(() => {
    setHora(formatearHora(language));
    const id = setInterval(() => setHora(formatearHora(language)), 60 * 1000);
    return () => clearInterval(id);
  }, [language]);

  useEffect(() => {
    if (leerCache()) {
      setCargando(false);
      return undefined;
    }

    // En desarrollo, StrictMode monta el efecto, lo limpia (abortando
    // este primer fetch) y lo vuelve a montar de inmediato, para
    // detectar justo este tipo de bug -- sin `cancelado`, el .catch()
    // del primer intento (abortado por esa limpieza, no por una falla
    // real) terminaba apagando "cargando" antes de tiempo, aunque el
    // segundo fetch (el que de verdad importa) seguía en curso. Con la
    // bandera, el intento cancelado ya no toca el estado del todo --
    // ni en ese remount de StrictMode, ni si el componente se
    // desmonta de verdad a media petición.
    let cancelado = false;
    const controlador = new AbortController();
    const idTimeout = setTimeout(() => controlador.abort(), TIMEOUT_MS);

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,weather_code&timezone=America%2FMexico_City`,
      { signal: controlador.signal }
    )
      .then((res) => {
        if (!res.ok) throw new Error("clima no disponible");
        return res.json();
      })
      .then((datos) => {
        const temperatura = datos?.current?.temperature_2m;
        const codigo = datos?.current?.weather_code;
        if (typeof temperatura !== "number" || typeof codigo !== "number") {
          throw new Error("respuesta de clima incompleta");
        }
        if (cancelado) return;
        const resultado = { temperatura, codigo };
        setClima(resultado);
        guardarCache(resultado);
      })
      .catch(() => {
        // Sin conexión, timeout o respuesta inesperada: se queda sin
        // clima, solo la hora -- a propósito, sin mostrar nada de esto.
      })
      .finally(() => {
        clearTimeout(idTimeout);
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
      clearTimeout(idTimeout);
      controlador.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const infoClima = clima ? CLIMA[clima.codigo] : null;
  const Icono = infoClima?.icon;

  return (
    <div className="tultepec-ahora" aria-live="off" aria-label={t("tultepecAhora.ariaLabel")}>
      {cargando ? (
        <span className="tultepec-ahora__skeleton" aria-hidden="true" />
      ) : (
        <span className="tultepec-ahora__texto">
          {infoClima && (
            <>
              <Icono className="tultepec-ahora__icono" size={16} strokeWidth={2} aria-hidden="true" />
              <span>
                {Math.round(clima.temperatura)} °C · {pick(infoClima)} ·{" "}
              </span>
            </>
          )}
          {hora}
        </span>
      )}
    </div>
  );
}
