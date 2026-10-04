import ContentModal from "./ContentModal.jsx";
import HistoryInfographic from "./HistoryInfographic.jsx";

// Infografía única que resume la historia de Tultepec (cifras, línea de
// tiempo, por qué importa, qué vas a encontrar, preguntas frecuentes),
// abierta desde el botón "Explora la historia" del hero.
export default function HistoryModal({ open, onClose }) {
  return (
    <ContentModal open={open} onClose={onClose} eyebrow="Explora la historia" title="La historia de Tultepec">
      <HistoryInfographic />
    </ContentModal>
  );
}
