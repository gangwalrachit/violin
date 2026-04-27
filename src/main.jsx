import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import Landing from "./components/Landing";
import Practice from "./components/Practice";
import PlaybackBar from "./components/PlaybackBar";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/:category" element={<Practice />} />
          <Route path="/:category/:id" element={<Practice />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <PlaybackBar />
      </PlayerProvider>
    </BrowserRouter>
  </StrictMode>
);
