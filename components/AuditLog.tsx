"use client";
import { useState } from "react";

export interface AuditChange { field: string; from: string; to: string }
export interface AuditEntry { id: string; actor: string; action: string; time: string; changes?: AuditChange[] }
interface AuditLogProps { entries: AuditEntry[]; className?: string }

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const initials = (n: string) => n.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();

/** Historial de auditoría: quién hizo qué cambio y cuándo, con diff plegable por campo. */
export function AuditLog({ entries, className = "" }: AuditLogProps) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <ol className={cn("divide-y divide-border rounded-xl border border-border overflow-hidden bg-surface", className)}>
      {entries.map(e => (
        <li key={e.id} className="px-3.5 py-3">
          <div className="flex items-start gap-3">
            <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-[10px] font-bold inline-flex items-center justify-center">{initials(e.actor)}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground"><span className="font-semibold">{e.actor}</span> {e.action}</p>
              <p className="mt-0.5 text-[11px] text-muted/80">{e.time}</p>
              {e.changes && e.changes.length > 0 && (
                <button type="button" onClick={() => setOpen(o => ({ ...o, [e.id]: !o[e.id] }))} className="mt-1 text-[11px] font-bold text-primary hover:underline">
                  {open[e.id] ? "Ocultar cambios" : `Ver cambios (${e.changes.length})`}
                </button>
              )}
              {open[e.id] && e.changes && (
                <div className="mt-2 space-y-1.5">
                  {e.changes.map((c, i) => (
                    <div key={i} className="text-[12px] rounded-lg bg-surface-alt/60 px-2.5 py-1.5">
                      <span className="font-semibold text-foreground">{c.field}: </span>
                      <span className="text-danger line-through">{c.from}</span>
                      <span className="text-muted mx-1">→</span>
                      <span className="text-success">{c.to}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
