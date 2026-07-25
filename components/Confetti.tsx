"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  /** cambiá este número para volver a disparar */
  fire?: number;
  /** cantidad de papelitos por disparo */
  count?: number;
  colors?: string[];
  /** burst = dos cañones laterales · rain = cae desde arriba · center = explosión central */
  mode?: "burst" | "rain" | "center";
  duration?: number;
  /** respeta prefers-reduced-motion (recomendado) */
  respectReducedMotion?: boolean;
  className?: string;
}

interface Piece {
  x: number; y: number; vx: number; vy: number;
  rot: number; vr: number; w: number; h: number;
  color: string; shape: 0 | 1; life: number;
}

const DEFAULT_COLORS = ["#2563eb", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4"];

/** Confeti en canvas: física simple, sin dependencias y sin capturar clicks. */
export function Confetti({
  fire = 1, count = 140, colors = DEFAULT_COLORS, mode = "burst",
  duration = 3200, respectReducedMotion = true, className = "",
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || fire <= 0) return;
    if (respectReducedMotion && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = canvas.getBoundingClientRect().width;
    const H = canvas.getBoundingClientRect().height;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const spawn = (): Piece => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const base = { rot: rnd(0, Math.PI * 2), vr: rnd(-0.22, 0.22), w: rnd(6, 11), h: rnd(8, 15), color, shape: (Math.random() > 0.35 ? 0 : 1) as 0 | 1, life: 0 };
      if (mode === "rain") return { ...base, x: rnd(0, W), y: rnd(-H * 0.4, 0), vx: rnd(-0.7, 0.7), vy: rnd(2.2, 4.6) };
      if (mode === "center") { const a = rnd(0, Math.PI * 2), s = rnd(4, 12); return { ...base, x: W / 2, y: H * 0.42, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 3 }; }
      const left = Math.random() > 0.5;
      const a = left ? rnd(-1.25, -0.5) : rnd(-2.64, -1.9);
      const s = rnd(9, 16);
      return { ...base, x: left ? 0 : W, y: H * 0.78, vx: Math.cos(a) * s * (left ? 1 : 1), vy: Math.sin(a) * s };
    };

    const pieces: Piece[] = Array.from({ length: count }, spawn);
    const start = performance.now();

    const tick = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      let alive = 0;
      for (const p of pieces) {
        p.vy += 0.16;            // gravedad
        p.vx *= 0.992;           // roce
        p.vy *= 0.994;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life = t / duration;
        if (p.y < H + 40) alive++;
        const fade = Math.max(0, 1 - Math.max(0, (t - duration * 0.62) / (duration * 0.38)));
        if (fade <= 0) continue;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.color;
        if (p.shape === 0) ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 1.4)));
        else { ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2); ctx.fill(); }
        ctx.restore();
      }
      if (t < duration && alive > 0) raf.current = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, W, H);
    };
    raf.current = requestAnimationFrame(tick);

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, [fire, count, colors, mode, duration, respectReducedMotion]);

  return (
    <canvas ref={canvasRef} aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}/>
  );
}
