"use client";

export interface BudgetCategory { id: string; label: string; spent: number; limit: number; icon?: React.ReactNode }
interface BudgetCategoryProgressProps { categories: BudgetCategory[]; currency?: string; locale?: string; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Presupuesto por categoría: barra de progreso, con aviso al acercarse o pasarse del límite. */
export function BudgetCategoryProgress({ categories, currency = "ARS", locale = "es-AR", className = "" }: BudgetCategoryProgressProps) {
  const fmt = (n: number) => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  return (
    <div className={cn("space-y-4", className)}>
      {categories.map(c => {
        const pct = Math.min(100, (c.spent / c.limit) * 100);
        const over = c.spent > c.limit;
        const near = !over && pct >= 80;
        return (
          <div key={c.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                {c.icon && <span className="w-6 h-6 rounded-md bg-primary/10 text-primary inline-flex items-center justify-center">{c.icon}</span>}
                {c.label}
              </span>
              <span className={cn("text-xs font-bold tabular-nums", over ? "text-danger" : "text-muted")}>{fmt(c.spent)} / {fmt(c.limit)}</span>
            </div>
            <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
              <div className={cn("h-full rounded-full transition-all", over ? "bg-danger" : near ? "bg-accent" : "bg-primary")} style={{ width: `${pct}%` }}/>
            </div>
            {over && <p className="mt-1 text-[11px] font-semibold text-danger">Te pasaste por {fmt(c.spent - c.limit)}</p>}
          </div>
        );
      })}
    </div>
  );
}
