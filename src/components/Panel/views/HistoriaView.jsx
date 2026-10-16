import HistoryInfographic from "../../shared/HistoryInfographic.jsx";

// Lo que antes era el contenido de HistoryModal.jsx (la infografía
// completa, HistoryInfographic.jsx, sin cambios) -- se quita el modal
// (fondo oscuro, cierre con X, atrapa-foco) porque ya es una vista del
// panel, no una ventana emergente. Es una pestaña de GroupPanelView.jsx
// (Pirotecnia > Historia): el único <h1> visible de ahí en adelante es
// el del grupo, así que este ya no trae título propio.
export default function HistoriaView() {
  return (
    <div className="panel-view panel-view--anidada">
      <HistoryInfographic />
    </div>
  );
}
