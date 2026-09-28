"use client";

import { useEffect, useRef } from "react";

const PARTICLES = 120_000;

function shader(gl: WebGL2RenderingContext, type: number, source: string) {
  const s = gl.createShader(type);
  if (!s) throw new Error("shader");
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader compile");
  return s;
}

function program(gl: WebGL2RenderingContext) {
  const vertex = shader(gl, gl.VERTEX_SHADER, `
    #version 300 es
    precision highp float;

    layout(location=0) in vec2 aPosition;
    layout(location=1) in float aPhase;
    layout(location=2) in float aSize;
    layout(location=3) in float aDepth;

    uniform float uTime;
    uniform float uAspect;

    out float vAlpha;
    out float vDepth;

    void main() {
      float t = uTime * (0.11 + aDepth * 0.13);
      float radius = length(aPosition);
      float wave = sin(t * 2.4 + aPhase * 8.0 + radius * 12.0);
      float wave2 = cos(t * 1.7 - aPhase * 5.0 + aPosition.y * 9.0);

      vec2 p = aPosition;
      p.x += sin(aPosition.y * 5.0 + aPhase * 6.283 + t) * 0.055 * (0.3 + aDepth);
      p.y += cos(aPosition.x * 4.0 - aPhase * 4.1 - t * 0.8) * 0.04 * (0.25 + aDepth);
      p *= 1.0 + 0.035 * sin(t + aPhase * 9.0);

      p.x += 0.055 * wave * (1.0 - smoothstep(0.15, 1.7, radius));
      p.y += 0.038 * wave2 * (1.0 - smoothstep(0.05, 1.6, radius));

      p.x *= (uAspect > 1.0 ? 1.0 : uAspect);
      gl_Position = vec4(p, aDepth * 0.7, 1.0);
      gl_PointSize = aSize * (1.0 + 0.42 * sin(t * 1.8 + aPhase * 13.0));
      vAlpha = 0.22 + 0.78 * (0.5 + 0.5 * sin(t * 1.35 + aPhase * 11.0));
      vDepth = aDepth;
    }
  `);

  const fragment = shader(gl, gl.FRAGMENT_SHADER, `
    #version 300 es
    precision highp float;

    in float vAlpha;
    in float vDepth;
    out vec4 outColor;

    void main() {
      vec2 p = gl_PointCoord * 2.0 - 1.0;
      float d = dot(p,p);
      if (d > 1.0) discard;
      float halo = pow(max(0.0, 1.0 - d), 2.6);
      float core = pow(max(0.0, 1.0 - d * 3.8), 6.0);

      vec3 deep = vec3(0.20, 0.14, 0.42);
      vec3 light = vec3(0.80, 0.73, 1.00);
      vec3 warm = vec3(0.95, 0.68, 0.58);
      float mixA = smoothstep(0.0, 1.0, vDepth);
      vec3 color = mix(deep, light, halo);
      color = mix(color, warm, 0.13 * sin(vDepth * 11.0 + gl_FragCoord.y * 0.015));

      outColor = vec4(color, (halo * 0.55 + core * 0.9) * vAlpha * (0.42 + 0.55 * mixA));
    }
  `);

  const p = gl.createProgram();
  if (!p) throw new Error("program");
  gl.attachShader(p, vertex);
  gl.attachShader(p, fragment);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || "program link");
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return p;
}

export default function InfiniteManifestation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      canvas.className = "manifestation-canvas fallback";
      return;
    }

    let raf = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      width = Math.max(1, Math.floor(window.innerWidth * dpr));
      height = Math.max(1, Math.floor(window.innerHeight * dpr));
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      gl.viewport(0, 0, width, height);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const p = program(gl);
    gl.useProgram(p);

    const positions = new Float32Array(PARTICLES * 2);
    const phases = new Float32Array(PARTICLES);
    const sizes = new Float32Array(PARTICLES);
    const depths = new Float32Array(PARTICLES);

    let state = 9137;
    const rand = () => {
      state = (state * 1664525 + 1013904223) >>> 0;
      return state / 4294967296;
    };

    for (let i = 0; i < PARTICLES; i++) {
      const theta = rand() * Math.PI * 2;
      const ring = Math.pow(rand(), 0.58);
      const spiral = 0.16 * Math.sin(theta * 3.0 + ring * 12.0);
      const x = Math.cos(theta) * ring * 1.38 + spiral * rand();
      const y = Math.sin(theta) * ring * 0.92 + 0.15 * Math.sin(theta * 7.0 + ring * 15.0) * rand();
      positions[i * 2] = x;
      positions[i * 2 + 1] = y;
      phases[i] = rand();
      sizes[i] = 0.7 + rand() * 3.7;
      depths[i] = rand();
    }

    const buffers: WebGLBuffer[] = [];
    const attrs: [number, Float32Array][] = [[0, positions],[1, phases],[2, sizes],[3, depths]];
    for (const [location, data] of attrs) {
      const b = gl.createBuffer();
      if (!b) throw new Error("buffer");
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, location === 0 ? 2 : 1, gl.FLOAT, false, 0, 0);
      buffers.push(b);
    }

    const uTime = gl.getUniformLocation(p, "uTime");
    const uAspect = gl.getUniformLocation(p, "uAspect");
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const start = performance.now();
    const render = (now: number) => {
      const time = (now - start) * 0.001;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uAspect, width > height ? height / width : width / height);
      gl.drawArrays(gl.POINTS, 0, PARTICLES);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      for (const b of buffers) gl.deleteBuffer(b);
      gl.deleteProgram(p);
    };
  }, []);

  return <canvas ref={ref} className="manifestation-canvas" aria-hidden="true" />;
}
