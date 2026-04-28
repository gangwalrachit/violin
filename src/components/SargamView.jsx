export default function SargamView({ items, currentNoteIndex }) {
  return (
    <div className="sargam-view">
      <div className="sargam-inner">
        {items.map((item, i) => {
          if (item.type === 'section') {
            return <div key={i} className="sargam-section-break" />;
          }

          return (
            <div key={i} className="sargam-row">
              {item.tokens.map((token, j) => {
                if (token.type === 'barline') {
                  return (
                    <span key={j} className="sargam-barline" aria-hidden="true">
                      |
                    </span>
                  );
                }

                const isActive = token.noteIndex === currentNoteIndex;
                const octaveClass = token.octave === 1 ? ' upper' : token.octave === -1 ? ' lower' : '';
                const restClass = token.type === 'rest' ? ' sargam-rest' : '';
                const activeClass = isActive ? ' active' : '';

                return (
                  <span key={j} className={`sargam-token${octaveClass}${restClass}${activeClass}`}>
                    {token.type === 'rest' ? '—' : token.label}
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
