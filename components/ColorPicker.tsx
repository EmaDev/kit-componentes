"use client";
import { useState } from "react";

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  palette?: string[];
  allowCustom?: boolean;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const DEFAULT_PALETTE = ["#2563eb", "#7c3aed", "#db2777", "#ef4444", "#f59e0b", "#84cc16", "#0ea5e9", "#14b8a6", "#64748b", "#0f172a"];

/** Selector de color: paleta curada + swatches recientes + picker nativo opcional para custom. */
export function ColorPicker({ value, onChange, palette = DEFAULT_PALETTE, allowCustom = true, className = "" }: ColorPickerProps) {
  const [recents, setRecents] = useState<string[]>([]);
  const pick = (hex: string) => { onChange(hex); setRecents(r => [hex, ...r.filter(x => x !== hex)].slice(0, 6)); };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl border border-border shadow-sm" style={{ background: value }}/>
        <span className="text-sm font-mono font-semibold text-foreground uppercase">{value}</span>
      </div>
      <div className="grid grid-cols-10 gap-1.5">
        {palette.map(c => (
          <button key={c} type="button" aria-label={c} onClick={() => pick(c)}
            className={cn("aspect-square rounded-full transition-transform active:scale-90", value.toLowerCase() === c.toLowerCase() && "ring-2 ring-offset-2 ring-primary ring-offset-surface")}
            style={{ background: c }}/>
        ))}
      </div>
      {recents.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">Recientes</p>
          <div className="flex gap-1.5">{recents.map((c, i) => <button key={`${c}${i}`} type="button" onClick={() => pick(c)} className="w-6 h-6 rounded-full" style={{ background: c }}/>)}</div>
        </div>
      )}
      {allowCustom && (
        <label className="inline-flex items-center gap-2 text-xs font-bold text-primary cursor-pointer hover:underline">
          <input type="color" value={value} onChange={e => pick(e.target.value)} className="w-0 h-0 opacity-0 absolute"/>
          Elegir un color personalizado
        </label>
      )}
    </div>
  );
}
