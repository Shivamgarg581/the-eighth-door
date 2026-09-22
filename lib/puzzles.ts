export const CABIN_CLOCK_SOLUTION = "2641";

export function solveCabinClock(input: string): boolean {
  return input.trim() === CABIN_CLOCK_SOLUTION;
}

export function canOpenEighthDoor(clues: number, solvedPuzzles: number): boolean {
  return clues >= 7 && solvedPuzzles >= 1;
}

export function getEnding(progress: { eighthDoor: boolean; secrets: number; solvedPuzzles: number }): "escape" | "watcher" | "eighth" | "true" {
  if (progress.eighthDoor && progress.secrets >= 6 && progress.solvedPuzzles >= 1) return "true";
  if (progress.eighthDoor) return "eighth";
  if (progress.secrets >= 3) return "watcher";
  return "escape";
}
