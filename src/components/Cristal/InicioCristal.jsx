import { useEffect, useRef, useState } from "react";
import { rutaHash } from "../../hooks/useHashRoute.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import { consumirVueltaPendiente } from "../../hooks/useVolverASecciones.js";
import SECTIONS from "../../data/sections.js";
import HeroCristal from "./HeroCristal.jsx";
import Bienvenida from "../Bienvenida/Bienvenida.jsx";
import CierreComun from "./CierreComun.jsx";
import TultepecAhora from "./TultepecAhora.jsx";
import "./InicioCristal.css";

// Cuánto dura el resaltado del ícono al volver desde una sección (ver
// el efecto de montaje más abajo) -- dentro del rango de 1.5-2s pedido.
const DURACION_RESALTADO_MS = 1800;

// Mismas 8 secciones que showInHome en sections.js (la fuente única
// que también lee el menú lateral, ver ColumnaCristal.jsx) -- ya no
// hay un ACCESOS propio de Inicio que se pueda desincronizar de esa
// lista. "Galería de imágenes" (subopción de Pirotecnia) y
// "Agradecimientos" (va solo en el pie, ver Footer.jsx) ya no tienen
// tarjeta suelta aquí -- Agradecimientos sigue alcanzable en 2 clics
// (Pirotecnia/el ítem que sea -> su resumen de grupo), así que no hizo
// falta un acceso directo aparte dentro de la tarjeta de Pirotecnia.
const ACCESOS = SECTIONS.filter((s) => s.showInHome);

// Vista de Inicio de Menú Cristal, en Bento Grid: una tarjeta grande
// (HeroCristal.jsx -- el relato + la portada del video), la tarjeta
// de "Una carta para ti" (Bienvenida.jsx, con su propio cristal en
// vez del degradado que traía cuando era su propia sección de ancho
// completo) y las tarjetas chicas de ACCESOS, todo dentro de la misma
// rejilla asimétrica (.cristal-bento, ver el CSS). El cierre (me
// gusta/comentar/compartir + pie de página, CierreComun.jsx -- el
// mismo que usan las vistas internas, ver Seccion.jsx) se queda fuera
// de la rejilla, al final. El <h1> real (el único de esta vista) vive
// dentro de HeroCristal.
export default function InicioCristal({ titleRef }) {
  const { t } = useLanguage();
  const bentoRef = useRef(null);
  const [resaltarId, setResaltarId] = useState(null);
  // Cachea lo leído de consumirVueltaPendiente() (ver más abajo) --
  // StrictMode vuelve a invocar este efecto una vez en desarrollo
  // (monta, limpia, monta de nuevo) y esa segunda pasada encontraría el
  // valor del módulo ya vacío (lo consumió la primera), dejando el
  // resaltado sin su setTimeout de cierre y el foco sin aplicarse de
  // verdad. Con el valor cacheado aquí, las dos pasadas hacen el mismo
  // trabajo -- la segunda (la que de verdad sobrevive) es la que deja
  // su temporizador en pie.
  const pendienteRef = useRef(undefined);

  // Al llegar aquí desde el enlace/botón "Secciones" de una sección
  // (ver Seccion.jsx y useVolverASecciones.js): hace scroll hasta el
  // ícono de la sección de la que venimos (o, si no tiene tarjeta
  // propia en Inicio -- Agradecimientos, Acerca de, el aviso de
  // privacidad -- hasta el primer ícono de la cuadrícula) y lo resalta
  // un momento. Solo en el montaje: esta vista se remonta por completo
  // en cada cambio de ruta (key en CristalShell.jsx), así que un
  // useEffect sin dependencias ya cubre "cada vez que se entra a
  // Inicio" sin falsos disparos.
  useEffect(() => {
    if (pendienteRef.current === undefined) {
      pendienteRef.current = consumirVueltaPendiente();
    }
    const pendiente = pendienteRef.current;
    if (!pendiente) return undefined;
    const grid = bentoRef.current;
    if (!grid) return undefined;

    const tileObjetivo = pendiente.seccionId && grid.querySelector(`[data-section-id="${pendiente.seccionId}"]`);
    const destino = tileObjetivo || grid.querySelector("[data-section-id]");
    if (!destino) return undefined;

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    destino.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    if (destino.matches("a, [tabindex]")) destino.focus({ preventScroll: true });

    if (!tileObjetivo) return undefined;
    setResaltarId(pendiente.seccionId);
    const idTimeout = setTimeout(() => setResaltarId(null), DURACION_RESALTADO_MS);
    return () => clearTimeout(idTimeout);
  }, []);

  return (
    <div className="cristal-inicio">
      <TultepecAhora />

      <div className="cristal-bento" ref={bentoRef}>
        <div className="cristal-bento__principal">
          <HeroCristal titleRef={titleRef} />
        </div>

        <div className="cristal-bento__carta">
          <Bienvenida className="bienvenida--bento" />
        </div>

        {ACCESOS.map((item) => {
          const Icono = item.homeIcon;
          const esProximamente = item.estado === "proximamente";
          const estilo = { "--icon-color": item.homeColor, "--icon-ink": item.homeInk };
          const contenido = (
            <>
              <span className="cristal-bento__tile-icono icono-3d" aria-hidden="true">
                <Icono size={25} strokeWidth={1.8} />
              </span>
              <span className="cristal-bento__tile-texto">
                <b>{t(item.label)}</b>
                {item.homeSub && <span>{t(item.homeSub)}</span>}
                {esProximamente && <span className="cristal-bento__badge">{t("menu.proximamente.badge")}</span>}
              </span>
            </>
          );
          const claseResaltado = resaltarId === item.id ? " is-resaltado" : "";

          // "Próximamente" (Museos, Gastronomía, Música): tarjeta
          // atenuada con su etiqueta, sin <a>/href -- no navega a
          // ningún lado, igual que sus filas en el menú lateral (ver
          // ColumnaCristal.jsx).
          return esProximamente ? (
            <div
              key={item.id}
              className={`cristal-bento__tile is-proximamente${claseResaltado}`}
              style={estilo}
              aria-disabled="true"
              data-section-id={item.id}
            >
              {contenido}
            </div>
          ) : (
            <a
              key={item.id}
              className={`cristal-bento__tile${claseResaltado}`}
              href={rutaHash(item.id)}
              style={estilo}
              data-section-id={item.id}
            >
              {contenido}
            </a>
          );
        })}
      </div>

      <CierreComun ctaClassName="cristal-inicio__cta" />
    </div>
  );
}
