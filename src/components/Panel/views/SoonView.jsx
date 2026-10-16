import { Sparkles } from "lucide-react";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";

// Aviso genérico para cualquier opción marcada `soon: true` en
// src/data/menu.js que no tiene su propio contenido todavía (p.ej.
// "Videos por tipo", "Gastronomía", "Fiestas del año"). Museos es la
// excepción: ya tenía su propio aviso de "en construcción" (ver
// MuseosView.jsx), así que se quedó con ese en vez de este genérico.
//
// `comoTab`: cuando una subopción individual de un grupo (p.ej.
// "Videos por tipo" dentro de Pirotecnia) todavía no existe, este
// aviso se muestra DENTRO de la pestaña -- GroupPanelView.jsx ya puso
// el único <h1> visible del grupo arriba, así que aquí no se repite
// (ni se usa titleRef: el foco de esa navegación ya lo maneja el <h1>
// del grupo). Sin `comoTab` (opción de nivel superior sin
// subopciones, como Gastronomía o Música) el título sí es el único de
// la vista y lleva el foco como cualquier otra.
export default function SoonView({ etiqueta, titleRef, comoTab = false }) {
  const { t } = useLanguage();
  const Titulo = comoTab ? "p" : "h1";
  return (
    <div className="panel-soon">
      <span className="panel-soon__icono" aria-hidden="true">
        <Sparkles size={34} strokeWidth={1.6} />
      </span>
      <Titulo
        className={comoTab ? "panel-soon__texto panel-soon__texto--titulo" : "panel-view__titulo"}
        tabIndex={comoTab ? undefined : -1}
        ref={comoTab ? undefined : titleRef}
      >
        {t("panel.proximamente.titulo")}
      </Titulo>
      <p className="panel-soon__texto">{t("panel.proximamente.texto", { opcion: etiqueta })}</p>
    </div>
  );
}
