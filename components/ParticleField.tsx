"use client";

import { useEffect, useRef } from "react";

export default function ParticleField({ dense = true }: { dense?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let width = 0;
    let height = 0;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const count = dense ? 120 : 45;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -0.08 - Math.random() * 0.18,
      r: 0.3 + Math.random() * 1.3,
      a: 0.08 + Math.random() * 0.36,
    }));
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -8) p.y = height + 8;
        if (p.x < -8) p.x = width + 8;
        if (p.x > width + 8) p.x = -8;
        ctx.beginPath();
        ctx.fillStyle = "rgba(230,232,222," + p.a + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(render);
    };
    window.addEventListener("resize", resize);
    render();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [dense]);

  return <canvas className="particle-field" ref={ref} aria-hidden="true" />;
}
