import { useState, useCallback } from "react";
import data from "./data.json";
import Sidebar from "./components/Sidebar";
import Notation from "./components/Notation";
import Controls from "./components/Controls";
import ThemeToggle from "./components/ThemeToggle";
import { usePlayer } from "./hooks/usePlayer";

const categories = ["exercises", "songs"];

export default function App() {
  const [category, setCategory] = useState("exercises");
  const [index, setIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const piece = data[category][index];
  const list = data[category];
  const player = usePlayer();

  const navigate = useCallback(
    (cat, idx) => {
      setCategory(cat);
      setIndex(idx);
      player.stop();
      setSidebarOpen(false);
    },
    [player]
  );

  const goPrev = () => {
    if (index > 0) navigate(category, index - 1);
  };

  const goNext = () => {
    if (index < list.length - 1) navigate(category, index + 1);
  };

  const composer = piece.abc.match(/^C:\s*(.+)$/m)?.[1]?.trim();

  return (
    <div className="app">
      <header className="header">
        <button
          className="hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="logo">Violin Practice</h1>
        <ThemeToggle />
      </header>

      <Sidebar
        data={data}
        categories={categories}
        activeCategory={category}
        activeIndex={index}
        onSelect={navigate}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main">
        <div className="piece-header">
          <h2>{piece.title}</h2>
          {composer && <p>{composer}</p>}
        </div>
        <Notation abc={piece.abc} setVisualObj={player.setVisualObj} />
        <Controls
          player={player}
          onPrev={goPrev}
          onNext={goNext}
          hasPrev={index > 0}
          hasNext={index < list.length - 1}
        />
      </main>
    </div>
  );
}
