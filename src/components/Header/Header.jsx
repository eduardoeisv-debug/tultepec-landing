import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <a className="site-header__brand" href="#inicio">
          Tultepec <span>· Pueblo Pirotécnico, Cuna del Fuego</span>
        </a>
        <a className="btn btn--dark site-header__cta" href="#tradiciones">
          Explora la historia
        </a>
      </div>
    </header>
  );
}
