"use client";
import { useState } from "react";

export interface TaskListItem { id: string; label: string; checked: boolean; note?: string }
export interface TaskGroup { id: string; label: string; sublabel?: string; items: TaskListItem[] }

interface GroupedTaskListProps {
  groups: TaskGroup[];
  onToggle: (groupId: string, itemId: string) => void;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Tareas agrupadas por día o categoría, con progreso por grupo y grupos colapsables. */
export function GroupedTaskList({ groups, onToggle, collapsible = true, defaultCollapsed = false, className = "" }: GroupedTaskListProps) {
  const [closed, setClosed] = useState<Set<string>>(() => new Set(defaultCollapsed ? groups.map(g => g.id) : []));
  const toggleGroup = (id: string) => setClosed(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <div className={cn("space-y-5", className)}>
      {groups.map(g => {
        const done = g.items.filter(i => i.checked).length;
        const isOpen = !closed.has(g.id);
        return (
          <div key={g.id}>
            <button type="button" disabled={!collapsible} onClick={() => toggleGroup(g.id)}
              className="w-full flex items-center justify-between gap-3 py-1">
              <span className="min-w-0 text-left">
                <span className="block text-sm font-bold text-foreground">{g.label}</span>
                {g.sublabel && <span className="block text-[11px] text-muted mt-0.5">{g.sublabel}</span>}
              </span>
              <span className="flex items-center gap-2 shrink-0">
                <span className={cn("text-xs font-bold tabular-nums", done === g.items.length && g.items.length > 0 ? "text-success" : "text-muted")}>{done}/{g.items.length}</span>
                {collapsible && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                    className={cn("text-muted transition-transform", isOpen ? "rotate-180" : "")}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                )}
              </span>
            </button>
            {isOpen && (
              <ul className="mt-2 divide-y divide-border rounded-xl border border-border overflow-hidden bg-surface">
                {g.items.map(it => (
                  <li key={it.id}>
                    <button type="button" onClick={() => onToggle(g.id, it.id)}
                      className="w-full flex items-start gap-3 px-3.5 py-2.5 text-left hover:bg-surface-alt/60 transition-colors">
                      <span className={cn("mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 inline-flex items-center justify-center transition-all", it.checked ? "bg-primary border-primary text-white" : "border-border")}>
                        {it.checked && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                      </span>
                      <span className="min-w-0">
                        <span className={cn("block text-sm", it.checked ? "text-muted line-through" : "text-foreground")}>{it.label}</span>
                        {it.note && <span className="block text-[11px] text-muted mt-0.5">{it.note}</span>}
                      </span>
                    </button>
                  </li>
                ))}
                {g.items.length === 0 && <li className="px-3.5 py-3 text-xs text-muted text-center">Sin tareas.</li>}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
