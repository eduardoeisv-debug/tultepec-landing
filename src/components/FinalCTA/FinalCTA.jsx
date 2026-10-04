import { useState } from "react";
import { MessageCircle } from "lucide-react";
import SparkField from "../shared/SparkField.jsx";
import ShareButtons from "../shared/ShareButtons.jsx";
import LikeButton from "../shared/LikeButton.jsx";
import CommentModal from "../shared/CommentModal.jsx";
import useReveal from "../../hooks/useReveal.js";
import "./FinalCTA.css";

export default function FinalCTA() {
  const ref = useReveal();
  const [commentOpen, setCommentOpen] = useState(false);

  return (
    <section className="final-cta" ref={ref}>
      <SparkField count={14} />
      <div className="container final-cta__content reveal">
        <h2>La memoria del pueblo sigue encendida</h2>
        <p>
          Cada visita a este archivo es una forma de mantener viva la historia de Tultepec.
          Vuelve cuando quieras seguir el hilo de la tradición.
        </p>
        <div className="final-cta__actions">
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => window.dispatchEvent(new Event("hero:open-history"))}
          >
            Sigue explorando el archivo
          </button>
        </div>

        <div className="final-cta__engage">
          <p className="final-cta__engage-text">
            Hola, si te gustó el contenido de este sitio, déjanos tu like y un comentario
          </p>
          <div className="final-cta__engage-actions">
            <LikeButton />
            <button type="button" className="comment-button" onClick={() => setCommentOpen(true)}>
              <span className="comment-button__icon">
                <MessageCircle size={18} strokeWidth={1.8} />
              </span>
              <span>Comentar</span>
            </button>
          </div>
        </div>

        <div className="final-cta__share">
          <ShareButtons />
        </div>
      </div>

      <CommentModal open={commentOpen} onClose={() => setCommentOpen(false)} />
    </section>
  );
}
