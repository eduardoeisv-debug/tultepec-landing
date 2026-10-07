import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STRINGS } from "./strings.js";

const LanguageContext = createContext(null);
const STORAGE_KEY = "tultepec:lang";

function detectInitialLanguage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "es" || stored === "en") return stored;
  } catch {
    // localStorage puede no estar disponible (modo privado, etc.) -- se
    // sigue con el valor por defecto sin romper nada.
  }
  return "es";
}

// Contexto de idioma para toda la app: guarda la preferencia en
// localStorage, actualiza <html lang="..."> (importante para lectores de
// pantalla y para que el navegador no intente traducir una página que ya
// está en el idioma correcto), y expone `t(key)` para textos de UI fijos.
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(detectInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language === "en" ? "en" : "es-MX";
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignorado a propósito -- ver nota en detectInitialLanguage.
    }
  }, [language]);

  const value = useMemo(() => {
    const setLanguage = (lang) => setLanguageState(lang === "en" ? "en" : "es");
    const toggleLanguage = () => setLanguageState((prev) => (prev === "es" ? "en" : "es"));
    const t = (key, vars) => {
      const entry = STRINGS[key];
      if (!entry) {
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn(`[i18n] Falta la llave "${key}" en src/i18n/strings.js`);
        }
        return key;
      }
      const text = entry[language] ?? entry.es ?? key;
      if (!vars) return text;
      // Sustituye placeholders "{nombre}" por el valor de vars.nombre --
      // usado por textos con datos dinámicos (contadores, nombres de mes...).
      return text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
    };
    // Para campos bilingües dentro de los archivos de datos (fiestas.js,
    // content.js, etc.), que ya vienen como { es, en } en vez de vivir en
    // el diccionario STRINGS.
    const pick = (field) => {
      if (field == null) return field;
      if (typeof field === "string") return field;
      return field[language] ?? field.es ?? "";
    };
    return { language, setLanguage, toggleLanguage, t, pick };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage debe usarse dentro de <LanguageProvider>");
  return ctx;
}
