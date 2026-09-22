# THE EIGHTH DOOR

An interactive mystery adventure for the web.

## Current build

This repository contains the first complete playable vertical slice:

- cinematic black-screen prologue
- seven-door selection corridor
- seven visual environments
- interactive clues and hidden events
- cabin clock puzzle
- journal/archive
- field map
- local progress persistence
- sound toggle using Web Audio
- reduced-motion setting
- Door Eight unlock condition
- multiple ending classifications
- responsive mobile layout
- Vitest unit tests
- Playwright browser test
- GitHub Actions quality workflow

## Stack

- Next.js 16.3.5
- React 19.3.0
- TypeScript 7.0.2
- Three.js 0.186.0
- GSAP 3.15.0
- Zustand 5.0.15
- Vitest
- Playwright

The first release deliberately uses lightweight procedural CSS/DOM environments so the experience works without a large asset pack. Three.js is included for the next true-3D scene layer.

## Run locally

1. npm install
2. npm run dev
3. Open http://localhost:3000

## Quality commands

- npm run typecheck
- npm run test
- npm run build
- npm run e2e

## Design principles

1. Hide the answer, never hide the logic.
2. Horror comes from uncertainty, not constant jump scares.
3. Environmental changes are clues.
4. The free core mystery remains complete.
5. The world remembers the player.

## Roadmap

- optimized Three.js forest and mountain scenes
- full cross-location symbol/meta puzzle
- deeper secret/event engine
- anonymous cloud case sync with Supabase
- spoiler-safe shareable case files
- production analytics
- monetization after the core experience is stable
