import useHashRoute from "../../hooks/useHashRoute.js";
import SidebarMenu from "./SidebarMenu.jsx";
import ContentPanel from "../Panel/ContentPanel.jsx";
import "./Layout.css";

// Rejilla de dos columnas: menú lateral (SidebarMenu.jsx, 380px, fijo
// al hacer scroll en escritorio) + panel de contenido (ContentPanel.jsx,
// que resuelve qué vista mostrar según la ruta). En celular se vuelve
// una sola columna -- el acordeón general de SidebarMenu.jsx hace el
// trabajo de "una sola columna, menú plegable arriba", no hace falta
// nada especial aquí para eso, solo la rejilla CSS (ver Layout.css).
export default function Layout({ onOpenPrivacy }) {
  const ruta = useHashRoute();

  return (
    <main className="layout">
      <div className="container layout__grid">
        <SidebarMenu ruta={ruta} />
        <ContentPanel ruta={ruta} onOpenPrivacy={onOpenPrivacy} />
      </div>
    </main>
  );
}
