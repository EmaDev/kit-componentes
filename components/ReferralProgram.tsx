"use client";
import { useState } from "react";

interface ReferralProgramProps {
  code: string;
  invited: number;
  joined: number;
  goal?: number;
  reward?: string;
  shareUrl?: string;
  onShare?: () => void;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Programa de referidos: código propio, copiar/compartir, y progreso hacia una recompensa. */
export function ReferralProgram({ code, invited, joined, goal, reward, shareUrl, onShare, className = "" }: ReferralProgramProps) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(shareUrl ?? code); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const pct = goal ? Math.min(100, (joined / goal) * 100) : null;

  return (
    <div className={cn("rounded-2xl border border-border bg-surface p-5 space-y-4", className)}>
      <div>
        <p className="text-sm font-bold text-foreground">Invitá amigos y ganá {reward ?? "beneficios"}</p>
        <p className="mt-1 text-xs text-muted leading-relaxed">Compartí tu código; cuando alguien se registre con él, sumás para tu recompensa.</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex-1 h-11 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-3.5 flex items-center justify-center font-mono font-bold text-primary tracking-widest">{code}</span>
        <button type="button" onClick={copy} className="h-11 px-4 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-surface-alt transition-colors shrink-0">{copied ? "Copiado" : "Copiar"}</button>
      </div>

      <button type="button" onClick={onShare} className="w-full h-11 rounded-xl bg-primary text-white text-sm font-bold active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>
        Compartir invitación
      </button>

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl bg-surface-alt/60 py-3"><p className="text-xl font-black text-foreground">{invited}</p><p className="text-[11px] text-muted">Invitados</p></div>
        <div className="rounded-xl bg-surface-alt/60 py-3"><p className="text-xl font-black text-foreground">{joined}</p><p className="text-[11px] text-muted">Se sumaron</p></div>
      </div>

      {goal != null && (
        <div>
          <div className="flex justify-between text-[11px] font-semibold text-muted mb-1"><span>{joined} de {goal}</span><span>{Math.round(pct!)}%</span></div>
          <div className="h-2 rounded-full bg-surface-alt overflow-hidden"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }}/></div>
        </div>
      )}
    </div>
  );
}
