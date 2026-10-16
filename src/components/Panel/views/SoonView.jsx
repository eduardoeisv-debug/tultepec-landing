import { Sparkles } from "lucide-react";
import { useLanguage } from "../../../i18n/LanguageContext.jsx";

// Aviso genérico para cualquier opción marcada `soon: true` en
// src/data/menu.js que no tiene su propio contenido todavía (p.ej.
// "Videos por tipo", "Gastronomía", "Fiestas del año"). Museos es la
// excepción: ya tenía su propio aviso de "en construcción" (ver
// MuseosView.jsx), así que se quedó con ese en vez de este genérico.
export default function SoonView({ etiqueta, titleRef }) {
  const { t } = useLanguage();
  return (
    <div className="panel-soon">
      <span className="panel-soon__icono" aria-hidden="true">
        <Sparkles size={34} strokeWidth={1.6} />
      </span>
      <h1 className="panel-view__titulo" tabIndex={-1} ref={titleRef}>
        {t("panel.proximamente.titulo")}
      </h1>
      <p className="panel-soon__texto">{t("panel.proximamente.texto", { opcion: etiqueta })}</p>
    </div>
  );
}
