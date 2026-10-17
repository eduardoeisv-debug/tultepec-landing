import { CalendarDays, BookOpen, Flame, MapPinned, Users, Image as ImageIcon, Gamepad2, HeartHandshake } from "lucide-react";
import { rutaHash } from "../../hooks/useHashRoute.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import HeroCristal from "./HeroCristal.jsx";
import Bienvenida from "../Bienvenida/Bienvenida.jsx";
import FinalCTA from "../FinalCTA/FinalCTA.jsx";
import "./InicioCristal.css";

// Los 4 pasos numerados de antes + "últimas novedades" ahora son un
// solo set de accesos directos (mismo trato visual: ícono + rótulo,
// con o sin bajada según tenga texto de más) para las tarjetas chicas
// del Bento de abajo -- ver cristal-bento__tile en InicioCristal.css.
// El color del ícono rota entre 5 tonos ya usados en el resto del
// sitio (ver --c0..--c4 ahí mismo) solo por variedad visual, no tiene
// significado por sección.
const ACCESOS = [
  { key: "pirotecnia", label: "menu.item.pirotecnia", icon: Flame, href: rutaHash("pirotecnia") },
  { key: "memorias", label: "menu.item.memorias", icon: BookOpen, href: rutaHash("memorias") },
  { key: "eventos", label: "menu.item.eventos", icon: CalendarDays, href: rutaHash("eventos") },
  { key: "visitanos", label: "menu.item.visitanos", icon: MapPinned, href: rutaHash("visitanos") },
  {
    key: "memoriasPueblo",
    label: "menu.opcion.memoriasPueblo",
    sub: "cristal.novedades.memoriasSub",
    icon: Users,
    href: rutaHash("memorias", "pueblo"),
  },
  {
    key: "galeria",
    label: "menu.opcion.galeria",
    sub: "cristal.novedades.galeriaSub",
    icon: ImageIcon,
    href: rutaHash("pirotecnia", "galeria"),
  },
  {
    key: "calendario",
    label: "menu.opcion.calendario",
    sub: "cristal.novedades.calendarioSub",
    icon: CalendarDays,
    href: rutaHash("eventos", "calendario"),
  },
  { key: "juegos", label: "menu.item.juegos", sub: "cristal.novedades.juegosSub", icon: Gamepad2, href: rutaHash("juegos") },
  {
    key: "agradecimientos",
    label: "menu.item.agradecimientos",
    sub: "cristal.novedades.agradecimientosSub",
    icon: HeartHandshake,
    href: rutaHash("agradecimientos"),
  },
];

// Vista de Inicio de Menú Cristal, en Bento Grid: una tarjeta grande
// (HeroCristal.jsx -- el relato + la portada del video), la tarjeta
// de "Una carta para ti" (Bienvenida.jsx, con su propio cristal en
// vez del degradado que traía cuando era su propia sección de ancho
// completo) y las tarjetas chicas de ACCESOS, todo dentro de la misma
// rejilla asimétrica (.cristal-bento, ver el CSS). El bloque de me
// gusta/comentar/compartir se queda fuera de la rejilla, al final. El
// <h1> real (el único de esta vista) vive dentro de HeroCristal.
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

        {ACCESOS.map((item, i) => {
          const Icono = item.icon;
          return (
            <a key={item.key} className={`cristal-bento__tile cristal-bento__tile--c${i % 5}`} href={item.href}>
              <span className="cristal-bento__tile-icono" aria-hidden="true">
                <Icono size={22} strokeWidth={1.8} />
              </span>
              <b>{t(item.label)}</b>
              {item.sub && <span>{t(item.sub)}</span>}
            </a>
          );
        })}
      </div>

      <div className="cristal-inicio__cta">
        <FinalCTA />
      </div>
    </div>
  );
}
