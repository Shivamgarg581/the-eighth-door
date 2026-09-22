"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CHARACTER_META, ROOM_LIBRARY, chooseResponse, type Camera, type CharacterId, type Mood, type RoomResponse } from "@/lib/room-content";

type Turn = { id: number; question: string; response: RoomResponse };

const starterQuestions = [
  "Tell me something strange",
  "I'm feeling lonely",
  "Scare me",
  "Make me laugh",
  "What is the meaning of life?",
  "Tell me about books",
];

function soundTone(enabled: boolean, kind: "send" | "appear" | "soft" = "appear") {
  if (!enabled || typeof window === "undefined") return;
  try {
    const Ctx = window.AudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const values = kind === "send" ? [180, 240] : kind === "soft" ? [220, 180] : [280, 410];
    osc.type = "sine";
    osc.frequency.setValueAtTime(values[0], ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(values[1], ctx.currentTime + 0.22);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(kind === "soft" ? 0.018 : 0.028, ctx.currentTime + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.26);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.27);
    window.setTimeout(() => void ctx.close(), 350);
  } catch {}
}

function Face({ character, camera, speaking, mood }: { character: CharacterId; camera: Camera; speaking: boolean; mood: Mood }) {
  const eyeShape = character === "ghost" ? "ghost-eyes" : character === "comedian" ? "happy-eyes" : character === "oracle" ? "oracle-eyes" : "human-eyes";
  return (
    <div className={`avatar avatar-${character} camera-${camera} mood-${mood} ${speaking ? "speaking" : ""}`}>
      <div className="avatar-halo" />
      <div className="avatar-body">
        <div className="avatar-shoulder" />
        <div className="avatar-neck" />
        <div className={`avatar-head ${camera === "eye" ? "eye-focus" : ""}`}>
          <div className={`eyes ${eyeShape}`}>
            <span className="eye eye-left"><i /></span>
            <span className="eye eye-right"><i /></span>
          </div>
          <div className="brow brow-left" />
          <div className="brow brow-right" />
          <div className="nose" />
          <div className="mouth"><span /></div>
          {character === "ghost" && <div className="ghost-mark" />}
          {character === "comedian" && <div className="comic-star star-one">✦</div>}
          {character === "oracle" && <div className="oracle-mark">◌</div>}
        </div>
      </div>
    </div>
  );
}

function StoryText({ response, visible }: { response: RoomResponse; visible: boolean }) {
  return (
    <div className={`story-text ${visible ? "visible" : ""}`}>
      {response.lines.map((line, index) => (
        <p key={index} style={{ animationDelay: `${index * 820}ms` }}>{line}</p>
      ))}
    </div>
  );
}

