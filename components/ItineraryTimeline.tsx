"use client";
import { useMemo, useState, type ReactNode } from "react";

export type ActivityKind = "flight" | "hotel" | "food" | "activity" | "transport";
export interface ItineraryActivity {
  id: string; kind: ActivityKind; title: string;
  time?: string; endTime?: string; location?: string; notes?: string;
}
export interface ItineraryDay { date: Date; activities: ItineraryActivity[] }

interface ItineraryTimelineProps {
  days: ItineraryDay[];
  value?: number;
  onDayChange?: (index: number) => void;
  onActivityClick?: (activity: ItineraryActivity, dayIndex: number) => void;
  locale?: string;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

const KIND_ICON: Record<ActivityKind, ReactNode> = {
  flight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19 3 13l1.7-2.5L11 12l1-6.3a2 2 0 0 1 2-1.7h.5c.6 0 1 .5 1 1.1L14.6 12l6.7 1.9c.6.2 1 .8 1 1.4v.4c0 .8-.7 1.4-1.5 1.3z"/></svg>,
  hotel: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20V9m0 11h20V9m-20 0h20M6 5h12v4H6z"/><path d="M6 20v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg>,
  food: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v9M15 3c-1.7 0-3 2-3 4.5S13.3 12 15 12s3-2 3-4.5S16.7 3 15 3zm0 9v9"/></svg>,
  activity: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.6-7-11a7 7 0 0 1 14 0c0 6.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>,
  transport: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17h14M5 17a2 2 0 1 0 4 0m6 0a2 2 0 1 0 4 0M5 17V9a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8M5 12h14"/></svg>,
};

const KIND_TONE: Record<ActivityKind, string> = {
  flight: "bg-primary/10 text-primary", hotel: "bg-accent/10 text-accent",
  food: "bg-success/10 text-success", activity: "bg-primary/10 text-primary", transport: "bg-muted/15 text-muted",
};

/** Itinerario día por día: tira de días + línea de tiempo vertical con horarios y tipo de actividad. */
export function ItineraryTimeline({ days, value, onDayChange, onActivityClick, locale = "es-AR", className = "" }: ItineraryTimelineProps) {
  const [internal, setInternal] = useState(0);
  const dayIdx = value ?? internal;
  const setDay = (i: number) => { setInternal(i); onDayChange?.(i); };

  const fmtDow = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short" }), [locale]);
  const fmtDay = useMemo(() => new Intl.DateTimeFormat(locale, { day: "numeric" }), [locale]);
  const fmtFull = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long" }), [locale]);

  const day = days[dayIdx];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {days.map((d, i) => (
          <button key={i} type="button" onClick={() => setDay(i)}
            className={cn("shrink-0 w-14 h-[62px] rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition-all",
              i === dayIdx ? "bg-primary border-primary text-white" : "border-border bg-surface hover:border-primary/40")}>
            <span className={cn("text-[10px] font-bold uppercase", i === dayIdx ? "text-white/80" : "text-muted")}>{fmtDow.format(d.date)}</span>
            <span className="text-base font-bold">{fmtDay.format(d.date)}</span>
          </button>
        ))}
      </div>

      {day && (
        <div>
          <p className="text-xs font-bold text-muted uppercase tracking-wide mb-3 capitalize">{fmtFull.format(day.date)}</p>
          <ol className="space-y-0">
            {day.activities.map((a, i) => (
              <li key={a.id} className="relative flex gap-3.5 pb-5 last:pb-0">
                {i < day.activities.length - 1 && <span className="absolute left-[13px] top-7 bottom-0 w-px bg-border" />}
                <span className={cn("relative z-10 w-7 h-7 rounded-full shrink-0 inline-flex items-center justify-center", KIND_TONE[a.kind])}>
                  {KIND_ICON[a.kind]}
                </span>
                <button type="button" onClick={() => onActivityClick?.(a, dayIdx)}
                  className="min-w-0 flex-1 text-left rounded-xl border border-border bg-surface px-3.5 py-2.5 -mt-0.5 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground leading-snug">{a.title}</p>
                    {a.time && <span className="shrink-0 text-[11px] font-bold text-muted tabular-nums">{a.time}{a.endTime ? `–${a.endTime}` : ""}</span>}
                  </div>
                  {a.location && <p className="mt-0.5 text-xs text-muted">{a.location}</p>}
                  {a.notes && <p className="mt-1 text-[11px] text-muted/80 leading-relaxed">{a.notes}</p>}
                </button>
              </li>
            ))}
            {day.activities.length === 0 && <p className="text-sm text-muted py-6 text-center">Sin actividades planificadas.</p>}
          </ol>
        </div>
      )}
    </div>
  );
}
