"use client";
import { useMemo } from "react";

export interface RouteStop { id: string; name: string; startDate: Date; endDate: Date; country?: string }

interface TripRouteMapProps {
  stops: RouteStop[];
  value?: string;
  onSelect?: (id: string) => void;
  locale?: string;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const MS_DAY = 86_400_000;

/** Resumen de ruta del viaje: destinos encadenados con fechas y noches, sin mapa real. */
export function TripRouteMap({ stops, value, onSelect, locale = "es-AR", className = "" }: TripRouteMapProps) {
  const fmt = useMemo(() => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }), [locale]);

  return (
    <div className={cn("overflow-x-auto -mx-1 px-1", className)}>
      <div className="flex items-start min-w-max">
        {stops.map((s, i) => {
          const nights = Math.max(0, Math.round((s.endDate.getTime() - s.startDate.getTime()) / MS_DAY));
          const active = value === s.id;
          return (
            <div key={s.id} className="flex items-start">
              <button type="button" onClick={() => onSelect?.(s.id)}
                className={cn("w-36 rounded-2xl border px-3.5 py-3 text-left transition-all shrink-0",
                  active ? "bg-primary border-primary text-white" : "border-border bg-surface hover:border-primary/40")}>
                <span className={cn("inline-flex w-6 h-6 rounded-full items-center justify-center mb-2", active ? "bg-white/20" : "bg-primary/10 text-primary")}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-4.6-7-11a7 7 0 0 1 14 0c0 6.4-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
                </span>
                <p className="text-sm font-bold leading-snug truncate">{s.name}</p>
                {s.country && <p className={cn("text-[11px] mt-0.5", active ? "text-white/70" : "text-muted")}>{s.country}</p>}
                <p className={cn("text-[11px] font-semibold mt-2 tabular-nums", active ? "text-white/85" : "text-muted")}>
                  {fmt.format(s.startDate)} – {fmt.format(s.endDate)}
                </p>
                <p className={cn("text-[10px] font-bold uppercase tracking-wide mt-1", active ? "text-white/70" : "text-primary")}>{nights} {nights === 1 ? "noche" : "noches"}</p>
              </button>
              {i < stops.length - 1 && (
                <div className="w-10 pt-6 flex items-center justify-center shrink-0">
                  <svg width="34" height="10" viewBox="0 0 34 10" className="text-muted/40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3">
                    <line x1="0" y1="5" x2="34" y2="5" />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
