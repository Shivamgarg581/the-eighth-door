# Architecture

The experience is intentionally split into an application layer, world/scene layer, puzzle/content layer and persistence layer.

- React/Next.js owns the application shell and accessible controls.
- GSAP owns cinematic sequencing.
- Three.js is reserved for the next optimized true-3D scene modules.
- Story content is data-driven in lib/story.ts.
- Puzzle rules are isolated in lib/puzzles.ts.
- Local persistence is isolated in lib/storage.ts.
- Playwright protects the opening journey.
- Vitest protects deterministic puzzle rules.

Core principle: hide the answer, never hide the logic.
