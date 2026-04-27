import { useEffect, useRef } from "react";
import ABCJS from "abcjs";

function stripHeaders(abc) {
  return abc
    .split("\n")
    .filter((line) => !line.match(/^[TC]:\s/))
    .join("\n");
}

function injectTempo(abc, bpm) {
  if (abc.match(/^Q:/m)) {
    return abc.replace(/^Q:.*$/m, `Q:1/4=${bpm}`);
  }
  return abc.replace(/^(M:.*$)/m, `$1\nQ:1/4=${bpm}`);
}

export default function Notation({ abc, tempo, setVisualObj }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const withTempo = injectTempo(abc, tempo);
    const cleaned = stripHeaders(withTempo);
    const visualObj = ABCJS.renderAbc(containerRef.current, cleaned, {
      responsive: "resize",
      add_classes: true,
      staffwidth: 600,
      scale: 0.85,
      paddingtop: 0,
      paddingbottom: 0,
    })[0];
    setVisualObj(visualObj);
  }, [abc, tempo, setVisualObj]);

  return (
    <div className="notation">
      <div className="notation-inner">
        <div ref={containerRef} id="notation" />
      </div>
    </div>
  );
}
