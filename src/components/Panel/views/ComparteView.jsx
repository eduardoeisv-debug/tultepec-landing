import MemoriasContenido from "./MemoriasContenido.jsx";

export default function ComparteView({ onOpenPrivacy }) {
  return <MemoriasContenido initialTab="comparte" onOpenPrivacy={onOpenPrivacy} />;
}
