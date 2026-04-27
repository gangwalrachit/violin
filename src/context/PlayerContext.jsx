import { createContext, useContext, useState, useCallback } from "react";
import { usePlayer } from "../hooks/usePlayer";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const player = usePlayer();
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nav, setNav] = useState({
    onPrev: null,
    onNext: null,
    hasPrev: false,
    hasNext: false,
  });

  const updateNav = useCallback((navState) => {
    setNav(navState);
  }, []);

  const clearNav = useCallback(() => {
    setNav({ onPrev: null, onNext: null, hasPrev: false, hasNext: false });
  }, []);

  return (
    <PlayerContext.Provider
      value={{ player, currentPiece, setCurrentPiece, nav, updateNav, clearNav }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayerContext() {
  return useContext(PlayerContext);
}
