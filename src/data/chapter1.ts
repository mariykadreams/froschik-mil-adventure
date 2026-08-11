export type DialogueLine =
  | string
  | {
      speaker: string;
      text: string;
      emote?: string;
    };

export type Question = {
  id: string;
  prompt: string;
  reply: string;
  emote?: string;
  addsEvidence?: string;
};

export type ExitAction =
  | {
      id: string;
      kind: "advance";
      label: string;
      next: SceneId;
      requiresQuestionId?: string;
      hint?: string;
    }
  | {
      id: string;
      kind: "trap";
      label: string;
      trapText: string;
    };

export type SceneId = string;

export type CutsceneBeat = {
  type: "cutscene";
  id: SceneId;
  location?: string;
  background?: string;
  portrait?: string;
  lines: DialogueLine[];
  next: SceneId;
};

export type HubBeat = {
  type: "hub";
  id: SceneId;
  location?: string;
  background?: string;
  portrait?: string;
  speaker: string;
  intro: DialogueLine[];
  questions: Question[];
  exits: ExitAction[];
};

export type EchoTutorialBeat = {
  type: "echo-tutorial";
  id: SceneId;
  location?: string;
  background?: string;
  intro: DialogueLine[];
  next: SceneId;
};

export type TrackerCard = {
  id: string;
  label: string;
  quote: string;
  scarMark?: boolean;
};

export type TrackerBeat = {
  type: "tracker";
  id: SceneId;
  background?: string;
  intro: DialogueLine[];
  cards: TrackerCard[];
  correctOrder: string[];
  failText: string;
  next: SceneId;
};

export type DebriefBeat = {
  type: "debrief";
  id: SceneId;
  background?: string;
  portrait?: string;
  lines: DialogueLine[];
  lessonTitle: string;
  lessonText: string;
};

export type Beat = CutsceneBeat | HubBeat | EchoTutorialBeat | TrackerBeat | DebriefBeat;

export const CHAPTER1_START: SceneId = "s_intro";

const BG = {
  village1: "/images/bg/village-1.png",
  village2: "/images/bg/village-2.png",
  village3: "/images/bg/village-3.png",
  hollow1: "/images/bg/hollow-1.png",
  hollow2: "/images/bg/hollow-2.png",
  river1: "/images/bg/river-1.png",
  river2: "/images/bg/river-2.png",
  treeClearing: "/images/bg/tree-clearing.png",
};

const PORTRAIT = {
  yarema: "/images/characters/yarema.png",
  ostap: "/images/characters/ostap.png",
  mavka: "/images/characters/mavka.png",
  berehynia: "/images/characters/rusalka-1.png",
  lelia: "/images/characters/rusalka-2.png",
  sukhostiy: "/images/characters/sukhostiy.png",
};

// Idle "blink" frame for each portrait that has one — swapped in briefly and
// on a loop to make the standing character art feel alive rather than static.
const PORTRAIT_BLINK: Record<string, string> = {
  [PORTRAIT.yarema]: "/images/characters/yarema-blink.png",
  [PORTRAIT.ostap]: "/images/characters/ostap-blink.png",
  [PORTRAIT.mavka]: "/images/characters/mavka-blink.png",
  [PORTRAIT.berehynia]: "/images/characters/rusalka-1-blink.png",
  [PORTRAIT.lelia]: "/images/characters/rusalka-2-blink.png",
  [PORTRAIT.sukhostiy]: "/images/characters/sukhostiy-blink.png",
};

export function getPortraitBlink(portrait?: string): string | undefined {
  return portrait ? PORTRAIT_BLINK[portrait] : undefined;
}

export const FROSKO_PORTRAIT = "/images/characters/frosko.png";

