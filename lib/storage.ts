export type SavedState = {
  visitedScenes: string[];
  clues: string[];
  secrets: string[];
  solvedPuzzles: string[];
  endings: string[];
  startingDoor: number | null;
  returnVisit: number;
};

const KEY = "the-eighth-door-state";

const emptyState = (): SavedState => ({
  visitedScenes: [],
  clues: [],
  secrets: [],
  solvedPuzzles: [],
  endings: [],
  startingDoor: null,
  returnVisit: 0,
});

export function loadState(): SavedState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...emptyState(), ...(JSON.parse(raw) as SavedState) } : emptyState();
  } catch {
    return emptyState();
  }
}

export function saveState(state: SavedState) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function resetState() {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(KEY); } catch {}
}
