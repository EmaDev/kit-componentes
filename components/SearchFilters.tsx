"use client";
import { useMemo, useState } from "react";

export interface FilterGroup { id: string; label: string; options: { id: string; label: string }[]; multi?: boolean }
export interface SearchResult { id: string; group: string; title: string; subtitle?: string; icon?: React.ReactNode }

interface SearchFiltersProps {
  placeholder?: string;
  filters?: FilterGroup[];
  results: SearchResult[];
  groupLabels?: Record<string, string>;
  onQueryChange?: (q: string) => void;
  onFiltersChange?: (active: Record<string, string[]>) => void;
  onSelect?: (r: SearchResult) => void;
  emptyLabel?: string;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Barra de búsqueda con chips de filtro (multi-selección) y resultados agrupados. */
export function SearchFilters({
  placeholder = "Buscar…", filters = [], results, groupLabels = {},
  onQueryChange, onFiltersChange, onSelect, emptyLabel = "No encontramos nada con esos filtros.", className = "",
}: SearchFiltersProps) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Record<string, string[]>>({});

  const toggle = (gid: string, oid: string, multi?: boolean) => {
    setActive(prev => {
      const cur = prev[gid] ?? [];
      const has = cur.includes(oid);
      const next = multi ? (has ? cur.filter(x => x !== oid) : [...cur, oid]) : has ? [] : [oid];
      const out = { ...prev, [gid]: next };
      onFiltersChange?.(out);
      return out;
    });
  };

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return results.filter(r => {
      if (query && !`${r.title} ${r.subtitle ?? ""}`.toLowerCase().includes(query)) return false;
      return Object.entries(active).every(([, ids]) => !ids.length || ids.includes(r.group) || true);
    });
  }, [q, active, results]);

  const grouped = useMemo(() => {
    const m = new Map<string, SearchResult[]>();
    filtered.forEach(r => m.set(r.group, [...(m.get(r.group) ?? []), r]));
    return [...m.entries()];
  }, [filtered]);

  const activeCount = Object.values(active).reduce((a, b) => a + b.length, 0);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input value={q} placeholder={placeholder} onChange={e => { setQ(e.target.value); onQueryChange?.(e.target.value); }}
          className="w-full h-11 rounded-xl border border-border bg-surface pl-10 pr-9 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"/>
        {q && (
          <button type="button" onClick={() => { setQ(""); onQueryChange?.(""); }} aria-label="Limpiar" className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full text-muted hover:bg-surface-alt inline-flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        )}
      </div>

      {filters.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filters.map(g => g.options.map(o => {
            const on = (active[g.id] ?? []).includes(o.id);
            return (
              <button key={`${g.id}-${o.id}`} type="button" onClick={() => toggle(g.id, o.id, g.multi)}
                className={cn("h-8 px-3 rounded-full text-xs font-semibold border transition-colors",
                  on ? "bg-primary text-white border-primary" : "bg-surface text-muted border-border hover:border-primary/40 hover:text-foreground")}>
                {o.label}
              </button>
            );
          }))}
          {activeCount > 0 && (
            <button type="button" onClick={() => { setActive({}); onFiltersChange?.({}); }} className="h-8 px-3 rounded-full text-xs font-semibold text-danger hover:bg-danger/10 transition-colors">
              Limpiar ({activeCount})
            </button>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface divide-y divide-border overflow-hidden">
        {grouped.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">{emptyLabel}</p>
        ) : grouped.map(([gid, items]) => (
          <div key={gid}>
            <p className="px-4 pt-3 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">{groupLabels[gid] ?? gid}</p>
            {items.map(r => (
              <button key={r.id} type="button" onClick={() => onSelect?.(r)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-alt transition-colors">
                {r.icon && <span className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center">{r.icon}</span>}
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground truncate">{r.title}</span>
                  {r.subtitle && <span className="block text-xs text-muted truncate">{r.subtitle}</span>}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
