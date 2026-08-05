import LockIcon from "./LockIcon";
import type { Book } from "../data/library";

type BookCoverCardProps = {
  book: Book;
  isFocused: boolean;
  onClick: () => void;
};

export default function BookCoverCard({ book, isFocused, onClick }: BookCoverCardProps) {
  return (
    <button
      className={`book-cover book-cover--${book.accent}${isFocused ? " is-focused" : ""}${book.locked ? " is-locked" : ""}`}
      onClick={onClick}
      aria-label={book.locked ? `${book.title} (locked)` : `Focus ${book.title}`}
    >
      <span className="book-spine-edge" aria-hidden="true">
        <span className="book-spine-ring" />
        <span className="book-spine-ring" />
      </span>

      <span className="book-corner book-corner--tl" aria-hidden="true" />
      <span className="book-corner book-corner--tr" aria-hidden="true" />
      <span className="book-corner book-corner--bl" aria-hidden="true" />
      <span className="book-corner book-corner--br" aria-hidden="true" />

      <span className="book-cover-face">
        <span className="book-cover-title">{book.title}</span>
        <svg className="book-divider" viewBox="0 0 60 10" aria-hidden="true">
          <line x1="0" y1="5" x2="22" y2="5" />
          <line x1="38" y1="5" x2="60" y2="5" />
          <path d="M30 1 L34 5 L30 9 L26 5 Z" />
        </svg>
        <span className="book-cover-category">{book.category}</span>
      </span>

      {book.locked && (
        <span className="book-cover-lock">
          <LockIcon />
        </span>
      )}
    </button>
  );
}
