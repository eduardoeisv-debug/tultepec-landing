import ContentModal from "./ContentModal.jsx";
import Testimonials from "../Testimonials/Testimonials.jsx";

// Abierto desde el botón "Memorias de mi pueblo" del hero -- antes era la
// sección "Voces del pueblo" fija en la página.
export default function MemoriesModal({ open, onClose, onShareClick }) {
  return (
    <ContentModal open={open} onClose={onClose} eyebrow="Memorias de mi pueblo" title="Lo que cuentan quienes lo viven">
      <Testimonials embedded onShareClick={onShareClick} />
    </ContentModal>
  );
}
