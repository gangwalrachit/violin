import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import data from "../data.json";
import { usePlayerContext } from "../context/PlayerContext";
import Sidebar from "./Sidebar";
import Notation from "./Notation";
import PlaybackBar from "./PlaybackBar";
import ThemeToggle from "./ThemeToggle";

const categories = ["exercises", "songs"];

export default function Practice() {
  const { category: paramCat, id: paramId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { player, tempo, setCurrentPiece, updateNav, clearNav } =
    usePlayerContext();

  const category = categories.includes(paramCat) ? paramCat : "exercises";
  const list = data[category];

  let index = 0;
  if (paramId) {
    const found = list.findIndex((item) => item.id === paramId);
    if (found >= 0) index = found;
  }

  const piece = list[index];

  const stopRef = useRef(player.stop);
  stopRef.current = player.stop;

  const navTo = useCallback(
    (cat, idx) => {
      const item = data[cat][idx];
      stopRef.current();
      setSidebarOpen(false);
      navigate(`/${cat}/${item.id}`);
    },
    [navigate]
  );

  const toggleSidebar = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarVisible((prev) => !prev);
    }
  };

  useEffect(() => {
    if (!paramId && list.length > 0) {
      navigate(`/${category}/${list[0].id}`, { replace: true });
    }
  }, [category, paramId, list, navigate]);

  useEffect(() => {
    setCurrentPiece({ title: piece.title, category, id: piece.id });
  }, [piece.title, category, piece.id, setCurrentPiece]);

  useEffect(() => {
    updateNav({
      onPrev: index > 0 ? () => navTo(category, index - 1) : null,
      onNext:
        index < list.length - 1 ? () => navTo(category, index + 1) : null,
      hasPrev: index > 0,
      hasNext: index < list.length - 1,
    });
    return clearNav;
  }, [index, category, list.length, navTo, updateNav, clearNav]);

  const composer = piece.abc.match(/^C:\s*(.+)$/m)?.[1]?.trim();

  return (
    <div className={`app${sidebarVisible ? "" : " sidebar-collapsed"}`}>
      <header className="header">
        <button
          className="hamburger"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <span />
          <span />
          <span />
        </button>
        <h1
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          Violin Practice
        </h1>
        <ThemeToggle />
      </header>

      <Sidebar
        data={data}
        categories={categories}
        activeCategory={category}
        activeIndex={index}
        onSelect={navTo}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main">
        <div className="piece-header">
          <h2>{piece.title}</h2>
          {composer && <p>{composer}</p>}
        </div>
        <Notation abc={piece.abc} tempo={tempo} setVisualObj={player.setVisualObj} />
        <PlaybackBar />
      </main>
    </div>
  );
}
