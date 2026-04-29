import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import data from "../data.json";
import { usePlayerContext } from "../context/PlayerContext";
import Sidebar from "./Sidebar";
import Notation from "./Notation";
import SargamView from "./SargamView";
import PlaybackBar from "./PlaybackBar";
import ThemeToggle from "./ThemeToggle";
import { parseSargam } from "../utils/parseSargam";

const categories = ["exercises", "songs"];

export default function Practice() {
  const { category: paramCat, id: paramId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [mode, setMode] = useState('sargam');
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
  const sargamItems = useMemo(() => parseSargam(piece.abc), [piece.abc]);

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
          String Theory
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
          <p className="piece-composer">{composer || " "}</p>
        </div>
        <div className="view-tabs">
          <button
            className={`view-tab${mode === 'sargam' ? ' active' : ''}`}
            onClick={() => setMode('sargam')}
          >
            Sargam
          </button>
          <button
            className={`view-tab${mode === 'sheet' ? ' active' : ''}`}
            onClick={() => setMode('sheet')}
          >
            Sheet
          </button>
        </div>

        {mode === 'sargam' && (
          <SargamView items={sargamItems} currentNoteIndex={player.currentNoteIndex} />
        )}
        <Notation
          abc={piece.abc}
          tempo={tempo}
          setVisualObj={player.setVisualObj}
          hidden={mode === 'sargam'}
        />
        <PlaybackBar />
      </main>
    </div>
  );
}
