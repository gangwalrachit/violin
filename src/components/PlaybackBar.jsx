import { usePlayerContext } from "../context/PlayerContext";

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="6,3 20,12 6,21" />
  </svg>
);

const PauseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <rect x="5" y="3" width="5" height="18" rx="1" />
    <rect x="14" y="3" width="5" height="18" rx="1" />
  </svg>
);

const PrevIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <rect x="3" y="5" width="3" height="14" rx="1" />
    <polygon points="21,5 10,12 21,19" />
  </svg>
);

const NextIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="3,5 14,12 3,19" />
    <rect x="18" y="5" width="3" height="14" rx="1" />
  </svg>
);

const LoopIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);

export default function PlaybackBar() {
  const { player, currentPiece, nav } = usePlayerContext();
  const idle = !currentPiece;
  const title = currentPiece?.title || "No piece loaded";

  return (
    <div className={`playbar-wrapper${idle ? " playbar-idle" : ""}`}>
      <div className="playbar">
        <div className="playbar-controls">
          <button
            className="playbar-btn"
            onClick={nav.onPrev}
            disabled={!nav.hasPrev}
            aria-label="Previous"
          >
            <PrevIcon />
          </button>
          <button
            className="playbar-btn playbar-btn-play"
            onClick={player.play}
            disabled={idle}
            aria-label={player.playing && !player.paused ? "Pause" : "Play"}
          >
            {player.playing && !player.paused ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            className="playbar-btn"
            onClick={nav.onNext}
            disabled={!nav.hasNext}
            aria-label="Next"
          >
            <NextIcon />
          </button>
        </div>

        <div className="playbar-center">
          <div className="playbar-title-row">
            <span className="playbar-title">{title}</span>
          </div>
          <div className="playbar-track">
            <div
              className="playbar-fill"
              style={{ width: `${player.progress}%` }}
            />
          </div>
        </div>

        <div className="playbar-end">
          <button
            className={`playbar-btn playbar-loop ${player.looping ? "active" : ""}`}
            onClick={player.toggleLoop}
            disabled={idle}
            aria-label="Toggle loop"
          >
            <LoopIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
