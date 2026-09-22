export type CharacterId = "curator" | "ghost" | "comedian" | "oracle" | "dreamer";
export type Mood = "calm" | "mystery" | "horror" | "funny" | "warm";
export type Camera = "wide" | "close" | "eye" | "silhouette" | "profile";

export type RoomResponse = {
  id: string;
  keywords: string[];
  character: CharacterId;
  mood: Mood;
  camera: Camera;
  title: string;
  lines: string[];
  prompt: string;
  collection: string;
};

export const ROOM_OPENING: RoomResponse = {
  id: "welcome",
  keywords: [],
  character: "curator",
  mood: "calm",
  camera: "wide",
  title: "Ask me something.",
  lines: [
    "This is not a search box.",
    "It is a room with a small library of strange answers.",
    "Ask about a feeling, a book, a movie, a fear, a joke, a mystery—or something only you would think to ask.",
    "Then watch what happens."
  ],
  prompt: "Tell me something strange",
  collection: "The front desk"
};

export const ROOM_LIBRARY: RoomResponse[] = [
  {
    id: "meaning-life",
    keywords: ["meaning of life", "purpose of life", "why are we here", "meaning", "purpose"],
    character: "oracle", mood: "warm", camera: "close",
    title: "A small answer to a huge question",
    lines: [
      "Maybe life never promised a single meaning.",
      "Maybe we make meaning the way a room makes shelter: one small thing at a time.",
      "A person. A craft. A morning you almost missed.",
      "That is not a tiny answer. That is the whole trick."
    ],
    prompt: "Ask me a harder question.",
    collection: "Philosophy shelf"
  },
  {
    id: "lonely",
    keywords: ["lonely", "alone", "miss someone", "miss him", "miss her", "sad", "heartbroken"],
    character: "dreamer", mood: "warm", camera: "close",
    title: "Stay for a minute",
    lines: [
      "Some kinds of loneliness are loud. The quiet kind is stranger.",
      "You can miss someone and still keep living your ordinary little day.",
      "Make tea. Open a window. Let the room be a room again.",
      "You do not have to solve tonight. You only have to get through it gently."
    ],
    prompt: "Tell me what you miss.",
    collection: "Night letters"
  },
  {
    id: "love",
    keywords: ["love", "fall in love", "relationship", "crush", "romance", "breakup"],
    character: "dreamer", mood: "warm", camera: "profile",
    title: "Love is an odd room",
    lines: [
      "Love is less like finding a perfect person and more like discovering a place where you can be unguarded.",
      "The dangerous part is that comfort can become courage.",
      "And courage can become attachment.",
      "So be kind. Even when the story changes."
    ],
    prompt: "Ask what makes love last.",
    collection: "Heart shelf"
  },
  {
    id: "why-lie",
    keywords: ["why do people lie", "lie", "lying", "truth", "honest"],
    character: "curator", mood: "mystery", camera: "eye",
    title: "The room gets quiet",
    lines: [
      "Because truth has a price.",
      "Sometimes the price is embarrassment. Sometimes it is loss.",
      "A lie can be a locked door built in a hurry.",
      "The strange part is that eventually the liar has to remember where they put the key."
    ],
    prompt: "Now ask me about the truth.",
    collection: "Human nature"
  },
  {
    id: "scary-story",
    keywords: ["scary story", "horror story", "scare me", "ghost story", "haunted", "ghost"],
    character: "ghost", mood: "horror", camera: "eye",
    title: "Do not turn around",
    lines: [
      "At 2:17 every night, someone knocked twice on the bedroom wall.",
      "The house had only one bedroom. The wall was solid brick.",
      "On the seventh night, the knocking stopped.",
      "That was when the voice on the other side whispered, “Thank you for opening the door.”"
    ],
    prompt: "I have a worse one.",
    collection: "Midnight cinema"
  },
  {
    id: "fear",
    keywords: ["fear", "afraid", "scared", "anxiety", "panic"],
    character: "oracle", mood: "calm", camera: "close",
    title: "Fear is a signal, not a prophecy",
    lines: [
      "Fear loves predictions.",
      "It tells you what might happen and presents the guess as if it already happened.",
      "Come back to what is actually in the room.",
      "One breath. One next step. Then another."
    ],
    prompt: "Show me something calming.",
    collection: "Quiet shelf"
  },
  {
    id: "dream",
    keywords: ["dream", "dreams", "meaning of dreams", "sleep"],
    character: "dreamer", mood: "calm", camera: "wide",
    title: "The dream drawer",
    lines: [
      "Dreams do not always arrive with subtitles.",
      "Sometimes the brain is sorting memory, emotion and noise into a movie with impossible scenery.",
      "Keep the feeling, not necessarily the plot.",
      "The weirdest image may simply be the one your sleeping mind had room for."
    ],
    prompt: "Give me a stranger dream.",
    collection: "Dream archive"
  },
  {
    id: "movie",
    keywords: ["movie", "film", "cinema", "ending", "story", "screen"],
    character: "curator", mood: "mystery", camera: "wide",
    title: "Why stories stay",
    lines: [
      "A good movie does not only tell you what happened.",
      "It makes you feel that the moment mattered.",
      "That is why a three-second look can survive longer than a two-hour plot.",
      "Cinema is memory wearing light."
    ],
    prompt: "Tell me a movie-like idea.",
    collection: "Cinema shelf"
  },
  {
    id: "book",
    keywords: ["book", "books", "novel", "read", "reading", "writer", "author"],
    character: "curator", mood: "calm", camera: "profile",
    title: "Books are rooms you carry",
    lines: [
      "A book is strange technology: one person's thoughts become another person's private place.",
      "You close the cover, but the room stays in your head.",
      "That is why certain stories follow us for years.",
      "They become part of the furniture."
    ],
    prompt: "Open another shelf.",
    collection: "Library"
  },
  {
    id: "joke",
    keywords: ["funny", "joke", "make me laugh", "bored", "laugh", "roast me"],
    character: "comedian", mood: "funny", camera: "close",
    title: "The emergency comedy department",
    lines: [
      "You are bored.",
      "Excellent. We finally have a problem I am emotionally qualified to handle.",
      "Here is today's wisdom: never trust a “quick nap.”",
      "That is not a nap. That is a two-hour plot twist."
    ],
    prompt: "Roast me gently.",
    collection: "Comedy drawer"
  },
  {
    id: "future",
    keywords: ["future", "tomorrow", "what will happen", "prediction", "future of"],
    character: "oracle", mood: "mystery", camera: "silhouette",
    title: "The future refuses to pose",
    lines: [
      "I can show you possibilities. I cannot honestly promise a prophecy.",
      "The future is less a destination than a room with many doors.",
      "Your choices keep changing which one gets a handle.",
      "That is the unsettling freedom of it."
    ],
    prompt: "Show me one possible future.",
    collection: "Forecast shelf"
  },
  {
    id: "money",
    keywords: ["money", "rich", "success", "business", "career", "job"],
    character: "curator", mood: "mystery", camera: "profile",
    title: "The expensive question",
    lines: [
      "Money can buy time, choices and fewer emergencies.",
      "It cannot automatically tell you what to do with the extra room it creates.",
      "So build useful skills. Keep your promises. Notice what people actually need.",
      "Then let the scoreboard stay a scoreboard."
    ],
    prompt: "Ask me about success.",
    collection: "Work shelf"
  },
  {
    id: "identity",
    keywords: ["who am i", "who am I", "identity", "myself", "self"],
    character: "oracle", mood: "warm", camera: "eye",
    title: "Look closer",
    lines: [
      "You are not one sentence.",
      "You are habits, memories, choices, contradictions and all the versions of yourself you have already outgrown.",
      "Identity is less a label than a trail.",
      "Notice what you keep choosing."
    ],
    prompt: "Ask me what I notice.",
    collection: "Mirror shelf"
  },
  {
    id: "mystery",
    keywords: ["mystery", "secret", "strange", "creepy", "unknown", "secret"],
    character: "ghost", mood: "mystery", camera: "silhouette",
    title: "The locked drawer",
    lines: [
      "Most mysteries are not hidden because they are impossible to see.",
      "They are hidden because everyone walks past the same detail.",
      "A shoe facing the wrong way.",
      "A clock that is one minute too early."
    ],
    prompt: "Give me a mystery.",
    collection: "Case files"
  },
  {
    id: "random",
    keywords: [],
    character: "curator", mood: "mystery", camera: "wide",
    title: "I found something in the library",
    lines: [
      "Your question does not match one of my shelves yet.",
      "That is fine. The best conversations usually start in the wrong room.",
      "Try asking about a feeling, a person, a story, a book, a movie, a fear, a joke—or anything oddly specific.",
      "I will choose the door."
    ],
    prompt: "Surprise me.",
    collection: "Uncatalogued"
  }
];

