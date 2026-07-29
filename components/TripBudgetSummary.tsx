"use client";

export interface TripBudgetCategory { id: string; label: string; spent: number; planned: number; icon?: React.ReactNode }

interface TripBudgetSummaryProps {
  categories: TripBudgetCategory[];
  currency?: string;
  locale?: string;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Presupuesto de viaje: total gastado vs. planificado con anillo, y desglose por categoría. */
export function TripBudgetSummary({ categories, currency = "ARS", locale = "es-AR", className = "" }: TripBudgetSummaryProps) {
  const fmt = (n: number) => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  const totalSpent = categories.reduce((s, c) => s + c.spent, 0);
  const totalPlanned = categories.reduce((s, c) => s + c.planned, 0);
  const pct = totalPlanned > 0 ? Math.min(100, (totalSpent / totalPlanned) * 100) : 0;
  const over = totalSpent > totalPlanned;
  const r = 30, circ = 2 * Math.PI * r;

  return (
    <div className={cn("space-y-5", className)}>
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
        <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="var(--color-border)" strokeWidth="7" />
          <circle cx="36" cy="36" r={r} fill="none" stroke={over ? "var(--color-danger)" : "var(--color-primary)"} strokeWidth="7"
            strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ} strokeLinecap="round" />
        </svg>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Gastado del viaje</p>
          <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums mt-0.5">{fmt(totalSpent)}</p>
          <p className={cn("text-xs font-semibold mt-0.5", over ? "text-danger" : "text-muted")}>
            {over ? `${fmt(totalSpent - totalPlanned)} por encima de ` : "de "}{fmt(totalPlanned)} planificados
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map(c => {
          const p = Math.min(100, (c.spent / c.planned) * 100);
          const co = c.spent > c.planned;
          const near = !co && p >= 80;
          return (
            <div key={c.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {c.icon && <span className="w-6 h-6 rounded-md bg-primary/10 text-primary inline-flex items-center justify-center">{c.icon}</span>}
                  {c.label}
                </span>
                <span className={cn("text-xs font-bold tabular-nums", co ? "text-danger" : "text-muted")}>{fmt(c.spent)} / {fmt(c.planned)}</span>
              </div>
              <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", co ? "bg-danger" : near ? "bg-accent" : "bg-primary")} style={{ width: `${p}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
