"use client";

import { useMemo } from "react";

interface StreakTrackerProps {
  /** fechas (yyyy-mm-dd) en que hubo estudio */
  studiedDates: string[];
  weeks?: number;
  goalPerWeek?: number;
  className?: string;
}

function toKey(d: Date) { return d.toISOString().slice(0, 10); }

/** Racha de estudio: grilla tipo calendario de constancia + racha actual. */
export function StreakTracker({ studiedDates, weeks = 14, goalPerWeek = 5, className = "" }: StreakTrackerProps) {
  const set = useMemo(() => new Set(studiedDates), [studiedDates]);

  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const total = weeks * 7;
    return Array.from({ length: total }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (total - 1 - i));
      return { date: d, key: toKey(d), studied: set.has(toKey(d)) };
    });
  }, [set, weeks]);

  const streak = useMemo(() => {
    let s = 0;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    for (let i = 0; ; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      if (set.has(toKey(d))) s++; else break;
    }
    return s;
  }, [set]);

  const thisWeekCount = days.slice(-7).filter(d => d.studied).length;
  const cols = weeks;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-6">
        <div>
          <p className="text-3xl font-bold text-foreground tabular-nums">{streak}</p>
          <p className="text-[11px] text-muted">{streak === 1 ? "día de racha" : "días de racha"}</p>
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground tabular-nums">{thisWeekCount}/{7}</p>
          <p className="text-[11px] text-muted">esta semana · meta {goalPerWeek}</p>
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-surface-alt/40 p-4 overflow-x-auto">
        <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: "repeat(7, 1fr)", gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {days.map(d => (
            <span key={d.key} title={d.key}
              className={`w-3.5 h-3.5 rounded-[3px] ${d.studied ? "bg-primary" : "bg-border/60"}`}/>
          ))}
        </div>
      </div>
    </div>
  );
}
