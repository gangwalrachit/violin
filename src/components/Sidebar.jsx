import { useState, useEffect } from "react";

const labels = { exercises: "Exercises", songs: "Songs" };

export default function Sidebar({
  data,
  categories,
  activeCategory,
  activeIndex,
  onSelect,
  open,
  onClose,
}) {
  const [expanded, setExpanded] = useState(() => {
    const init = {};
    categories.forEach((cat) => {
      init[cat] = cat === activeCategory;
    });
    return init;
  });

  useEffect(() => {
    setExpanded((prev) => {
      const next = {};
      categories.forEach((cat) => {
        next[cat] = cat === activeCategory ? true : (prev[cat] === true && cat !== activeCategory ? false : prev[cat]);
      });
      next[activeCategory] = true;
      return next;
    });
  }, [activeCategory, categories]);

  const toggle = (cat) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <nav className="sidebar-inner">
          {categories.map((cat) => (
            <div className="nav-section" key={cat}>
              <button className="nav-section-toggle" onClick={() => toggle(cat)}>
                <svg
                  className={`chevron ${expanded[cat] ? "expanded" : ""}`}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
                <span>{labels[cat]}</span>
                <span className="nav-count">{data[cat].length}</span>
              </button>
              {expanded[cat] && (
                <div className="nav-items">
                  {data[cat].map((item, i) => (
                    <button
                      key={item.id}
                      className={`nav-item ${cat === activeCategory && i === activeIndex ? "active" : ""}`}
                      onClick={() => onSelect(cat, i)}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
      {open && <div className="overlay" onClick={onClose} />}
    </>
  );
}
