import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import "./PrivacyModal.css";

export default function PrivacyModal({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="privacy-modal__backdrop" onMouseDown={onClose}>
      <div
        className="privacy-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        tabIndex={-1}
        ref={dialogRef}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button className="privacy-modal__close" onClick={onClose} aria-label="Cerrar">
          <X size={18} strokeWidth={2} />
        </button>

        <span className="eyebrow">Aviso de privacidad</span>
        <h3 id="privacy-modal-title">Cómo tratamos tus datos</h3>
        <p className="privacy-modal__updated">Última actualización: septiembre de 2026.</p>

        <div className="privacy-modal__body">
          <h4>¿Quién es responsable de tus datos?</h4>
          <p>
            Este sitio es un proyecto cultural independiente, hecho como pieza de portafolio. No
            representa a ninguna institución de gobierno ni organización oficial. Los responsables
            del tratamiento de los datos recabados a través de este sitio son Addair del Rosario
            Torices Vargas y Eduardo Israel Sánchez Villaseñor, y pueden ser contactados en{" "}
            <a href="mailto:eduardoeisv@gmail.com">eduardoeisv@gmail.com</a>.
          </p>

          <h4>¿De dónde viene el contenido histórico?</h4>
          <p>
            La historia, las memorias familiares y los testimonios que dan vida a este archivo
            provienen del conocimiento y los recuerdos compartidos por la Profesora Juanita y el
            Profesor Fernando Manuel Torices Ramírez, a quienes pertenece esa historia. Addair del
            Rosario Torices Vargas y Eduardo Israel Sánchez Villaseñor son responsables únicamente
            de la creación, operación de este sitio web y del tratamiento de los datos personales
            descrito en este aviso.
          </p>

          <h4>¿Qué datos recabamos y para qué?</h4>
          <p>Al usar la función "Comparte tu memoria" puedes proporcionar, de forma voluntaria:</p>
          <ul>
            <li>Tu nombre (opcional; puedes dejarlo en blanco y compartir de forma anónima).</li>
            <li>Tu relación con Tultepec y el texto de tu memoria.</li>
            <li>Tu correo electrónico (opcional, solo para contactarte sobre tu envío; nunca se muestra públicamente).</li>
          </ul>
          <p>
            Estos datos se usan únicamente para revisar tu memoria antes de decidir si se publica en
            el archivo del sitio, y para contactarte si dejaste tu correo y es necesario. No se
            venden ni se comparten con terceros con fines comerciales.
          </p>

          <h4>Verificación anti-spam y analítica</h4>
          <p>
            Para evitar envíos automatizados (bots), este formulario usa Cloudflare Turnstile, que
            procesa información técnica del navegador (no datos personales identificables) para
            verificar que quien envía es una persona. Este sitio también puede usar analítica web
            agregada y anónima para entender cuántas personas lo visitan, sin identificarte
            individualmente.
          </p>

          <h4>¿Dónde se almacenan tus datos?</h4>
          <p>
            Las memorias enviadas se guardan en una base de datos gestionada por Supabase. El
            acceso está restringido y cada envío pasa por una revisión manual antes de poder
            mostrarse públicamente.
          </p>

          <h4>Tus derechos (ARCO)</h4>
          <p>
            Puedes solicitar en cualquier momento el Acceso, Rectificación, Cancelación u Oposición
            al tratamiento de los datos que nos hayas compartido, incluyendo pedir que se elimine
            una memoria ya enviada. Para ejercer cualquiera de estos derechos, escribe a{" "}
            <a href="mailto:eduardoeisv@gmail.com">eduardoeisv@gmail.com</a>.
          </p>

          <h4>Cambios a este aviso</h4>
          <p>
            Este aviso puede actualizarse conforme el sitio evolucione. La fecha de la versión
            vigente siempre aparece al inicio de este texto.
          </p>
        </div>
      </div>
    </div>
  );
}
