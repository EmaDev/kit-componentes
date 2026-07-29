"use client";
import { useState } from "react";

export interface SplitParticipant { id: string; name: string; avatar?: string }
interface BillSplitterProps {
  total: number;
  participants: SplitParticipant[];
  currency?: string;
  locale?: string;
  onConfirm?: (shares: Record<string, number>) => void;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const initials = (n: string) => n.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();

/** Dividir un gasto entre varias personas: equitativo o por montos custom, con validación de que sume el total. */
export function BillSplitter({ total, participants, currency = "ARS", locale = "es-AR", onConfirm, className = "" }: BillSplitterProps) {
  const [mode, setMode] = useState<"equal" | "custom">("equal");
  const [included, setIncluded] = useState<string[]>(participants.map(p => p.id));
  const [custom, setCustom] = useState<Record<string, string>>({});
  const fmt = (n: number) => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);

  const equalShare = included.length ? total / included.length : 0;
  const customSum = included.reduce((s, id) => s + (parseFloat(custom[id]) || 0), 0);
  const remaining = total - customSum;
  const valid = mode === "equal" ? included.length > 0 : Math.abs(remaining) < 0.01;

  const toggle = (id: string) => setIncluded(inc => inc.includes(id) ? inc.filter(x => x !== id) : [...inc, id]);
  const confirm = () => {
    const shares: Record<string, number> = {};
    included.forEach(id => { shares[id] = mode === "equal" ? equalShare : parseFloat(custom[id]) || 0; });
    onConfirm?.(shares);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Total a dividir</p>
        <p className="text-xl font-black text-foreground tracking-tight">{fmt(total)}</p>
      </div>

      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-alt p-1">
        {(["equal", "custom"] as const).map(m => (
          <button key={m} type="button" onClick={() => setMode(m)} className={cn("h-8 px-3.5 rounded-full text-xs font-bold transition-all", mode === m ? "bg-surface text-foreground shadow-sm" : "text-muted")}>{m === "equal" ? "Partes iguales" : "Montos custom"}</button>
        ))}
      </div>

      <ul className="space-y-2">
        {participants.map(p => {
          const on = included.includes(p.id);
          return (
            <li key={p.id} className={cn("flex items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors", on ? "border-border bg-surface" : "border-border/50 bg-surface-alt/30 opacity-50")}>
              <button type="button" onClick={() => toggle(p.id)} className={cn("w-5 h-5 rounded-md border-2 shrink-0 inline-flex items-center justify-center", on ? "bg-primary border-primary text-white" : "border-border")}>
                {on && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </button>
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-primary text-white text-[10px] font-bold inline-flex items-center justify-center shrink-0">{initials(p.name)}</span>
              <span className="flex-1 text-sm font-semibold text-foreground">{p.name}</span>
              {mode === "equal" ? (
                <span className="text-sm font-bold text-foreground">{on ? fmt(equalShare) : "—"}</span>
              ) : (
                <input disabled={!on} inputMode="decimal" value={custom[p.id] ?? ""} onChange={e => setCustom(c => ({ ...c, [p.id]: e.target.value }))} placeholder="0"
                  className="w-24 h-8 rounded-lg border border-border bg-surface px-2 text-right text-sm font-semibold outline-none focus:border-primary disabled:opacity-40"/>
              )}
            </li>
          );
        })}
      </ul>

      {mode === "custom" && <p className={cn("text-xs font-semibold text-right", Math.abs(remaining) < 0.01 ? "text-success" : "text-danger")}>{Math.abs(remaining) < 0.01 ? "Cuadra con el total" : `Falta asignar ${fmt(remaining)}`}</p>}

      <button type="button" onClick={confirm} disabled={!valid} className="w-full h-11 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40 active:scale-[0.98] transition-all">Confirmar división</button>
    </div>
  );
}