export function chooseResponse(question: string, previousCharacter?: CharacterId): RoomResponse {
  const q = question.trim().toLowerCase();
  if (!q) return ROOM_LIBRARY[ROOM_LIBRARY.length - 1];

  let best = ROOM_LIBRARY[ROOM_LIBRARY.length - 1];
  let bestScore = 0;

  for (const item of ROOM_LIBRARY) {
    const score = item.keywords.reduce((total, keyword) => total + (q.includes(keyword) ? Math.max(2, keyword.split(" ").length) : 0), 0);
    const continuity = previousCharacter && item.character === previousCharacter ? 0.4 : 0;
    if (score + continuity > bestScore) {
      best = item;
      bestScore = score + continuity;
    }
  }

  return best;
}

export const CHARACTER_META: Record<CharacterId, { name: string; title: string; whisper: string }> = {
  curator: { name: "The Curator", title: "keeper of the shelves", whisper: "I keep strange things here." },
  ghost: { name: "The Guest", title: "the one who arrived late", whisper: "Please do not look behind me." },
  comedian: { name: "The Fool", title: "department of unnecessary answers", whisper: "At last. A sensible question." },
  oracle: { name: "The Oracle", title: "listener at the edge", whisper: "Ask carefully." },
  dreamer: { name: "The Dreamer", title: "keeper of soft hours", whisper: "Some answers need quiet." }
};
