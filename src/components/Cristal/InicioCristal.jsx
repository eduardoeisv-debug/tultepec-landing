import { rutaHash } from "../../hooks/useHashRoute.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import SECTIONS from "../../data/sections.js";
import HeroCristal from "./HeroCristal.jsx";
import Bienvenida from "../Bienvenida/Bienvenida.jsx";
import CierreComun from "./CierreComun.jsx";
import TultepecAhora from "./TultepecAhora.jsx";
import "./InicioCristal.css";

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

  return (
    <div className="cristal-inicio">
      <TultepecAhora />

      <div className="cristal-bento">
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

          // "Próximamente" (Museos, Gastronomía, Música): tarjeta
          // atenuada con su etiqueta, sin <a>/href -- no navega a
          // ningún lado, igual que sus filas en el menú lateral (ver
          // ColumnaCristal.jsx).
          return esProximamente ? (
            <div key={item.id} className="cristal-bento__tile is-proximamente" style={estilo} aria-disabled="true">
              {contenido}
            </div>
          ) : (
            <a key={item.id} className="cristal-bento__tile" href={rutaHash(item.id)} style={estilo}>
              {contenido}
            </a>
          );
        })}
      </div>

      <CierreComun ctaClassName="cristal-inicio__cta" />
    </div>
  );
}
