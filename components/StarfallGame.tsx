"use client";

import { useEffect, useRef, useState } from "react";

type Vec = { x: number; y: number };
type Orb = Vec & { r: number; phase: number; value: number };
type Enemy = Vec & { r: number; speed: number; angle: number; spin: number };
type Power = Vec & { r: number; phase: number; ttl: number };

const WORLD = { w: 1200, h: 760 };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function resetGame() {
  return {
    player: { x: WORLD.w * 0.5, y: WORLD.h * 0.68, r: 17, vx: 0, vy: 0, shield: 0, invuln: 0 },
    stars: [] as Orb[],
    enemies: [] as Enemy[],
    powers: [] as Power[],
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; max: number; size: number; kind: number }[],
    score: 0,
    combo: 1,
    lives: 3,
    time: 0,
    spawn: 0,
    starSpawn: 0,
    powerSpawn: 10,
    screenShake: 0,
    over: false,
  };
}

export default function StarfallGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<ReturnType<typeof resetGame> | null>(null);
  const keys = useRef(new Set<string>());
  const pointer = useRef({ active: false, x: WORLD.w / 2, y: WORLD.h * 0.68 });
  const bestRef = useRef(0);
  const [started, setStarted] = useState(false);
  const [best, setBest] = useState(0);
  const [display, setDisplay] = useState({ score: 0, combo: 1, lives: 3, shield: 0 });

  useEffect(() => {
    try {
      const value = Number(localStorage.getItem("starfall-best") || 0);
      bestRef.current = Number.isFinite(value) ? value : 0;
      setBest(bestRef.current);
    } catch {}
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let cssW = 0;
    let cssH = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      cssW = window.innerWidth;
      cssH = window.innerHeight;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const toWorld = (clientX: number, clientY: number): Vec => ({
      x: (clientX / cssW) * WORLD.w,
      y: (clientY / cssH) * WORLD.h,
    });

    const pointerMove = (event: PointerEvent) => {
      pointer.current.active = true;
      pointer.current.x = clamp(toWorld(event.clientX, event.clientY).x, 0, WORLD.w);
      pointer.current.y = clamp(toWorld(event.clientX, event.clientY).y, 0, WORLD.h);
    };
    const pointerDown = (event: PointerEvent) => {
      pointer.current.active = true;
      const p = toWorld(event.clientX, event.clientY);
      pointer.current.x = clamp(p.x, 0, WORLD.w);
      pointer.current.y = clamp(p.y, 0, WORLD.h);
      if (!started && !stateRef.current) {
        stateRef.current = resetGame();
        setStarted(true);
      }
    };
    const pointerUp = () => { pointer.current.active = false; };

    window.addEventListener("pointermove", pointerMove, { passive: true });
    window.addEventListener("pointerdown", pointerDown, { passive: true });
    window.addEventListener("pointerup", pointerUp, { passive: true });

    let last = performance.now();
    let uiTick = 0;

    const spawnStar = (game: NonNullable<typeof stateRef.current>) => {
      game.stars.push({
        x: 55 + Math.random() * (WORLD.w - 110),
        y: 86 + Math.random() * (WORLD.h - 145),
        r: 8 + Math.random() * 5,
        phase: Math.random() * Math.PI * 2,
        value: 10,
      });
    };

    const spawnEnemy = (game: NonNullable<typeof stateRef.current>) => {
      const edge = Math.floor(Math.random() * 4);
      let x = 0;
      let y = 0;
      if (edge === 0) { x = -25; y = Math.random() * WORLD.h; }
      if (edge === 1) { x = WORLD.w + 25; y = Math.random() * WORLD.h; }
      if (edge === 2) { x = Math.random() * WORLD.w; y = -25; }
      if (edge === 3) { x = Math.random() * WORLD.w; y = WORLD.h + 25; }
      const angle = Math.atan2(game.player.y - y, game.player.x - x);
      game.enemies.push({
        x, y, r: 13 + Math.random() * 10,
        speed: 80 + game.time * 2.5 + Math.random() * 55,
        angle,
        spin: (Math.random() - 0.5) * 4,
      });
    };

    const spawnPower = (game: NonNullable<typeof stateRef.current>) => {
      game.powers.push({
        x: 85 + Math.random() * (WORLD.w - 170),
        y: 120 + Math.random() * (WORLD.h - 210),
        r: 14,
        phase: Math.random() * Math.PI * 2,
        ttl: 13,
      });
    };

    const burst = (game: NonNullable<typeof stateRef.current>, x: number, y: number, kind = 0, amount = 22) => {
      for (let i = 0; i < amount; i++) {
        const a = Math.random() * Math.PI * 2;
        const speed = 35 + Math.random() * 220;
        const max = 0.35 + Math.random() * 0.55;
        game.particles.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life: max, max, size: 1 + Math.random() * 3, kind });
      }
    };

    const update = (now: number) => {
      const game = stateRef.current;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = "#060711";
      ctx.fillRect(0, 0, cssW, cssH);

      const sx = cssW / WORLD.w;
      const sy = cssH / WORLD.h;
      ctx.save();
      ctx.scale(sx, sy);

      // Backdrop layers.
      const gradient = ctx.createRadialGradient(
        WORLD.w * (0.5 + (pointer.current.x / WORLD.w - 0.5) * 0.12),
        WORLD.h * (0.48 + (pointer.current.y / WORLD.h - 0.5) * 0.08),
        30,
        WORLD.w * 0.5,
        WORLD.h * 0.5,
        WORLD.w * 0.72
      );
      gradient.addColorStop(0, "rgba(87,76,189,.22)");
      gradient.addColorStop(0.4, "rgba(27,43,92,.1)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WORLD.w, WORLD.h);

      ctx.strokeStyle = "rgba(154,150,255,.07)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 10; i++) {
        const y = ((i * 96 + game?.time * 13) % (WORLD.h + 96)) - 48;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WORLD.w, y + 110);
        ctx.stroke();
      }

      // Background stars.
      for (let i = 0; i < 110; i++) {
        const px = (i * 97.13) % WORLD.w;
        const py = (i * 53.77) % WORLD.h;
        const twinkle = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin((game?.time || 0) * (0.6 + (i % 4) * 0.17) + i));
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = i % 6 === 0 ? "#e9c8ff" : "#9ba9ff";
        ctx.fillRect(px, py, i % 5 === 0 ? 2 : 1, i % 5 === 0 ? 2 : 1);
      }
      ctx.globalAlpha = 1;

      if (!game) {
        ctx.restore();
        raf = requestAnimationFrame(update);
        return;
      }

      if (!game.over) {
        game.time += dt;
        game.spawn -= dt;
        game.starSpawn -= dt;
        game.powerSpawn -= dt;
        game.screenShake = Math.max(0, game.screenShake - dt * 7);
        game.player.invuln = Math.max(0, game.player.invuln - dt);
        game.player.shield = Math.max(0, game.player.shield - dt);

        const inputX = (keys.current.has("d") || keys.current.has("arrowright") ? 1 : 0) - (keys.current.has("a") || keys.current.has("arrowleft") ? 1 : 0);
        const inputY = (keys.current.has("s") || keys.current.has("arrowdown") ? 1 : 0) - (keys.current.has("w") || keys.current.has("arrowup") ? 1 : 0);
        let tx = inputX;
        let ty = inputY;
        if (pointer.current.active) {
          const dx = pointer.current.x - game.player.x;
          const dy = pointer.current.y - game.player.y;
          const d = Math.hypot(dx, dy);
          if (d > 18) {
            tx += dx / d;
            ty += dy / d;
          }
        }
        const len = Math.hypot(tx, ty) || 1;
        const speed = 290;
        game.player.vx += (tx / len * speed - game.player.vx) * Math.min(1, dt * 8);
        game.player.vy += (ty / len * speed - game.player.vy) * Math.min(1, dt * 8);
        game.player.x = clamp(game.player.x + game.player.vx * dt, 28, WORLD.w - 28);
        game.player.y = clamp(game.player.y + game.player.vy * dt, 72, WORLD.h - 36);

        if (game.starSpawn <= 0) {
          spawnStar(game);
          game.starSpawn = Math.max(0.18, 0.55 - game.time * 0.003);
        }
        if (game.spawn <= 0) {
          spawnEnemy(game);
          if (game.time > 18 && Math.random() < 0.35) spawnEnemy(game);
          game.spawn = Math.max(0.27, 0.95 - game.time * 0.012);
        }
        if (game.powerSpawn <= 0) {
          spawnPower(game);
          game.powerSpawn = 17 + Math.random() * 7;
        }

        for (const star of game.stars) {
          star.phase += dt * 3;
          const d = Math.hypot(game.player.x - star.x, game.player.y - star.y);
          if (d < game.player.r + star.r + 4) {
            game.score += Math.round(star.value * game.combo);
            game.combo = Math.min(9, game.combo + 0.25);
            burst(game, star.x, star.y, 1, 18);
            star.x = -999;
          }
        }
        game.stars = game.stars.filter((s) => s.x > -100);

        for (const power of game.powers) {
          power.phase += dt * 3;
          power.ttl -= dt;
          if (Math.hypot(game.player.x - power.x, game.player.y - power.y) < game.player.r + power.r + 6) {
            game.player.shield = 5;
            game.score += 50;
            burst(game, power.x, power.y, 2, 30);
            power.ttl = -1;
          }
        }
        game.powers = game.powers.filter((p) => p.ttl > 0);

        for (const enemy of game.enemies) {
          const angle = Math.atan2(game.player.y - enemy.y, game.player.x - enemy.x);
          enemy.angle += Math.atan2(Math.sin(angle - enemy.angle), Math.cos(angle - enemy.angle)) * dt * 1.7;
          enemy.x += Math.cos(enemy.angle) * enemy.speed * dt;
          enemy.y += Math.sin(enemy.angle) * enemy.speed * dt;
          enemy.spin += dt * 2;

          const d = Math.hypot(game.player.x - enemy.x, game.player.y - enemy.y);
          if (d < game.player.r + enemy.r) {
            if (game.player.shield > 0) {
              burst(game, enemy.x, enemy.y, 2, 36);
              game.score += 35;
              game.screenShake = 0.9;
              enemy.x = 9999;
            } else if (game.player.invuln <= 0) {
              game.lives -= 1;
              game.combo = 1;
              game.player.invuln = 1.2;
              game.screenShake = 1;
              burst(game, game.player.x, game.player.y, 0, 42);
              if (game.lives <= 0) {
                game.over = true;
                bestRef.current = Math.max(bestRef.current, game.score);
                setBest(bestRef.current);
                try { localStorage.setItem("starfall-best", String(bestRef.current)); } catch {}
              }
            }
          }
        }
        game.enemies = game.enemies.filter((e) => e.x < WORLD.w + 1000 && e.x > -1000 && e.y < WORLD.h + 1000 && e.y > -1000);
      } else {
        game.combo = 1;
      }

      for (const p of game.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.life -= dt;
      }
      game.particles = game.particles.filter((p) => p.life > 0);

      // Draw objects.
      for (const star of game.stars) {
        const pulse = 0.9 + Math.sin(star.phase) * 0.18;
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "#ffd56e";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 3.5 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff0b8";
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#ffbd55";
        ctx.beginPath();
        ctx.moveTo(star.x - star.r * 2.1, star.y);
        ctx.lineTo(star.x + star.r * 2.1, star.y);
        ctx.moveTo(star.x, star.y - star.r * 2.1);
        ctx.lineTo(star.x, star.y + star.r * 2.1);
        ctx.stroke();
      }

      for (const power of game.powers) {
        const pulse = 1 + Math.sin(power.phase) * 0.12;
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = "#7de6ff";
        ctx.beginPath();
        ctx.arc(power.x, power.y, 38 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = "#9df0ff";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(power.x, power.y, power.r * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(power.x, power.y - power.r * 0.55);
        ctx.lineTo(power.x + power.r * 0.55, power.y);
        ctx.lineTo(power.x, power.y + power.r * 0.55);
        ctx.lineTo(power.x - power.r * 0.55, power.y);
        ctx.closePath();
        ctx.stroke();
      }

      for (const enemy of game.enemies) {
        ctx.save();
        ctx.translate(enemy.x, enemy.y);
        ctx.rotate(enemy.spin);
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = "#ff456d";
        ctx.beginPath();
        ctx.arc(0, 0, enemy.r * 2.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#ff4b70";
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI / 4;
          const rr = i % 2 ? enemy.r * 0.7 : enemy.r * 1.28;
          const px = Math.cos(a) * rr;
          const py = Math.sin(a) * rr;
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#190817";
        ctx.beginPath();
        ctx.arc(-enemy.r * 0.26, -enemy.r * 0.1, 2.2, 0, Math.PI * 2);
        ctx.arc(enemy.r * 0.26, -enemy.r * 0.1, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      for (const p of game.particles) {
        ctx.globalAlpha = Math.max(0, p.life / p.max);
        ctx.fillStyle = p.kind === 1 ? "#ffd56e" : p.kind === 2 ? "#82e6ff" : "#bcaeff";
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;

      const px = game.player.x;
      const py = game.player.y;
      const pulse = 1 + Math.sin(game.time * 5) * 0.08;
      ctx.globalAlpha = game.player.invuln > 0 && Math.floor(game.time * 16) % 2 ? 0.32 : 1;
      ctx.fillStyle = "rgba(126,109,255,.16)";
      ctx.beginPath();
      ctx.arc(px, py, 58 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#d8d3ff";
      ctx.beginPath();
      ctx.arc(px, py, game.player.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6d58ff";
      ctx.beginPath();
      ctx.arc(px + game.player.vx * 0.025, py + game.player.vy * 0.025, game.player.r * 0.55, 0, Math.PI * 2);
      ctx.fill();

      if (game.player.shield > 0) {
        ctx.strokeStyle = "rgba(128,229,255,.9)";
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(px, py, 34 + Math.sin(game.time * 8) * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.restore();

      if (game.screenShake > 0) {
        // Visual shake is represented via a brief border flash so the canvas remains stable for touch.
        const alpha = Math.min(0.2, game.screenShake * 0.16);
        ctx.fillStyle = `rgba(255,70,110,${alpha})`;
        ctx.fillRect(0, 0, cssW, cssH);
      }

      uiTick += dt;
      if (uiTick > 0.08) {
        uiTick = 0;
        setDisplay({ score: game.score, combo: game.combo, lives: game.lives, shield: game.player.shield });
      }

      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", pointerMove);
      window.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointerup", pointerUp);
    };
  }, [started]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"," "].includes(key)) {
        e.preventDefault();
        keys.current.add(key);
      }
      if (key === "r" && stateRef.current?.over) {
        stateRef.current = resetGame();
        setStarted(true);
      }
      if (key === "enter" && !started) {
        stateRef.current = resetGame();
        setStarted(true);
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [started]);

  function start() {
    stateRef.current = resetGame();
    setStarted(true);
  }

  const gameOver = display.lives <= 0 && started && stateRef.current?.over;

  return (
    <main className="starfall-game">
      <canvas ref={canvasRef} className="starfall-canvas" />
      <div className="starfall-vignette" />

      <header className="game-hud">
        <div className="hud-brand">
          <span className="hud-dot" />
          <div><b>STARFALL</b><small>2D NIGHT SURVIVAL</small></div>
        </div>
        <div className="hud-stats">
          <div><span>SCORE</span><b>{display.score.toString().padStart(6, "0")}</b></div>
          <div><span>COMBO</span><b>x{display.combo.toFixed(1)}</b></div>
          <div><span>BEST</span><b>{best.toString().padStart(6, "0")}</b></div>
        </div>
      </header>

      {display.shield > 0 && <div className="shield-status">SHIELD {display.shield.toFixed(1)}s</div>}

      {!started && (
        <section className="game-intro">
          <span>ONE SCREEN. ONE ORB. DON'T STOP MOVING.</span>
          <h1>Catch the light.<br /><i>Survive the dark.</i></h1>
          <p>Collect golden stars, dodge red comets and grab the blue shield. Your combo climbs when you keep collecting.</p>
          <div className="control-row">
            <span><b>WASD</b> / <b>ARROWS</b> move</span>
            <span><b>DRAG</b> or <b>TOUCH</b> on mobile</span>
          </div>
          <button className="start-game" onClick={start}>START STARFALL</button>
        </section>
      )}

      {gameOver && (
        <section className="game-over">
          <span>SIGNAL LOST</span>
          <h2>THE SKY WON.</h2>
          <p>Score <b>{display.score.toLocaleString()}</b> · Best <b>{best.toLocaleString()}</b></p>
          <button className="start-game" onClick={start}>PLAY AGAIN</button>
          <small>Press R to restart</small>
        </section>
      )}

      <footer className="game-footer">
        <span>★ COLLECT</span><span>◆ SHIELD</span><span>✦ DODGE</span><span>{display.lives > 0 ? "●".repeat(display.lives) : "○○○"}</span>
      </footer>
    </main>
  );
}
