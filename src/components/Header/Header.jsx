import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#inicio">
          Tultepec <span>· Pueblo Pirotécnico</span>
        </a>
        <a
          className="btn btn--dark site-header__cta"
          href="#ubicacion"
          onClick={() => window.dispatchEvent(new Event("plan-visit:open"))}
        >
          Planea tu visita
        </a>
      </div>
    </header>
  );
}
