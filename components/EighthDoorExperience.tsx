"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ParticleField from "./ParticleField";
import { CABIN_CLOCK_SOLUTION, canOpenEighthDoor, getEnding, solveCabinClock } from "@/lib/puzzles";
import { CLUES, DOORS, SCENES, type SceneId } from "@/lib/story";
import { loadState, resetState, saveState, type SavedState } from "@/lib/storage";

type Phase = "void" | "corridor" | "transition" | "world" | "ending";
type Modal = null | "journal" | "map" | "settings" | "clue" | "puzzle" | "case";

const EMPTY: SavedState = {
  visitedScenes: [],
  clues: [],
  secrets: [],
  solvedPuzzles: [],
  endings: [],
  startingDoor: null,
  returnVisit: 0,
};

function Icon({ name }: { name: "book" | "map" | "sound" | "back" | "close" | "spark" }) {
  const paths = {
    book: <><path d="M5 5.5c2.8-1.2 5.2-.7 7 1v12c-1.8-1.7-4.2-2.2-7-1z" /><path d="M19 5.5c-2.8-1.2-5.2-.7-7 1v12c1.8-1.7 4.2-2.2 7-1z" /></>,
    map: <><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" /><path d="M9 4v14M15 6v14" /></>,
    sound: <><path d="M4 10v4h4l5 4V6l-5 4z" /><path d="M17 9a5 5 0 0 1 0 6M19.5 6.5a8.5 8.5 0 0 1 0 11" /></>,
    back: <><path d="M19 12H5" /><path d="M11 18l-6-6 6-6" /></>,
    close: <><path d="M6 6l12 12M18 6L6 18" /></>,
    spark: <><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" /></>,
  };
  return <svg viewBox="0 0 24 24" className="icon" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

export default function EighthDoorExperience() {
  const [phase, setPhase] = useState<Phase>("void");
  const [scene, setScene] = useState<SceneId | null>(null);
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
  const [modal, setModal] = useState<Modal>(null);
  const [activeClue, setActiveClue] = useState<(typeof CLUES)[number] | null>(null);
  const [clockInput, setClockInput] = useState("");
  const [flash, setFlash] = useState(false);
  const [sound, setSound] = useState(true);
  const [motion, setMotion] = useState(true);
  const [suspense, setSuspense] = useState(false);
  const [save, setSave] = useState<SavedState>(EMPTY);
  const root = useRef<HTMLDivElement>(null);
  const audioContext = useRef<AudioContext | null>(null);

  const currentScene = scene ? SCENES[scene] : null;
  const sceneClues = scene ? CLUES.filter((clue) => clue.scene === scene) : [];
  const sceneFound = sceneClues.filter((clue) => save.clues.includes(clue.id)).length;
  const sceneRemaining = Math.max(0, sceneClues.length - sceneFound);
  const progress = Math.min(100, Math.round((save.clues.length / CLUES.length) * 100));
  const eighthUnlocked = canOpenEighthDoor(save.clues.length, save.solvedPuzzles.length);
  const endingKind = getEnding({ eighthDoor: eighthUnlocked, secrets: save.secrets.length, solvedPuzzles: save.solvedPuzzles.length });

  useEffect(() => {
    const stored = loadState();
    setSave(stored);
    setSuspense(stored.returnVisit > 0);
  }, []);

  useEffect(() => {
    saveState(save);
  }, [save]);

  useEffect(() => {
    if (!root.current || !motion) return;
    const ctx = gsap.context(() => {
      gsap.to(".title-mark", { rotate: 360, duration: 32, repeat: -1, ease: "none" });
      gsap.to(".ambient-glow", { opacity: 0.52, duration: 3.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.fromTo(".door", { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: .75, stagger: .07, ease: "power3.out" });
    }, root);
    return () => ctx.revert();
  }, [motion, phase]);

  function tone(frequency = 210, duration = 0.1, gain = 0.025) {
    if (!sound || typeof window === "undefined") return;
    try {
      const Ctx = window.AudioContext;
      if (!Ctx) return;
      const ctx = audioContext.current || new Ctx();
      audioContext.current = ctx;
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      amp.gain.setValueAtTime(gain, ctx.currentTime);
      amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(amp).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  function enter() {
    tone(98, .65, .035);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 360);
    setPhase("corridor");
    setSave((s) => ({ ...s, returnVisit: s.returnVisit + 1 }));
  }

  function chooseDoor(id: number) {
    const door = DOORS.find((d) => d.id === id);
    if (!door) return;
    tone(62 + id * 12, .4, .04);
    setSelectedDoor(id);
    setPhase("transition");
    window.setTimeout(() => {
      setScene(door.scene);
      setPhase("world");
      setSave((s) => ({
        ...s,
        startingDoor: id,
        visitedScenes: Array.from(new Set(s.visitedScenes.concat(door.scene))),
      }));
      if (door.scene === "forest" && save.returnVisit > 0) setSuspense(true);
    }, 1300);
  }

  function visitScene(target: SceneId) {
    tone(130, .16, .03);
    setScene(target);
    setSave((s) => ({ ...s, visitedScenes: Array.from(new Set(s.visitedScenes.concat(target))) }));
    setModal(null);
  }

  function discoverClue(id: string) {
    const clue = CLUES.find((c) => c.id === id);
    if (!clue) return;
    tone(clue.rarity === "rare" ? 420 : 260, .2, .035);
    setActiveClue(clue);
    setModal("clue");
    setSave((s) => ({
      ...s,
      clues: s.clues.includes(id) ? s.clues : s.clues.concat(id),
      secrets: clue.rarity === "rare" && !s.secrets.includes(id) ? s.secrets.concat(id) : s.secrets,
    }));
  }

  function solveCabin() {
    const solved = solveCabinClock(clockInput);
    tone(solved ? 520 : 96, solved ? .35 : .12, .04);
    if (solved) {
      setSave((s) => ({
        ...s,
        solvedPuzzles: s.solvedPuzzles.includes("cabin-clock") ? s.solvedPuzzles : s.solvedPuzzles.concat("cabin-clock"),
        secrets: s.secrets.includes("cabin-solved") ? s.secrets : s.secrets.concat("cabin-solved"),
      }));
      setActiveClue({
        id: "cabin-solved",
        scene: "cabin",
        title: "Drawer Open",
        text: "YOU HAVE ALREADY BEEN HERE. The note is dated tomorrow.",
        rarity: "rare",
      });
      setModal("clue");
      setClockInput("");
    } else {
      setActiveClue({
        id: "wrong-clock",
        scene: "cabin",
        title: "The Clock Shudders",
        text: "Wrong. One clock moved backward.",
        rarity: "hidden",
      });
      setModal("clue");
    }
  }

  function triggerSecret(name: string) {
    if (save.secrets.includes(name)) return;
    tone(390, .5, .035);
    setSave((s) => ({ ...s, secrets: s.secrets.concat(name) }));
    setSuspense(true);
  }

  function openEighthDoor() {
    tone(55, .8, .05);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 500);
    setPhase("ending");
  }

  function finishEnding() {
    setSave((s) => ({ ...s, endings: Array.from(new Set(s.endings.concat(endingKind))) }));
    setModal("case");
  }

  function resetExperience() {
    resetState();
    setSave(EMPTY);
    setPhase("void");
    setScene(null);
    setSelectedDoor(null);
    setModal(null);
    setSuspense(false);
  }

  const sceneTargets = ["forest","cabin","mountain","lake","village","observatory","ruins"] as SceneId[];
  const nextTarget = scene ? sceneTargets[(sceneTargets.indexOf(scene) + 1) % sceneTargets.length] : "forest";
  const hotspotLabel = (id: string, label: string) => save.clues.includes(id) ? "✓ FOUND · " + label : "FIND · " + label;

  return (
    <main ref={root} className={"experience " + phase + " " + (currentScene ? currentScene.colorClass : "") + " " + (motion ? "" : "reduced-motion")}>
      <ParticleField dense={phase !== "void"} />
      <div className="noise" />
      <div className="vignette" />
      <div className={"ambient-glow " + (suspense ? "danger" : "")} />
      {flash && <div className="flash" aria-hidden="true" />}

      {phase === "void" && (
        <section className="void-screen">
          <div className="void-copy">
            <span className="micro-line">NO SIGNAL · CASE UNKNOWN</span>
            <div className="title-mark" aria-hidden="true">◇</div>
            <p className="void-line line-a">You are late.</p>
            <p className="void-line line-b">Eleven minutes late.</p>
            <p className="void-line line-c">{save.returnVisit > 0 ? "You came back." : "We were expecting someone else."}</p>
            <button className="enter-button" onClick={enter}><span>{save.returnVisit > 0 ? "RETURN" : "ENTER"}</span><span className="enter-ring" /></button>
          </div>
          <div className="corner-readout"><span>CASE 017</span><span>UNKNOWN ORIGIN</span></div>
        </section>
      )}

      {phase === "corridor" && (
        <section className="corridor">
          <header className="minimal-header">
            <div><span className="eyebrow">THE EIGHTH DOOR</span><span className="tiny-status">CASE 017 · FIRST CHOICE</span></div>
            <div className="header-actions">
              <button className="icon-button" onClick={() => setModal("journal")} title="Journal"><Icon name="book" /></button>
              <button className="icon-button" onClick={() => setModal("map")} title="Map"><Icon name="map" /></button>
              <button className={"icon-button " + (sound ? "" : "muted")} onClick={() => setSound((v) => !v)} title="Sound"><Icon name="sound" /></button>
            </div>
          </header>
          <div className="corridor-title">
            <span className="chapter-number">I / VII</span>
            <h1>{save.returnVisit > 1 ? "You came back." : "There are seven doors."}</h1>
            <p>{save.returnVisit > 1 ? "They remember what you chose." : "Choose carefully. You only get one first choice."}</p>
            <div className="mission-brief corridor-brief">
              <span>YOUR MISSION</span>
              <b>Choose a door. Explore the place behind it.</b>
              <small>Look for marked objects, tap them to collect clues, then use the clues to solve puzzles and unlock the Eighth Door.</small>
            </div>
          </div>
          <div className="door-hall">
            {DOORS.map((door) => (
              <button key={door.id} className={"door door-" + door.id + " visual-" + door.visual} onClick={() => chooseDoor(door.id)} aria-label={"Choose door " + door.id + ": " + door.name}>
                <span className="door-number">0{door.id}</span>
                <span className="door-frame"><span className="door-surface"><span className="door-symbol">{door.id === 7 ? "∅" : door.id === 5 ? "◉" : door.id === 4 ? "≈" : door.id === 3 ? "Ⅲ" : "◇"}</span><span className="door-handle" /></span></span>
                <span className="door-name">{door.name}</span>
                <span className="door-subtitle">{door.subtitle}</span>
              </button>
            ))}
          </div>
          <div className="corridor-footer"><span>DO NOT TRUST THE ORDER</span><span>01—07</span></div>
        </section>
      )}

      {phase === "transition" && (
        <section className="transition-screen">
          <div className="transition-door" data-door={selectedDoor}>{selectedDoor ? "0" + selectedDoor : ""}</div>
          <div className="transition-copy"><span>THE DOOR REMEMBERS YOU.</span><b>OPENING</b></div>
        </section>
      )}

      {phase === "world" && scene && currentScene && (
        <section className={"world-scene " + currentScene.colorClass}>
          <div className="scene-hud">
            <div className="scene-id">
              <span className="scene-kicker">{currentScene.kicker}</span>
              <h1>{currentScene.title}</h1>
              <p>{currentScene.quote}</p>
              <div className="investigation-status">
                <span>{sceneRemaining > 0 ? "SEARCH THIS LOCATION" : "LOCATION CLEARED"}</span>
                <b>{sceneFound}/{sceneClues.length} CLUES FOUND</b>
              </div>
              <div className="search-instruction">
                {sceneRemaining > 0 ? "TAP THE MARKED OBJECTS TO INVESTIGATE THEM." : "YOU FOUND EVERY CLUE HERE. FOLLOW THE PATH TO CONTINUE."}
              </div>
            </div>
            <div className="hud-right">
              <div className="progress-chip"><span>{progress}%</span><small>CASE</small></div>
              <button className="icon-button" onClick={() => setModal("journal")} title="Journal"><Icon name="book" /></button>
              <button className="icon-button" onClick={() => setModal("map")} title="Map"><Icon name="map" /></button>
              <button className="icon-button" onClick={() => setModal("settings")} title="Settings">•••</button>
            </div>
          </div>

          <div className="scene-stage" onClick={() => scene === "forest" && triggerSecret("forest-stillness")}>
            <div className="moon" />
            <div className="mountain-silhouette" />
            <div className="fog fog-one" />
            <div className="fog fog-two" />

            {scene === "forest" && <div className="forest-world">
              {Array.from({ length: 13 }).map((_, i) => <span key={i} className={"tree tree-" + (i + 1)} />)}
              <button className="hotspot hotspot-tree" onClick={(e) => { e.stopPropagation(); discoverClue("forest-tree"); }}>{hotspotLabel("forest-tree", "CARVING")}</button>
              <button className="hotspot hotspot-bird" onClick={(e) => { e.stopPropagation(); discoverClue("forest-bird"); }}>{hotspotLabel("forest-bird", "FOLLOW THE BIRD")}</button>
              <button className="hotspot hotspot-note" onClick={(e) => { e.stopPropagation(); discoverClue("forest-note"); }}>{hotspotLabel("forest-note", "WET PAPER")}</button>
              {suspense && <div className="watcher watcher-forest" aria-hidden="true" />}
            </div>}

            {scene === "cabin" && <div className="cabin-world">
              <div className="cabin-house"><div className="cabin-roof" /><div className="cabin-wall" /><div className="cabin-window" /><div className="cabin-door" /></div>
              <div className="cabin-table" />
              <button className="hotspot hotspot-clocks" onClick={(e) => { e.stopPropagation(); discoverClue("cabin-clocks"); setModal("puzzle"); }}>{hotspotLabel("cabin-clocks", "FOUR CLOCKS")}</button>
              <button className="hotspot hotspot-mirror" onClick={(e) => { e.stopPropagation(); discoverClue("cabin-mirror"); triggerSecret("mirror-delay"); }}>{hotspotLabel("cabin-mirror", "MIRROR")}</button>
            </div>}

            {scene === "mountain" && <div className="mountain-world">
              <div className="peak peak-a" /><div className="peak peak-b" /><div className="rock-door" />
              <button className="hotspot hotspot-stone" onClick={(e) => { e.stopPropagation(); discoverClue("mountain-stone"); }}>{hotspotLabel("mountain-stone", "INSCRIPTION")}</button>
              <button className="hotspot hotspot-hollow" onClick={(e) => { e.stopPropagation(); discoverClue("mountain-hollow"); triggerSecret("three-knocks"); }}{hotspotLabel("mountain-hollow", "KNOCK ×3")}</button>
            </div>}

            {scene === "lake" && <div className="lake-world">
              <div className="lake-surface" /><div className="lake-island" />
              <button className="hotspot hotspot-reflection" onClick={(e) => { e.stopPropagation(); discoverClue("lake-reflection"); triggerSecret("reflection-first"); }}>{hotspotLabel("lake-reflection", "LOOK DOWN")}</button>
              <button className="hotspot hotspot-stairs" onClick={(e) => { e.stopPropagation(); discoverClue("lake-stairs"); }}>{hotspotLabel("lake-stairs", "UNDERWATER STEPS")}</button>
            </div>}

            {scene === "village" && <div className="village-world">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className={"village-house house-" + (i + 1)} />)}
              <button className="hotspot hotspot-window" onClick={(e) => { e.stopPropagation(); discoverClue("village-window"); triggerSecret("lit-window"); }}>{hotspotLabel("village-window", "LIT WINDOW")}</button>
              <button className="hotspot hotspot-photo" onClick={(e) => { e.stopPropagation(); discoverClue("village-photo"); }}>{hotspotLabel("village-photo", "PHOTOGRAPH")}</button>
            </div>}

            {scene === "observatory" && <div className="observatory-world">
              <div className="observatory-dome" /><div className="scope" /><div className="constellation" />
              <button className="hotspot hotspot-scope" onClick={(e) => { e.stopPropagation(); discoverClue("observatory-scope"); triggerSecret("scope-loop"); }}>{hotspotLabel("observatory-scope", "LOOK THROUGH")}</button>
              <button className="hotspot hotspot-clock" onClick={(e) => { e.stopPropagation(); discoverClue("observatory-clock"); }}>{hotspotLabel("observatory-clock", "03:17")}</button>
            </div>}

            {scene === "ruins" && <div className="ruins-world">
              <div className="ruin-arch" /><div className="ruin-wall wall-one" /><div className="ruin-wall wall-two" />
              <div className="symbols">◇ △ ⟟ ⊙ ϟ</div>
              <button className="hotspot hotspot-symbols" onClick={(e) => { e.stopPropagation(); discoverClue("ruins-symbol"); triggerSecret("symbol-language"); }}>{hotspotLabel("ruins-symbol", "SYMBOLS")}</button>
              <button className="hotspot hotspot-eighth" onClick={(e) => { e.stopPropagation(); discoverClue("ruins-eighth"); }}>{hotspotLabel("ruins-eighth", "MISSING INSCRIPTION")}</button>
            </div>}
          </div>

          <div className="scene-actions">
            <button className="ghost-button" onClick={() => setModal("journal")}><Icon name="book" /> Journal <span>{save.clues.length}</span></button>
            <button className="ghost-button" onClick={() => setModal("map")}><Icon name="map" /> Map</button>
            {eighthUnlocked && <button className="eighth-button" onClick={openEighthDoor}><span>OPEN THE EIGHTH</span><Icon name="spark" /></button>}
            <button className="ghost-button" onClick={() => visitScene(nextTarget)}>FOLLOW THE PATH <Icon name="back" /></button>
          </div>
          <div className="scene-footnote"><span>LOCATION {scene.toUpperCase()}</span><span>{save.secrets.length} SECRET{save.secrets.length === 1 ? "" : "S"} FOUND</span></div>
        </section>
      )}

      {phase === "ending" && (
        <section className="ending-screen">
          <div className="ending-orbit" />
          <span className="ending-kicker">THE DOOR HAS OPENED</span>
          <h1>There were never seven.</h1>
          <p className="ending-line">You thought you were solving the mystery.</p>
          <p className="ending-line faint">You were completing it.</p>
          <div className="ending-actions">
            <button className="eighth-button" onClick={finishEnding}><span>OPEN CASE FILE</span><Icon name="spark" /></button>
            <button className="ghost-button" onClick={() => setPhase("world")}><Icon name="back" /> Return</button>
          </div>
        </section>
      )}

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <aside className={"modal-panel " + (modal === "map" ? "wide" : "")} onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <span className="eyebrow">{modal === "journal" ? "ARCHIVE" : modal === "map" ? "FIELD MAP" : modal === "settings" ? "SYSTEM" : modal === "puzzle" ? "CABIN / LOCK" : modal === "case" ? "CASE FILE" : "DISCOVERY"}</span>
                <h2>{modal === "journal" ? "What you know" : modal === "map" ? "The world is not flat." : modal === "settings" ? "Experience controls" : modal === "puzzle" ? "Four clocks" : modal === "case" ? "Investigation complete" : activeClue?.title}</h2>
              </div>
              <button className="icon-button" onClick={() => setModal(null)} title="Close"><Icon name="close" /></button>
            </div>

            {modal === "journal" && <div className="journal">
              <div className="stat-grid">
                <div><strong>{progress}%</strong><span>discovered</span></div>
                <div><strong>{save.secrets.length}</strong><span>secrets</span></div>
                <div><strong>{save.solvedPuzzles.length}</strong><span>puzzles</span></div>
                <div><strong>{save.endings.length}</strong><span>endings</span></div>
              </div>
              <div className="journal-list">
                {save.clues.length === 0 ? <p className="empty-copy">Nothing written yet. The world is waiting.</p> : CLUES.filter((c) => save.clues.includes(c.id)).map((clue) => (
                  <button key={clue.id} className="journal-entry" onClick={() => { setActiveClue(clue); setModal("clue"); }}>
                    <span>{clue.scene.toUpperCase()}</span><b>{clue.title}</b><small>{clue.text}</small>
                  </button>
                ))}
              </div>
            </div>}

            {modal === "map" && <div className="map-panel">
              <div className="map-stars" />
              <div className="map-line line-1" /><div className="map-line line-2" /><div className="map-line line-3" />
              {sceneTargets.map((id, idx) => (
                <button key={id} className={"map-node node-" + (idx + 1) + " " + (save.visitedScenes.includes(id) ? "seen" : "")} onClick={() => save.visitedScenes.includes(id) && visitScene(id)}>
                  <span>{String(idx + 1).padStart(2, "0")}</span><b>{SCENES[id].title}</b>
                </button>
              ))}
              <div className="map-note">Some paths exist only after you leave them.</div>
            </div>}

            {modal === "settings" && <div className="settings-list">
              <button className="setting-row" onClick={() => setSound((v) => !v)}><span>Ambient sound</span><b>{sound ? "ON" : "OFF"}</b></button>
              <button className="setting-row" onClick={() => setMotion((v) => !v)}><span>Cinematic motion</span><b>{motion ? "ON" : "REDUCED"}</b></button>
              <button className="setting-row danger-row" onClick={resetExperience}><span>Erase local case</span><b>RESET</b></button>
            </div>}

            {modal === "clue" && activeClue && <div className="clue-view">
              <div className={"clue-sigil rarity-" + activeClue.rarity}>◇</div>
              <p className="clue-rarity">{activeClue.rarity.toUpperCase()} FIND</p>
              <p>{activeClue.text}</p>
              <button className="ghost-button" onClick={() => setModal("journal")}><Icon name="book" /> Add to archive</button>
            </div>}

            {modal === "puzzle" && <div className="puzzle">
              <p className="puzzle-copy">The clocks show 02:17 · 06:41 · 11:03 · 08:26. The candle heights determine the order. Use the first two digits of the four displayed hours.</p>
              <div className="clock-row">{CABIN_CLOCK_SOLUTION.split("").map((n, i) => <span key={i}>{n}{i % 2 === 0 ? "2" : "4"}</span>)}</div>
              <label><span>ENTER THE FOUR DIGITS</span><input value={clockInput} onChange={(e) => setClockInput(e.target.value.replace(/\D/g, "").slice(0, 4))} inputMode="numeric" placeholder="••••" /></label>
              <button className="eighth-button" onClick={solveCabin} disabled={clockInput.length !== 4}>TURN THE LOCK</button>
              <small>Hint: the first two correct positions are 2 and 6.</small>
            </div>}

            {modal === "case" && <div className="case-file">
              <div className="case-code">CASE 017</div>
              <div className="case-grid">
                <span>STARTING DOOR<b>{save.startingDoor ? "0" + save.startingDoor : "—"}</b></span>
                <span>CLUES<b>{save.clues.length}</b></span>
                <span>SECRETS<b>{save.secrets.length}</b></span>
                <span>ENDING<b>{endingKind.toUpperCase()}</b></span>
              </div>
              <p>{endingKind === "true" ? "You found the layer beneath the layer. The door remembers your first choice." : "The case is incomplete. Something is still missing."}</p>
              <button className="ghost-button" onClick={() => { setModal(null); setPhase("corridor"); }}><Icon name="back" /> Return to the doors</button>
            </div>}
          </aside>
        </div>
      )}
    </main>
  );
}
