"use client";
import { useState } from "react";

export interface ApprovalItem { id: string; label: string; description?: string }
interface ApprovalChecklistProps {
  items: ApprovalItem[];
  onApprove?: (checked: string[]) => void | Promise<void>;
  onReject?: (reason: string) => void | Promise<void>;
  requireAll?: boolean;
  approveLabel?: string;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Revisar y aprobar un documento: checklist obligatorio + firma o motivo de rechazo. */
export function ApprovalChecklist({ items, onApprove, onReject, requireAll = true, approveLabel = "Aprobar", className = "" }: ApprovalChecklistProps) {
  const [checked, setChecked] = useState<string[]>([]);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const allChecked = items.every(i => checked.includes(i.id));
  const canApprove = requireAll ? allChecked : checked.length > 0;

  const toggle = (id: string) => setChecked(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);
  const approve = async () => { setBusy("approve"); try { await onApprove?.(checked); } finally { setBusy(null); } };
  const reject = async () => { if (!reason.trim()) return; setBusy("reject"); try { await onReject?.(reason.trim()); } finally { setBusy(null); } };

  return (
    <div className={cn("space-y-4", className)}>
      <ul className="space-y-2">
        {items.map(it => {
          const on = checked.includes(it.id);
          return (
            <li key={it.id}>
              <button type="button" onClick={() => toggle(it.id)} className="w-full flex items-start gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 text-left hover:border-primary/30 transition-colors">
                <span className={cn("mt-0.5 w-5 h-5 rounded-md border-2 shrink-0 inline-flex items-center justify-center transition-all", on ? "bg-primary border-primary text-white" : "border-border")}>
                  {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{it.label}</span>
                  {it.description && <span className="block text-xs text-muted mt-0.5 leading-relaxed">{it.description}</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {rejecting ? (
        <div className="space-y-2">
          <textarea autoFocus rows={2} value={reason} onChange={e => setReason(e.target.value)} placeholder="Motivo del rechazo…"
            className="w-full resize-none rounded-xl border border-danger/40 bg-surface px-3.5 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-danger/20"/>
          <div className="flex gap-2">
            <button type="button" onClick={() => setRejecting(false)} className="flex-1 h-10 rounded-xl text-xs font-bold text-muted hover:bg-surface-alt transition-colors">Cancelar</button>
            <button type="button" onClick={reject} disabled={!reason.trim() || busy !== null} className="flex-1 h-10 rounded-xl bg-danger text-white text-xs font-bold disabled:opacity-40 transition-all">{busy === "reject" ? "Enviando…" : "Confirmar rechazo"}</button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          {onReject && <button type="button" onClick={() => setRejecting(true)} className="h-11 px-4 rounded-xl border border-border text-sm font-bold text-danger hover:bg-danger/8 transition-colors">Rechazar</button>}
          <button type="button" onClick={approve} disabled={!canApprove || busy !== null} className="flex-1 h-11 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2">
            {busy === "approve" && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"/>}{approveLabel}
          </button>
        </div>
      )}
    </div>
  );
}
