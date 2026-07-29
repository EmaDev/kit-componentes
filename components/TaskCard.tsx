"use client";
import { useState } from "react";

export type TaskPriority = "low" | "medium" | "high";
export interface Subtask { id: string; label: string; done: boolean }
export interface TaskCardData {
  id: string; title: string; description?: string;
  dueDate?: Date; priority?: TaskPriority; done?: boolean; subtasks?: Subtask[];
}

interface TaskCardProps {
  task: TaskCardData;
  onToggleDone?: (id: string) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  locale?: string;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const PRIORITY: Record<TaskPriority, { label: string; cls: string }> = {
  low: { label: "Baja", cls: "bg-muted/15 text-muted" },
  medium: { label: "Media", cls: "bg-accent/10 text-accent" },
  high: { label: "Alta", cls: "bg-danger/10 text-danger" },
};

/** Tarea con subtareas, prioridad y fecha límite; se expande para completar el detalle. */
export function TaskCard({ task, onToggleDone, onToggleSubtask, locale = "es-AR", className = "" }: TaskCardProps) {
  const [open, setOpen] = useState(false);
  const subtasks = task.subtasks ?? [];
  const doneCount = subtasks.filter(s => s.done).length;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const overdue = !!task.dueDate && !task.done && task.dueDate < today;
  const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });
  const prio = task.priority ? PRIORITY[task.priority] : null;

  return (
    <div className={cn("rounded-2xl border border-border bg-surface px-4 py-3.5", className)}>
      <div className="flex items-start gap-3">
        <button type="button" onClick={() => onToggleDone?.(task.id)}
          className={cn("mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 inline-flex items-center justify-center transition-all", task.done ? "bg-primary border-primary text-white" : "border-border hover:border-primary/50")}>
          {task.done && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
        </button>

        <button type="button" onClick={() => setOpen(o => !o)} className="min-w-0 flex-1 text-left">
          <div className="flex items-start justify-between gap-3">
            <p className={cn("text-sm font-semibold leading-snug", task.done ? "text-muted line-through" : "text-foreground")}>{task.title}</p>
            {subtasks.length > 0 && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                className={cn("shrink-0 text-muted mt-0.5 transition-transform", open ? "rotate-180" : "")}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            )}
          </div>
          {task.description && <p className="mt-1 text-xs text-muted leading-relaxed">{task.description}</p>}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {prio && <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full", prio.cls)}>{prio.label}</span>}
            {task.dueDate && (
              <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1", overdue ? "bg-danger/10 text-danger" : "bg-surface-alt text-muted")}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" /></svg>
                {fmt.format(task.dueDate)}
              </span>
            )}
            {subtasks.length > 0 && <span className="text-[11px] font-semibold text-muted tabular-nums">{doneCount}/{subtasks.length}</span>}
          </div>
        </button>
      </div>

      {open && subtasks.length > 0 && (
        <ul className="mt-3 ml-8 space-y-1.5 border-l border-border pl-3.5">
          {subtasks.map(s => (
            <li key={s.id}>
              <button type="button" onClick={() => onToggleSubtask?.(task.id, s.id)}
                className="w-full flex items-center gap-2.5 text-left py-0.5">
                <span className={cn("w-4 h-4 rounded-[5px] border-2 shrink-0 inline-flex items-center justify-center", s.done ? "bg-primary border-primary text-white" : "border-border")}>
                  {s.done && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                </span>
                <span className={cn("text-[13px]", s.done ? "text-muted line-through" : "text-foreground")}>{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
