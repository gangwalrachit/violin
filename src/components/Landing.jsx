import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const strings = [
  { thickness: 3.5, note: "G3" },
  { thickness: 2.5, note: "D4" },
  { thickness: 1.5, note: "A4" },
  { thickness: 0.8, note: "E5" },
];

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.53C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-theme-toggle">
        <ThemeToggle />
      </div>

      <div className="landing-content">
        <h1 className="landing-title anim-rise">String Theory</h1>
        <p className="landing-subtitle anim-rise anim-delay-1">
          Violin Practice &amp; Lessons
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
                    "--thickness": `${s.thickness}px`,
                    animationDelay: `${0.4 + si * 0.1}s`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="landing-ready anim-rise anim-delay-3">Ready to begin?</p>

        <div className="landing-actions anim-rise anim-delay-4">
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

      <footer className="landing-footer">
        <div className="landing-credit">
          <span>As taught by Madhav Sharma</span>
          <div className="landing-socials">
            <a
              href="https://instagram.com/madhavviolin"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-social-link"
              aria-label="Madhav Violin on Instagram"
              title="@madhavviolin"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://youtube.com/@MadhavViolinofficialchannel"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-social-link"
              aria-label="Madhav Violin Official on YouTube"
              title="@MadhavViolinofficialchannel"
            >
              <YouTubeIcon />
            </a>
            <a
              href="https://youtube.com/@ViolinWithMadhav"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-social-link"
              aria-label="Violin With Madhav on YouTube"
              title="@ViolinWithMadhav"
            >
              <YouTubeIcon />
            </a>
            <a
              href="https://github.com/gangwalrachit/violin/"
              target="_blank"
              rel="noopener noreferrer"
              className="landing-social-link landing-github"
              aria-label="Source code on GitHub"
              title="View source on GitHub"
            >
              <GitHubIcon />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
