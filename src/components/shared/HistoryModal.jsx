import ContentModal from "./ContentModal.jsx";
import Stats from "../Stats/Stats.jsx";
import WhyItMatters from "../WhyItMatters/WhyItMatters.jsx";
import Traditions from "../Traditions/Traditions.jsx";
import FAQ from "../FAQ/FAQ.jsx";

// Reúne en una sola pantalla todo lo que antes eran 4 secciones separadas
// de la página (cifras, por qué importa, línea de tiempo, preguntas
// frecuentes), abierta desde el botón "Explora la historia" del hero.
export default function HistoryModal({ open, onClose }) {
  return (
    <ContentModal open={open} onClose={onClose} eyebrow="Explora la historia" title="La historia de Tultepec">
      <Stats embedded />
      <WhyItMatters embedded />
      <Traditions embedded />
      <FAQ embedded />
    </ContentModal>
  );
}