export default function LivingRoom() {
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<Turn[]>([]);
  const [active, setActive] = useState<RoomResponse>(ROOM_LIBRARY[ROOM_LIBRARY.length - 1]);
  const [character, setCharacter] = useState<CharacterId>("curator");
  const [speaking, setSpeaking] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [sound, setSound] = useState(true);
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const [turnId, setTurnId] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("living-room-history");
      if (!raw) return;
      const saved = JSON.parse(raw) as Turn[];
      if (Array.isArray(saved) && saved.length) {
        const last = saved[saved.length - 1];
        setTurns(saved.slice(-8));
        setActive(last.response);
        setCharacter(last.response.character);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem("living-room-history", JSON.stringify(turns.slice(-8))); } catch {}
  }, [turns]);

  useEffect(() => {
    setSpeaking(true);
    const timer = window.setTimeout(() => setSpeaking(false), Math.max(2600, active.lines.length * 820 + 500));
    soundTone(sound, "appear");
    return () => window.clearTimeout(timer);
  }, [active, sound]);

  const metadata = CHARACTER_META[character];
  const moodLabel = active.mood === "horror" ? "MIDNIGHT" : active.mood === "funny" ? "PLAYFUL" : active.mood.toUpperCase();
  const turnCount = turns.length;

  function submit(value = question) {
    const trimmed = value.trim();
    if (!trimmed) return;
    const response = chooseResponse(trimmed, character);
    const id = turnId + 1;
    setTurnId(id);
    setQuestion("");
    setActive(response);
    setCharacter(response.character);
    setTurns((prev) => [...prev, { id, question: trimmed, response }].slice(-8));
    soundTone(sound, "send");
    setSpeaking(true);
  }

  function resetRoom() {
    setTurns([]);
    setActive(ROOM_LIBRARY[ROOM_LIBRARY.length - 1]);
    setCharacter("curator");
    setQuestion("");
    setTurnId(0);
    try { localStorage.removeItem("living-room-history"); } catch {}
  }

  const recent = useMemo(() => turns.slice(-4).reverse(), [turns]);

  return (
    <main className={`living-room mood-${active.mood} ${speaking ? "is-speaking" : ""}`}>
      <div className="room-grain" />
      <div className="room-stars" />
      <div className="room-orbit orbit-a" />
      <div className="room-orbit orbit-b" />
      <div className="room-glow" />
      <div className="room-floor" />
      {active.mood === "horror" && <><div className="fog-strip fog-a" /><div className="fog-strip fog-b" /></>}
      {active.mood === "funny" && <div className="confetti-field">{Array.from({ length: 18 }).map((_, i) => <i key={i} className={"confetti-piece confetti-" + i} />)}</div>}
      {active.mood === "calm" && <div className="breath-orb" />}
      
      <header className="room-header">
        <button className="brand-lockup" onClick={resetRoom} aria-label="Reset room">
          <span className="brand-dot" />
          <span><b>THE ROOM</b><small>a living conversation</small></span>
        </button>
        <div className="header-tools">
          <span className="session-pill">{turnCount ? `MEMORY ${turnCount}` : "LISTENING"}</span>
          <button className="text-button" onClick={() => setShowArchive((v) => !v)}>LIBRARY</button>
          <button className={`round-tool ${sound ? "" : "is-off"}`} onClick={() => setSound(v => !v)} aria-label={sound ? "Mute sound" : "Enable sound"}>{sound ? "◉" : "○"}</button>
        </div>
      </header>

      <section className="cinema" key={turnId}>
        <div className="cinema-label"><span>{moodLabel}</span><em>•</em><span>{metadata.name}</span><em>•</em><span>{metadata.title}</span></div>
        <div className="character-stage">
          <div className="stage-light" />
          <Face character={character} camera={active.camera} speaking={speaking} mood={active.mood} />
          <div className="camera-caption">{active.camera === "eye" ? "EXTREME CLOSE" : active.camera.replace("-", " ").toUpperCase()}</div>
        </div>

        <div className="dialogue">
          <div className="dialogue-speaker"><span>{metadata.name}</span><i /></div>
          <h1>{active.title}</h1>
          <StoryText response={active} visible={speaking} />
          <div className="dialogue-footer"><span>{active.collection}</span><span>{speaking ? "..." : "READY"}</span></div>
        </div>
      </section>

      <section className={`composer ${isComposerFocused ? "focused" : ""}`}>
        <div className="starter-row">
          {starterQuestions.map((starter) => <button key={starter} onClick={() => submit(starter)}>{starter}</button>)}
        </div>
        <form className="input-shell" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <span className="input-orb" aria-hidden="true">✦</span>
          <input
            ref={inputRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onFocus={() => setIsComposerFocused(true)}
            onBlur={() => setIsComposerFocused(false)}
            placeholder="Ask something. The room will decide how to answer."
            aria-label="Ask something"
          />
          <button type="submit" className="send-button" disabled={!question.trim()} aria-label="Send question">↗</button>
        </form>
        <div className="composer-note">Written response library • no generic chatbot wall of text • every answer has its own scene</div>
      </section>

      {recent.length > 0 && (
        <aside className="memory-strip">
          <span className="memory-title">RECENT ECHOES</span>
          {recent.map((turn) => <button key={turn.id} onClick={() => { setActive(turn.response); setCharacter(turn.response.character); }}>{turn.question}</button>)}
        </aside>
      )}

      {showArchive && (
        <div className="archive-backdrop" onClick={() => setShowArchive(false)}>
          <section className="archive-panel" onClick={(e) => e.stopPropagation()}>
            <div className="archive-head">
              <div><span>THE ROOM LIBRARY</span><h2>Different questions, different worlds.</h2></div>
              <button className="round-tool" onClick={() => setShowArchive(false)}>×</button>
            </div>
            <p className="archive-intro">The first release uses an authored collection: original mini-essays, tiny stories, jokes, cinematic fragments and reflective answers. Your words choose the shelf; the shelf chooses the character and camera.</p>
            <div className="library-grid">
              {ROOM_LIBRARY.filter((item) => item.id !== "random").map((item) => (
                <button key={item.id} className={`library-card mood-card-${item.mood}`} onClick={() => { submit(item.prompt); setShowArchive(false); }}>
                  <span>{item.collection}</span><b>{item.title}</b><small>{item.prompt}</small>
                </button>
              ))}
            </div>
            <div className="archive-footer"><button onClick={() => { resetRoom(); setShowArchive(false); }}>CLEAR MEMORY</button><span>{ROOM_LIBRARY.length - 1} authored scenes in this release</span></div>
          </section>
        </div>
      )}
    </main>
  );
}
