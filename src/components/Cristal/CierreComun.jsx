import FinalCTA from "../FinalCTA/FinalCTA.jsx";
import Footer from "../Footer/Footer.jsx";

// Cierre que comparten Inicio (InicioCristal.jsx) y las vistas internas
// (Seccion.jsx): el bloque de me gusta/comentar/compartir (FinalCTA) y
// el pie de página (Footer, con el aviso del proyecto, la tarjeta de
// agradecimiento, el logo "Hecho por EA" y el enlace al Aviso de
// privacidad). Antes solo vivía en Seccion.jsx -- Inicio se quedaba
// sin pie. `ctaClassName` es el margen/ancho propio de cada contexto
// (.cristal-sec__cta vs .cristal-inicio__cta, con reglas distintas en
// cada CSS), para no cambiar el aspecto que ya tenía cada uno.
export default function CierreComun({ ctaClassName, onOpenPrivacy }) {
  return (
    <>
      <div className={ctaClassName}>
        <FinalCTA />
      </div>
      <Footer onOpenPrivacy={onOpenPrivacy} />
    </>
  );
}
