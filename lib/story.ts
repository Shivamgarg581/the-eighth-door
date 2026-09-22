export type SceneId =
  | "forest"
  | "cabin"
  | "mountain"
  | "lake"
  | "village"
  | "observatory"
  | "ruins";

export type Door = {
  id: number;
  name: string;
  subtitle: string;
  scene: SceneId;
  visual: string;
  hint: string;
};

export type Clue = {
  id: string;
  scene: SceneId;
  title: string;
  text: string;
  rarity: "common" | "hidden" | "rare";
};

export const DOORS: Door[] = [
  { id: 1, name: "ROOT", subtitle: "The Forest Door", scene: "forest", visual: "roots", hint: "The path wasn't here yesterday." },
  { id: 2, name: "IRON", subtitle: "The Mountain Door", scene: "mountain", visual: "iron", hint: "Listen for what is hollow." },
  { id: 3, name: "RED", subtitle: "The Knocking Door", scene: "village", visual: "red", hint: "Three. Three. One." },
  { id: 4, name: "DROWNED", subtitle: "The Lake Door", scene: "lake", visual: "water", hint: "Don't trust the reflection." },
  { id: 5, name: "MIRROR", subtitle: "The Reflection Door", scene: "cabin", visual: "mirror", hint: "Look away. Then look back." },
  { id: 6, name: "ASH", subtitle: "The Snow Door", scene: "observatory", visual: "ash", hint: "The sky is not above you." },
  { id: 7, name: "EMPTY", subtitle: "The Door Without a Handle", scene: "ruins", visual: "empty", hint: "You already chose this." },
];

export const SCENES: Record<SceneId, { title: string; kicker: string; quote: string; colorClass: string }> = {
  forest: { title: "The Black Forest", kicker: "YOU HEARD THE BIRDS. GOOD.", quote: "The path wasn't here yesterday.", colorClass: "forest" },
  cabin: { title: "The Cabin", kicker: "SOMEONE STILL LIVES HERE.", quote: "The clocks don't agree.", colorClass: "cabin" },
  mountain: { title: "The Hollow Mountain", kicker: "LISTEN.", quote: "It's hollow.", colorClass: "mountain" },
  lake: { title: "The Forgotten Lake", kicker: "THERE WAS NEVER A LAKE.", quote: "The reflection is looking back.", colorClass: "lake" },
  village: { title: "The Silent Village", kicker: "EVERY HOUSE IS EMPTY.", quote: "Except yours.", colorClass: "village" },
  observatory: { title: "The Observatory", kicker: "LOOK THROUGH.", quote: "The telescope isn't looking at the sky.", colorClass: "observatory" },
  ruins: { title: "The Underground Ruins", kicker: "THE WALLS REMEMBER.", quote: "The symbols are instructions.", colorClass: "ruins" },
};

export const CLUES: Clue[] = [
  { id: "forest-tree", scene: "forest", title: "The Carved Tree", text: "DO NOT COUNT THE TREES.", rarity: "common" },
  { id: "forest-bird", scene: "forest", title: "The Black Bird", text: "It always flies toward the place where the path is about to disappear.", rarity: "hidden" },
  { id: "forest-note", scene: "forest", title: "Wet Paper", text: "Something has been walking beside you.", rarity: "rare" },
  { id: "cabin-clocks", scene: "cabin", title: "Four Clocks", text: "02:17 · 06:41 · 11:03 · 08:26. One of them is lying.", rarity: "common" },
  { id: "cabin-mirror", scene: "cabin", title: "The Mirror", text: "Your reflection waited for you.", rarity: "hidden" },
  { id: "mountain-stone", scene: "mountain", title: "Stone Inscription", text: "Nobody climbs this mountain anymore.", rarity: "common" },
  { id: "mountain-hollow", scene: "mountain", title: "The Hollow Wall", text: "The mountain answers in three knocks.", rarity: "hidden" },
  { id: "lake-reflection", scene: "lake", title: "Black Water", text: "The reflection moved first.", rarity: "common" },
  { id: "lake-stairs", scene: "lake", title: "Underwater Steps", text: "When the bells stop, the lake remembers the stairs.", rarity: "hidden" },
  { id: "village-window", scene: "village", title: "The Lit Window", text: "Every house is empty. Except yours.", rarity: "common" },
  { id: "village-photo", scene: "village", title: "Old Photograph", text: "You are standing beneath the missing tree.", rarity: "rare" },
  { id: "observatory-scope", scene: "observatory", title: "The Telescope", text: "It is looking at the forest. Then the cabin. Then you.", rarity: "common" },
  { id: "observatory-clock", scene: "observatory", title: "The Same Clock", text: "03:17 appears here too.", rarity: "hidden" },
  { id: "ruins-symbol", scene: "ruins", title: "The Symbols", text: "They are not a language. They are instructions.", rarity: "common" },
  { id: "ruins-eighth", scene: "ruins", title: "Missing Inscription", text: "There were seven. There are eight.", rarity: "rare" },
];

export const SCENE_ORDER: SceneId[] = ["forest", "cabin", "mountain", "lake", "village", "observatory", "ruins"];

export function getNextScene(current: SceneId): SceneId {
  const index = SCENE_ORDER.indexOf(current);
  return SCENE_ORDER[(index + 1) % SCENE_ORDER.length];
}
