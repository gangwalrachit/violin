export default function Controls({ player, onPrev, onNext }) {
  return (
    <div className="controls">
      <div className="controls-left">
        <button className="btn" onClick={onPrev} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          className={`btn btn-play ${player.playing ? "playing" : ""}`}
          onClick={() => player.playing ? player.stop() : player.play()}
        >
          {player.playing ? "Stop" : "Play"}
        </button>
        <button className="btn" onClick={onNext} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className="controls-right">
        <button
          className={`btn btn-loop ${player.looping ? "active" : ""}`}
          onClick={player.toggleLoop}
          aria-label="Toggle loop"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="17 1 21 5 17 9" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <polyline points="7 23 3 19 7 15" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          <span>Loop</span>
        </button>
      </div>
    </div>
  );
}
