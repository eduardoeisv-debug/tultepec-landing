import { Component } from "react";

// Red de seguridad alrededor del contenido de la ruta activa. Las
// vistas pesadas se cargan con React.lazy (ver REGISTRO en
// CristalShell.jsx); si su chunk no logra descargarse -- el caso
// típico es que el sitio se haya vuelto a desplegar mientras esta
// pestaña ya estaba abierta, y el navegador pida un archivo con el
// hash de la build vieja que el servidor ya no tiene -- la promesa de
// import() rechaza. Sin un límite de error, React desmonta TODO el
// árbol y la pantalla se queda en blanco, sin ningún aviso; con este
// límite se ve un mensaje con un botón para recargar (que sí trae la
// build nueva) en vez de una pantalla muerta. CristalShell.jsx lo
// vuelve a montar con key=ruta en cada cambio de ruta, así que un
// error en una vista no deja atascadas a las demás.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { tieneError: false };
  }

  static getDerivedStateFromError() {
    return { tieneError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.tieneError) return this.props.fallback;
    return this.props.children;
  }
}
