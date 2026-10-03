import "./Footer.css";

export default function Footer({ onOpenPrivacy }) {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <span className="footer__brand">Tultepec · Pueblo Pirotécnico</span>
          <p className="footer__tagline">Un archivo hecho para honrar la memoria de un pueblo.</p>
          <p className="footer__thanks">
            Un agradecimiento especial a <strong>la Profesora Juanita</strong> y al{" "}
            <strong>Profesor Fernando Manuel Torices Ramírez</strong>, por compartir con
            generosidad su conocimiento y sus recuerdos — el verdadero corazón de este archivo.
          </p>
        </div>

        <div className="footer__meta">
          <p>
            Proyecto cultural independiente, hecho como pieza de portafolio. No representa a
            ninguna institución de gobierno, gremio pirotécnico ni organizador oficial de la Feria
            Nacional de la Pirotecnia.
          </p>
          <p>
            Datos históricos generales (fiesta de San Juan de Dios, origen de la Feria Nacional de
            la Pirotecnia) tomados de fuentes públicas de divulgación histórica y turística.
            Testimonios y algunas cifras son ilustrativos, marcados en el contenido, y deben
            sustituirse por material verificado del pueblo.
          </p>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Tultepec · Pueblo Pirotécnico — proyecto de portafolio.</span>
        <button type="button" className="footer__privacy-link" onClick={onOpenPrivacy}>
          Aviso de privacidad
        </button>
      </div>
    </footer>
  );
}
