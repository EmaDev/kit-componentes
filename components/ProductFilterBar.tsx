"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CheckboxGroup } from "./Checkbox";
import { DualRangeSlider } from "./DualRangeSlider";

export type SortDirection = "asc" | "desc";
export interface SortField { id: string; label: string }
export interface FilterOption { id: string; label: string; count?: number }
export interface ProductFilterGroup {
  id: string;
  label: string;
  /** selección múltiple (default `true`) o única dentro del grupo */
  multi?: boolean;
  options: FilterOption[];
}
export interface ProductFilterValue {
  sortField?: string | null;
  sortDirection?: SortDirection;
  price?: [number, number];
  groups?: Record<string, string[]>;
}

interface ProductFilterBarProps {
  value: ProductFilterValue;
  onChange: (value: ProductFilterValue) => void;
  sortFields?: SortField[];
  groups?: ProductFilterGroup[];
  price?: { min: number; max: number; step?: number; label?: string; format?: (n: number) => string };
  /** cantidad de resultados, mostrada a la izquierda de la barra */
  resultCount?: number;
  resultLabel?: (n: number) => string;
  clearable?: boolean;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Barra de orden + filtros para un listado de productos: ordenamiento asc/desc y grupos de filtros (checkbox o único) con chips activos. */
export function ProductFilterBar({
  value, onChange, sortFields = [], groups = [], price, resultCount, resultLabel,
  clearable = true, className = "",
}: ProductFilterBarProps) {
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const sortBox = useRef<HTMLDivElement>(null);
  const filterBox = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sortOpen) return;
    const onDoc = (e: MouseEvent) => { if (!sortBox.current?.contains(e.target as Node)) setSortOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSortOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [sortOpen]);

