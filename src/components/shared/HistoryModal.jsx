import ContentModal from "./ContentModal.jsx";
import HistoryInfographic from "./HistoryInfographic.jsx";
import { useLanguage } from "../../i18n/LanguageContext.jsx";

// Infografía única que resume la historia de Tultepec (cifras, línea de
// tiempo, por qué importa, qué vas a encontrar, preguntas frecuentes),
// abierta desde el botón "Explora la historia" del hero.
export default function HistoryModal({ open, onClose }) {
  const { t } = useLanguage();
  return (
    <ContentModal open={open} onClose={onClose} eyebrow={t("historyModal.eyebrow")} title={t("historyModal.title")}>
      <HistoryInfographic />
    </ContentModal>
  );
}
