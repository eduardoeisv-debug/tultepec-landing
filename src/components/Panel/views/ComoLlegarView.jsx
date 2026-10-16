import ComoLlegarBlock from "../../VisitInfo/ComoLlegarBlock.jsx";
import "../../VisitInfo/VisitInfo.css";

// El mapa que antes vivía dentro de "Planea tu visita" (VisitInfo.jsx)
// -- ComoLlegarBlock.jsx no se tocó, solo se reubicó.
export default function ComoLlegarView() {
  return (
    <div className="panel-view panel-view--anidada">
      <div className="visit-info__block">
        <ComoLlegarBlock />
      </div>
    </div>
  );
}
