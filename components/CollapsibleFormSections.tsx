"use client";
import { useState } from "react";

export interface FormSection { id: string; title: string; description?: string; content: React.ReactNode; defaultOpen?: boolean }
interface CollapsibleFormSectionsProps { sections: FormSection[]; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Formulario largo dividido en secciones colapsables — configuración avanzada. */
export function CollapsibleFormSections({ sections, className = "" }: CollapsibleFormSectionsProps) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => Object.fromEntries(sections.map(s => [s.id, !!s.defaultOpen])));
  return (
    <div className={cn("rounded-2xl border border-border divide-y divide-border overflow-hidden bg-surface", className)}>
      {sections.map(s => (
        <div key={s.id}>
          <button type="button" onClick={() => setOpen(o => ({ ...o, [s.id]: !o[s.id] }))}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-surface-alt/60 transition-colors">
            <span>
              <span className="block text-sm font-bold text-foreground">{s.title}</span>
              {s.description && <span className="block text-xs text-muted mt-0.5">{s.description}</span>}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
              className={cn("shrink-0 text-muted transition-transform", open[s.id] && "rotate-180")}><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {open[s.id] && <div className="px-4 pb-4 grid gap-3 sm:grid-cols-2">{s.content}</div>}
        </div>
      ))}
    </div>
  );
}
