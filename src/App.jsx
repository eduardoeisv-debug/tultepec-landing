import { Analytics } from "@vercel/analytics/react";
import ClickFireworks from "./components/shared/ClickFireworks.jsx";
import CristalShell from "./components/Cristal/CristalShell.jsx";

// Menú Cristal: columna fija + contenido de la ruta activa, todo
// dentro de CristalShell.jsx (ver ese archivo). Ya no hay encabezado
// ni pie globales aparte -- la marca y el selector de idioma viven en
// la columna, y el pie solo aparece al final de cada vista interna
// (Seccion.jsx), nunca en Inicio. El aviso de privacidad y "Comparte
// tu memoria" dejaron de ser modales de App.jsx: el primero es una
// ruta propia (#/privacidad) y el segundo ya vivía como pestaña dentro
// de Memorias desde antes de este cambio.
export default function App() {
  return (
    <>
      <ClickFireworks />
      <CristalShell />
      <Analytics />
    </>
  );
}
