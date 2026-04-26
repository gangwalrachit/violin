import { useEffect, useRef } from "react";
import ABCJS from "abcjs";

function stripHeaders(abc) {
  return abc
    .split("\n")
    .filter((line) => !line.match(/^[TC]:\s/))
    .join("\n");
}

export default function Notation({ abc, setVisualObj }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cleaned = stripHeaders(abc);
    const visualObj = ABCJS.renderAbc(containerRef.current, cleaned, {
      responsive: "resize",
      add_classes: true,
      staffwidth: 600,
      scale: 0.85,
      paddingtop: 0,
      paddingbottom: 0,
    })[0];
    setVisualObj(visualObj);
  }, [abc, setVisualObj]);

  return (
    <div className="notation">
      <div className="notation-inner">
        <div ref={containerRef} id="notation" />
      </div>
    </div>
  );
}
