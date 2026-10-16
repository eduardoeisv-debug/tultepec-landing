import { useRef, useState } from "react";
import { Play, Mail, CalendarDays, BookOpen, Flame, MapPinned, Users, Image as ImageIcon, Gamepad2, HeartHandshake } from "lucide-react";
import { rutaHash } from "../../hooks/useHashRoute.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import VideoBienvenidaModal from "../shared/VideoBienvenidaModal.jsx";
import Bienvenida from "../Bienvenida/Bienvenida.jsx";
import FinalCTA from "../FinalCTA/FinalCTA.jsx";
import "./InicioCristal.css";

const PASOS = [
  { n: "01", id: "pirotecnia", icon: Flame },
  { n: "02", id: "memorias", icon: BookOpen },
  { n: "03", id: "eventos", icon: CalendarDays },
  { n: "04", id: "visitanos", icon: MapPinned },
];

const NOVEDADES = [
  { icon: Users, label: "menu.opcion.memoriasPueblo", sub: "cristal.novedades.memoriasSub", href: rutaHash("memorias", "pueblo") },
  { icon: ImageIcon, label: "menu.opcion.galeria", sub: "cristal.novedades.galeriaSub", href: rutaHash("pirotecnia", "galeria") },
  { icon: CalendarDays, label: "menu.opcion.calendario", sub: "cristal.novedades.calendarioSub", href: rutaHash("eventos", "calendario") },
  { icon: Gamepad2, label: "menu.item.juegos", sub: "cristal.novedades.juegosSub", href: rutaHash("juegos") },
  { icon: HeartHandshake, label: "menu.item.agradecimientos", sub: "cristal.novedades.agradecimientosSub", href: rutaHash("agradecimientos") },
];

// Vista de Inicio de Menú Cristal: los 4 accesos colgantes, el
// bienvenido centrado con los 4 pasos numerados, la franja de
// "últimas novedades" y, al final, el bloque de me gusta/comentar/
// compartir -- tal como pide el prompt. El video y la carta son los
// componentes EXISTENTES (VideoBienvenidaModal.jsx reutiliza el mismo
// <video>; Bienvenida.jsx es el mismo de siempre, sin tocar), no
// contenido nuevo.
export default function InicioCristal({ titleRef }) {
  const { t } = useLanguage();
  const [videoAbierto, setVideoAbierto] = useState(false);
  const videoTriggerRef = useRef(null);
  const bienvenidaRef = useRef(null);

  const irABienvenida = () => {
    bienvenidaRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="cristal-inicio">
      <div className="cristal-inicio__tiles">
        <button
          type="button"
          ref={videoTriggerRef}
          className="cristal-tile"
          onClick={() => setVideoAbierto(true)}
        >
          <span className="cristal-tile__icono cristal-tile__icono--video" aria-hidden="true">
            <Play size={20} strokeWidth={0} fill="currentColor" />
          </span>
          <b>{t("hero.verBienvenida")}</b>
          <span>1:28</span>
        </button>

        <button type="button" className="cristal-tile" onClick={irABienvenida}>
          <span className="cristal-tile__icono cristal-tile__icono--carta" aria-hidden="true">
            <Mail size={20} strokeWidth={1.8} />
          </span>
          <b>{t("bienvenida.nota.titulo")}</b>
        </button>

        <a className="cristal-tile" href={rutaHash("eventos", "calendario")}>
          <span className="cristal-tile__icono cristal-tile__icono--calendario" aria-hidden="true">
            <CalendarDays size={20} strokeWidth={1.8} />
          </span>
          <b>{t("menu.opcion.calendario")}</b>
          <span>{t("cristal.tiles.calendarioSub")}</span>
        </a>

        <a className="cristal-tile" href={rutaHash("memorias", "pueblo")}>
          <span className="cristal-tile__icono cristal-tile__icono--memorias" aria-hidden="true">
            <BookOpen size={20} strokeWidth={1.8} />
          </span>
          <b>{t("menu.item.memorias")}</b>
          <span>{t("cristal.tiles.memoriasSub")}</span>
        </a>
      </div>

      <div className="cristal-inicio__centro">
        <p className="cristal-inicio__kick2">{t("cristal.inicio.bienvenidosA")}</p>
        <h1 className="cristal-inicio__kick" tabIndex={-1} ref={titleRef}>
          Tultepec
        </h1>
        <p className="cristal-inicio__kick3">{t("cristal.marca.sub")}</p>

        <ul className="cristal-inicio__pasos">
          {PASOS.map((paso) => {
            const Icono = paso.icon;
            return (
              <li key={paso.id}>
                <a href={rutaHash(paso.id)}>
                  <span className="cristal-inicio__paso-n">
                    {t("cristal.paso")} <b>{paso.n}</b>
                  </span>
                  <span className="cristal-inicio__paso-texto">{t(`menu.item.${paso.id}`)}</span>
                  <span className="cristal-inicio__paso-icono" aria-hidden="true">
                    <Icono size={26} strokeWidth={1.6} />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="cristal-inicio__novedades">
        <h2>{t("cristal.novedades.titulo")}</h2>
        <div className="cristal-inicio__novedades-grid">
          {NOVEDADES.map((n) => {
            const Icono = n.icon;
            return (
              <a key={n.label} href={n.href}>
                <Icono size={30} strokeWidth={1.6} aria-hidden="true" />
                <b>{t(n.label)}</b>
                <span>{t(n.sub)}</span>
              </a>
            );
          })}
        </div>
      </div>

      <div className="cristal-inicio__carta" ref={bienvenidaRef}>
        <Bienvenida />
      </div>

      <div className="cristal-inicio__cta">
        <FinalCTA />
      </div>

      <VideoBienvenidaModal open={videoAbierto} onClose={() => setVideoAbierto(false)} triggerRef={videoTriggerRef} />
    </div>
  );
}
