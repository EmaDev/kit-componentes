"use client";
import { useMemo, useState } from "react";

export interface CurrencyOption { code: string; name: string; flag?: string; rate?: number }
interface CurrencySelectorProps {
  options: CurrencyOption[];
  value: string;
  onChange: (code: string) => void;
  baseCode?: string;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Selector de moneda buscable con bandera, nombre y cotización respecto a una moneda base. */
export function CurrencySelector({ options, value, onChange, baseCode, className = "" }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const current = options.find(o => o.code === value) ?? options[0];
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? options.filter(o => o.code.toLowerCase().includes(s) || o.name.toLowerCase().includes(s)) : options;
  }, [q, options]);

  return (
    <div className={cn("relative inline-block", className)}>
      <button type="button" onClick={() => setOpen(o => !o)} className="h-12 pl-3 pr-3 rounded-xl border border-border bg-surface inline-flex items-center gap-2.5 hover:border-primary/40 transition-colors">
        {current?.flag && <span className="text-xl leading-none">{current.flag}</span>}
        <span className="text-left">
          <span className="block text-sm font-bold text-foreground">{current?.code}</span>
          <span className="block text-[11px] text-muted">{current?.name}</span>
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="text-muted ml-1"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <div className="absolute z-30 top-full mt-1.5 w-72 rounded-xl border border-border bg-surface shadow-xl shadow-black/10 overflow-hidden">
          <div className="p-2 border-b border-border">
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar moneda…" className="w-full h-9 rounded-lg border border-border bg-surface-alt px-3 text-xs outline-none focus:border-primary"/>
          </div>
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.map(o => (
              <button key={o.code} type="button" onClick={() => { onChange(o.code); setOpen(false); setQ(""); }}
                className={cn("w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors", o.code === value ? "bg-primary/8" : "hover:bg-surface-alt")}>
                {o.flag && <span className="text-lg leading-none">{o.flag}</span>}
                <span className="min-w-0 flex-1">
                  <span className={cn("block text-sm font-semibold", o.code === value ? "text-primary" : "text-foreground")}>{o.code}</span>
                  <span className="block text-[11px] text-muted truncate">{o.name}</span>
                </span>
                {o.rate != null && baseCode && <span className="text-[11px] font-mono text-muted shrink-0">1 {baseCode} = {o.rate.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>}
              </button>
            ))}
            {filtered.length === 0 && <p className="px-3.5 py-4 text-center text-xs text-muted">Sin resultados</p>}
          </div>
        </div>
      )}
    </div>
  );
}
