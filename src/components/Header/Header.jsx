import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#inicio">
          <span className="site-header__brand-text">
            <span>Tultepec</span>
            <span className="site-header__subtitle">· Pueblo Pirotécnico</span>
          </span>
        </a>
        <button
          type="button"
          className="btn btn--dark site-header__cta"
          onClick={() => window.dispatchEvent(new Event("plan-visit:open"))}
        >
          Planea tu visita
        </button>
      </div>
    </header>
  );
}
