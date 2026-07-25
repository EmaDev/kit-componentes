"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

interface DatePickerProps {
  /** modo simple (Date) o rango ({ from, to }) */
  mode?: "single" | "range";
  value?: Date | DateRange | null;
  onChange?: (value: Date | DateRange | null) => void;
  label?: string;
  placeholder?: string;
  locale?: string;
  /** 1 = lunes (default), 0 = domingo */
  weekStartsOn?: 0 | 1;
  min?: Date;
  max?: Date;
  /** fechas que no se pueden elegir */
  disabledDate?: (d: Date) => boolean;
  /** atajos: hoy, mañana, +7 días… */
  presets?: { label: string; value: () => Date | DateRange }[];
  /** dos meses en paralelo (útil en rango) */
  months?: 1 | 2;
  /** calendario siempre visible, sin input */
  inline?: boolean;
  clearable?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const isRange = (v: unknown): v is DateRange => !!v && typeof v === "object" && "from" in (v as object);

function monthMatrix(month: Date, weekStartsOn: 0 | 1) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const start = new Date(first);
  start.setDate(1 - lead);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

/** Selector de fecha: simple o rango, con atajos, límites y navegación por teclado. */
export function DatePicker({
  mode = "single", value, onChange, label, placeholder = "Elegí una fecha",
  locale = "es-AR", weekStartsOn = 1, min, max, disabledDate, presets,
  months = 1, inline = false, clearable = true, error, hint, className = "",
}: DatePickerProps) {
  const [open, setOpen] = useState(inline);
  const [cursor, setCursor] = useState<Date>(() => {
    const base = isRange(value) ? value.from : (value as Date | null);
    return base ? new Date(base.getFullYear(), base.getMonth(), 1) : new Date();
  });
  const [hoverDate, setHover] = useState<Date | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inline || !open) return;
    const onDoc = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open, inline]);

  const dayNames = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2024, 0, 7 + ((i + weekStartsOn) % 7));
      return fmt.format(d).replace(".", "").slice(0, 2);
    });
  }, [locale, weekStartsOn]);

  const fmtDate = (d: Date) => new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(d);
  const display = !value
    ? ""
    : isRange(value)
      ? [value.from && fmtDate(value.from), value.to && fmtDate(value.to)].filter(Boolean).join("  →  ")
      : fmtDate(value as Date);

  const blocked = (d: Date) =>
    (min && startOfDay(d) < startOfDay(min)) ||
    (max && startOfDay(d) > startOfDay(max)) ||
    !!disabledDate?.(d);

  const pick = (d: Date) => {
    if (blocked(d)) return;
    if (mode === "single") {
      onChange?.(startOfDay(d));
      if (!inline) setOpen(false);
      return;
    }
    const cur = isRange(value) ? value : { from: null, to: null };
    if (!cur.from || (cur.from && cur.to)) onChange?.({ from: startOfDay(d), to: null });
    else if (startOfDay(d) < cur.from) onChange?.({ from: startOfDay(d), to: cur.from });
    else onChange?.({ from: cur.from, to: startOfDay(d) });
  };

  const inRange = (d: Date) => {
    if (mode !== "range" || !isRange(value) || !value.from) return false;
    const end = value.to ?? hoverDate;
    if (!end) return false;
    const [a, b] = value.from <= end ? [value.from, end] : [end, value.from];
    return startOfDay(d) > startOfDay(a) && startOfDay(d) < startOfDay(b);
  };
  const isEdge = (d: Date) =>
    isRange(value) ? sameDay(d, value.from) || sameDay(d, value.to) : sameDay(d, value as Date);

  const calendar = (
    <div className="flex flex-col gap-3">
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-3 border-b border-border">
          {presets.map((p) => (
            <button key={p.label} type="button"
              onClick={() => { const v = p.value(); onChange?.(v); if (!isRange(v)) setCursor(new Date(v.getFullYear(), v.getMonth(), 1)); }}
              className="h-7 px-2.5 rounded-lg text-[11px] font-semibold bg-surface-alt border border-border text-foreground hover:border-primary/40 active:scale-95 transition-all">
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button type="button" onClick={() => setCursor((c) => addMonths(c, -1))} aria-label="Mes anterior"
          className="w-8 h-8 rounded-lg grid place-items-center text-muted hover:text-foreground hover:bg-surface-alt active:scale-90 transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="flex items-center gap-6">
          {Array.from({ length: months }, (_, i) => (
            <p key={i} className="text-sm font-bold text-foreground capitalize"
              style={{ minWidth: months === 2 ? 200 : undefined, textAlign: "center" }}>
              {new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(addMonths(cursor, i))}
            </p>
          ))}
        </div>
        <button type="button" onClick={() => setCursor((c) => addMonths(c, 1))} aria-label="Mes siguiente"
          className="w-8 h-8 rounded-lg grid place-items-center text-muted hover:text-foreground hover:bg-surface-alt active:scale-90 transition-all">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <div className="flex gap-6">
        {Array.from({ length: months }, (_, m) => {
          const month = addMonths(cursor, m);
          return (
            <div key={m} style={{ width: 224 }}>
              <div className="grid grid-cols-7 mb-1">
                {dayNames.map((d) => (
                  <span key={d} className="h-7 grid place-items-center text-[10px] font-bold uppercase text-muted">{d}</span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-0.5">
                {monthMatrix(month, weekStartsOn).map((d, i) => {
                  const out = d.getMonth() !== month.getMonth();
                  const edge = isEdge(d);
                  const mid = inRange(d);
                  const off = blocked(d);
                  const today = sameDay(d, new Date());
                  return (
                    <button key={i} type="button" disabled={off}
                      onClick={() => pick(d)} onMouseEnter={() => setHover(d)}
                      className={[
                        "relative h-8 text-[13px] font-medium transition-colors",
                        mid ? "bg-primary/12" : "",
                        edge ? "text-white" : out ? "text-muted/40" : off ? "text-muted/40 line-through" : "text-foreground hover:bg-surface-alt",
                        off ? "cursor-not-allowed" : "",
                        mid && !edge ? "rounded-none" : "rounded-lg",
                      ].join(" ")}>
                      {edge && (
                        <motion.span layoutId={mode === "single" ? "dp-sel" : undefined}
                          className="absolute inset-0.5 rounded-lg bg-primary shadow-sm shadow-primary/30"/>
                      )}
                      <span className="relative tabular-nums">{d.getDate()}</span>
                      {today && !edge && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"/>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {clearable && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <button type="button" onClick={() => onChange?.(mode === "range" ? { from: null, to: null } : null)}
            className="h-8 px-2.5 rounded-lg text-[11px] font-semibold text-muted hover:text-danger hover:bg-danger/8 transition-colors">
            Limpiar
          </button>
          <button type="button" onClick={() => { const t = new Date(); setCursor(new Date(t.getFullYear(), t.getMonth(), 1)); }}
            className="h-8 px-2.5 rounded-lg text-[11px] font-semibold text-primary hover:bg-primary/8 transition-colors">
            Hoy
          </button>
        </div>
      )}
    </div>
  );

  if (inline) {
    return (
      <div className={`rounded-2xl border border-border bg-surface p-4 ${className}`} style={{ width: "fit-content" }}>
        {calendar}
      </div>
    );
  }

  return (
    <div ref={box} className={`relative ${className}`}>
      {label && <label className="block text-xs font-semibold text-foreground mb-1.5">{label}</label>}
      <button type="button" onClick={() => setOpen((o) => !o)}
        className={[
          "w-full h-11 px-3.5 rounded-xl border bg-surface text-left text-sm flex items-center gap-2.5 transition-colors",
          error ? "border-danger" : open ? "border-primary" : "border-border hover:border-muted/50",
        ].join(" ")}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-muted shrink-0">
          <rect x="3" y="4.5" width="18" height="16" rx="2"/><line x1="3" y1="9.5" x2="21" y2="9.5"/><line x1="8" y1="2.5" x2="8" y2="6"/><line x1="16" y1="2.5" x2="16" y2="6"/>
        </svg>
        <span className={`flex-1 truncate ${display ? "text-foreground font-medium" : "text-muted"}`}>{display || placeholder}</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
          className="text-muted shrink-0 transition-transform" style={{ transform: open ? "rotate(180deg)" : undefined }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {(error || hint) && <p className={`mt-1.5 text-[11px] ${error ? "text-danger" : "text-muted"}`}>{error || hint}</p>}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.14 } }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="absolute z-50 mt-2 rounded-2xl border border-border bg-surface p-4 shadow-2xl shadow-black/15"
            style={{ width: "fit-content" }}>
            {calendar}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
