import "./SettingsScreen.css";
import type { Chapter } from "../data/library";

type PlayPlaceholderProps = {
  chapter: Chapter | null;
  onBack: () => void;
};

export default function PlayPlaceholder({ chapter, onBack }: PlayPlaceholderProps) {
  return (
    <div className="settings-screen">
      <div className="settings-panel">
        <h2 className="settings-title">{chapter?.title ?? "Chapter"}</h2>
        <p style={{ fontFamily: "var(--font-ui)", color: "var(--parchment)", textAlign: "center", lineHeight: 1.6 }}>
          {chapter?.blurb ?? "This tale is still being written."}
          <br />
          Come back soon, traveler.
        </p>
        <button className="pixel-btn" onClick={onBack}>
          Back to Chapters
        </button>
      </div>
    </div>
  );
}
