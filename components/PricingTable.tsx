"use client";
import { useState } from "react";

export interface PricingPlan { id: string; name: string; price: { monthly: number; yearly: number }; tagline?: string; features: string[]; highlight?: boolean; cta?: string }

interface PricingTableProps {
  plans: PricingPlan[];
  currency?: string;
  locale?: string;
  onSelect?: (planId: string, cycle: "monthly" | "yearly") => void;
  yearlyDiscountLabel?: string;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Comparador de planes con switch mensual/anual y plan destacado. */
export function PricingTable({ plans, currency = "USD", locale = "en-US", onSelect, yearlyDiscountLabel = "2 meses gratis", className = "" }: PricingTableProps) {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const fmt = (n: number) => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(n);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-alt p-1">
          {(["monthly", "yearly"] as const).map(c => (
            <button key={c} type="button" onClick={() => setCycle(c)}
              className={cn("h-8 px-4 rounded-full text-xs font-bold transition-all", cycle === c ? "bg-surface text-foreground shadow-sm" : "text-muted")}>
              {c === "monthly" ? "Mensual" : `Anual · ${yearlyDiscountLabel}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        {plans.map(p => (
          <div key={p.id} className={cn("relative rounded-2xl border p-6 flex flex-col", p.highlight ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/10" : "border-border bg-surface")}>
            {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 px-3 rounded-full bg-primary text-white text-[10px] font-bold inline-flex items-center">Más elegido</span>}
            <p className="text-sm font-bold text-foreground">{p.name}</p>
            {p.tagline && <p className="mt-1 text-xs text-muted leading-relaxed">{p.tagline}</p>}
            <p className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-black text-foreground tracking-tight">{fmt(cycle === "monthly" ? p.price.monthly : Math.round(p.price.yearly / 12))}</span>
              <span className="text-xs text-muted">/mes</span>
            </p>
            {cycle === "yearly" && <p className="text-[11px] text-muted mt-0.5">{fmt(p.price.yearly)} facturado al año</p>}
            <ul className="mt-5 space-y-2 flex-1">
              {p.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-foreground leading-relaxed">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => onSelect?.(p.id, cycle)}
              className={cn("mt-6 h-11 rounded-xl text-sm font-bold transition-all active:scale-[0.98]", p.highlight ? "bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-hover" : "border border-border text-foreground hover:bg-surface-alt")}>
              {p.cta ?? "Elegir plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
