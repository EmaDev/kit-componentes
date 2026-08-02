"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

interface TimePickerProps {
  /** "HH:mm" (24h) o "HH:mm:ss" si `seconds` está activo */
  value?: string | null;
  onChange?: (value: string | null) => void;
  label?: string;
  placeholder?: string;
  locale?: string;
  /** muestra columna AM/PM en vez de horas 0-23 */
  hour12?: boolean;
  /** paso de la columna de minutos */
  step?: number;
  /** agrega columna de segundos (value pasa a "HH:mm:ss") */
  seconds?: boolean;
  /** hora mínima seleccionable, "HH:mm" */
  min?: string;
  /** hora máxima seleccionable, "HH:mm" */
  max?: string;
  /** horarios que no se pueden elegir */
  disabledTime?: (h: number, m: number) => boolean;
  /** atajos: ahora, apertura, cierre… */
  presets?: { label: string; value: () => string }[];
  /** columnas siempre visibles, sin input */
  inline?: boolean;
  clearable?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

function parseValue(v?: string | null) {
  if (!v) return null;
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(v);
  if (!m) return null;
  return { h: Number(m[1]), m: Number(m[2]), s: m[3] !== undefined ? Number(m[3]) : 0 };
}
const formatValue = (p: { h: number; m: number; s: number }, withSeconds: boolean) =>
  withSeconds ? `${pad(p.h)}:${pad(p.m)}:${pad(p.s)}` : `${pad(p.h)}:${pad(p.m)}`;

const to24 = (h12: number, pm: boolean) => (h12 % 12) + (pm ? 12 : 0);
const to12 = (h24: number) => { const h = h24 % 12; return h === 0 ? 12 : h; };

/** Selector de horario: horas/minutos (y segundos opcional), 12h o 24h, con atajos y límites. */
export function TimePicker({
  value, onChange, label, placeholder = "Elegí un horario",
  locale = "es-AR", hour12 = false, step = 5, seconds = false,
  min, max, disabledTime, presets, inline = false, clearable = true,
  error, hint, className = "",
}: TimePickerProps) {
  const [open, setOpen] = useState(inline);
  const box = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inline || !open) return;
    const onDoc = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open, inline]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      [hourRef, minuteRef, secondRef].forEach((ref) => {
        const el = ref.current?.querySelector('[data-selected="true"]') as HTMLElement | null;
        el?.scrollIntoView({ block: "center" });
      });
    });
  }, [open]);

  const parsed = parseValue(value);
  const now = new Date();
  const activeH = parsed?.h ?? now.getHours();
  const activeM = parsed?.m ?? 0;
  const isPM = parsed ? parsed.h >= 12 : now.getHours() >= 12;

  const MINUTES = useMemo(() => Array.from({ length: Math.floor(60 / step) }, (_, i) => i * step), [step]);
  const SECONDS = useMemo(() => Array.from({ length: 60 }, (_, i) => i), []);
  const HOURS24 = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);
  const HOURS12 = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);

  const minMinutes = min ? parseValue(min) : null;
  const maxMinutes = max ? parseValue(max) : null;
  const minTot = minMinutes ? minMinutes.h * 60 + minMinutes.m : null;
  const maxTot = maxMinutes ? maxMinutes.h * 60 + maxMinutes.m : null;

  const blocked = (h: number, m: number) => {
    const tot = h * 60 + m;
    return (minTot !== null && tot < minTot) || (maxTot !== null && tot > maxTot) || !!disabledTime?.(h, m);
  };
  const hourBlocked = (h24: number) => MINUTES.every((mm) => blocked(h24, mm));

  const fmtDisplay = (v: string) => {
    const p = parseValue(v);
    if (!p) return "";
    const d = new Date();
    d.setHours(p.h, p.m, p.s, 0);
    return new Intl.DateTimeFormat(locale, {
      hour: "2-digit", minute: "2-digit", ...(seconds ? { second: "2-digit" } : {}), hour12,
    }).format(d);
  };
  const display = value ? fmtDisplay(value) : "";

  const pick = (part: "h" | "m" | "s", n: number) => {
    const base = { h: activeH, m: activeM, s: parsed?.s ?? 0 };
    const next = { ...base, [part]: n };
    if (part !== "s" && blocked(next.h, next.m)) return;
    onChange?.(formatValue(next, seconds));
  };

  const columns = (
    <div className="flex flex-col gap-3">
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-3 border-b border-border">
          {presets.map((p) => (
            <button key={p.label} type="button" onClick={() => onChange?.(p.value())}
              className="h-7 px-2.5 rounded-lg text-[11px] font-semibold bg-surface-alt border border-border text-foreground hover:border-primary/40 active:scale-95 transition-all">
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-1.5">
        <div ref={hourRef} className="h-52 w-14 overflow-y-auto scroll-smooth" style={{ scrollbarWidth: "none" }}>
          {(hour12 ? HOURS12 : HOURS24).map((h) => {
            const h24 = hour12 ? to24(h, isPM) : h;
            const selected = parsed !== null && (hour12 ? to12(parsed.h) === h : parsed.h === h);
            const off = hourBlocked(h24);
            return (
              <button key={h} type="button" disabled={off} onClick={() => pick("h", h24)}
                data-selected={selected}
                className={[
                  "relative w-full h-9 grid place-items-center text-[13px] font-semibold tabular-nums transition-colors rounded-lg mb-0.5",
                  off ? "text-muted/40 cursor-not-allowed" : selected ? "text-white" : "text-foreground hover:bg-surface-alt",
                ].join(" ")}>
                {selected && <motion.span layoutId="tp-h" className="absolute inset-0.5 rounded-lg bg-primary shadow-sm shadow-primary/30" />}
                <span className="relative">{pad(h)}</span>
              </button>
            );
          })}
        </div>

        <div ref={minuteRef} className="h-52 w-14 overflow-y-auto scroll-smooth" style={{ scrollbarWidth: "none" }}>
          {MINUTES.map((m) => {
            const selected = parsed !== null && parsed.m === m;
            const off = blocked(activeH, m);
            return (
              <button key={m} type="button" disabled={off} onClick={() => pick("m", m)}
                data-selected={selected}
                className={[
                  "relative w-full h-9 grid place-items-center text-[13px] font-semibold tabular-nums transition-colors rounded-lg mb-0.5",
                  off ? "text-muted/40 cursor-not-allowed" : selected ? "text-white" : "text-foreground hover:bg-surface-alt",
                ].join(" ")}>
                {selected && <motion.span layoutId="tp-m" className="absolute inset-0.5 rounded-lg bg-primary shadow-sm shadow-primary/30" />}
                <span className="relative">{pad(m)}</span>
              </button>
            );
          })}
        </div>

        {seconds && (
          <div ref={secondRef} className="h-52 w-14 overflow-y-auto scroll-smooth" style={{ scrollbarWidth: "none" }}>
            {SECONDS.map((s) => {
              const selected = parsed !== null && (parsed.s ?? 0) === s;
              return (
                <button key={s} type="button" onClick={() => pick("s", s)}
                  data-selected={selected}
                  className={[
                    "relative w-full h-9 grid place-items-center text-[13px] font-semibold tabular-nums transition-colors rounded-lg mb-0.5",
                    selected ? "text-white" : "text-foreground hover:bg-surface-alt",
                  ].join(" ")}>
                  {selected && <motion.span layoutId="tp-s" className="absolute inset-0.5 rounded-lg bg-primary shadow-sm shadow-primary/30" />}
                  <span className="relative">{pad(s)}</span>
                </button>
              );
            })}
          </div>
        )}

        {hour12 && (
          <div className="h-52 w-12 flex flex-col justify-center gap-1.5">
            {(["AM", "PM"] as const).map((ap) => {
              const selected = parsed !== null && isPM === (ap === "PM");
              return (
                <button key={ap} type="button"
                  onClick={() => pick("h", to24(to12(activeH), ap === "PM"))}
                  className={[
                    "h-9 rounded-lg text-[11px] font-bold tracking-wide transition-colors",
                    selected ? "bg-primary text-white shadow-sm shadow-primary/30" : "bg-surface-alt border border-border text-foreground hover:border-primary/40",
                  ].join(" ")}>
                  {ap}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {(clearable || !inline) && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          {clearable ? (
            <button type="button" onClick={() => onChange?.(null)}
              className="h-8 px-2.5 rounded-lg text-[11px] font-semibold text-muted hover:text-danger hover:bg-danger/8 transition-colors">
              Limpiar
            </button>
          ) : <span />}
          {!inline && (
            <button type="button" onClick={() => setOpen(false)}
              className="h-8 px-2.5 rounded-lg text-[11px] font-semibold text-primary hover:bg-primary/8 transition-colors">
              Listo
            </button>
          )}
        </div>
      )}
    </div>
  );

  if (inline) {
    return (
      <div className={`rounded-2xl border border-border bg-surface p-4 ${className}`} style={{ width: "fit-content" }}>
        {columns}
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
          <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15.5 14" />
        </svg>
        <span className={`flex-1 truncate ${display ? "text-foreground font-medium" : "text-muted"}`}>{display || placeholder}</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
          className="text-muted shrink-0 transition-transform" style={{ transform: open ? "rotate(180deg)" : undefined }}>
          <polyline points="6 9 12 15 18 9" />
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
            {columns}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
