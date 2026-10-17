// Las 2 chispitas decorativas del efecto "espejo dorado" (ver
// .brand-mirror en global.css) -- mismo par de SVG en los dos lugares
// que usan ese efecto (TopBarCristal.jsx y ColumnaCristal.jsx), así
// que viven aquí una sola vez en vez de duplicar el marcado.
export default function BrandSparkles() {
  return (
    <>
      <svg
        className="brand-sparkle brand-sparkle--arriba"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
      </svg>
      <svg
        className="brand-sparkle brand-sparkle--abajo"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
      </svg>
    </>
  );
}
