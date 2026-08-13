import { useEffect, useRef, useState } from "react";
import { books } from "../data/library";
import type { Book } from "../data/library";
import BookCoverCard from "../components/BookCoverCard";
import "./LibraryScreen.css";

const CARD_W = 280;
const GAP = 40;
const STEP = CARD_W + GAP;

type LibraryScreenProps = {
  onBack: () => void;
  onChooseBook: (book: Book) => void;
};

export default function LibraryScreen({ onBack, onChooseBook }: LibraryScreenProps) {
  const [focusIndex, setFocusIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);

  const focusedBook = books[focusIndex];

  const goTo = (index: number) => {
    setFocusIndex(((index % books.length) + books.length) % books.length);
  };

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goTo(focusIndex - 1);
      if (e.key === "ArrowRight") goTo(focusIndex + 1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusIndex]);

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - dragStartX.current);
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -60) goTo(focusIndex + 1);
    else if (dragOffset > 60) goTo(focusIndex - 1);
    setDragOffset(0);
  };

  const trackOffset = -(focusIndex * STEP + CARD_W / 2) + dragOffset;

  return (
    <div className="library-screen">
      <div className="pixel-backdrop" />

      <div className="library-content">
        <header className="library-header">
          <h1 className="library-title">The Shelf</h1>
          <p className="library-subtitle">Choose a tale to learn from</p>
        </header>

        <div className="carousel-viewport">
          <button
            className="carousel-arrow carousel-arrow--prev"
            onClick={() => goTo(focusIndex - 1)}
            aria-label="Previous book"
          >
            <img src={`${import.meta.env.BASE_URL}assets/book/arrow.png`} className="pixelated arrow-icon arrow-icon--prev" alt="" />
          </button>

          <div
            className="carousel-mask"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <div
              className={`carousel-track${isDragging ? " is-dragging" : ""}`}
              style={{ transform: `translateX(${trackOffset}px)` }}
            >
              {books.map((book, i) => (
                <BookCoverCard key={book.id} book={book} isFocused={i === focusIndex} onClick={() => goTo(i)} />
              ))}
            </div>
          </div>

          <button
            className="carousel-arrow carousel-arrow--next"
            onClick={() => goTo(focusIndex + 1)}
            aria-label="Next book"
          >
            <img src={`${import.meta.env.BASE_URL}assets/book/arrow.png`} className="pixelated arrow-icon" alt="" />
          </button>
        </div>

        <div className="focused-book-meta">
          <h2 className="focused-book-title">{focusedBook.title}</h2>
          <p className="focused-book-category">{focusedBook.category}</p>
          <button
            className="pixel-btn choose-btn"
            disabled={focusedBook.locked}
            onClick={() => onChooseBook(focusedBook)}
          >
            {focusedBook.locked ? "Locked" : "Choose"}
          </button>
        </div>

        <button className="pixel-btn library-back" onClick={onBack}>
          Back
        </button>

        <p className="library-credit">
          Book UI by{" "}
          <a href="https://crusenho.itch.io/complete-ui-book-styles-pack" target="_blank" rel="noreferrer">
            Crusenho
          </a>
          {" · "}
          Music: "Fairytale Waltz" by{" "}
          <a href="https://incompetech.com" target="_blank" rel="noreferrer">
            Kevin MacLeod
          </a>{" "}
          (
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
            CC BY 4.0
          </a>
          )
        </p>
      </div>
    </div>
  );
}
