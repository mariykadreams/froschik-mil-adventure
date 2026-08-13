const VOLUME_KEY = "musicVolume";
const DEFAULT_VOLUME = 70;
const TRACK_SRC = `${import.meta.env.BASE_URL}audio/chapter-theme.mp3`;

let element: HTMLAudioElement | null = null;

function getElement(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!element) {
    element = new Audio(TRACK_SRC);
    element.loop = true;
    element.volume = getMusicVolume() / 100;
  }
  return element;
}

export function getMusicVolume(): number {
  if (typeof window === "undefined") return DEFAULT_VOLUME;
  const stored = window.localStorage.getItem(VOLUME_KEY);
  const parsed = stored === null ? DEFAULT_VOLUME : Number(stored);
  return Number.isFinite(parsed) ? Math.min(100, Math.max(0, parsed)) : DEFAULT_VOLUME;
}

export function setMusicVolume(volume: number) {
  const clamped = Math.min(100, Math.max(0, volume));
  window.localStorage.setItem(VOLUME_KEY, String(clamped));
  const el = getElement();
  if (el) el.volume = clamped / 100;
}

export function playChapterMusic() {
  const el = getElement();
  if (!el) return;
  el.currentTime = 0;
  void el.play().catch(() => {
    // Autoplay was blocked (no prior user gesture on this page load) — music
    // will start on the next chapter mount instead.
  });
}

export function stopChapterMusic() {
  if (!element) return;
  element.pause();
  element.currentTime = 0;
}
