"use client";
import { useState } from "react";

export interface NumberGeneratorProps {
  defaultMin?: number;
  defaultMax?: number;
  onGenerate?: (n: number) => void;
  className?: string;
}
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

/** Generador de números al azar en un rango elegible, con efecto de conteo y historial. */
export function NumberGenerator({ defaultMin = 1, defaultMax = 100, onGenerate, className = "" }: NumberGeneratorProps) {
  const [min, setMin] = useState(defaultMin);
  const [max, setMax] = useState(defaultMax);
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [rolling, setRolling] = useState(false);

  const generate = () => {
    if (rolling || min >= max) return;
    setRolling(true);
    let ticks = 0;
    const total = 10;
    const final = randInt(min, max);
    const step = () => {
      setResult(randInt(min, max));
      ticks++;
      if (ticks < total) window.setTimeout(step, 40 + (ticks / total) * 90);
      else {
        setResult(final);
        setHistory((h) => [final, ...h].slice(0, 10));
        setRolling(false);
        onGenerate?.(final);
      }
    };
    step();
  };

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="flex items-end gap-3">
        <label className="flex-1"><p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1">Mínimo</p><input type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} className="w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></label>
        <label className="flex-1"><p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1">Máximo</p><input type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} className="w-full h-10 rounded-lg border border-border bg-surface px-3 text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" /></label>
      </div>
      <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/[0.04] py-8 flex items-center justify-center">
        <span className="text-5xl font-bold text-foreground tabular-nums">{result ?? "?"}</span>
      </div>
      <button type="button" onClick={generate} disabled={rolling || min >= max} className="h-11 px-6 rounded-xl bg-primary text-white text-sm font-bold active:scale-[0.98] disabled:opacity-60 transition-all w-full">{rolling ? "Generando…" : "Generar número"}</button>
      {history.length > 0 && <p className="text-xs text-muted">Historial: {history.join(", ")}</p>}
    </div>
  );
}
