import { useRef, useEffect } from "react";

export default function SargamView({ items, currentNoteIndex }) {
  const activeRowRef = useRef(null);

  // Scroll the active row into view when playback moves to a new line
  useEffect(() => {
    if (activeRowRef.current) {
      activeRowRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentNoteIndex]);

  return (
    <div className="sargam-view">
      <div className="sargam-inner">
        {items.map((item, i) => {
          if (item.type === "section") {
            return <div key={i} className="sargam-section-break" />;
          }

          const rowIsActive = item.tokens.some(
            (t) => t.noteIndex === currentNoteIndex
          );

          return (
            <div
              key={i}
              className="sargam-row"
              ref={rowIsActive ? activeRowRef : null}
            >
              {item.tokens.map((token, j) => {
                if (token.type === "barline") {
                  return (
                    <span key={j} className="sargam-barline" aria-hidden="true">
                      |
                    </span>
                  );
                }

                const isActive = token.noteIndex === currentNoteIndex;
                const octaveClass =
                  token.octave === 1 ? " upper" : token.octave === -1 ? " lower" : "";
                const restClass = token.type === "rest" ? " sargam-rest" : "";
                const activeClass = isActive ? " active" : "";

                return (
                  <span
                    key={j}
                    className={`sargam-token${octaveClass}${restClass}${activeClass}`}
                  >
                    {token.type === "rest" ? "—" : token.label}
                    {Number.isInteger(token.duration) && token.duration > 1 && (
                      <span className="sargam-dur">{token.duration}</span>
                    )}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
