"use client";

import { useEffect, useRef, useState } from "react";

interface CardGridProps<T> {
  items?: T[];
  renderItem?: (item: T, index: number) => React.ReactNode;
  children?: React.ReactNode;
  /** columnas iniciales */
  defaultColumns?: number;
  min?: number;
  max?: number;
  /** ancho mínimo por card: por debajo, la grilla baja columnas sola */
  minCardWidth?: number;
  gap?: number;
  /** muestra el control de columnas. Default true */
  controls?: boolean;
  /** "buttons" = − / + · "pills" = 1·2·3… · "both" */
  controlStyle?: "buttons" | "pills" | "both";
  /** recuerda la elección del usuario */
  storageKey?: string;
  label?: string;
  toolbar?: React.ReactNode;
  onColumnsChange?: (columns: number) => void;
  className?: string;
}

/** Grilla de cards con ajuste de columnas en tiempo real. */
export function CardGrid<T>({
  items, renderItem, children, defaultColumns = 3, min = 1, max = 6,
  minCardWidth = 200, gap = 16, controls = true, controlStyle = "both",
  storageKey, label = "Columnas", toolbar, onColumnsChange, className = "",
}: CardGridProps<T>) {
  const [cols, setCols] = useState(defaultColumns);
  const [width, setWidth] = useState(0);
  const shell = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!storageKey) return;
    const saved = Number(localStorage.getItem(storageKey));
    if (saved >= min && saved <= max) setCols(saved);
  }, [storageKey, min, max]);

  useEffect(() => {
    const el = shell.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const set = (n: number) => {
    const v = Math.min(max, Math.max(min, n));
    setCols(v);
    onColumnsChange?.(v);
    if (storageKey) localStorage.setItem(storageKey, String(v));
  };

  // columnas que realmente caben
  const fit = width ? Math.max(min, Math.floor((width + gap) / (minCardWidth + gap))) : cols;
  const effective = Math.max(min, Math.min(cols, fit));
  const clamped = effective < cols;

  const pill = (on: boolean) =>
    `h-8 min-w-8 px-2 rounded-lg text-xs font-bold tabular-nums border transition-all active:scale-95 ${
      on ? "bg-primary text-white border-primary shadow-sm shadow-primary/25" : "bg-surface text-foreground border-border hover:bg-surface-alt"
    }`;

  return (
    <div className={className}>
      {(controls || toolbar) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {controls && (
            <>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mr-0.5">{label}</span>

              {(controlStyle === "buttons" || controlStyle === "both") && (
                <div className="inline-flex items-center rounded-xl border border-border bg-surface overflow-hidden">
                  <button type="button" onClick={() => set(cols - 1)} disabled={cols <= min} aria-label="Menos columnas"
                    className="w-9 h-8 grid place-items-center text-foreground hover:bg-surface-alt disabled:opacity-30 active:scale-90 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </button>
                  <span className="w-9 text-center text-xs font-bold tabular-nums text-foreground border-x border-border leading-8">{cols}</span>
                  <button type="button" onClick={() => set(cols + 1)} disabled={cols >= max} aria-label="Más columnas"
                    className="w-9 h-8 grid place-items-center text-foreground hover:bg-surface-alt disabled:opacity-30 active:scale-90 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  </button>
                </div>
              )}

              {(controlStyle === "pills" || controlStyle === "both") && (
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((n) => (
                    <button key={n} type="button" onClick={() => set(n)} className={pill(n === cols)} aria-pressed={n === cols}>
                      {n}
                    </button>
                  ))}
                </div>
              )}

              {clamped && (
                <span className="text-[11px] text-muted">
                  mostrando <b className="text-foreground">{effective}</b> · no caben {cols}
                </span>
              )}
            </>
          )}
          {toolbar && <div className="ml-auto flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      <div ref={shell}>
        <div
          className="grid"
          style={{
            gap,
            gridTemplateColumns: `repeat(${effective}, minmax(0, 1fr))`,
            transition: "gap 0.25s ease",
          }}
        >
          {items && renderItem ? items.map((item, i) => renderItem(item, i)) : children}
        </div>
      </div>
    </div>
  );
}
