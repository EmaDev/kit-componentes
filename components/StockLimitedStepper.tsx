"use client";
import { useState } from "react";

interface StockLimitedStepperProps {
  value: number;
  onChange: (n: number) => void;
  stock: number;
  min?: number;
  lowStockThreshold?: number;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Stepper de cantidad que avisa "quedan N" y bloquea al llegar al stock disponible. */
export function StockLimitedStepper({ value, onChange, stock, min = 1, lowStockThreshold = 5, className = "" }: StockLimitedStepperProps) {
  const [flash, setFlash] = useState(false);
  const atMax = value >= stock;
  const low = stock <= lowStockThreshold;

  const inc = () => { if (atMax) { setFlash(true); setTimeout(() => setFlash(false), 400); return; } onChange(value + 1); };
  const dec = () => onChange(Math.max(min, value - 1));

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="inline-flex items-center rounded-xl border border-border overflow-hidden">
        <button type="button" onClick={dec} disabled={value <= min} aria-label="Restar" className="w-10 h-10 text-foreground font-bold text-lg disabled:opacity-30 hover:bg-surface-alt transition-colors">−</button>
        <span className="w-12 text-center text-sm font-bold text-foreground tabular-nums">{value}</span>
        <button type="button" onClick={inc} aria-label="Sumar" className={cn("w-10 h-10 text-foreground font-bold text-lg hover:bg-surface-alt transition-colors", flash && "bg-danger/10")}>+</button>
      </div>
      {stock === 0 ? (
        <p className="text-xs font-semibold text-danger">Sin stock</p>
      ) : atMax ? (
        <p className="text-xs font-semibold text-danger">Llegaste al máximo disponible ({stock})</p>
      ) : low ? (
        <p className="text-xs font-semibold text-accent">¡Quedan solo {stock}!</p>
      ) : null}
    </div>
  );
}
