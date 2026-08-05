import PixelForestScene from "../components/PixelForestScene";
import "./MainMenu.css";

type MainMenuProps = {
  onPlay: () => void;
  onSettings: () => void;
};

export default function MainMenu({ onPlay, onSettings }: MainMenuProps) {
  return (
    <div className="menu-screen">
      <PixelForestScene />
      <div className="menu-vignette" />

      <div className="menu-content">
        <div className="menu-title-block">
          <h1 className="menu-title">Froschik</h1>
          <p className="menu-subtitle">MIL Adventure</p>
        </div>

        <nav className="menu-buttons">
          <button className="pixel-btn" onClick={onPlay}>
            Play
          </button>
          <button className="pixel-btn" onClick={onSettings}>
            Settings
          </button>
        </nav>
      </div>

      <p className="menu-footer">A folktale MIL adventure &middot; UNESCO Youth Hackathon 2026</p>
    </div>
  );
}
