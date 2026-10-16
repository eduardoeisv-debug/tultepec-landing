import { lazy, Suspense, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header/Header.jsx";
import Layout from "./components/Layout/Layout.jsx";
import FinalCTA from "./components/FinalCTA/FinalCTA.jsx";
import Footer from "./components/Footer/Footer.jsx";
import ClickFireworks from "./components/shared/ClickFireworks.jsx";
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

// Encabezado fijo + Layout (menú lateral + panel de contenido, enrutado
// por hash -- ver useHashRoute.js) + "me gusta/comentar/compartir"
// (FinalCTA) + pie, siempre a todo lo ancho debajo de las dos columnas,
// nunca dentro del panel. El menú lateral reemplaza a las tarjetas que
// antes vivían en Hero.jsx; lo que esas tarjetas abrían (historia,
// galería, memorias, relatos, museos) ahora son vistas del panel
// (src/components/Panel/views/), no modales de App.jsx.
export default function App() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const privacyTriggerRef = useRef(null);

  // El aviso de privacidad se abre desde varios sitios (el pie y el
  // enlace dentro de "Comparte tu historia", este último dentro de una
  // vista del panel) -- se guarda cuál era el elemento con foco justo
  // antes de abrir (el botón que se acaba de pulsar) para devolvérselo
  // al cerrar.
  const openPrivacy = () => {
    privacyTriggerRef.current = document.activeElement;
    setPrivacyModalOpen(true);
  };
  // "Comparte tu memoria" ahora vive como pestaña dentro de la vista de
  // Memorias (ver MemoriasContenido.jsx). ShareMemoryModal y este estado
  // se dejan montados pero sin ningún botón que los abra, por si se
  // necesita un acceso directo en otro lugar más adelante -- openShare()
  // sigue funcionando si algo vuelve a llamarlo.
  const openShare = () => setShareModalOpen(true);

  return (
    <>
      <ClickFireworks />
      <Header />
      <Layout onOpenPrivacy={openPrivacy} />
      <FinalCTA />
      <Footer onOpenPrivacy={openPrivacy} />

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
