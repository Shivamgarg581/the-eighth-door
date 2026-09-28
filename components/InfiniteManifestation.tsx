"use client";

import { useEffect, useRef } from "react";

const PARTICLES = 120_000;
const MOBILE_PARTICLES = 100_000;

export default function InfiniteManifestation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const count = window.innerWidth < 700 ? MOBILE_PARTICLES : PARTICLES;

    const x = new Float32Array(count);
    const y = new Float32Array(count);
    const vx = new Float32Array(count);
    const vy = new Float32Array(count);
    const phase = new Float32Array(count);
    const depth = new Float32Array(count);
    const size = new Float32Array(count);

    let seed = 1771;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };

    for (let i = 0; i < count; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.pow(rand(), 0.5);
      x[i] = Math.cos(a) * r;
      y[i] = Math.sin(a) * r * 0.68;
      vx[i] = (rand() - 0.5) * 0.00022;
      vy[i] = (rand() - 0.5) * 0.00022;
      phase[i] = rand() * Math.PI * 2;
      depth[i] = rand();
      size[i] = 0.35 + rand() * 1.8;
    }

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const move = (event: PointerEvent) => {
      pointer.tx = event.clientX / width;
      pointer.ty = event.clientY / height;
      pointer.active = true;
    };
    const leave = () => { pointer.active = false; };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave, { passive: true });

    let last = performance.now();
    let frame = 0;
    const render = (now: number) => {
      const dt = Math.min(34, now - last);
      last = now;
      frame++;

      pointer.x += (pointer.tx - pointer.x) * 0.065;
      pointer.y += (pointer.ty - pointer.y) * 0.065;

      const cx = width * 0.5;
      const cy = height * 0.49;
      const scaleX = Math.min(width * 0.62, 980);
      const scaleY = Math.min(height * 0.46, 620);
      const mx = (pointer.x - 0.5) * width;
      const my = (pointer.y - 0.5) * height;
      const t = now * 0.001;

      ctx.fillStyle = "#010106";
      ctx.fillRect(0, 0, width, height);

      const halo = ctx.createRadialGradient(
        cx + mx * 0.13,
        cy + my * 0.13,
        0,
        cx + mx * 0.13,
        cy + my * 0.13,
        Math.min(width, height) * 0.68
      );
      halo.addColorStop(0, "rgba(150,120,255,0.20)");
      halo.addColorStop(0.34, "rgba(91,72,184,0.08)");
      halo.addColorStop(0.7, "rgba(38,58,122,0.025)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < count; i++) {
        const radial = Math.sqrt(x[i] * x[i] + y[i] * y[i]);
        const ang = phase[i] + t * (0.05 + depth[i] * 0.08);
        const wave = Math.sin(ang + radial * 9.0) * 0.0007;
        const curl = Math.cos(ang * 0.73 - radial * 11.0) * 0.0006;

        x[i] += vx[i] + wave * (1 + depth[i]);
        y[i] += vy[i] + curl * (1 + depth[i]);

        const dx = x[i] - (pointer.x - 0.5) * 0.85;
        const dy = y[i] - (pointer.y - 0.5) * 0.58;
        const dist2 = dx * dx + dy * dy + 0.00015;

        if (pointer.active) {
          const force = 0.0000095 / dist2;
          x[i] += dx * force * (0.35 + depth[i]);
          y[i] += dy * force * (0.35 + depth[i]);
        }

        if (radial > 1.35) {
          const inv = 0.45 / radial;
          x[i] *= inv;
          y[i] *= inv;
        }

        const px = cx + x[i] * scaleX;
        const py = cy + y[i] * scaleY;
        const sparkle = 0.26 + 0.58 * (0.5 + 0.5 * Math.sin(t * (0.7 + depth[i] * 1.3) + phase[i]));
        const warm = 0.08 + 0.13 * (0.5 + 0.5 * Math.sin(phase[i] * 2 + t * 0.21));
        const s = size[i] * (0.75 + 0.65 * depth[i]);

        ctx.globalAlpha = sparkle * (0.3 + depth[i] * 0.72);
        ctx.fillStyle = warm > 0.15 ? "rgba(255,188,208,0.9)" : "rgba(195,180,255,0.9)";
        ctx.fillRect(px, py, s, s);
      }

      // Cursor-made gravitational rings.
      if (pointer.active) {
        const ringX = width * pointer.x;
        const ringY = height * pointer.y;
        for (let r = 0; r < 4; r++) {
          const rr = 34 + r * 23 + Math.sin(t * 1.8 + r) * 5;
          ctx.globalAlpha = 0.12 - r * 0.018;
          ctx.strokeStyle = r % 2 ? "rgba(170,150,255,0.85)" : "rgba(245,170,198,0.75)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(ringX, ringY, rr, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // A slow, giant "eye" made from light—kept subtle until the pointer gets close.
      const eyeDx = pointer.x - 0.5;
      const eyeDy = pointer.y - 0.46;
      const eyeFocus = pointer.active ? Math.min(1, Math.sqrt(eyeDx * eyeDx + eyeDy * eyeDy) * 3.2) : 0;
      const eyeAlpha = 0.035 + eyeFocus * 0.09 + (0.5 + 0.5 * Math.sin(t * 0.35)) * 0.018;

      ctx.globalAlpha = eyeAlpha;
      ctx.strokeStyle = "rgba(214,202,255,0.8)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cx + mx * 0.16, cy + my * 0.16, Math.min(width, height) * 0.22, Math.min(width, height) * 0.07, Math.sin(t * 0.13) * 0.05, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = eyeAlpha * 1.6;
      ctx.fillStyle = "rgba(244,222,237,0.9)";
      ctx.beginPath();
      ctx.arc(cx + mx * 0.18, cy + my * 0.18, 2.4 + eyeFocus * 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} className="manifestation-canvas" aria-hidden="true" />;
}
