import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./ExploraOpcionLink.css";

// Una opción del menú "Explora" (src/data/menu.js): un enlace real si
// `soon` es false, o un <span> sin enlace con la etiqueta "Próximamente"
// si todavía no existe esa página -- mismo criterio que ya usa el sitio
// para datos pendientes (ver el contacto de WhatsApp sin número
// confirmado en RelatosModal.jsx). Compartido por ExploraMenu.jsx (panel
// de escritorio y cajón móvil) y la sección ExploraTultepec.jsx, para
// que agregar un ícono de "pendiente" no haya que repetirlo tres veces.
export default function ExploraOpcionLink({ opcion, className = "explora-opcion", onSelect, tabIndex }) {
  const { t } = useLanguage();

  if (opcion.soon) {
    return (
      <span className={`${className} ${className}--pendiente`}>
        <span className={`${className}__texto`}>{t(opcion.label)}</span>
        <span className={`${className}__badge`}>{t("explora.proximamente")}</span>
      </span>
    );
  }

  return (
    <a className={className} href={opcion.href} onClick={onSelect} tabIndex={tabIndex}>
      <span className={`${className}__texto`}>{t(opcion.label)}</span>
    </a>
  );
}
