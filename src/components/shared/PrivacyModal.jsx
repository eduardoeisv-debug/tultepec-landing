import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./PrivacyModal.css";

function withEmailLink(text) {
  const [before, after] = text.split("{email}");
  return (
    <>
      {before}
      <a href="mailto:eduardoeisv@gmail.com">eduardoeisv@gmail.com</a>
      {after}
    </>
  );
}

export default function PrivacyModal({ open, onClose }) {
  const { t } = useLanguage();
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
        <button className="privacy-modal__close" onClick={onClose} aria-label={t("common.cerrar")}>
          <X size={18} strokeWidth={2} />
        </button>

        <span className="eyebrow">{t("privacyModal.eyebrow")}</span>
        <h3 id="privacy-modal-title">{t("privacyModal.title")}</h3>
        <p className="privacy-modal__updated">{t("privacyModal.updated")}</p>

        <div className="privacy-modal__body">
          <h4>{t("privacyModal.h1")}</h4>
          <p>{withEmailLink(t("privacyModal.p1"))}</p>

          <h4>{t("privacyModal.h2")}</h4>
          <p>{t("privacyModal.p2")}</p>

          <h4>{t("privacyModal.h3")}</h4>
          <p>{t("privacyModal.p3")}</p>
          <ul>
            <li>{t("privacyModal.li1")}</li>
            <li>{t("privacyModal.li2")}</li>
            <li>{t("privacyModal.li3")}</li>
          </ul>
          <p>{t("privacyModal.p4")}</p>

          <h4>{t("privacyModal.h5")}</h4>
          <p>{t("privacyModal.p5")}</p>

          <h4>{t("privacyModal.h6")}</h4>
          <p>{t("privacyModal.p6")}</p>

          <h4>{t("privacyModal.h7")}</h4>
          <p>{withEmailLink(t("privacyModal.p7"))}</p>

          <h4>{t("privacyModal.h8")}</h4>
          <p>{t("privacyModal.p8")}</p>
        </div>
      </div>
    </div>
  );
}
