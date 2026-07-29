"use client";
import { useState } from "react";

export interface TimelineNote { id: string; author: string; text: string; time: string }
export interface CommentableEvent { id: string; title: string; time: string; status: "done" | "current" | "pending"; notes: TimelineNote[] }
interface TimelineCommentsProps { events: CommentableEvent[]; currentUser?: string; onAddNote?: (eventId: string, text: string) => void; className?: string }

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const DOT: Record<CommentableEvent["status"], string> = { done: "bg-success text-white", current: "bg-primary text-white", pending: "bg-surface-alt text-muted border border-border" };

/** Timeline editable: bitácora con notas por evento (proyecto, historial de soporte). */
export function TimelineComments({ events, currentUser = "Vos", onAddNote, className = "" }: TimelineCommentsProps) {
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const submit = (id: string) => {
    const text = (draft[id] ?? "").trim();
    if (!text) return;
    onAddNote?.(id, text);
    setDraft(d => ({ ...d, [id]: "" }));
  };

  return (
    <ol className={cn("space-y-0", className)}>
      {events.map((e, i) => (
        <li key={e.id} className="relative flex gap-3.5 pb-6 last:pb-0">
          {i < events.length - 1 && <span className="absolute left-[13px] top-7 bottom-0 w-px bg-border"/>}
          <span className={cn("relative z-10 w-7 h-7 rounded-full shrink-0 inline-flex items-center justify-center", DOT[e.status])}>
            {e.status === "done" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            {e.status === "current" && <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"/>}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className={cn("text-sm font-semibold", e.status === "pending" ? "text-muted" : "text-foreground")}>{e.title}</p>
            <p className="mt-0.5 text-[11px] font-medium text-muted/80">{e.time}</p>

            {e.notes.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {e.notes.map(n => (
                  <li key={n.id} className="rounded-lg bg-surface-alt/60 px-3 py-1.5 text-[12px] leading-relaxed">
                    <span className="font-semibold text-foreground">{n.author}: </span>
                    <span className="text-muted">{n.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {onAddNote && (open[e.id] ? (
              <div className="mt-2 flex gap-1.5">
                <input autoFocus value={draft[e.id] ?? ""} onChange={ev => setDraft(d => ({ ...d, [e.id]: ev.target.value }))}
                  onKeyDown={ev => ev.key === "Enter" && submit(e.id)} placeholder={`Nota de ${currentUser}…`}
                  className="flex-1 h-8 rounded-lg border border-border bg-surface px-2.5 text-xs outline-none focus:border-primary"/>
                <button type="button" onClick={() => submit(e.id)} className="h-8 px-2.5 rounded-lg bg-primary text-white text-xs font-bold">Agregar</button>
              </div>
            ) : (
              <button type="button" onClick={() => setOpen(o => ({ ...o, [e.id]: true }))} className="mt-1.5 text-[11px] font-bold text-primary hover:underline">+ Agregar nota</button>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}
