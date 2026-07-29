"use client";
import { useState } from "react";

export interface ShippingOption { id: string; label: string; description?: string; price: number; eta: string; icon?: React.ReactNode }
interface ShippingMethodPickerProps { options: ShippingOption[]; value?: string; onChange: (id: string) => void; currency?: string; locale?: string; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Selector de método de envío: retiro en local, delivery o correo, con precio y tiempo estimado. */
export function ShippingMethodPicker({ options, value, onChange, currency = "ARS", locale = "es-AR", className = "" }: ShippingMethodPickerProps) {
  const fmt = (n: number) => n === 0 ? "Gratis" : new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  return (
    <div className={cn("space-y-2", className)}>
      {options.map(o => {
        const on = value === o.id;
        return (
          <button key={o.id} type="button" onClick={() => onChange(o.id)}
            className={cn("w-full flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors", on ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
            <span className={cn("w-5 h-5 rounded-full border-2 shrink-0 inline-flex items-center justify-center", on ? "border-primary" : "border-border")}>{on && <span className="w-2.5 h-2.5 rounded-full bg-primary"/>}</span>
            {o.icon && <span className="w-9 h-9 rounded-lg bg-surface-alt text-muted inline-flex items-center justify-center shrink-0">{o.icon}</span>}
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-foreground">{o.label}</span>
              {o.description && <span className="block text-[11px] text-muted">{o.description}</span>}
              <span className="block text-[11px] text-muted mt-0.5">{o.eta}</span>
            </span>
            <span className="shrink-0 text-sm font-bold text-foreground">{fmt(o.price)}</span>
          </button>
        );
      })}
    </div>
  );
}
