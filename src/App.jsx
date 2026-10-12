import { lazy, Suspense, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import Bienvenida from "./components/Bienvenida/Bienvenida.jsx";
import VisitInfo from "./components/VisitInfo/VisitInfo.jsx";
import FinalCTA from "./components/FinalCTA/FinalCTA.jsx";
import Footer from "./components/Footer/Footer.jsx";
import RelatosModal from "./components/shared/RelatosModal.jsx";
import ClickFireworks from "./components/shared/ClickFireworks.jsx";
import useHashScrollFix from "./hooks/useHashScrollFix.js";
import { useLanguage } from "./i18n/LanguageContext.jsx";

const ShareMemoryModal = lazy(() => import("./components/shared/ShareMemoryModal.jsx"));
// El aviso de privacidad tira de react-markdown (y su cadena de
// remark/unified) solo para renderizar dos archivos .md -- son ~50kB
// gzip que la mayoría de quienes visitan el sitio nunca necesitan, así
// que también se carga bajo demanda en vez de ir en el bundle principal.
const PrivacyModal = lazy(() => import("./components/shared/PrivacyModal.jsx"));

// El formulario de "Comparte tu memoria" se carga bajo demanda (lazy) para
// no engordar el bundle principal. Sin un fallback visible, una conexión
// de celular lenta deja la pantalla literalmente en blanco mientras
// descarga -- esto le da al menos un fondo y un indicador de carga.
function ModalLoading() {
  const { t } = useLanguage();
  return (
    <div className="modal-loading__backdrop">
      <span className="modal-loading__spinner" aria-label={t("app.cargando")} />
    </div>
  );
}

export default function App() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [booksModalOpen, setBooksModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const booksTriggerRef = useRef(null);
  const privacyTriggerRef = useRef(null);

  useHashScrollFix();

  // El aviso de privacidad se abre desde dos sitios distintos (el pie y
  // el enlace dentro del formulario "Comparte tu memoria", este último
  // anidado en otro modal) -- en vez de pasar una ref por cada posible
  // origen, se guarda cuál era el elemento con foco justo antes de abrir
  // (que es el botón que se acaba de pulsar) para devolvérselo al cerrar.
  const openPrivacy = () => {
    privacyTriggerRef.current = document.activeElement;
    setPrivacyModalOpen(true);
  };
  // "Comparte tu memoria" ahora vive como pestaña dentro de MemoriesModal
  // (ver Hero.jsx). ShareMemoryModal y este estado se dejan montados pero
  // sin ningún botón que los abra, por si se necesita un acceso directo
  // en otro lugar más adelante -- openShare() sigue funcionando si algo
  // vuelve a llamarlo.
  const openShare = () => setShareModalOpen(true);

  return (
    <>
      <ClickFireworks />
      <Header />
      <main>
        <Hero onOpenBooks={() => setBooksModalOpen(true)} onOpenPrivacy={openPrivacy} booksTriggerRef={booksTriggerRef} />
        <Bienvenida />
        <VisitInfo />
        <FinalCTA />
      </main>
      <Footer onOpenPrivacy={openPrivacy} />

      <RelatosModal open={booksModalOpen} onClose={() => setBooksModalOpen(false)} triggerRef={booksTriggerRef} />

      {shareModalOpen && (
        <Suspense fallback={<ModalLoading />}>
          <ShareMemoryModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} onOpenPrivacy={openPrivacy} />
        </Suspense>
      )}

      {privacyModalOpen && (
        <Suspense fallback={<ModalLoading />}>
          <PrivacyModal open={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} triggerRef={privacyTriggerRef} />
        </Suspense>
      )}

      <Analytics />
    </>
  );
}
