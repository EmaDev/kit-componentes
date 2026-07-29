"use client";
import { useMemo, useState } from "react";

export interface Transaction { id: string; date: Date; title: string; category: string; amount: number; icon?: React.ReactNode }
interface TransactionListProps { transactions: Transaction[]; currency?: string; locale?: string; categories?: string[]; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const dayLabel = (d: Date, locale: string) => {
  const today = new Date(), y = new Date(today); y.setDate(today.getDate() - 1);
  if (sameDay(d, today)) return "Hoy";
  if (sameDay(d, y)) return "Ayer";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" }).format(d);
};

/** Historial de movimientos con filtro por categoría, agrupado por día, montos +/- coloreados. */
export function TransactionList({ transactions, currency = "ARS", locale = "es-AR", categories, className = "" }: TransactionListProps) {
  const [filter, setFilter] = useState<string | null>(null);
  const cats = categories ?? Array.from(new Set(transactions.map(t => t.category)));
  const fmt = (n: number) => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
  const filtered = filter ? transactions.filter(t => t.category === filter) : transactions;

  const groups = useMemo(() => {
    const out: [string, Transaction[]][] = [];
    filtered.forEach(t => {
      const label = dayLabel(t.date, locale);
      const g = out.find(([l]) => l === label);
      if (g) g[1].push(t); else out.push([label, [t]]);
    });
    return out;
  }, [filtered, locale]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setFilter(null)} className={cn("h-8 px-3 rounded-full text-xs font-semibold border transition-colors", !filter ? "bg-primary text-white border-primary" : "bg-surface text-muted border-border")}>Todos</button>
        {cats.map(c => (
          <button key={c} type="button" onClick={() => setFilter(c)} className={cn("h-8 px-3 rounded-full text-xs font-semibold border transition-colors", filter === c ? "bg-primary text-white border-primary" : "bg-surface text-muted border-border")}>{c}</button>
        ))}
      </div>
      {groups.map(([label, items]) => (
        <div key={label}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1.5">{label}</p>
          <ul className="divide-y divide-border rounded-xl border border-border overflow-hidden bg-surface">
            {items.map(t => (
              <li key={t.id} className="flex items-center gap-3 px-3.5 py-2.5">
                <span className="shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary inline-flex items-center justify-center">
                  {t.icon ?? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/></svg>}
                </span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-foreground truncate">{t.title}</span><span className="block text-[11px] text-muted">{t.category}</span></span>
                <span className={cn("shrink-0 text-sm font-bold tabular-nums", t.amount >= 0 ? "text-success" : "text-foreground")}>{t.amount >= 0 ? "+" : ""}{fmt(t.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {groups.length === 0 && <p className="text-center text-sm text-muted py-8">Sin movimientos en esta categoría.</p>}
    </div>
  );
}
