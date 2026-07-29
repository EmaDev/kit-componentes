"use client";

export interface ChecklistItem { id: string; label: string; checked: boolean; note?: string }

interface TripChecklistProps {
  title?: string;
  items: ChecklistItem[];
  onToggle: (id: string) => void;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Checklist simple con progreso — listas de equipaje o pendientes previos al viaje. */
export function TripChecklist({ title, items, onToggle, className = "" }: TripChecklistProps) {
  const done = items.filter(i => i.checked).length;
  const pct = items.length > 0 ? (done / items.length) * 100 : 0;
  const complete = items.length > 0 && done === items.length;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        {title && <p className="text-sm font-semibold text-foreground">{title}</p>}
        <span className={cn("text-xs font-bold tabular-nums", complete ? "text-success" : "text-muted")}>{done}/{items.length}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", complete ? "bg-success" : "bg-primary")} style={{ width: `${pct}%` }} />
      </div>
      <ul className="space-y-2">
        {items.map(it => (
          <li key={it.id}>
            <button type="button" onClick={() => onToggle(it.id)}
              className="w-full flex items-start gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 text-left hover:border-primary/30 transition-colors">
              <span className={cn("mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 inline-flex items-center justify-center transition-all", it.checked ? "bg-primary border-primary text-white" : "border-border")}>
                {it.checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
              </span>
              <span className="min-w-0">
                <span className={cn("block text-sm font-medium", it.checked ? "text-muted line-through" : "text-foreground")}>{it.label}</span>
                {it.note && <span className="block text-xs text-muted mt-0.5 leading-relaxed">{it.note}</span>}
              </span>
            </button>
          </li>
        ))}
        {items.length === 0 && <p className="text-sm text-muted py-4 text-center">Sin ítems todavía.</p>}
      </ul>
    </div>
  );
}
