"use client";
import { useState } from "react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Input de etiquetas: escribir + Enter para crear, autocompletado y borrado con Backspace. */
export function TagInput({ value, onChange, suggestions = [], placeholder = "Agregar etiqueta…", maxTags, className = "" }: TagInputProps) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const add = (tag: string) => {
    const t = tag.trim();
    if (!t || value.includes(t) || (maxTags && value.length >= maxTags)) return;
    onChange([...value, t]);
    setQ(""); setOpen(false);
  };
  const remove = (tag: string) => onChange(value.filter(t => t !== tag));
  const filtered = suggestions.filter(s => !value.includes(s) && s.toLowerCase().includes(q.toLowerCase())).slice(0, 6);

  return (
    <div className={cn("relative", className)}>
      <div className="min-h-11 rounded-xl border border-border bg-surface px-2 py-1.5 flex flex-wrap items-center gap-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        {value.map(t => (
          <span key={t} className="h-7 pl-2.5 pr-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold inline-flex items-center gap-1">
            {t}
            <button type="button" onClick={() => remove(t)} aria-label={`Quitar ${t}`} className="w-4 h-4 rounded-full hover:bg-primary/20 inline-flex items-center justify-center">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </span>
        ))}
        <input value={q} onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
          placeholder={value.length ? "" : placeholder}
          onKeyDown={e => {
            if (e.key === "Enter") { e.preventDefault(); add(q); }
            if (e.key === "Backspace" && !q && value.length) remove(value[value.length - 1]);
          }}
          className="flex-1 min-w-[100px] h-7 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"/>
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 rounded-xl border border-border bg-surface shadow-xl shadow-black/10 overflow-hidden">
          {filtered.map(s => (
            <button key={s} type="button" onMouseDown={e => { e.preventDefault(); add(s); }} className="w-full px-3.5 py-2 text-left text-sm text-foreground hover:bg-surface-alt transition-colors">{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}
