import ContentModal from "./ContentModal.jsx";
import Testimonials from "../Testimonials/Testimonials.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

// Abierto desde el botón "Memorias de mi pueblo" del hero -- antes era la
// sección "Voces del pueblo" fija en la página.
export default function MemoriesModal({ open, onClose, onShareClick }) {
  const { t } = useLanguage();
  return (
    <ContentModal open={open} onClose={onClose} eyebrow={t("memoriesModal.eyebrow")} title={t("memoriesModal.title")}>
      <Testimonials embedded onShareClick={onShareClick} />
    </ContentModal>
  );
}