export const chapter1Beats: Record<SceneId, Beat> = {
  s_intro: {
    type: "cutscene",
    id: "s_intro",
    location: "Somewhere on the road",
    background: BG.village1,
    lines: [
      "Frosko is a traveler by trade and by nature — the kind who can't walk past something strange without stopping to ask why.",
      "Word reaches him of a village called Verbivka, where the forest has gone quiet in all the wrong ways. Something there doesn't add up.",
      "Frosko means to find out what — and, more than that, why everyone there is so certain they already know.",
    ],
    next: "s0_road",
  },

  s0_road: {
    type: "cutscene",
    id: "s0_road",
    location: "The Road to Verbivka",
    background: BG.village1,
    lines: [
      "The road runs through forest at dusk. A wooden sign leans at the treeline: VERBIVKA — 1 mile.",
      "Somewhere in the trees, singing rises — and breaks, mid-note, into a keening cry.",
      "Birds burst from the canopy all at once, all of them flying the wrong way: toward the road, away from the trees.",
    ],
    next: "s1_village",
  },

  s1_village: {
    type: "hub",
    id: "s1_village",
    location: "Verbivka, at the gate",
    background: BG.village1,
    portrait: PORTRAIT.yarema,
    speaker: "Yarema",
    intro: [
      "Every village Frosko has walked leans toward its forest — for wood, for berries, for shade. This one has turned its back on the trees.",
      "The gate is barred with fresh-cut timber. A well-worn path to the forest is roped off and already going wild. A woodcutter's axe lies rusting; the woodshed is half-empty. A mother pulls her child back from the treeline.",
      { speaker: "Yarema", text: "Far enough, traveler. Wood's gone strange." },
    ],
    questions: [
      {
        id: "why_afraid",
        prompt: "Why won't anyone go near the forest?",
        reply:
          "The wood's gone mad — keening like something's dying in there, day and night. Six days now. No one's fool enough to set foot past the gate.",
      },
      {
        id: "six_days_ago",
        prompt: "What happened six days ago?",
        reply:
          "Ostap went in for firewood. Came back white as milk, said the trees were watching him. Since then — this.",
      },
      {
        id: "burn_plan",
        prompt: "Is the village planning to burn the forest?",
        reply: "Burn it? No. Why would we — where did you hear that?",
        emote: "genuinely startled",
        addsEvidence: "YAREMA_DENIAL",
      },
    ],
    exits: [
      {
        id: "to_ostap",
        kind: "advance",
        label: "Go find Ostap.",
        next: "s2_ostap",
        requiresQuestionId: "six_days_ago",
        hint: "Ask what happened six days ago first.",
      },
      {
        id: "warn_others",
        kind: "trap",
        label: "Warn the village that the forest means them harm.",
        trapText:
          "Frosko almost shouts it across the square — before he's confirmed a single thing. He catches himself. Warning everyone before checking anything is exactly how a rumor spreads.",
      },
      {
        id: "leave_village",
        kind: "trap",
        label: "This isn't his problem. Turn around and leave.",
        trapText:
          "Frosko turns to go — and stops. Walking away won't tell him what's actually happening here.",
      },
    ],
  },

  s2_ostap: {
    type: "hub",
    id: "s2_ostap",
    location: "Ostap's woodpile",
    background: BG.village2,
    portrait: PORTRAIT.ostap,
    speaker: "Ostap",
    intro: [
      "Ostap sits alone on a woodpile, neighbors turning away as they pass. He's about Frosko's age. He looks sad, not guilty.",
    ],
    questions: [
      {
        id: "what_did_you_do",
        prompt: "What did you actually do in the forest?",
        reply:
          "My own woodpile was stolen. I was cold. I took a few branches near the old grove — that's all. A few branches.",
      },
      {
        id: "bring_fire",
        prompt: "Did you bring fire? Threaten the trees?",
        reply: "Fire? Never. I know how that sounds now. I never so much as struck a flint in there.",
      },
      {
        id: "show_me",
        prompt: "Show me where.",
        reply:
          "Fine. But you'll see — it's nothing. A handful of cut branches, sap still fresh, right at the edge of the Elder Grove. Not inside it.",
        addsEvidence: "REAL_BRANCHES",
      },
    ],
    exits: [
      {
        id: "into_forest",
        kind: "advance",
        label: "Follow the path into the forest.",
        next: "s3_hollow",
        requiresQuestionId: "show_me",
        hint: "Ask Ostap to show you where he cut the branches first.",
      },
      {
        id: "blame_ostap",
        kind: "trap",
        label: "This is his fault. Say so.",
        trapText:
          "Frosko starts to lay the blame on Ostap outright — the boy flinches, and Frosko catches himself. Blaming him without hearing him out is exactly the kind of leap that got the village here.",
      },
    ],
  },

  s3_hollow: {
    type: "echo-tutorial",
    id: "s3_hollow",
    location: "The Treeline & the Hollow",
    background: BG.hollow1,
    intro: [
      "Past the gate, the keening resolves into words — layered, overlapping, dozens of voices at once: \"...they mean to burn us all... they mean to burn us all...\"",
      "It's coming from a natural amphitheater deeper in, a clearing where sound behaves strangely.",
      "Standing in the Hollow, Frosko feels the pull to test it. Say something — anything — into the clearing.",
    ],
    next: "s4_lisovyk",
  },

  s4_lisovyk: {
    type: "hub",
    id: "s4_lisovyk",
    location: "The bent pine",
    background: BG.hollow2,
    speaker: "The Lisovyk",
    intro: [
      "A grumpy, moss-bearded shape resolves out of the bark of a bent pine.",
      {
        speaker: "The Lisovyk",
        text: "Mavka came to me, pale as birch bark. Said a man came into the grove with an axe, meant for burning.",
      },
    ],
    questions: [
      {
        id: "who_told_you",
        prompt: "Who told you?",
        reply: "Mavka told me. She was shaking when she said it.",
      },
      {
        id: "did_you_see_it",
        prompt: "Did you see it yourself?",
        reply:
          "No. But she was so certain — and then I heard it again from the river folk, so it must be true.",
        addsEvidence: "LISOVYK_V1",
      },
    ],
    exits: [
      {
        id: "continue_river",
        kind: "advance",
        label: "Follow the story to the river.",
        next: "s4_berehynia",
        requiresQuestionId: "who_told_you",
        hint: "Ask who told him first.",
      },
      {
        id: "tell_mavka_right_1",
        kind: "trap",
        label: "Tell him Mavka must be right.",
        trapText:
          "Agreeing would just add Frosko's voice to the echo — one more repetition mistaken for confirmation. He holds his tongue instead.",
      },
    ],
  },

  s4_berehynia: {
    type: "hub",
    id: "s4_berehynia",
    location: "The riverbank",
    background: BG.river1,
    portrait: PORTRAIT.berehynia,
    speaker: "Berehynia",
    intro: [
      {
        speaker: "Berehynia",
        text: "The lisovyk told us — a man with FIRE came for the grove. My sister Lelia swears she smelled smoke that very morning!",
      },
    ],
    questions: [
      {
        id: "who_told_you",
        prompt: "Who told you?",
        reply: "The lisovyk. And Lelia backs it — she smelled the smoke herself.",
      },
      {
        id: "did_you_see_it",
        prompt: "Did you smell it yourself?",
        reply: "No… but she did.",
        addsEvidence: "RUSALKA_V2",
      },
    ],
    exits: [
      {
        id: "continue_downstream",
        kind: "advance",
        label: "Follow the story downstream.",
        next: "s4_lelia",
        requiresQuestionId: "who_told_you",
        hint: "Ask who told her first.",
      },
      {
        id: "tell_mavka_right_2",
        kind: "trap",
        label: "Tell her Mavka must be right.",
        trapText:
          "Agreeing would just add Frosko's voice to the echo — one more repetition mistaken for confirmation. He holds his tongue instead.",
      },
    ],
  },

  s4_lelia: {
    type: "hub",
    id: "s4_lelia",
    location: "Further downstream",
    background: BG.river2,
    portrait: PORTRAIT.lelia,
    speaker: "Lelia",
    intro: [
      {
        speaker: "Lelia",
        text: "They mean to burn the whole grove at MIDSUMMER, when the wood is driest — someone told me the very day they'd chosen.",
      },
    ],
    questions: [
      {
        id: "who_told_you",
        prompt: "Who chose that day?",
        reply: "I… don't remember. Everyone knows it.",
        addsEvidence: "RUSALKA_V3",
      },
      {
        id: "did_you_see_it",
        prompt: "Did you see anyone choose it?",
        reply: "No. But it's the kind of thing that's just — true, isn't it?",
      },
    ],
    exits: [
      {
        id: "continue_roost",
        kind: "advance",
        label: "Follow the story to the roost.",
        next: "s4_birdspirit",
        requiresQuestionId: "who_told_you",
        hint: "Ask who chose that date first.",
      },
      {
        id: "tell_mavka_right_3",
        kind: "trap",
        label: "Tell her Mavka must be right.",
        trapText:
          "Agreeing would just add Frosko's voice to the echo — one more repetition mistaken for confirmation. He holds his tongue instead.",
      },
    ],
  },

  s4_birdspirit: {
    type: "hub",
    id: "s4_birdspirit",
    location: "The roost, closest to Mavka",
    background: BG.hollow1,
    speaker: "The Bird-Spirit",
    intro: [
      {
        speaker: "The Bird-Spirit",
        text: "They mean to burn us all. I only tell Mavka what everyone already knows — it's not a secret anymore. Everybody says it.",
      },
    ],
    questions: [
      {
        id: "who_told_you",
        prompt: "Who told you first?",
        reply: "Everyone. That's the point — when everyone says the same thing, who needs a \"first\"?",
        addsEvidence: "BIRD_V4",
      },
      {
        id: "did_you_see_it",
        prompt: "Did you see anything yourself?",
        reply: "See it? No. I heard it. Same thing, in the end.",
      },
    ],
    exits: [
      {
        id: "continue_mavka",
        kind: "advance",
        label: "This is the last voice before Mavka.",
        next: "s5_mavka_early",
        requiresQuestionId: "who_told_you",
        hint: "Ask who told him first.",
      },
      {
        id: "tell_mavka_right_4",
        kind: "trap",
        label: "Tell him Mavka must be right.",
        trapText:
          "Agreeing would just add Frosko's voice to the echo — one more repetition mistaken for confirmation. He holds his tongue instead.",
      },
    ],
  },

  s5_mavka_early: {
    type: "cutscene",
    id: "s5_mavka_early",
    location: "The Hollow",
    background: BG.hollow2,
    portrait: PORTRAIT.mavka,
    lines: [
      "Four voices, and every one of them traces back to Mavka. Frosko goes to her directly.",
      {
        speaker: "Mavka",
        text: "You don't understand. I've asked everyone. Every voice in this wood says the same thing. You'd have me doubt my own kin over one stranger's word?",
      },
      "She won't hear it — not like this. Being told he's wrong, with nothing to show for it, was never going to work. Frosko needs the village's side of it, confirmed, before he comes back.",
    ],
    next: "s6_crosscheck",
  },

  s6_crosscheck: {
    type: "hub",
    id: "s6_crosscheck",
    location: "Verbivka, back at the gate",
    background: BG.village3,
    portrait: PORTRAIT.yarema,
    speaker: "Yarema",
    intro: ["Yarema looks up as Frosko returns from the treeline."],
    questions: [
      {
        id: "midsummer_date",
        prompt: "Was a midsummer date ever chosen to burn the wood?",
        reply: "There's no plan, midsummer or any other day. On my name, there's not.",
        addsEvidence: "YAREMA_CORROBORATION",
      },
    ],
    exits: [
      {
        id: "to_tracker",
        kind: "advance",
        label: "Back to the Hollow — it's time to lay it all out.",
        next: "s7_tracker",
        requiresQuestionId: "midsummer_date",
        hint: "Ask Yarema about the midsummer date first.",
      },
    ],
  },

  s7_tracker: {
    type: "tracker",
    id: "s7_tracker",
    background: BG.hollow1,
    intro: [
      "In the Hollow, Frosko lays out everything he's heard and drags each account into the order it was actually told.",
    ],
    cards: [
      { id: "branches", label: "The Truth", quote: "A cold boy took a few branches from the grove edge." },
      { id: "lisovyk", label: "The Lisovyk", quote: "A man came with an axe, meant for burning." },
      { id: "berehynia", label: "Berehynia", quote: "A man with fire — my sister smelled smoke.", scarMark: true },
      {
        id: "lelia",
        label: "Lelia",
        quote: "They'll burn the whole grove at midsummer.",
        scarMark: true,
      },
      { id: "birdspirit", label: "The Bird-Spirit", quote: "They mean to burn us all — everybody says it." },
      { id: "mavka", label: "Mavka", quote: "Certain. Calling the whole forest to fight." },
    ],
    correctOrder: ["branches", "lisovyk", "berehynia", "lelia", "birdspirit", "mavka"],
    failText: "The story doesn't flow this way — trace who spoke to whom, and try again.",
    next: "s8_sukhostiy",
  },

  s8_sukhostiy: {
    type: "hub",
    id: "s8_sukhostiy",
    location: "The scarred clearing",
    background: BG.treeClearing,
    portrait: PORTRAIT.sukhostiy,
    speaker: "Sukhostiy",
    intro: [
      "The two scarred accounts lead to a clearing apart from the rest of the wood, where one tree stands alone — half its limbs long since gone bare and brittle, the bark split and weeping old sap.",
      "Sukhostiy. Even his name is what's left of him: the dead-standing one.",
      {
        speaker: "Sukhostiy",
        text: "You found the marks, then. Good. I didn't hide them well — I wasn't trying to.",
      },
    ],
    questions: [
      {
        id: "why_doing_this",
        prompt: "Why are you doing this?",
        reply:
          "They tore my dry branches for kindling — mine, not deadwood off the ground, mine — and left the wound open to the weather. No one came back. Not the village, not the wood. I stood here rotting for a season before anyone so much as asked if it hurt. So when the fear started again, I didn't need to lie. I only let it grow the way it wanted to grow. Better the whole wood believes it than only me.",
        addsEvidence: "SUKHOSTIY_CONFESSION",
      },
      {
        id: "why_not_just_say",
        prompt: "Why not just tell someone what happened to you?",
        reply:
          "Tell who? A tree doesn't get asked how its day was. I found out a rumor travels farther than a complaint ever will.",
      },
    ],
    exits: [
      {
        id: "take_proof_back",
        kind: "advance",
        label: "Bring him back to the Hollow, where the whole wood can hear him.",
        next: "s9_gathering",
        requiresQuestionId: "why_doing_this",
        hint: "Ask him why he's doing this first.",
      },
      {
        id: "accuse_alone",
        kind: "trap",
        label: "Accuse him here, alone, and be done with it.",
        trapText:
          "Accused with no one else to hear it — least of all him — it's just Frosko's word against a wound nobody ever tended. Better to bring it back to the Hollow, where the whole wood can hear it too.",
      },
    ],
  },

  s9_gathering: {
    type: "cutscene",
    id: "s9_gathering",
    location: "The Hollow",
    background: BG.hollow2,
    portrait: PORTRAIT.mavka,
    lines: [
      "Back in the Hollow, Frosko lays out the completed chain for Mavka. She is silent, then asks to see it again, slower.",
      {
        speaker: "Mavka",
        text: "Then no one saw fire. No one saw an axe. I asked everyone… and everyone was only telling me myself, back again — and someone was feeding the flame.",
      },
      "Mavka calls every spirit who spoke the rumor into the Hollow and asks each of them, aloud, in front of the others: \"Where did you first hear this — truly first?\"",
      "One by one, they trace back to each other — never to any real sighting — until only Sukhostiy is left standing in the ring of voices. He doesn't run. For the first time in a long while, the whole wood is listening to him instead of about him.",
    ],
    next: "s10_resolution",
  },

  s10_resolution: {
    type: "debrief",
    id: "s10_resolution",
    background: BG.village1,
    portrait: PORTRAIT.mavka,
    lines: [
      "Mavka and Yarema reopen the treeline together. Ostap explains the stolen woodpile aloud, and helps replant the cut branches. The keening fades back into song.",
      "Yarema promises something new, too: storm-broken and stolen branches will be cleared with care from now on, not torn. Sukhostiy, still scarred but no longer alone in it, lets the first green shoot in a long while push through his bark.",
      {
        speaker: "Mavka",
        text: "I forgot to ask where the water was flowing from. I only listened to how loud the current sounded.",
      },
      "The Rumor Tracker is saved to Frosko's journal — a tool he'll carry into whatever kingdom comes next.",
    ],
    lessonTitle: "Frosko's Journal",
    lessonText:
      "A whole wood agreed with her, and still it wasn't true — they were only repeating each other, and one of them was hurt long before any of this started, and let the fear grow so he wouldn't be the only one who felt it. Next time a thing feels certain because everyone says so, I'll ask each of them, one at a time: where did you hear it first? — and I'll ask what happened to whoever started it.",
  },
};
