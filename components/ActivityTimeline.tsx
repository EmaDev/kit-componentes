"use client";

export interface TimelineEvent { id: string; title: string; description?: string; time: string; status: "done" | "current" | "pending" | "error" }

interface ActivityTimelineProps { events: TimelineEvent[]; className?: string }

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const DOT: Record<TimelineEvent["status"], string> = { done: "bg-success text-white", current: "bg-primary text-white", pending: "bg-surface-alt text-muted border border-border", error: "bg-danger text-white" };

/** Historial de eventos tipo "pedido creado → en camino → entregado". */
export function ActivityTimeline({ events, className = "" }: ActivityTimelineProps) {
  return (
    <ol className={cn("space-y-0", className)}>
      {events.map((e, i) => (
        <li key={e.id} className="relative flex gap-3.5 pb-6 last:pb-0">
          {i < events.length - 1 && <span className={cn("absolute left-[13px] top-7 bottom-0 w-px", e.status === "done" ? "bg-success/40" : "bg-border")}/>}
          <span className={cn("relative z-10 w-7 h-7 rounded-full shrink-0 inline-flex items-center justify-center", DOT[e.status])}>
            {e.status === "done" && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            {e.status === "current" && <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"/>}
            {e.status === "error" && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
          </span>
          <div className="min-w-0 pt-0.5">
            <p className={cn("text-sm font-semibold", e.status === "pending" ? "text-muted" : "text-foreground")}>{e.title}</p>
            {e.description && <p className="mt-0.5 text-[13px] text-muted leading-relaxed">{e.description}</p>}
            <p className="mt-1 text-[11px] font-medium text-muted/80">{e.time}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
