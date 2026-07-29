"use client";
import { useMemo, useState } from "react";

export interface UnitGroup { id: string; label: string; units: { id: string; label: string; toBase: number }[] }
interface UnitConverterProps { groups: UnitGroup[]; defaultGroup?: string; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Conversor de unidades genérico (largo, peso, volumen…) configurable por grupos. */
export function UnitConverter({ groups, defaultGroup, className = "" }: UnitConverterProps) {
  const [groupId, setGroupId] = useState(defaultGroup ?? groups[0]?.id);
  const group = groups.find(g => g.id === groupId) ?? groups[0];
  const [fromUnit, setFromUnit] = useState(group.units[0]?.id);
  const [toUnit, setToUnit] = useState(group.units[1]?.id ?? group.units[0]?.id);
  const [input, setInput] = useState("1");

  const result = useMemo(() => {
    const from = group.units.find(u => u.id === fromUnit);
    const to = group.units.find(u => u.id === toUnit);
    const n = parseFloat(input);
    if (!from || !to || isNaN(n)) return "";
    return ((n * from.toBase) / to.toBase).toLocaleString(undefined, { maximumFractionDigits: 6 });
  }, [group, fromUnit, toUnit, input]);

  const changeGroup = (id: string) => {
    setGroupId(id);
    const g = groups.find(x => x.id === id)!;
    setFromUnit(g.units[0]?.id); setToUnit(g.units[1]?.id ?? g.units[0]?.id);
  };
  const selectCls = "h-11 rounded-xl border border-border bg-surface px-3 text-sm font-semibold text-foreground outline-none focus:border-primary";

  return (
    <div className={cn("space-y-4", className)}>
      {groups.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {groups.map(g => <button key={g.id} type="button" onClick={() => changeGroup(g.id)} className={cn("h-8 px-3 rounded-full text-xs font-semibold border transition-colors", g.id === groupId ? "bg-primary text-white border-primary" : "bg-surface text-muted border-border")}>{g.label}</button>)}
        </div>
      )}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
        <label className="block"><span className="block text-[11px] font-bold uppercase text-muted mb-1">De</span>
          <input inputMode="decimal" value={input} onChange={e => setInput(e.target.value)} className="w-full h-11 rounded-xl border border-border bg-surface px-3 text-sm font-semibold outline-none focus:border-primary mb-1.5"/>
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value)} className={cn(selectCls, "w-full")}>{group.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}</select>
        </label>
        <button type="button" onClick={() => { setFromUnit(toUnit); setToUnit(fromUnit); }} className="mb-1.5 w-9 h-9 rounded-full border border-border text-muted hover:bg-surface-alt inline-flex items-center justify-center transition-colors">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
        </button>
        <label className="block"><span className="block text-[11px] font-bold uppercase text-muted mb-1">A</span>
          <p className="h-11 rounded-xl border border-primary/30 bg-primary/5 px-3 text-sm font-bold text-primary flex items-center mb-1.5">{result || "—"}</p>
          <select value={toUnit} onChange={e => setToUnit(e.target.value)} className={cn(selectCls, "w-full")}>{group.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}</select>
        </label>
      </div>
    </div>
  );
}
