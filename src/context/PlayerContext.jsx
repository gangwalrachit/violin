import { createContext, useContext, useState, useCallback } from "react";
import { usePlayer } from "../hooks/usePlayer";

const PlayerContext = createContext(null);

function loadTempo() {
  const saved = localStorage.getItem("violin-tempo");
  const n = saved ? parseInt(saved, 10) : 80;
  return n >= 40 && n <= 200 ? n : 80;
}

export function PlayerProvider({ children }) {
  const player = usePlayer();
  const [currentPiece, setCurrentPiece] = useState(null);
  const [tempo, setTempoState] = useState(loadTempo);
  const [nav, setNav] = useState({
    onPrev: null,
    onNext: null,
    hasPrev: false,
    hasNext: false,
  });

  const setTempo = useCallback((bpm) => {
    const clamped = Math.max(40, Math.min(200, bpm));
    setTempoState(clamped);
    localStorage.setItem("violin-tempo", String(clamped));
  }, []);

  const updateNav = useCallback((navState) => {
    setNav(navState);
  }, []);

  const clearNav = useCallback(() => {
    setNav({ onPrev: null, onNext: null, hasPrev: false, hasNext: false });
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        player,
        currentPiece,
        setCurrentPiece,
        tempo,
        setTempo,
        nav,
        updateNav,
        clearNav,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  return useContext(PlayerContext);
}
