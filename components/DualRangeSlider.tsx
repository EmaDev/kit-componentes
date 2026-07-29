"use client";
import { useRef, useState } from "react";

interface DualRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  format?: (n: number) => string;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Rango numérico dual (min–max), ej. filtro de precio. */
export function DualRangeSlider({ min, max, step = 1, value, onChange, format = String, className = "" }: DualRangeSliderProps) {
  const [lo, hi] = value;
  const track = useRef<HTMLDivElement>(null);
  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  const setFromClient = (which: "lo" | "hi", clientX: number) => {
    const el = track.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const raw = min + ((clientX - r.left) / r.width) * (max - min);
    const snapped = Math.round(raw / step) * step;
    if (which === "lo") onChange([Math.min(Math.max(min, snapped), hi - step), hi]);
    else onChange([lo, Math.max(Math.min(max, snapped), lo + step)]);
  };

  const drag = (which: "lo" | "hi") => (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setFromClient(which, e.clientX);
    const move = (ev: PointerEvent) => setFromClient(which, ev.clientX);
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between text-sm font-bold text-foreground"><span>{format(lo)}</span><span>{format(hi)}</span></div>
      <div ref={track} className="relative h-1.5 rounded-full bg-border">
        <div className="absolute h-1.5 rounded-full bg-primary" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}/>
        {(["lo", "hi"] as const).map(which => (
          <span key={which} onPointerDown={drag(which)}
            className="absolute top-1/2 w-5 h-5 rounded-full bg-white border-2 border-primary shadow-md -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing touch-none"
            style={{ left: `${pct(which === "lo" ? lo : hi)}%` }}/>
        ))}
      </div>
    </div>
  );
}
