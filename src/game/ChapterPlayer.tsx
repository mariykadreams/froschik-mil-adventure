import { useEffect, useMemo, useRef, useState } from "react";
import type { Beat, DialogueLine, SceneId, TrackerCard } from "../data/chapter1";
import { FROSKO_PORTRAIT } from "../data/chapter1";
import JournalIcon from "../components/JournalIcon";
import "./ChapterPlayer.css";

type ChapterPlayerProps = {
  beats: Record<SceneId, Beat>;
  startId: SceneId;
  chapterTitle: string;
  onExit: () => void;
  onComplete: () => void;
};

type LogEntry = {
  id: string;
  kind: "story" | "dialogue" | "question" | "trap";
  speaker?: string;
  emote?: string;
  text: string;
};

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function lineToEntry(line: DialogueLine): Omit<LogEntry, "id"> {
  if (typeof line === "string") return { kind: "story", text: line };
  return { kind: "dialogue", speaker: line.speaker, emote: line.emote, text: line.text };
}

function beatOpeningEntries(beat: Beat): Omit<LogEntry, "id">[] {
  switch (beat.type) {
    case "cutscene":
      return beat.lines.map(lineToEntry);
    case "hub":
    case "echo-tutorial":
    case "tracker":
      return beat.intro.map(lineToEntry);
    case "debrief":
      return [
        ...beat.lines.map(lineToEntry),
        { kind: "dialogue", speaker: beat.lessonTitle, text: beat.lessonText },
      ];
    default:
      return [];
  }
}

function Line({ line }: { line: DialogueLine }) {
  if (typeof line === "string") {
    return <p className="story-line">{line}</p>;
  }
  return (
    <p className="story-line story-line--dialogue">
      <span className="story-speaker">{line.speaker}:</span>{" "}
      {line.emote && <em className="story-emote">({line.emote}) </em>}
      &ldquo;{line.text}&rdquo;
    </p>
  );
}

