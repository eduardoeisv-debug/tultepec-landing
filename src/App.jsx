import { lazy, Suspense, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import VisitInfo from "./components/VisitInfo/VisitInfo.jsx";
import FinalCTA from "./components/FinalCTA/FinalCTA.jsx";
import Footer from "./components/Footer/Footer.jsx";
import RelatosModal from "./components/shared/RelatosModal.jsx";
import PrivacyModal from "./components/shared/PrivacyModal.jsx";
import ClickFireworks from "./components/shared/ClickFireworks.jsx";
import useHashScrollFix from "./hooks/useHashScrollFix.js";
import { useLanguage } from "./i18n/LanguageContext.jsx";

const ShareMemoryModal = lazy(() => import("./components/shared/ShareMemoryModal.jsx"));

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

  useHashScrollFix();

  const openPrivacy = () => setPrivacyModalOpen(true);
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
        <VisitInfo />
        <FinalCTA />
      </main>
      <Footer onOpenPrivacy={openPrivacy} />

      <RelatosModal open={booksModalOpen} onClose={() => setBooksModalOpen(false)} triggerRef={booksTriggerRef} />
      <PrivacyModal open={privacyModalOpen} onClose={() => setPrivacyModalOpen(false)} />

      {shareModalOpen && (
        <Suspense fallback={<ModalLoading />}>
          <ShareMemoryModal open={shareModalOpen} onClose={() => setShareModalOpen(false)} onOpenPrivacy={openPrivacy} />
        </Suspense>
      )}

      <Analytics />
    </>
  );
}
