import { useEffect, useRef, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import CartaContenido from "./CartaContenido.jsx";
import "./Bienvenida.css";

// Solapa de sobre (línea dorada): reemplaza el borde en zigzag rosa
// fucsia de antes, ajeno a la paleta del sitio. Un solo triángulo (no
// una fila repetida de dientes) desde las dos esquinas superiores
// hasta un punto central, como la solapa de un sobre real visto de
// frente. viewBox fijo + preserveAspectRatio="none" para que se
// estire al ancho real de quien la use en cualquier pantalla. El
// recorte a las esquinas redondeadas (para que la línea arranque justo
// en la esquina, no por fuera de su curva) vive en el CSS de cada
// quien la usa, con un border-radius + overflow:hidden ahí -- mismo
// radio que el contenedor, así que las dos curvas coinciden exactas.
// Relleno dorado muy tenue (6%, opcional por encargo) para darle
// volumen al triángulo, no solo una línea.
//
// Exportada (ya no local de este archivo): CartaSheet.jsx (la hoja
// inferior de celular) también la usa como su propio encabezado, para
// conservar el mismo lenguaje visual en los dos contextos.
export function SobreSolapa() {
  return (
    <svg className="bienvenida-carta__solapa" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
      <path d="M1,1 L200,57 L399,1" fill="rgba(243, 205, 122, 0.07)" />
    </svg>
  );
}

// "Carta de bienvenida": va justo después del hero dentro de InicioView
// (ver src/components/Panel/views/InicioView.jsx) y de InicioCristal.jsx
// (el Bento de Inicio). Empieza compacta, como una nota con solapa de
// papel picado: al tocarla se abre y muestra el mensaje completo (dos
// columnas desde 860px); al salir de la pantalla (scroll) se vuelve a
// compactar sola, igual que el laberinto del torito se pausa solo al
// salir de vista -- así no queda desplegada todo el tiempo, solo
// mientras alguien la está viendo.
//
// Solo en escritorio: en celular esta tarjeta ya no existe en Inicio
// (display:none, ver Bienvenida.css) -- la carta se mudó a la barra
// inferior fija (botón "Carta", BottomNav.jsx) y se abre como hoja
// inferior (CartaSheet.jsx), que reutiliza CartaContenido igual que
// este acordeón, así que el texto nunca se desincroniza entre los dos.
export default function Bienvenida({ className = "" }) {
  const { t } = useLanguage();
  const [abierta, setAbierta] = useState(false);
  const [resaltar, setResaltar] = useState(false);
  const seccionRef = useRef(null);
  // Espejo de `abierta` legible dentro del observer sin tener que
  // reconstruirlo cada vez que cambia (su efecto solo se monta una vez).
  const abiertaRef = useRef(false);
  // Para no repetir la animación de aviso ni siquiera si la sección
  // vuelve a entrar en pantalla más tarde en la misma visita.
  const yaAvisadoRef = useRef(false);

  useEffect(() => {
    abiertaRef.current = abierta;
  }, [abierta]);

  useEffect(() => {
    const el = seccionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;
    const reduceMotion =
      typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) {
          setAbierta(false);
          return;
        }
        // Primera vez que la nota entra en pantalla: un aviso breve (ícono
        // + brillo del borde), una sola vez por visita, y solo si todavía
        // está cerrada -- si ya la abrieron no hace falta llamar la
        // atención hacia algo que ya vieron.
        if (!reduceMotion && !yaAvisadoRef.current && !abiertaRef.current) {
          yaAvisadoRef.current = true;
          setResaltar(true);
          setTimeout(() => setResaltar(false), 1200);
        }
      },
      { threshold: 0 }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <section
      className={`bienvenida${className ? ` ${className}` : ""}`}
      id="bienvenida"
      aria-labelledby="bienvenida-nota-titulo"
      ref={seccionRef}
    >
      <div className="container bienvenida__inner">
        <button
          type="button"
          className={`bienvenida__nota${abierta ? " is-abierta" : ""}${resaltar ? " is-resaltada" : ""}`}
          onClick={() => {
            setResaltar(false);
            setAbierta((a) => !a);
          }}
          aria-expanded={abierta}
          aria-controls="bienvenida-contenido"
        >
          <SobreSolapa />
          <span className="bienvenida__nota-cuerpo">
            <span className="bienvenida__nota-icono icono-3d" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M4 7l8 6 8-6" />
              </svg>
            </span>
            <span className="bienvenida__nota-texto">
              <span className="bienvenida__nota-titulo" id="bienvenida-nota-titulo">
                {t("bienvenida.nota.titulo")}
              </span>
              <span className="bienvenida__nota-hint">{t(abierta ? "bienvenida.ocultarNota" : "bienvenida.leerNota")}</span>
            </span>
            {/* ChevronRight, no una flecha hacia abajo: apunta "hacia
                adelante" en reposo (misma señal de "desplegable" que
                el resto del sitio) y gira 90° al abrir (ver CSS) para
                apuntar hacia abajo -- ya no es un simple basculamiento
                180°/arriba-abajo. */}
            <ChevronRight className="bienvenida__nota-chevron" size={20} strokeWidth={2} aria-hidden="true" />
          </span>
        </button>

        <div className={`bienvenida__acordeon${abierta ? " is-abierta" : ""}`} id="bienvenida-contenido">
          <div className="bienvenida__acordeon-inner" inert={!abierta}>
            {/* .bienvenida__revelar (Bienvenida.css): la animación de
                aparición al abrir vive aquí, no en CartaContenido/
                .bienvenida-carta -- esas clases se comparten con
                CartaSheet.jsx (la hoja de celular), que no tiene el
                ancestro .bienvenida__acordeon.is-abierta que la dispara. */}
            <div className="bienvenida__revelar">
              <CartaContenido />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
