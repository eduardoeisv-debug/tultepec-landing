import MemoriasContenido from "./MemoriasContenido.jsx";

export default function ComparteView({ titleRef, onOpenPrivacy }) {
  return <MemoriasContenido initialTab="comparte" titleRef={titleRef} onOpenPrivacy={onOpenPrivacy} />;
}
