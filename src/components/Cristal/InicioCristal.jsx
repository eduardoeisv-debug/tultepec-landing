import { Ticket, BookOpen, Flame, MapPinned, Users, Image as ImageIcon, CalendarDays, Gamepad2, HeartHandshake } from "lucide-react";
import { rutaHash } from "../../hooks/useHashRoute.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import HeroCristal from "./HeroCristal.jsx";
import Bienvenida from "../Bienvenida/Bienvenida.jsx";
import CierreComun from "./CierreComun.jsx";
import "./InicioCristal.css";

// Los 4 pasos numerados de antes + "últimas novedades" ahora son un
// solo set de accesos directos (mismo trato visual: ícono + rótulo,
// con o sin bajada según tenga texto de más) para las tarjetas chicas
// del Bento de abajo -- ver cristal-bento__tile en InicioCristal.css.
// `color`/`ink` (fondo del círculo del ícono y el color del ícono en
// sí, vía --icon-color/--icon-ink) van por DESTINO, no por índice de
// la lista -- antes rotaban con `i % 5` y, al ser 9 tarjetas para solo
// 5 tonos, terminaban repitiendo color entre secciones que no tienen
// nada que ver (p.ej. Memorias y "Calendario por mes" quedaban con el
// mismo). Aquí cada una de las 6 secciones reales (pirotecnia,
// memorias, eventos, visitanos, juegos, agradecimientos) tiene su
// propio tono fijo, y un acceso que es subopción de una de ellas
// (memoriasPueblo, galeria, calendario) comparte el de su sección a
// propósito -- es la MISMA sección, no una distinta.
const ACCESOS = [
  { key: "pirotecnia", label: "menu.item.pirotecnia", icon: Flame, href: rutaHash("pirotecnia"), color: "var(--color-terracotta)", ink: "#fff" },
  { key: "memorias", label: "menu.item.memorias", icon: BookOpen, href: rutaHash("memorias"), color: "var(--color-gold)", ink: "#14163a" },
  // Antes compartía CalendarDays con "Calendario por mes" de abajo --
  // mismo ícono para dos tarjetas distintas en la misma rejilla.
  { key: "eventos", label: "menu.item.eventos", icon: Ticket, href: rutaHash("eventos"), color: "var(--color-fire-red)", ink: "#fff" },
  { key: "visitanos", label: "menu.item.visitanos", icon: MapPinned, href: rutaHash("visitanos"), color: "var(--color-turquoise)", ink: "#14163a" },
  {
    key: "memoriasPueblo",
    label: "menu.opcion.memoriasPueblo",
    sub: "cristal.novedades.memoriasSub",
    icon: Users,
    href: rutaHash("memorias", "pueblo"),
    color: "var(--color-gold)",
    ink: "#14163a",
  },
  {
    key: "galeria",
    label: "menu.opcion.galeria",
    sub: "cristal.novedades.galeriaSub",
    icon: ImageIcon,
    href: rutaHash("pirotecnia", "galeria"),
    color: "var(--color-terracotta)",
    ink: "#fff",
  },
  {
    key: "calendario",
    label: "menu.opcion.calendario",
    sub: "cristal.novedades.calendarioSub",
    icon: CalendarDays,
    href: rutaHash("eventos", "calendario"),
    color: "var(--color-fire-red)",
    ink: "#fff",
  },
  {
    key: "juegos",
    label: "menu.item.juegos",
    sub: "cristal.novedades.juegosSub",
    icon: Gamepad2,
    href: rutaHash("juegos"),
    color: "var(--color-pink)",
    ink: "#fff",
  },
  {
    key: "agradecimientos",
    label: "menu.item.agradecimientos",
    sub: "cristal.novedades.agradecimientosSub",
    icon: HeartHandshake,
    href: rutaHash("agradecimientos"),
    color: "var(--color-violet)",
    ink: "#fff",
  },
];

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

  return (
    <div className="cristal-inicio">
      <div className="cristal-bento">
        <div className="cristal-bento__principal">
          <HeroCristal titleRef={titleRef} />
        </div>

        <div className="cristal-bento__carta">
          <Bienvenida className="bienvenida--bento" />
        </div>

        {ACCESOS.map((item) => {
          const Icono = item.icon;
          // Agradecimientos (siempre el último acceso): tarjeta ancha
          // en celular (ocupa las 2 columnas) en vez de 1 como las
          // otras 8 -- mismo molde vertical centrado que todas, solo
          // más ancha. Ver .cristal-bento__tile--ancho.
          const esAncho = item.key === "agradecimientos";
          return (
            <a
              key={item.key}
              className={`cristal-bento__tile${esAncho ? " cristal-bento__tile--ancho" : ""}`}
              href={item.href}
              style={{ "--icon-color": item.color, "--icon-ink": item.ink }}
            >
              <span className="cristal-bento__tile-icono icono-3d" aria-hidden="true">
                <Icono size={25} strokeWidth={1.8} />
              </span>
              <span className="cristal-bento__tile-texto">
                <b>{t(item.label)}</b>
                {item.sub && <span>{t(item.sub)}</span>}
              </span>
            </a>
          );
        })}
      </div>

      <CierreComun ctaClassName="cristal-inicio__cta" />
    </div>
  );
}
