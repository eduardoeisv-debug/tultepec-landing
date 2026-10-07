import { useState } from "react";
import { MessageCircle } from "lucide-react";
import SparkField from "../shared/SparkField.jsx";
import ShareButtons from "../shared/ShareButtons.jsx";
import LikeButton from "../shared/LikeButton.jsx";
import CommentModal from "../shared/CommentModal.jsx";
import useReveal from "../../hooks/useReveal.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./FinalCTA.css";

export default function FinalCTA() {
  const { t } = useLanguage();
  const ref = useReveal();
  const [commentOpen, setCommentOpen] = useState(false);

  return (
    <section className="final-cta" ref={ref}>
      <SparkField count={14} />
      <div className="container final-cta__content reveal">
        <h2>{t("finalCta.title")}</h2>
        <p>{t("finalCta.text")}</p>
        <div className="final-cta__engage">
          <p className="final-cta__engage-text">{t("finalCta.engageText")}</p>
          <div className="final-cta__engage-actions">
            <LikeButton />
            <button type="button" className="comment-button" onClick={() => setCommentOpen(true)}>
              <span className="comment-button__icon">
                <MessageCircle size={18} strokeWidth={1.8} />
              </span>
              <span>{t("finalCta.comentar")}</span>
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
