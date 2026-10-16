import { Suspense } from "react";
import { Menu as MenuIcon } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import FinalCTA from "../FinalCTA/FinalCTA.jsx";
import Footer from "../Footer/Footer.jsx";
import "./Seccion.css";

// Envoltura genérica de cualquier vista que no sea Inicio ni el aviso
// de privacidad: miga de pan (nombre del grupo en dorado), h2 (nombre
// de la subopción, o del grupo si no tiene) y el contenido real
// debajo -- `Vista` es el componente ya existente del sitio (sin su
// propio título, ver HistoriaView.jsx y compañía), o null si la
// opción todavía no existe (aviso "Próximamente"). El pie y el bloque
// de compartir van SIEMPRE al final de estas vistas internas (nunca en
// Inicio, ver InicioCristal.jsx).
//
// El botón "Menú" solo se ve en celular (CSS, ver Seccion.css) -- en
// escritorio la columna ya está siempre visible al lado, no hace
// falta un botón para volver a ella.
export default function Seccion({ eyebrow, titulo, Vista, titleRef, onOpenPrivacy, onAbrirMenu }) {
  const { t } = useLanguage();
  return (
    <div className="cristal-sec">
      <button type="button" className="cristal-sec__menu-boton" onClick={onAbrirMenu}>
        <MenuIcon size={16} strokeWidth={2} aria-hidden="true" />
        {t("menu.header.titulo")}
      </button>

      <span className="cristal-sec__pill">{eyebrow}</span>
      <h2 className="cristal-sec__titulo" tabIndex={-1} ref={titleRef}>
        {titulo}
      </h2>

      <Suspense fallback={<div className="cristal-sec__cargando" aria-hidden="true" />}>
        {Vista ? (
          <Vista onOpenPrivacy={onOpenPrivacy} />
        ) : (
          <p className="cristal-sec__proximamente">{t("cristal.seccion.proximamente")}</p>
        )}
      </Suspense>

      <div className="cristal-sec__cta">
        <FinalCTA />
      </div>
      <Footer onOpenPrivacy={onOpenPrivacy} />
    </div>
  );
}
