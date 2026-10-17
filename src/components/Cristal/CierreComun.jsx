import FinalCTA from "../FinalCTA/FinalCTA.jsx";

// Cierre que comparten Inicio (InicioCristal.jsx) y las vistas internas
// (Seccion.jsx): el bloque de me gusta/comentar/compartir (FinalCTA).
// El pie de página (Footer) ya NO vive aquí -- CristalShell.jsx lo
// renderiza una sola vez, fuera del <ErrorBoundary key=.../> que se
// remonta en cada cambio de ruta, para que no desaparezca ni tarde en
// volver a aparecer mientras el chunk de la vista nueva (React.lazy)
// todavía se está descargando. `ctaClassName` es el margen/ancho
// propio de cada contexto (.cristal-sec__cta vs .cristal-inicio__cta,
// con reglas distintas en cada CSS), para no cambiar el aspecto que ya
// tenía cada uno.
export default function CierreComun({ ctaClassName }) {
  return (
    <div className={ctaClassName}>
      <FinalCTA />
    </div>
  );
}
