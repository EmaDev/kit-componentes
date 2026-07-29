"use client";
import { useMemo, useState } from "react";

export interface ValuePoint { date: Date; value: number }
export interface ValueHistoryPeriod { id: string; label: string; points: ValuePoint[] }
interface ValueHistoryChartProps {
  periods: ValueHistoryPeriod[];
  defaultPeriod?: string;
  currency?: string;
  locale?: string;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Historial de valor (cotización, saldo, precio de un activo) con toggle de período y variación. */
export function ValueHistoryChart({ periods, defaultPeriod, currency = "USD", locale = "es-AR", className = "" }: ValueHistoryChartProps) {
  const [periodId, setPeriodId] = useState(defaultPeriod ?? periods[0]?.id);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const period = periods.find(p => p.id === periodId) ?? periods[0];
  const points = period?.points ?? [];

  const { min, max, path, area } = useMemo(() => {
    if (!points.length) return { min: 0, max: 1, path: "", area: "" };
    const vals = points.map(p => p.value);
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min || 1;
    const w = 100, h = 40;
    const xy = points.map((p, i) => [((i / (points.length - 1)) * w).toFixed(2), (h - ((p.value - min) / range) * h).toFixed(2)]);
    const path = xy.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
    const area = `${path} L${xy[xy.length - 1][0]},${h} L${xy[0][0]},${h} Z`;
    return { min, max, path, area };
  }, [points]);

  const first = points[0]?.value ?? 0, last = points[points.length - 1]?.value ?? 0;
  const change = first ? ((last - first) / first) * 100 : 0;
  const up = change >= 0;
  const fmt = (n: number) => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
  const fmtDate = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });

  const hovered = hoverIdx != null ? points[hoverIdx] : null;

  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-black text-foreground tracking-tight">{fmt(hovered ? hovered.value : last)}</p>
          <p className={cn("mt-1 text-xs font-bold inline-flex items-center gap-1", up ? "text-success" : "text-danger")}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: up ? undefined : "rotate(180deg)" }}><polyline points="18 15 12 9 6 15"/></svg>
            {Math.abs(change).toFixed(2)}% en {period?.label.toLowerCase()}
          </p>
        </div>
        {hovered && <p className="text-[11px] text-muted pt-1">{fmtDate.format(hovered.date)}</p>}
      </div>

      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className={cn("w-full h-28 mt-3", up ? "text-success" : "text-danger")}
        onMouseLeave={() => setHoverIdx(null)}
        onMouseMove={e => {
          const rect = (e.target as SVGElement).closest("svg")!.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          setHoverIdx(Math.max(0, Math.min(points.length - 1, Math.round(pct * (points.length - 1)))));
        }}>
        <defs><linearGradient id="vhc-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity="0.25"/><stop offset="100%" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs>
        <path d={area} fill="url(#vhc-fill)" stroke="none"/>
        <path d={path} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
        {hoverIdx != null && points.length > 1 && (
          <line x1={(hoverIdx / (points.length - 1)) * 100} y1="0" x2={(hoverIdx / (points.length - 1)) * 100} y2="40" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.5"/>
        )}
      </svg>

      <div className="mt-3 flex items-center gap-1">
        {periods.map(p => (
          <button key={p.id} type="button" onClick={() => setPeriodId(p.id)}
            className={cn("h-8 px-3 rounded-full text-xs font-bold transition-colors", p.id === periodId ? "bg-primary text-white" : "text-muted hover:bg-surface-alt")}>{p.label}</button>
        ))}
      </div>
    </div>
  );
}
