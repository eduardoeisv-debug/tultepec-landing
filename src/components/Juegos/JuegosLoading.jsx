import "./Juegos.css";

// Reserva la altura aproximada de la sección "Juegos" mientras el chunk
// diferido (Juegos.jsx + los dos minijuegos) termina de descargarse --
// sin esto, el contenido de abajo (FinalCTA) brincaría hacia abajo en
// cuanto el chunk cargara. Sin spinner a pantalla completa: solo el
// fondo nocturno de la sección, para que el salto visual al terminar de
// cargar sea mínimo.
export default function JuegosLoading() {
  return <div className="juegos juegos-loading" aria-hidden="true" />;
}
