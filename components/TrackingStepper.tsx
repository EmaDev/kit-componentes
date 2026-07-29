"use client";

export interface TrackingStep { id: string; label: string; time?: string; status: "done" | "current" | "pending" }
interface TrackingStepperProps { steps: TrackingStep[]; className?: string }

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Timeline horizontal de progreso tipo tracking de envío: iconos en fila con línea conectora. */
export function TrackingStepper({ steps, className = "" }: TrackingStepperProps) {
  return (
    <div className={cn("flex items-start", className)}>
      {steps.map((s, i) => (
        <div key={s.id} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <span className={cn("w-8 h-8 rounded-full inline-flex items-center justify-center transition-colors",
              s.status === "done" ? "bg-success text-white" : s.status === "current" ? "bg-primary text-white" : "bg-surface-alt border border-border text-muted")}>
              {s.status === "done"
                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <span className={cn("w-2 h-2 rounded-full", s.status === "current" ? "bg-white animate-pulse" : "bg-muted/50")}/>}
            </span>
            <span className={cn("text-[11px] font-semibold text-center w-20 leading-tight", s.status === "pending" ? "text-muted" : "text-foreground")}>{s.label}</span>
            {s.time && <span className="text-[10px] text-muted/70">{s.time}</span>}
          </div>
          {i < steps.length - 1 && <span className={cn("flex-1 h-0.5 -mt-6", s.status === "done" ? "bg-success" : "bg-border")}/>}
        </div>
      ))}
    </div>
  );
}
