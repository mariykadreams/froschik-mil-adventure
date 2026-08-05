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
      <span className="book-cover-art" aria-hidden="true" />
      <span className="book-cover-title-plate">
        <span className="book-cover-title">{book.title}</span>
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
