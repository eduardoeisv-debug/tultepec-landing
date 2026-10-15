import { useState } from "react";
import { Gamepad2, Grid3x3, Search } from "lucide-react";
import SegmentedTabs from "../shared/SegmentedTabs.jsx";
import ToritoPirotecnico from "./ToritoPirotecnico.jsx";
import MemoramaTultepec from "./MemoramaTultepec.jsx";
import SopaDeLetras from "./SopaDeLetras.jsx";
import useReveal from "../../hooks/useReveal.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "../shared/SegmentedTabs.css";
import "./Juegos.css";

// Sección "Juegos": un descanso opcional entre la info de visita
// (VisitInfo) y el cierre de la página (FinalCTA) -- ahí la persona ya
// vio lo que necesita para planear su visita y todavía no llega al cierre
// (me gusta/comentar/compartir). Pestañas (mismo SegmentedTabs que la
// galería y los demás overlays) para que en celular la sección no sea
// larguísima: solo se monta el juego activo, nunca los tres a la vez.
export default function Juegos() {
  const { t } = useLanguage();
  const ref = useReveal();
  const [activeTab, setActiveTab] = useState("torito");

  return (
    <section className="juegos" id="juegos">
      <div className="container juegos__inner reveal" ref={ref}>
        <div className="juegos__frame">
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
              {
                id: "torito",
                icon: Gamepad2,
                // "Laberinto del torito" no cabe junto a "Memorama" en una
                // píldora de ancho igual en celular (se desbordaba) -- igual
                // que ES/EN del selector de idioma, dos spans y CSS decide
                // cuál mostrar según el ancho (segmented-tabs__label-* en
                // SegmentedTabs.css).
                label: (
                  <>
                    <span className="segmented-tabs__label-corta">{t("juegos.tabs.toritoCorto")}</span>
                    <span className="segmented-tabs__label-larga">{t("juegos.tabs.torito")}</span>
                  </>
                ),
              },
              {
                id: "memorama",
                icon: Grid3x3,
                label: (
                  <>
                    <span className="segmented-tabs__label-corta">{t("juegos.tabs.memoramaCorto")}</span>
                    <span className="segmented-tabs__label-larga">{t("juegos.tabs.memorama")}</span>
                  </>
                ),
              },
              {
                id: "sopa",
                icon: Search,
                label: (
                  <>
                    <span className="segmented-tabs__label-corta">{t("juegos.tabs.sopaCorto")}</span>
                    <span className="segmented-tabs__label-larga">{t("juegos.tabs.sopa")}</span>
                  </>
                ),
              },
            ]}
          />

          <div
            className="juegos__stage"
            role="tabpanel"
            id={`juegos-panel-${activeTab}`}
            aria-labelledby={`juegos-tab-${activeTab}`}
          >
            {activeTab === "torito" && <ToritoPirotecnico />}
            {activeTab === "memorama" && <MemoramaTultepec />}
            {activeTab === "sopa" && <SopaDeLetras />}
          </div>
        </div>
      </div>
    </section>
  );
}
