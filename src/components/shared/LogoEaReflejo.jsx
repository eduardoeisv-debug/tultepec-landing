import "./LogoEaReflejo.css";

// Logo EA (logo-ea.svg) con su reflejo debajo -- extraído de
// Footer.jsx ("Hecho por EA" del pie) para poder reutilizar la misma
// técnica también en el cierre de la carta (CartaInfografia.jsx), tal
// como se pidió explícitamente. `size`: ancho/alto del ícono en px (72
// en el pie, 104 en el cierre de la carta) -- el resto de las medidas
// (alto del reflejo, línea, resplandor) se calculan a partir de esta
// misma variable, vía --logo-ea-size, así que los dos usos quedan
// proporcionalmente idénticos sin duplicar números.
//
// El reflejo se pinta como background-image (no <img>) a propósito:
// un SVG usado como imagen de fondo/máscara se renderiza en modo
// ESTÁTICO en todos los motores (Chromium, WebKit, Gecko) -- el pulso
// de los 3 nodos de logo-ea.svg sí anima en el ícono real (<img>,
// arriba) pero nunca se repite en el reflejo.
export default function LogoEaReflejo({ size = 72, className = "" }) {
  return (
    <span
      className={`logo-ea-reflejo${className ? ` ${className}` : ""}`}
      style={{ "--logo-ea-size": `${size}px` }}
    >
      <img className="logo-ea-reflejo__icono" src="/images/brand/logo-ea.svg" alt="" width={size} height={size} />
      <span className="logo-ea-reflejo__reflejo" aria-hidden="true" />
    </span>
  );
}
