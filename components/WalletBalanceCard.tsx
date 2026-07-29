"use client";
import { useState, type ReactNode } from "react";

export interface WalletBalance { code: string; symbol: string; amount: number; flag?: string }
interface WalletBalanceCardProps {
  balances: WalletBalance[];
  primaryCode?: string;
  locale?: string;
  onSend?: () => void;
  onReceive?: () => void;
  onConvert?: () => void;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Tarjeta de saldo de billetera virtual: multi-moneda, ocultar montos y acciones rápidas. */
export function WalletBalanceCard({ balances, primaryCode, locale = "es-AR", onSend, onReceive, onConvert, className = "" }: WalletBalanceCardProps) {
  const [hidden, setHidden] = useState(false);
  const primary = balances.find(b => b.code === primaryCode) ?? balances[0];
  const rest = balances.filter(b => b.code !== primary?.code);
  const fmt = (n: number, code: string) => new Intl.NumberFormat(locale, { style: "currency", currency: code, maximumFractionDigits: 2 }).format(n);

  return (
    <div className={cn("rounded-2xl border border-border bg-gradient-to-br from-primary to-accent text-white p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-wider text-white/70">Saldo disponible</p>
        <button type="button" onClick={() => setHidden(h => !h)} aria-label={hidden ? "Mostrar saldo" : "Ocultar saldo"} className="w-8 h-8 rounded-lg text-white/80 hover:bg-white/15 inline-flex items-center justify-center transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>{hidden && <line x1="3" y1="21" x2="21" y2="3"/>}
          </svg>
        </button>
      </div>
      <p className="mt-1.5 text-3xl font-black tracking-tight">{primary ? (hidden ? "••••••" : fmt(primary.amount, primary.code)) : "—"}</p>

      {rest.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {rest.map(b => (
            <span key={b.code} className="text-xs font-semibold text-white/85 inline-flex items-center gap-1">
              {b.flag && <span>{b.flag}</span>}{hidden ? "••••" : fmt(b.amount, b.code)}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-2">
        {([["Enviar", onSend, <path key="1" d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>], ["Recibir", onReceive, <path key="2" d="M12 5v14M19 12l-7 7-7-7"/>], ["Cambiar", onConvert, <g key="3"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></g>]] as [string, (() => void) | undefined, ReactNode][]).map(([label, fn, icon]) => (
          <button key={label} type="button" onClick={fn}
            className="h-16 rounded-xl bg-white/15 hover:bg-white/25 flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
