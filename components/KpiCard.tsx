"use client";

export interface KpiCardProps {
  label: string;
  value: string;
  delta?: { value: string; direction: "up" | "down" | "flat" };
  trend?: number[];
  tone?: "neutral" | "success" | "danger";
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const DELTA_CLS = { up: "text-success bg-success/10", down: "text-danger bg-danger/10", flat: "text-muted bg-surface-alt" };

/** Tarjeta de KPI con tendencia (sparkline) y variación — para dashboards. */
export function KpiCard({ label, value, delta, trend, tone = "neutral", className = "" }: KpiCardProps) {
  const max = trend ? Math.max(...trend) : 1;
  const min = trend ? Math.min(...trend) : 0;
  const range = max - min || 1;
  const pts = trend?.map((v, i) => `${(i / (trend.length - 1)) * 100},${28 - ((v - min) / range) * 26}`).join(" ");

  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-4", className)}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{label}</p>
      <div className="mt-1.5 flex items-end justify-between gap-3">
        <p className={cn("text-2xl font-black tracking-tight", tone === "success" ? "text-success" : tone === "danger" ? "text-danger" : "text-foreground")}>{value}</p>
        {trend && (
          <svg viewBox="0 0 100 28" width="72" height="24" preserveAspectRatio="none" className="shrink-0 text-primary/60">
            <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      {delta && (
        <span className={cn("mt-2 inline-flex items-center gap-1 h-6 px-2 rounded-full text-[11px] font-bold", DELTA_CLS[delta.direction])}>
          {delta.direction !== "flat" && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" style={{ transform: delta.direction === "down" ? "rotate(180deg)" : undefined }}>
              <polyline points="18 15 12 9 6 15"/>
            </svg>
          )}
          {delta.value}
        </span>
      )}
    </div>
  );
}
