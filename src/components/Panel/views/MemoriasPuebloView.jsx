import MemoriasContenido from "./MemoriasContenido.jsx";

export default function MemoriasPuebloView({ onOpenPrivacy }) {
  return <MemoriasContenido initialTab="memorias" onOpenPrivacy={onOpenPrivacy} />;
}
