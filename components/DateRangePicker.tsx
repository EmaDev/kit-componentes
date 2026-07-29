"use client";
import { useMemo, useState } from "react";

export interface DateRange { from: Date | null; to: Date | null }
interface DateRangePickerProps {
  value: DateRange;
  onChange: (v: DateRange) => void;
  presets?: { label: string; range: () => DateRange }[];
  locale?: string;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const sameDay = (a: Date | null, b: Date | null) => !!a && !!b && a.toDateString() === b.toDateString();
const inRange = (d: Date, r: DateRange) => r.from && r.to && d >= r.from && d <= r.to;
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

function MonthGrid({ month, value, hover, onPick, onHover, locale }: { month: Date; value: DateRange; hover: Date | null; onPick: (d: Date) => void; onHover: (d: Date | null) => void; locale: string }) {
  const first = startOfMonth(month);
  const offset = (first.getDay() + 6) % 7;
  const total = daysInMonth(month);
  const cells: (Date | null)[] = [...Array(offset).fill(null), ...Array.from({ length: total }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  const dow = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  const preview: DateRange = value.from && !value.to && hover ? { from: value.from < hover ? value.from : hover, to: value.from < hover ? hover : value.from } : value;

  return (
    <div>
      <p className="text-center text-xs font-bold uppercase tracking-wide text-foreground mb-2">{new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month)}</p>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {[0, 1, 2, 3, 4, 5, 6].map(i => <span key={i} className="text-[10px] font-bold text-muted">{dow.format(new Date(2024, 0, i + 1))}</span>)}
        {cells.map((d, i) => {
          if (!d) return <span key={i}/>;
          const isFrom = sameDay(d, value.from), isTo = sameDay(d, value.to);
          const within = inRange(d, preview) || (isFrom && preview.to) || (isTo && preview.from);
          return (
            <button key={i} type="button" onClick={() => onPick(d)} onMouseEnter={() => onHover(d)}
              className={cn("h-8 w-8 mx-auto text-[13px] rounded-full transition-colors", isFrom || isTo ? "bg-primary text-white font-bold" : within ? "bg-primary/12 text-primary" : "text-foreground hover:bg-surface-alt")}>
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Rango de fechas con dos calendarios, atajos y resumen — para filtros y reportes. */
export function DateRangePicker({ value, onChange, presets = [], locale = "es-AR", className = "" }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => startOfMonth(value.from ?? new Date()));
  const [hover, setHover] = useState<Date | null>(null);
  const nextMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);

  const pick = (d: Date) => {
    if (!value.from || (value.from && value.to)) onChange({ from: d, to: null });
    else onChange(d < value.from ? { from: d, to: value.from } : { from: value.from, to: d });
  };
  const fmt = useMemo(() => new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }), [locale]);
  const label = value.from ? `${fmt.format(value.from)} – ${value.to ? fmt.format(value.to) : "…"}` : "Elegí un rango";

  return (
    <div className={cn("relative inline-block", className)}>
      <button type="button" onClick={() => setOpen(o => !o)} className="h-11 px-3.5 rounded-xl border border-border bg-surface inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        {label}
      </button>
      {open && (
        <div className="absolute z-30 top-full left-0 mt-1.5 rounded-2xl border border-border bg-surface shadow-2xl shadow-black/10 p-4 flex flex-col sm:flex-row gap-4" onMouseLeave={() => setHover(null)}>
          {presets.length > 0 && (
            <div className="flex sm:flex-col gap-1.5 sm:w-36 sm:border-r sm:border-border sm:pr-4 overflow-x-auto">
              {presets.map(p => (
                <button key={p.label} type="button" onClick={() => { onChange(p.range()); setOpen(false); }} className="shrink-0 h-8 px-2.5 rounded-lg text-left text-xs font-semibold text-foreground hover:bg-surface-alt transition-colors">{p.label}</button>
              ))}
            </div>
          )}
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="w-7 h-7 rounded-lg hover:bg-surface-alt inline-flex items-center justify-center text-muted"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>
            <div className="w-52"><MonthGrid month={cursor} value={value} hover={hover} onPick={pick} onHover={setHover} locale={locale}/></div>
            <div className="w-52 hidden sm:block"><MonthGrid month={nextMonth} value={value} hover={hover} onPick={pick} onHover={setHover} locale={locale}/></div>
            <button type="button" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="w-7 h-7 rounded-lg hover:bg-surface-alt inline-flex items-center justify-center text-muted"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
          </div>
        </div>
      )}
    </div>
  );
}