  useEffect(() => {
    if (!filterOpen) return;
    const onDoc = (e: MouseEvent) => { if (!filterBox.current?.contains(e.target as Node)) setFilterOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setFilterOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [filterOpen]);

  const groupsValue = value.groups ?? {};
  const direction = value.sortDirection ?? "desc";
  const activeField = sortFields.find((f) => f.id === value.sortField);
  const priceValue: [number, number] = value.price ?? (price ? [price.min, price.max] : [0, 0]);
  const priceActive = !!price && !!value.price && (value.price[0] !== price.min || value.price[1] !== price.max);

  const toggleOption = (g: ProductFilterGroup, oid: string) => {
    const cur = groupsValue[g.id] ?? [];
    const has = cur.includes(oid);
    const next = g.multi === false ? (has ? [] : [oid]) : has ? cur.filter((x) => x !== oid) : [...cur, oid];
    onChange({ ...value, groups: { ...groupsValue, [g.id]: next } });
  };
  const clearPrice = () => onChange({ ...value, price: price ? [price.min, price.max] : undefined });
  const clearFilters = () => onChange({ ...value, price: price ? [price.min, price.max] : undefined, groups: {} });

  const activeCount = Object.values(groupsValue).reduce((a, b) => a + b.length, 0) + (priceActive ? 1 : 0);

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  groups.forEach((g) => (groupsValue[g.id] ?? []).forEach((oid) => {
    const opt = g.options.find((o) => o.id === oid);
    if (opt) chips.push({ key: `${g.id}-${oid}`, label: opt.label, onRemove: () => toggleOption(g, oid) });
  }));
  if (priceActive && price) {
    const fmt = price.format ?? String;
    chips.push({ key: "price", label: `${fmt(priceValue[0])} – ${fmt(priceValue[1])}`, onRemove: clearPrice });
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {resultCount != null && (
          <span className="text-sm text-muted mr-auto">{(resultLabel ?? ((n) => `${n} resultados`))(resultCount)}</span>
        )}

        {sortFields.length > 0 && (
          <div ref={sortBox} className="relative">
            <button type="button" onClick={() => setSortOpen((o) => !o)}
              className={cn(
                "h-9 px-3 rounded-xl border bg-surface text-xs font-semibold flex items-center gap-1.5 transition-colors",
                sortOpen ? "border-primary text-foreground" : "border-border text-foreground hover:border-muted/50",
              )}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
                <line x1="4" y1="7" x2="14" y2="7" /><line x1="4" y1="12" x2="11" y2="12" /><line x1="4" y1="17" x2="8" y2="17" />
              </svg>
              {activeField?.label ?? "Ordenar"}
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.14 } }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute z-50 mt-2 w-48 rounded-2xl border border-border bg-surface p-1.5 shadow-2xl shadow-black/15">
                  {sortFields.map((f) => (
                    <button key={f.id} type="button"
                      onClick={() => { onChange({ ...value, sortField: f.id }); setSortOpen(false); }}
                      className={cn(
                        "w-full h-9 px-3 rounded-lg text-left text-[13px] font-medium flex items-center gap-2 transition-colors",
                        f.id === value.sortField ? "bg-primary/10 text-primary" : "text-foreground hover:bg-surface-alt",
                      )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", f.id === value.sortField ? "bg-primary" : "bg-transparent")} />
                      {f.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {sortFields.length > 0 && (
          <button type="button" aria-label={direction === "asc" ? "Orden ascendente" : "Orden descendente"}
            onClick={() => onChange({ ...value, sortDirection: direction === "asc" ? "desc" : "asc" })}
            className="w-9 h-9 rounded-xl border border-border bg-surface grid place-items-center text-muted hover:text-foreground hover:border-muted/50 active:scale-90 transition-all">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
              className="transition-transform" style={{ transform: direction === "asc" ? "rotate(180deg)" : undefined }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}

        {groups.length > 0 && (
          <div ref={filterBox} className="relative">
            <button type="button" onClick={() => setFilterOpen((o) => !o)}
              className={cn(
                "h-9 px-3 rounded-xl border bg-surface text-xs font-semibold flex items-center gap-1.5 transition-colors",
                filterOpen ? "border-primary text-foreground" : "border-border text-foreground hover:border-muted/50",
              )}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-muted shrink-0">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="10" y1="18" x2="14" y2="18" />
              </svg>
              Filtros
              {activeCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold grid place-items-center">{activeCount}</span>
              )}
            </button>
            <AnimatePresence>
              {filterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.14 } }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-border bg-surface p-4 shadow-2xl shadow-black/15 max-h-[26rem] overflow-y-auto">
                  <div className="flex flex-col gap-5">
                    {price && (
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2.5">{price.label ?? "Precio"}</p>
                        <DualRangeSlider min={price.min} max={price.max} step={price.step} value={priceValue}
                          onChange={(v) => onChange({ ...value, price: v })} format={price.format} />
                      </div>
                    )}
                    {groups.map((g) => (
                      g.multi === false ? (
                        <div key={g.id}>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2.5">{g.label}</p>
                          <div className="flex flex-col gap-2">
                            {g.options.map((o) => {
                              const on = (groupsValue[g.id] ?? []).includes(o.id);
                              return (
                                <button key={o.id} type="button" onClick={() => toggleOption(g, o.id)}
                                  className="flex items-center gap-2.5 text-left">
                                  <span className={cn(
                                    "w-4 h-4 rounded-full border-2 shrink-0 grid place-items-center transition-colors",
                                    on ? "border-primary" : "border-border",
                                  )}>
                                    {on && <span className="w-2 h-2 rounded-full bg-primary" />}
                                  </span>
                                  <span className="text-[13px] font-medium text-foreground">{o.label}</span>
                                  {o.count != null && <span className="text-[11px] text-muted">({o.count})</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <CheckboxGroup key={g.id} label={g.label} size="sm"
                          value={groupsValue[g.id] ?? []}
                          onChange={(next) => onChange({ ...value, groups: { ...groupsValue, [g.id]: next } })}
                          options={g.options.map((o) => ({
                            value: o.id,
                            label: <span className="flex items-center gap-1.5">{o.label}{o.count != null && <span className="text-[11px] text-muted">({o.count})</span>}</span>,
                          }))}
                        />
                      )
                    ))}
                  </div>

                  {clearable && (
                    <div className="flex items-center justify-between pt-3 mt-4 border-t border-border">
                      <button type="button" onClick={clearFilters}
                        className="h-8 px-2.5 rounded-lg text-[11px] font-semibold text-muted hover:text-danger hover:bg-danger/8 transition-colors">
                        Limpiar
                      </button>
                      <button type="button" onClick={() => setFilterOpen(false)}
                        className="h-8 px-2.5 rounded-lg text-[11px] font-semibold text-primary hover:bg-primary/8 transition-colors">
                        Listo
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((c) => (
            <button key={c.key} type="button" onClick={c.onRemove}
              className="h-7 pl-2.5 pr-1.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary flex items-center gap-1 hover:bg-primary/15 transition-colors">
              {c.label}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ))}
          {clearable && (
            <button type="button" onClick={clearFilters}
              className="h-7 px-2.5 rounded-full text-[11px] font-semibold text-muted hover:text-danger transition-colors">
              Limpiar todo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
