import { describe, expect, it } from "vitest";
import { canOpenEighthDoor, getEnding, solveCabinClock } from "../lib/puzzles";

describe("The Eighth Door puzzle logic", () => {
  it("solves the cabin clock code", () => {
    expect(solveCabinClock("2641")).toBe(true);
    expect(solveCabinClock("2640")).toBe(false);
  });

  it("locks Door Eight until meaningful progress", () => {
    expect(canOpenEighthDoor(6, 2)).toBe(false);
    expect(canOpenEighthDoor(7, 2)).toBe(true);
  });

  it("classifies the deep ending correctly", () => {
    expect(getEnding({ eighthDoor: true, secrets: 6, solvedPuzzles: 3 })).toBe("true");
    expect(getEnding({ eighthDoor: true, secrets: 2, solvedPuzzles: 2 })).toBe("eighth");
  });
});
