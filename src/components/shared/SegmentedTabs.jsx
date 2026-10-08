import useArrowNavigation from "../../hooks/useArrowNavigation.js";

// Control de pestañas tipo "segmented" (píldora dorada deslizante),
// compartido por GaleriaOverlay (Imágenes/Videos), RelatosModal (Quiénes
// somos/Los libros) y MemoriesModal (Memorias/Voces/Comparte) para que
// todas las ventanas se vean y se comporten igual. `tabs` es
// [{ id, icon: Component, label, count? }]; `count` (opcional) se
// muestra como "· N" junto al texto.
//
// Flechas ←/→ cambian de pestaña, Inicio/Fin van a la primera/última
// (useArrowNavigation, compartido con el resto de las tarjetas del
// sitio).
export default function SegmentedTabs({ tabs, activeId, onChange, ariaLabel, idPrefix }) {
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === activeId));
  const { register, onKeyDown } = useArrowNavigation({ count: tabs.length, orientation: "horizontal" });

  const goToIndex = (index) => onChange(tabs[index].id);

  return (
    <div
      className="segmented-tabs"
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown(activeIndex, goToIndex)}
      style={{ "--tab-count": tabs.length }}
    >
      <span
        className="segmented-tabs__indicator"
        aria-hidden="true"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {tabs.map((tabItem, i) => (
        <button
          key={tabItem.id}
          type="button"
          role="tab"
          id={`${idPrefix}-tab-${tabItem.id}`}
          aria-selected={activeId === tabItem.id}
          aria-controls={`${idPrefix}-panel-${tabItem.id}`}
          tabIndex={activeId === tabItem.id ? 0 : -1}
          ref={register(i)}
          className={`segmented-tabs__tab ${activeId === tabItem.id ? "is-active" : ""}`}
          onClick={() => onChange(tabItem.id)}
        >
          <tabItem.icon width={18} height={18} />
          {tabItem.label}
          {tabItem.count != null && <span className="segmented-tabs__count">· {tabItem.count}</span>}
        </button>
      ))}
    </div>
  );
}
