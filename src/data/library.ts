export type TopicAccent = "disinfo" | "ai-safety";

export type Chapter = {
  id: string;
  title: string;
  locked: boolean;
  blurb?: string;
};

export type Book = {
  id: string;
  title: string;
  category: string;
  accent: TopicAccent;
  locked: boolean;
  chapters: Chapter[];
};

export const books: Book[] = [
  {
    id: "whispering-wood",
    title: "The Whispering Wood",
    category: "Disinformation",
    accent: "disinfo",
    locked: false,
    chapters: [
      {
        id: "kingdom_1_mavka",
        title: "Kingdom I — The Whispering Wood",
        locked: false,
        blurb: "Echo chambers and rumor, in a forest that repeats everything it hears.",
      },
      { id: "kingdom_2_placeholder", title: "Kingdom II", locked: true },
    ],
  },
  {
    id: "disinfo-2",
    title: "Coming Soon",
    category: "Disinformation",
    accent: "disinfo",
    locked: true,
    chapters: [],
  },
  {
    id: "disinfo-3",
    title: "Coming Soon",
    category: "Disinformation",
    accent: "disinfo",
    locked: true,
    chapters: [],
  },
  {
    id: "mirror-lake",
    title: "The Mirror Lake",
    category: "Safety with AI",
    accent: "ai-safety",
    locked: true,
    chapters: [],
  },
  {
    id: "ai-safety-2",
    title: "Coming Soon",
    category: "Safety with AI",
    accent: "ai-safety",
    locked: true,
    chapters: [],
  },
];
