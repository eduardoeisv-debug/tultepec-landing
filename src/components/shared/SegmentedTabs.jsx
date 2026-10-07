import { useRef } from "react";

// Control de pestañas tipo "segmented" (píldora dorada deslizante),
// compartido por GaleriaOverlay (Imágenes/Videos) y RelatosModal (Quiénes
// somos/Los libros) para que las dos ventanas se vean y se comporten
// igual. `tabs` es [{ id, icon: Component, label, count? }]; `count`
// (opcional) se muestra como "· N" junto al texto, igual que antes.
export default function SegmentedTabs({ tabs, activeId, onChange, ariaLabel, idPrefix }) {
  const tabRefs = useRef({});
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === activeId));

  const goTo = (id) => {
    onChange(id);
    tabRefs.current[id]?.focus();
  };

  const onKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const idx = tabs.findIndex((t) => t.id === activeId);
    const nextIdx = e.key === "ArrowRight" ? (idx + 1) % tabs.length : (idx - 1 + tabs.length) % tabs.length;
    goTo(tabs[nextIdx].id);
  };

  return (
    <div
      className="segmented-tabs"
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      style={{ "--tab-count": tabs.length }}
    >
      <span
        className="segmented-tabs__indicator"
        aria-hidden="true"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {tabs.map((tabItem) => (
        <button
          key={tabItem.id}
          type="button"
          role="tab"
          id={`${idPrefix}-tab-${tabItem.id}`}
          aria-selected={activeId === tabItem.id}
          aria-controls={`${idPrefix}-panel-${tabItem.id}`}
          tabIndex={activeId === tabItem.id ? 0 : -1}
          ref={(el) => (tabRefs.current[tabItem.id] = el)}
          className={`segmented-tabs__tab ${activeId === tabItem.id ? "is-active" : ""}`}
          onClick={() => goTo(tabItem.id)}
        >
          <tabItem.icon width={18} height={18} />
          {tabItem.label}
          {tabItem.count != null && <span className="segmented-tabs__count">· {tabItem.count}</span>}
        </button>
      ))}
    </div>
  );
}
