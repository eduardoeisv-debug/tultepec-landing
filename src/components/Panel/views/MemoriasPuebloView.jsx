import MemoriasContenido from "./MemoriasContenido.jsx";

export default function MemoriasPuebloView({ titleRef, onOpenPrivacy }) {
  return <MemoriasContenido initialTab="memorias" titleRef={titleRef} onOpenPrivacy={onOpenPrivacy} />;
}