export default function ChapterPlayer({ beats, startId, chapterTitle, onExit, onComplete }: ChapterPlayerProps) {
  const [currentId, setCurrentId] = useState(startId);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());
  const [evidence, setEvidence] = useState<Set<string>>(new Set());
  const [trapMessage, setTrapMessage] = useState<string | null>(null);

  const [echoInput, setEchoInput] = useState("");
  const [echoSubmitted, setEchoSubmitted] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [trackerResult, setTrackerResult] = useState<"idle" | "success" | "fail">("idle");

  const logIdRef = useRef(0);
  const [log, setLog] = useState<LogEntry[]>(() =>
    beatOpeningEntries(beats[startId]).map((e) => ({ ...e, id: `log-${logIdRef.current++}` })),
  );
  const [logOpen, setLogOpen] = useState(false);
  const logEntriesRef = useRef<HTMLDivElement>(null);

  const beat = beats[currentId];

  const shuffledCards = useMemo<TrackerCard[]>(() => {
    if (beat.type !== "tracker") return [];
    return shuffle(beat.cards);
  }, [beat]);

  useEffect(() => {
    if (logOpen && logEntriesRef.current) {
      logEntriesRef.current.scrollTop = logEntriesRef.current.scrollHeight;
    }
  }, [logOpen]);

  const pushLog = (entries: Omit<LogEntry, "id">[]) => {
    setLog((prev) => [...prev, ...entries.map((e) => ({ ...e, id: `log-${logIdRef.current++}` }))]);
  };

  const goTo = (next: SceneId) => {
    setCurrentId(next);
    setAskedQuestions(new Set());
    setTrapMessage(null);
    setEchoInput("");
    setEchoSubmitted(false);
    setSelectedOrder([]);
    setTrackerResult("idle");
    pushLog(beatOpeningEntries(beats[next]));
  };

  const askQuestion = (
    id: string,
    speaker: string,
    prompt: string,
    reply: string,
    emote?: string,
    addsEvidence?: string,
  ) => {
    setAskedQuestions((prev) => new Set(prev).add(id));
    if (addsEvidence) {
      setEvidence((prev) => new Set(prev).add(addsEvidence));
    }
    pushLog([
      { kind: "question", text: prompt },
      { kind: "dialogue", speaker, emote, text: reply },
    ]);
  };

  const triggerTrap = (trapText: string) => {
    setTrapMessage(trapText);
    pushLog([{ kind: "trap", text: trapText }]);
  };

  const pickTrackerCard = (id: string) => {
    if (trackerResult !== "idle" || selectedOrder.includes(id)) return;
    const beatT = beat.type === "tracker" ? beat : null;
    if (!beatT) return;
    const nextOrder = [...selectedOrder, id];
    setSelectedOrder(nextOrder);
    if (nextOrder.length === beatT.correctOrder.length) {
      const isCorrect = nextOrder.every((cardId, i) => cardId === beatT.correctOrder[i]);
      if (isCorrect) {
        setTrackerResult("success");
        setEvidence((prev) => new Set(prev).add("COMPLETED_TRACKER"));
        const scarLabels = beatT.cards
          .filter((c) => c.scarMark)
          .map((c) => c.label)
          .join(" and ");
        pushLog([
          {
            kind: "story",
            text: "Locked into place, the claim visibly grows at every hop — a few branches become a whole wood on fire.",
          },
          {
            kind: "story",
            text: `Two links carry the same raw, splintered scar: ${scarLabels}. It doesn't match any creature Frosko has met.`,
          },
        ]);
      } else {
        setTrackerResult("fail");
        pushLog([{ kind: "trap", text: beatT.failText }]);
      }
    }
  };

  const npcPortrait = "portrait" in beat ? beat.portrait : undefined;

  return (
    <div className="chapter-play-screen">
      <div
        className="scene-background pixelated"
        style={beat.background ? { backgroundImage: `url(${beat.background})` } : undefined}
      />
      <div className="scene-vignette" />

      {npcPortrait && <img key={npcPortrait} src={npcPortrait} className="npc-portrait pixelated" alt="" />}

      <img src={FROSKO_PORTRAIT} className="frosko-portrait pixelated" alt="Frosko" />

      <button className="chapter-back-arrow" onClick={onExit} aria-label="Leave chapter">
        <img src="/assets/book/arrow.png" className="pixelated back-arrow-icon" alt="" />
      </button>

      <button className="chapter-log-button" onClick={() => setLogOpen(true)} aria-label="View Frosko's journal">
        <JournalIcon />
      </button>

      {logOpen && (
        <div className="log-overlay" onClick={() => setLogOpen(false)}>
          <div className="log-panel" onClick={(e) => e.stopPropagation()}>
            <div className="log-panel-header">
              <h2 className="log-panel-title">Frosko&apos;s Journal</h2>
              <button className="log-close-btn" onClick={() => setLogOpen(false)} aria-label="Close journal">
                &times;
              </button>
            </div>
            <div className="log-entries" ref={logEntriesRef}>
              {log.map((entry) => (
                <div key={entry.id} className={`log-entry log-entry--${entry.kind}`}>
                  {entry.kind === "trap" && <span className="log-entry-tag">Wrong turn</span>}
                  {entry.kind === "question" && <span className="log-entry-tag log-entry-tag--question">Frosko asked</span>}
                  <p className="log-entry-text">
                    {entry.kind === "dialogue" ? (
                      <>
                        {entry.speaker && <span className="story-speaker">{entry.speaker}:</span>}{" "}
                        {entry.emote && <em className="story-emote">({entry.emote}) </em>}
                        &ldquo;{entry.text}&rdquo;
                      </>
                    ) : (
                      entry.text
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="chapter-play-content">
        <header className="chapter-play-header">
          <h1 className="chapter-play-title">{chapterTitle}</h1>
          {"location" in beat && beat.location && <p className="chapter-play-location">{beat.location}</p>}
        </header>

        <div className="chapter-play-panel">
          {beat.type === "cutscene" && (
            <>
              <div className="story-lines">
                {beat.lines.map((line, i) => (
                  <Line key={i} line={line} />
                ))}
              </div>
              <div className="chapter-actions">
                <button className="pixel-btn" onClick={() => goTo(beat.next)}>
                  Continue
                </button>
              </div>
            </>
          )}

          {beat.type === "echo-tutorial" && (
            <>
              <div className="story-lines">
                {beat.intro.map((line, i) => (
                  <Line key={i} line={line} />
                ))}
              </div>

              {!echoSubmitted ? (
                <form
                  className="echo-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!echoInput.trim()) return;
                    setEchoSubmitted(true);
                    pushLog([
                      { kind: "dialogue", speaker: "Frosko", text: echoInput },
                      { kind: "story", text: `"${echoInput.toUpperCase()} — THEY MEAN TO BURN US ALL!"` },
                    ]);
                  }}
                >
                  <input
                    className="echo-input"
                    type="text"
                    value={echoInput}
                    onChange={(e) => setEchoInput(e.target.value)}
                    placeholder="Say something into the Hollow..."
                    maxLength={60}
                  />
                  <button className="pixel-btn" type="submit" disabled={!echoInput.trim()}>
                    Speak
                  </button>
                </form>
              ) : (
                <>
                  <div className="story-lines echo-lines">
                    <p className="story-line echo-line">&ldquo;{echoInput}&rdquo;</p>
                    <p className="story-line echo-line echo-line--bigger">&ldquo;{echoInput.toUpperCase()}!&rdquo;</p>
                    <p className="story-line echo-line echo-line--biggest">
                      &ldquo;{echoInput.toUpperCase()} — THEY MEAN TO BURN US ALL!&rdquo;
                    </p>
                    <p className="story-line">
                      The Hollow hands every word back bigger than it was given. Frosko understands, now, how a
                      whisper becomes a certainty.
                    </p>
                  </div>
                  <div className="chapter-actions">
                    <button className="pixel-btn" onClick={() => goTo(beat.next)}>
                      Continue
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {beat.type === "hub" && (
            <>
              <div className="story-lines">
                {beat.intro.map((line, i) => (
                  <Line key={i} line={line} />
                ))}
              </div>

              <h3 className="section-label section-label--questions">
                <span className="section-label-icon">?</span>
                Ask {beat.speaker}
              </h3>
              <div className="question-list">
                {beat.questions.map((q) => {
                  const asked = askedQuestions.has(q.id);
                  return (
                    <div key={q.id} className="question-block">
                      <button
                        className={`question-btn${asked ? " is-asked" : ""}`}
                        onClick={() => askQuestion(q.id, beat.speaker, q.prompt, q.reply, q.emote, q.addsEvidence)}
                      >
                        <span className="question-btn-icon">?</span>
                        {q.prompt}
                      </button>
                      {asked && (
                        <p className="story-line story-line--dialogue question-reply">
                          <span className="story-speaker">{beat.speaker}:</span>{" "}
                          {q.emote && <em className="story-emote">({q.emote}) </em>}
                          &ldquo;{q.reply}&rdquo;
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {trapMessage && <p className="trap-message">{trapMessage}</p>}

              <h3 className="section-label section-label--actions">
                <span className="section-label-icon">&#9656;</span>
                What will Frosko do?
              </h3>
              <div className="chapter-actions chapter-actions--choices">
                {beat.exits.map((exit) => {
                  if (exit.kind === "trap") {
                    return (
                      <button
                        key={exit.id}
                        className="pixel-btn choice-btn trap-btn"
                        onClick={() => triggerTrap(exit.trapText)}
                      >
                        {exit.label}
                      </button>
                    );
                  }
                  const locked = !!exit.requiresQuestionId && !askedQuestions.has(exit.requiresQuestionId);
                  return (
                    <button
                      key={exit.id}
                      className="pixel-btn choice-btn advance-btn"
                      disabled={locked}
                      title={locked ? exit.hint : undefined}
                      onClick={() => goTo(exit.next)}
                    >
                      {exit.label}
                      {locked && exit.hint && <span className="advance-hint"> ({exit.hint})</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {beat.type === "tracker" && (
            <>
              <div className="story-lines">
                {beat.intro.map((line, i) => (
                  <Line key={i} line={line} />
                ))}
              </div>

              <div className="tracker-selected">
                {selectedOrder.length === 0 && <p className="tracker-hint">Tap the accounts in the order they were told.</p>}
                {selectedOrder.map((id, i) => {
                  const card = beat.cards.find((c) => c.id === id)!;
                  return (
                    <span key={id} className="tracker-chip">
                      {i + 1}. {card.label}
                    </span>
                  );
                })}
              </div>

              <div className="tracker-cards">
                {shuffledCards.map((card) => (
                  <button
                    key={card.id}
                    className="tracker-card"
                    disabled={selectedOrder.includes(card.id) || trackerResult !== "idle"}
                    onClick={() => pickTrackerCard(card.id)}
                  >
                    <span className="tracker-card-label">{card.label}</span>
                    <span className="tracker-card-quote">&ldquo;{card.quote}&rdquo;</span>
                  </button>
                ))}
              </div>

              {trackerResult === "fail" && (
                <>
                  <p className="trap-message">{beat.failText}</p>
                  <div className="chapter-actions">
                    <button
                      className="pixel-btn"
                      onClick={() => {
                        setSelectedOrder([]);
                        setTrackerResult("idle");
                      }}
                    >
                      Try Again
                    </button>
                  </div>
                </>
              )}

              {trackerResult === "success" && (
                <>
                  <div className="story-lines">
                    <p className="story-line">
                      Locked into place, the claim visibly grows at every hop — a few branches become a whole wood
                      on fire.
                    </p>
                    <p className="story-line">
                      Two links carry the same raw, splintered scar:{" "}
                      {beat.cards
                        .filter((c) => c.scarMark)
                        .map((c) => c.label)
                        .join(" and ")}
                      . It doesn't match any creature Frosko has met.
                    </p>
                  </div>
                  <div className="chapter-actions">
                    <button className="pixel-btn" onClick={() => goTo(beat.next)}>
                      Continue
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {beat.type === "debrief" && (
            <>
              <div className="story-lines">
                {beat.lines.map((line, i) => (
                  <Line key={i} line={line} />
                ))}
              </div>

              <div className="debrief-card">
                <h2 className="debrief-title">{beat.lessonTitle}</h2>
                <p className="debrief-text">{beat.lessonText}</p>
              </div>

              <div className="chapter-actions">
                <button className="pixel-btn" onClick={onComplete}>
                  Chapter Complete
                </button>
              </div>
            </>
          )}
        </div>

        {evidence.size > 0 && <p className="evidence-counter">Evidence gathered: {evidence.size}</p>}
      </div>
    </div>
  );
}
