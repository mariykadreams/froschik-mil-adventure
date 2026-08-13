import { useState } from "react";
import { getMusicVolume, setMusicVolume } from "../audio/music";
import "./SettingsScreen.css";

type SettingsScreenProps = {
  onBack: () => void;
};

export default function SettingsScreen({ onBack }: SettingsScreenProps) {
  const [volume, setVolume] = useState(getMusicVolume);

  return (
    <div className="settings-screen">
      <div className="settings-panel">
        <h2 className="settings-title">Settings</h2>

        <div className="settings-row">
          <label htmlFor="volume">Music Volume</label>
          <input
            id="volume"
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => {
              const next = Number(e.target.value);
              setVolume(next);
              setMusicVolume(next);
            }}
          />
        </div>

        <div className="settings-row">
          <label htmlFor="text-speed">Text Speed</label>
          <input id="text-speed" type="range" min={0} max={100} defaultValue={50} />
        </div>

        <button className="pixel-btn" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
