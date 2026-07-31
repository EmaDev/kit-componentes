"use client";

import { useEffect, useRef, useState } from "react";

interface StudyTimerProps {
  focusMinutes?: number;
  breakMinutes?: number;
  onCycleComplete?: (kind: "focus" | "break") => void;
  className?: string;
}

/** Temporizador Pomodoro: foco/descanso alternados, con conteo de ciclos completados. */
export function StudyTimer({ focusMinutes = 25, breakMinutes = 5, onCycleComplete, className = "" }: StudyTimerProps) {
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [seconds, setSeconds] = useState(focusMinutes * 60);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const total = mode === "focus" ? focusMinutes * 60 : breakMinutes * 60;
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          const finished = mode;
          const next = mode === "focus" ? "break" : "focus";
          onCycleComplete?.(finished);
          if (finished === "focus") setCycles(c => c + 1);
          setMode(next);
          return (next === "focus" ? focusMinutes : breakMinutes) * 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, mode, focusMinutes, breakMinutes, onCycleComplete]);

  const reset = () => { setRunning(false); setMode("focus"); setSeconds(focusMinutes * 60); };
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const pct = ((total - seconds) / total) * 100;
  const r = 78;
  const circumference = 2 * Math.PI * r;

  return (
    <div className={`flex flex-col items-center gap-5 ${className}`}>
      <span className={`text-[11px] font-bold uppercase tracking-[0.14em] ${mode === "focus" ? "text-primary" : "text-success"}`}>
        {mode === "focus" ? "Foco" : "Descanso"}
      </span>
      <div className="relative w-44 h-44">
        <svg width="176" height="176" viewBox="0 0 176 176" className="-rotate-90">
          <circle cx="88" cy="88" r={r} fill="none" stroke="var(--color-border)" strokeWidth="8"/>
          <circle cx="88" cy="88" r={r} fill="none" stroke={mode === "focus" ? "var(--color-primary)" : "var(--color-success)"} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={circumference - (pct / 100) * circumference}
            style={{ transition: "stroke-dashoffset 1s linear" }}/>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-foreground tabular-nums">{mm}:{ss}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setRunning(r => !r)}
          className="h-11 px-6 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover active:scale-[0.98] transition-all">
          {running ? "Pausar" : "Iniciar"}
        </button>
        <button type="button" onClick={reset} className="h-11 px-4 rounded-xl text-sm font-bold text-muted hover:bg-surface-alt transition-colors">Reiniciar</button>
      </div>
      <p className="text-xs text-muted">{cycles} {cycles === 1 ? "ciclo completado" : "ciclos completados"}</p>
    </div>
  );
}
