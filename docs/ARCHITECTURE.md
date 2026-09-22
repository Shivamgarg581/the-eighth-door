# Architecture

The homepage is a cinematic character-chat experience rather than a game.

- Next.js/React owns the application shell, composer, archive panel and responsive UI.
- `components/LivingRoom.tsx` coordinates question submission, local memory, character selection, scene timing and UI state.
- `lib/room-content.ts` is the authored response library and deterministic topic matcher.
- CSS supplies the first-release character rig, camera choreography, atmospheric backgrounds and motion.
- Browser storage keeps the recent conversation locally.
- GSAP and Three.js remain available for later, richer animation/3D work.
- Playwright protects the main question-to-response journey.
- The previous Eighth Door puzzle engine remains in the repository as an archived experiment, but it is not mounted by `app/page.tsx`.

The design principle is simple: **the answer should change the room.**
