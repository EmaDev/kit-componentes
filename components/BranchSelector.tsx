"use client";
import { useState } from "react";

export interface Branch { id: string; name: string; address: string; distanceKm?: number; open?: boolean }
interface BranchSelectorProps { branches: Branch[]; value?: string; onChange: (id: string) => void; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Selector de sucursal/local para negocios con varias ubicaciones físicas. */
export function BranchSelector({ branches, value, onChange, className = "" }: BranchSelectorProps) {
  const [q, setQ] = useState("");
  const filtered = branches.filter(b => `${b.name} ${b.address}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar sucursal…" className="w-full h-11 rounded-xl border border-border bg-surface pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/>
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filtered.map(b => {
          const on = value === b.id;
          return (
            <button key={b.id} type="button" onClick={() => onChange(b.id)}
              className={cn("w-full flex items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors", on ? "border-primary bg-primary/5" : "border-border hover:border-primary/30")}>
              <span className={cn("mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 inline-flex items-center justify-center", on ? "border-primary" : "border-border")}>{on && <span className="w-2.5 h-2.5 rounded-full bg-primary"/>}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{b.name}</span>
                  {b.open != null && <span className={cn("h-4 px-1.5 rounded-full text-[9px] font-bold inline-flex items-center", b.open ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>{b.open ? "Abierto" : "Cerrado"}</span>}
                </span>
                <span className="block text-xs text-muted mt-0.5">{b.address}</span>
              </span>
              {b.distanceKm != null && <span className="shrink-0 text-xs font-bold text-muted">{b.distanceKm.toFixed(1)} km</span>}
            </button>
          );
        })}
        {filtered.length === 0 && <p className="text-center text-sm text-muted py-6">No encontramos sucursales.</p>}
      </div>
    </div>
  );
}
