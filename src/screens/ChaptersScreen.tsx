import LockIcon from "../components/LockIcon";
import type { Book, Chapter } from "../data/library";
import "./ChaptersScreen.css";

type ChaptersScreenProps = {
  book: Book;
  onBack: () => void;
  onSelectChapter: (chapter: Chapter) => void;
};

export default function ChaptersScreen({ book, onBack, onSelectChapter }: ChaptersScreenProps) {
  return (
    <div className="chapters-screen">
      <div className="pixel-backdrop" />

      <div className="chapters-content">
        <div className="chapters-stage">
          <div className="open-book">
            <div className="page page--left">
              <img src={`${import.meta.env.BASE_URL}assets/book/page-left.png`} className="pixelated page-bg" alt="" />
              <div className="page-content">
                <h2 className="page-title">{book.title}</h2>
                <p className="page-category">{book.category}</p>
                <p className="page-hint">Pick a chapter to begin reading.</p>
              </div>
            </div>

            <div className="page page--right">
              <img src={`${import.meta.env.BASE_URL}assets/book/page-right.png`} className="pixelated page-bg" alt="" />
              <div className="page-content">
                <ul className="chapter-list">
                  {book.chapters.map((chapter) => (
                    <li key={chapter.id}>
                      <button
                        className={`chapter-slot${chapter.locked ? " is-locked" : ""}`}
                        disabled={chapter.locked}
                        onClick={() => onSelectChapter(chapter)}
                      >
                        <span className="chapter-title">{chapter.title}</span>
                        {chapter.locked && (
                          <span className="chapter-lock">
                            <LockIcon />
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <button className="pixel-btn chapters-back" onClick={onBack}>
          Back to Shelf
        </button>
      </div>
    </div>
  );
}
