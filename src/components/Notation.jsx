import { useEffect, useRef } from "react";
import ABCJS from "abcjs";

export default function Notation({ abc, setVisualObj }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const visualObj = ABCJS.renderAbc(containerRef.current, abc, {
      responsive: "resize",
      add_classes: true,
      staffwidth: 740,
      scale: 0.9,
      paddingtop: 0,
      paddingbottom: 0,
    })[0];
    setVisualObj(visualObj);
  }, [abc, setVisualObj]);

  return (
    <div className="notation">
      <div ref={containerRef} id="notation" />
    </div>
  );
}
