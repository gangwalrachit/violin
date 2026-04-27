import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const strings = [
  { thickness: 3.5, note: "A3" },
  { thickness: 2.5, note: "D4" },
  { thickness: 1.5, note: "A4" },
  { thickness: 0.8, note: "D5" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-theme-toggle">
        <ThemeToggle />
      </div>

      <div className="landing-content">
        <h1 className="landing-title anim-rise">Violin Practice</h1>
        <p className="landing-subtitle anim-rise anim-delay-1">
          First position exercises & songs
        </p>

        <div className="fingerboard anim-rise anim-delay-2">
          {strings.map((s, si) => (
            <div className="fb-string" key={si}>
              <div
                className="fb-open"
                style={{ animationDelay: `${0.5 + si * 0.1}s` }}
              >
                {s.note}
              </div>
              <div className="fb-board">
                <div
                  className="fb-line"
                  style={{
                    height: `${s.thickness}px`,
                    animationDelay: `${0.4 + si * 0.1}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="landing-actions anim-rise anim-delay-3">
          <button
            className="landing-btn"
            onClick={() => navigate("/exercises")}
          >
            Exercises
          </button>
          <button
            className="landing-btn"
            onClick={() => navigate("/songs")}
          >
            Songs
          </button>
        </div>
      </div>
    </div>
  );
}
