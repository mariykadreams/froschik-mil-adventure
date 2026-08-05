import { useState } from "react";
import MainMenu from "./screens/MainMenu";
import SettingsScreen from "./screens/SettingsScreen";
import LibraryScreen from "./screens/LibraryScreen";
import ChaptersScreen from "./screens/ChaptersScreen";
import PlayPlaceholder from "./screens/PlayPlaceholder";
import type { Book, Chapter } from "./data/library";

type Screen = "menu" | "settings" | "library" | "chapters" | "play";

function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);

  switch (screen) {
    case "settings":
      return <SettingsScreen onBack={() => setScreen("menu")} />;

    case "library":
      return (
        <LibraryScreen
          onBack={() => setScreen("menu")}
          onChooseBook={(book) => {
            if (book.locked) return;
            setActiveBook(book);
            setScreen("chapters");
          }}
        />
      );

    case "chapters":
      if (!activeBook) {
        setScreen("library");
        return null;
      }
      return (
        <ChaptersScreen
          book={activeBook}
          onBack={() => setScreen("library")}
          onSelectChapter={(chapter) => {
            if (chapter.locked) return;
            setActiveChapter(chapter);
            setScreen("play");
          }}
        />
      );

    case "play":
      return <PlayPlaceholder chapter={activeChapter} onBack={() => setScreen("chapters")} />;

    default:
      return <MainMenu onPlay={() => setScreen("library")} onSettings={() => setScreen("settings")} />;
  }
}

export default App;
