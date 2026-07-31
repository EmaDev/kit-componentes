"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export interface QuizOption {
  id: string;
  label: string;
}

interface QuizCardProps {
  question: string;
  options: QuizOption[];
  correctId: string;
  explanation?: string;
  index?: number;
  total?: number;
  onAnswer?: (id: string, correct: boolean) => void;
  onNext?: () => void;
  className?: string;
}

/** Pregunta de opción múltiple con feedback inmediato y explicación. */
export function QuizCard({ question, options, correctId, explanation, index, total, onAnswer, onNext, className = "" }: QuizCardProps) {
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;
  const correct = picked === correctId;

  const pick = (id: string) => {
    if (answered) return;
    setPicked(id);
    onAnswer?.(id, id === correctId);
  };

  return (
    <section className={`rounded-2xl border border-border bg-surface p-5 ${className}`}>
      <header className="mb-4 flex items-center justify-between">
        {typeof index === "number" && typeof total === "number" && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">Pregunta {index + 1} de {total}</span>
        )}
        {answered && (
          <span className={`text-[11px] font-bold uppercase tracking-wider ${correct ? "text-success" : "text-danger"}`}>
            {correct ? "Correcto" : "Incorrecto"}
          </span>
        )}
      </header>

      <h3 className="text-base font-bold text-foreground leading-snug mb-4" style={{ textWrap: "pretty" }}>{question}</h3>

      <div className="space-y-2">
        {options.map(o => {
          const isCorrect = o.id === correctId;
          const isPicked = o.id === picked;
          let cls = "border-border bg-surface hover:border-primary/40 hover:bg-surface-alt/60";
          if (answered) {
            if (isCorrect) cls = "border-success bg-success/10";
            else if (isPicked) cls = "border-danger bg-danger/10";
            else cls = "border-border bg-surface opacity-60";
          }
          return (
            <motion.button
              key={o.id} type="button" onClick={() => pick(o.id)} disabled={answered}
              whileTap={!answered ? { scale: 0.99 } : undefined}
              className={`w-full text-left rounded-xl border px-3.5 h-11 flex items-center gap-2.5 transition-colors ${cls}`}
            >
              <span className={[
                "w-[18px] h-[18px] shrink-0 inline-flex items-center justify-center rounded-full border-2",
                answered && isCorrect ? "border-success bg-success text-white" : answered && isPicked ? "border-danger bg-danger text-white" : "border-border",
              ].join(" ")}>
                {answered && isCorrect && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                {answered && isPicked && !isCorrect && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>}
              </span>
              <span className="text-sm font-medium text-foreground">{o.label}</span>
            </motion.button>
          );
        })}
      </div>

      {answered && explanation && (
        <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-xs text-muted leading-relaxed rounded-xl bg-surface-alt/60 p-3">
          {explanation}
        </motion.p>
      )}

      {answered && onNext && (
        <button type="button" onClick={onNext} className="mt-4 w-full h-11 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover active:scale-[0.99] transition-all">
          Siguiente
        </button>
      )}
    </section>
  );
}
