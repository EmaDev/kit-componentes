"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";

export interface CalendarEvent {
  id: string;
  title: string;
  /** inicio del evento */
  start: Date;
  /** fin; si se omite, dura lo mismo que el inicio */
  end?: Date;
  /** todo el día (se muestra como chip sólido, sin hora) */
  allDay?: boolean;
  /** color del token: usa los del tema */
  color?: "primary" | "accent" | "success" | "danger" | "muted";
  meta?: ReactNode;
}

interface CalendarGridProps {
  /** mes visible (cualquier fecha dentro de él). Default: hoy */
  month?: Date;
  events?: CalendarEvent[];
  /** primer día de la semana: 1 = lunes (default), 0 = domingo */
  weekStartsOn?: 0 | 1;
  /** eventos visibles por celda antes de "+N más". Default: 3 */
  maxPerDay?: number;
  /** alto mínimo de cada celda en px. Default: 96 */
  cellMinHeight?: number;
  onDayClick?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  /** controla el mes desde afuera; si se omite, el componente navega solo */
  onMonthChange?: (month: Date) => void;
  /** mostrar semanas del mes anterior/siguiente en gris. Default: true */
  showAdjacent?: boolean;
  locale?: string;
}

const COLORS = {
  primary: { chip: "bg-primary/12 text-primary", dot: "bg-primary", solid: "bg-primary text-white" },
  accent:  { chip: "bg-accent/12 text-accent",   dot: "bg-accent",  solid: "bg-accent text-white" },
  success: { chip: "bg-success/12 text-success", dot: "bg-success", solid: "bg-success text-white" },
  danger:  { chip: "bg-danger/12 text-danger",   dot: "bg-danger",  solid: "bg-danger text-white" },
  muted:   { chip: "bg-surface-alt text-muted",  dot: "bg-muted",   solid: "bg-muted text-white" },
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function CalendarGrid({
  month, events = [], weekStartsOn = 1, maxPerDay = 3, cellMinHeight = 96,
  onDayClick, onEventClick, onMonthChange, showAdjacent = true, locale = "es-AR",
}: CalendarGridProps) {
  const [innerMonth, setInnerMonth] = useState(() => month ?? new Date());
  const current = month ?? innerMonth;
  const [expanded, setExpanded] = useState<string | null>(null);

  const setMonth = (d: Date) => {
    if (onMonthChange) onMonthChange(d);
    else setInnerMonth(d);
  };

  const today = startOfDay(new Date());

  /** 6 semanas × 7 días que cubren el mes */
  const days = useMemo(() => {
    const first = new Date(current.getFullYear(), current.getMonth(), 1);
    const shift = (first.getDay() - weekStartsOn + 7) % 7;
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - shift);
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      return d;
    });
  }, [current, weekStartsOn]);

  /** eventos por día (YYYY-MM-DD), expandiendo los multi-día */
  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    const key = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    for (const ev of events) {
      const from = startOfDay(ev.start);
      const to = startOfDay(ev.end ?? ev.start);
      for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
        const k = key(d);
        map.set(k, [...(map.get(k) ?? []), ev]);
      }
    }
    for (const list of map.values()) {
      list.sort((a, b) =>
        Number(Boolean(b.allDay)) - Number(Boolean(a.allDay)) || a.start.getTime() - b.start.getTime()
      );
    }
    return map;
  }, [events]);

  const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

  const weekdayNames = useMemo(() => {
    const base = new Date(2024, 0, 1); // lunes
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + ((i + (weekStartsOn === 0 ? 6 : 0)) % 7));
      return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(d).replace(".", "");
    });
  }, [locale, weekStartsOn]);

  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(current);
  const timeFmt = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" });

  const shiftMonth = (delta: number) =>
    setMonth(new Date(current.getFullYear(), current.getMonth() + delta, 1));

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {/* barra de navegación */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-3">
        <p className="flex-1 text-sm font-semibold text-foreground capitalize">{monthLabel}</p>
        <div className="flex items-center gap-1">
          <NavBtn onClick={() => shiftMonth(-1)} label="Mes anterior"><Chevron dir="left" /></NavBtn>
          <button
            onClick={() => setMonth(new Date())}
            className="h-8 px-3 rounded-lg text-xs font-semibold text-foreground hover:bg-surface-alt transition-colors"
          >
            Hoy
          </button>
          <NavBtn onClick={() => shiftMonth(1)} label="Mes siguiente"><Chevron dir="right" /></NavBtn>
        </div>
      </div>

      {/* encabezado de días */}
      <div className="grid grid-cols-7 border-b border-border bg-surface-alt/40">
        {weekdayNames.map((w) => (
          <div key={w} className="py-2 text-center text-[11px] font-bold uppercase tracking-wider text-muted">
            {w}
          </div>
        ))}
      </div>

      {/* grilla */}
      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const inMonth = d.getMonth() === current.getMonth();
          if (!showAdjacent && !inMonth) {
            return <div key={i} className="border-r border-b border-border last-in-row:border-r-0" style={{ minHeight: cellMinHeight }} />;
          }
          const k = dayKey(d);
          const list = byDay.get(k) ?? [];
          const isToday = sameDay(d, today);
          const isOpen = expanded === k;
          const shown = isOpen ? list : list.slice(0, maxPerDay);
          const hidden = list.length - shown.length;
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;

          return (
            <div
              key={i}
              onClick={() => onDayClick?.(d)}
              className={[
                "relative border-r border-b border-border p-1.5 flex flex-col gap-1 transition-colors",
                (i + 1) % 7 === 0 ? "border-r-0" : "",
                i >= 35 ? "border-b-0" : "",
                inMonth ? "" : "bg-surface-alt/30",
                isWeekend && inMonth ? "bg-surface-alt/20" : "",
                onDayClick ? "cursor-pointer hover:bg-primary/[0.04]" : "",
              ].join(" ")}
              style={{ minHeight: cellMinHeight }}
            >
              <div className="flex items-center justify-between px-0.5">
                <span
                  className={[
                    "inline-flex items-center justify-center text-[12px] font-semibold tabular-nums transition-colors",
                    isToday ? "w-6 h-6 rounded-full bg-primary text-white" : "",
                    !isToday && inMonth ? "text-foreground" : "",
                    !isToday && !inMonth ? "text-muted/50" : "",
                  ].join(" ")}
                >
                  {d.getDate()}
                </span>
                {list.length > 0 && !isOpen && (
                  <span className="flex items-center gap-0.5">
                    {list.slice(0, 3).map((ev, j) => (
                      <span key={j} className={`w-1 h-1 rounded-full ${COLORS[ev.color ?? "primary"].dot}`} />
                    ))}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-0.5">
                <AnimatePresence initial={false}>
                  {shown.map((ev) => {
                    const c = COLORS[ev.color ?? "primary"];
                    return (
                      <motion.button
                        key={ev.id}
                        layout
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={(e) => { e.stopPropagation(); onEventClick?.(ev); }}
                        className={[
                          "w-full text-left rounded-md px-1.5 py-1 text-[11px] font-medium truncate transition-transform active:scale-[0.97]",
                          ev.allDay ? c.solid : c.chip,
                          inMonth ? "" : "opacity-50",
                        ].join(" ")}
                      >
                        {!ev.allDay && (
                          <span className="opacity-70 mr-1 tabular-nums">{timeFmt.format(ev.start)}</span>
                        )}
                        {ev.title}
                      </motion.button>
                    );
                  })}
                </AnimatePresence>

                {hidden > 0 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(k); }}
                    className="text-left px-1.5 text-[11px] font-semibold text-muted hover:text-foreground transition-colors"
                  >
                    +{hidden} más
                  </button>
                )}
                {isOpen && list.length > maxPerDay && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setExpanded(null); }}
                    className="text-left px-1.5 text-[11px] font-semibold text-muted hover:text-foreground transition-colors"
                  >
                    Ver menos
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NavBtn({ children, onClick, label }: { children: ReactNode; onClick: () => void; label: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      aria-label={label}
      className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors"
    >
      {children}
    </motion.button>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}
