"use client";
import { useMemo, useRef, useState } from "react";

export interface LanguageOption { code: string; label: string; region?: string; flag?: string }

interface LanguagePickerProps {
  options: LanguageOption[];
  value: string;
  onChange: (code: string) => void;
  variant?: "select" | "sheet";
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Selector de idioma/región: dropdown buscable con bandera y nombre nativo. */
export function LanguagePicker({ options, value, onChange, variant = "select", className = "" }: LanguagePickerProps) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find(o => o.code === value) ?? options[0];

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? options.filter(o => o.label.toLowerCase().includes(s) || o.region?.toLowerCase().includes(s)) : options;
  }, [q, options]);

  const pick = (code: string) => { onChange(code); setOpen(false); setQ(""); };

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="h-11 pl-3 pr-2.5 rounded-xl border border-border bg-surface inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:border-primary/40 transition-colors">
        {current?.flag && <span className="text-base leading-none">{current.flag}</span>}
        <span>{current?.label}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open && (
        <div className="absolute z-30 top-full mt-1.5 w-64 rounded-xl border border-border bg-surface shadow-xl shadow-black/10 overflow-hidden">
          <div className="p-2 border-b border-border">
            <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar idioma…"
              className="w-full h-9 rounded-lg border border-border bg-surface-alt px-3 text-xs outline-none focus:border-primary"/>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.map(o => (
              <button key={o.code} type="button" onClick={() => pick(o.code)}
                className={cn("w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors", o.code === value ? "bg-primary/8 text-primary font-semibold" : "text-foreground hover:bg-surface-alt")}>
                {o.flag && <span className="text-base leading-none">{o.flag}</span>}
                <span className="flex-1 min-w-0 truncate">{o.label}</span>
                {o.region && <span className="text-[11px] text-muted">{o.region}</span>}
              </button>
            ))}
            {filtered.length === 0 && <p className="px-3.5 py-4 text-center text-xs text-muted">Sin resultados</p>}
          </div>
        </div>
      )}
    </div>
  );
}
