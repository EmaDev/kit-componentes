"use client";

import { motion } from "framer-motion";

export interface TopicProgress {
  id: string;
  label: string;
  /** 0 a 100 */
  mastery: number;
}

interface ProgressByTopicProps {
  topics: TopicProgress[];
  onTopicClick?: (id: string) => void;
  className?: string;
}

function toneFor(mastery: number) {
  if (mastery >= 80) return "success";
  if (mastery >= 40) return "primary";
  return "danger";
}

/** Dominio por tema/materia: barra de progreso por cada uno, ordenadas por avance. */
export function ProgressByTopic({ topics, onTopicClick, className = "" }: ProgressByTopicProps) {
  const sorted = [...topics].sort((a, b) => b.mastery - a.mastery);
  const overall = topics.length ? Math.round(topics.reduce((s, t) => s + t.mastery, 0) / topics.length) : 0;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">Dominio general</span>
        <span className="font-bold text-foreground tabular-nums">{overall}%</span>
      </div>
      <div className="space-y-3">
        {sorted.map(t => {
          const tone = toneFor(t.mastery);
          const Comp = onTopicClick ? "button" : "div";
          return (
            <Comp key={t.id} type={onTopicClick ? "button" : undefined} onClick={onTopicClick ? () => onTopicClick(t.id) : undefined}
              className={`w-full text-left rounded-xl border border-border bg-surface p-3.5 ${onTopicClick ? "hover:border-primary/40 hover:bg-surface-alt/60 transition-colors" : ""}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground truncate">{t.label}</span>
                <span className="text-xs font-bold tabular-nums" style={{ color: `var(--color-${tone})` }}>{t.mastery}%</span>
              </div>
              <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: `var(--color-${tone})` }}
                  initial={{ width: 0 }} animate={{ width: `${t.mastery}%` }} transition={{ type: "spring", stiffness: 120, damping: 22 }}/>
              </div>
            </Comp>
          );
        })}
      </div>
    </div>
  );
}
