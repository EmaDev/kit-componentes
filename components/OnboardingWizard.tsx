"use client";
import { useState } from "react";

export interface WizardStep { id: string; title: string; description?: string; content: React.ReactNode; optional?: boolean; validate?: () => boolean }

interface OnboardingWizardProps {
  steps: WizardStep[];
  onFinish?: () => void | Promise<void>;
  onStepChange?: (idx: number) => void;
  finishLabel?: string;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Wizard de pasos: barra de progreso, validación por paso y navegación atrás/siguiente. */
export function OnboardingWizard({ steps, onFinish, onStepChange, finishLabel = "Empezar", className = "" }: OnboardingWizardProps) {
  const [idx, setIdx] = useState(0);
  const [busy, setBusy] = useState(false);
  const step = steps[idx];
  const last = idx === steps.length - 1;
  const canNext = step.validate ? step.validate() : true;

  const go = (n: number) => { setIdx(n); onStepChange?.(n); };

  const next = async () => {
    if (!canNext) return;
    if (last) {
      setBusy(true);
      try { await onFinish?.(); } finally { setBusy(false); }
      return;
    }
    go(idx + 1);
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <span key={s.id} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= idx ? "bg-primary" : "bg-border")}/>
        ))}
      </div>

      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">Paso {idx + 1} de {steps.length}{step.optional && " · opcional"}</p>
        <h3 className="mt-1 text-xl font-bold text-foreground tracking-tight" style={{ textWrap: "balance" }}>{step.title}</h3>
        {step.description && <p className="mt-1.5 text-sm text-muted leading-relaxed" style={{ textWrap: "pretty" }}>{step.description}</p>}
      </div>

      <div>{step.content}</div>

      <div className="flex items-center gap-3">
        {idx > 0 && (
          <button type="button" onClick={() => go(idx - 1)} className="h-11 px-4 rounded-xl text-sm font-bold text-muted hover:bg-surface-alt transition-colors">Atrás</button>
        )}
        {step.optional && !last && (
          <button type="button" onClick={() => go(idx + 1)} className="h-11 px-4 rounded-xl text-sm font-bold text-muted hover:bg-surface-alt transition-colors">Omitir</button>
        )}
        <button type="button" onClick={next} disabled={!canNext || busy}
          className="ml-auto h-11 px-5 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40 active:scale-[0.98] transition-all inline-flex items-center gap-2">
          {busy && <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"/>}
          {last ? finishLabel : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
