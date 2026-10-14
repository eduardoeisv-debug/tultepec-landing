import { useState } from "react";
import { Rocket, Grid3x3 } from "lucide-react";
import SegmentedTabs from "../shared/SegmentedTabs.jsx";
import FuegosArtificiales from "./FuegosArtificiales.jsx";
import MemoramaTultepec from "./MemoramaTultepec.jsx";
import useReveal from "../../hooks/useReveal.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "../shared/SegmentedTabs.css";
import "./Juegos.css";

// Sección "Juegos": un descanso opcional entre la info de visita
// (VisitInfo) y el cierre de la página (FinalCTA) -- ahí la persona ya
// vio lo que necesita para planear su visita y todavía no llega al cierre
// (me gusta/comentar/compartir). Pestañas (mismo SegmentedTabs que la
// galería y los demás overlays) para que en celular la sección no sea
// larguísima: solo se monta el juego activo, nunca los dos a la vez.
export default function Juegos() {
  const { t } = useLanguage();
  const ref = useReveal();
  const [activeTab, setActiveTab] = useState("fuegos");

  return (
    <section className="juegos" id="juegos">
      <div className="container juegos__inner reveal" ref={ref}>
        <div className="section-head">
          <span className="eyebrow eyebrow--light">{t("juegos.eyebrow")}</span>
          <h2>{t("juegos.title")}</h2>
        </div>

        <SegmentedTabs
          idPrefix="juegos"
          ariaLabel={t("juegos.tabsAriaLabel")}
          activeId={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: "fuegos", icon: Rocket, label: t("juegos.tabs.fuegos") },
            { id: "memorama", icon: Grid3x3, label: t("juegos.tabs.memorama") },
          ]}
        />

        <div
          className="juegos__stage"
          role="tabpanel"
          id={`juegos-panel-${activeTab}`}
          aria-labelledby={`juegos-tab-${activeTab}`}
        >
          {activeTab === "fuegos" ? <FuegosArtificiales /> : <MemoramaTultepec />}
        </div>
      </div>
    </section>
  );
}
