"use client";
import { useRef, useState } from "react";

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspect?: number;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Comparador de imágenes con divisor arrastrable (antes/después). */
export function BeforeAfterSlider({ before, after, beforeLabel = "Antes", afterLabel = "Después", aspect = 16 / 10, className = "" }: BeforeAfterSliderProps) {
  const [pct, setPct] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const move = (clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPct(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div ref={box} className={cn("relative w-full overflow-hidden rounded-2xl border border-border select-none touch-none", className)}
      style={{ aspectRatio: aspect }}
      onPointerDown={e => { dragging.current = true; (e.target as HTMLElement).setPointerCapture(e.pointerId); move(e.clientX); }}
      onPointerMove={e => dragging.current && move(e.clientX)}
      onPointerUp={() => { dragging.current = false; }}>
      <img src={after} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover"/>
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <img src={before} alt={beforeLabel} className="h-full object-cover" style={{ width: `${100 / (pct / 100 || 1)}%`, maxWidth: "none" }}/>
      </div>
      <div className="absolute inset-y-0" style={{ left: `${pct}%`, transform: "translateX(-50%)" }}>
        <div className="w-0.5 h-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"/>
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg inline-flex items-center justify-center cursor-ew-resize">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 6 9 12 15 18"/><polyline points="9 6 15 12 9 18" transform="translate(0,0)" style={{ display: "none" }}/></svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="-ml-2"><polyline points="9 6 15 12 9 18"/></svg>
        </span>
      </div>
      <span className="absolute top-2.5 left-2.5 h-6 px-2.5 rounded-full bg-black/55 text-white text-[11px] font-bold inline-flex items-center">{beforeLabel}</span>
      <span className="absolute top-2.5 right-2.5 h-6 px-2.5 rounded-full bg-black/55 text-white text-[11px] font-bold inline-flex items-center">{afterLabel}</span>
    </div>
  );
}
