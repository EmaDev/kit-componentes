"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

export interface FlashcardItem {
  id: string;
  front: React.ReactNode;
  back: React.ReactNode;
  tag?: string;
}

export type FlashcardGrade = "again" | "hard" | "good" | "easy";

interface FlashcardDeckProps {
  cards: FlashcardItem[];
  /** se llama al calificar cada tarjeta (para repetición espaciada real, en el backend) */
  onGrade?: (id: string, grade: FlashcardGrade) => void;
  onComplete?: () => void;
  height?: number;
  className?: string;
}

const GRADES: { id: FlashcardGrade; label: string; tone: string }[] = [
  { id: "again", label: "De nuevo", tone: "danger" },
  { id: "hard", label: "Difícil", tone: "accent" },
  { id: "good", label: "Bien", tone: "primary" },
  { id: "easy", label: "Fácil", tone: "success" },
];

/** Mazo de flashcards: flip + calificación por tarjeta, con cola tipo repetición espaciada (again vuelve al final). */
export function FlashcardDeck({ cards, onGrade, onComplete, height = 260, className = "" }: FlashcardDeckProps) {
  const [queue, setQueue] = useState(() => cards.map(c => c.id));
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState<string[]>([]);

  const byId = useMemo(() => new Map(cards.map(c => [c.id, c])), [cards]);
  const currentId = queue[0];
  const current = currentId ? byId.get(currentId) : null;
  const total = cards.length;
  const finished = queue.length === 0;

  const grade = (g: FlashcardGrade) => {
    if (!currentId) return;
    onGrade?.(currentId, g);
    setFlipped(false);
    setQueue(q => {
      const rest = q.slice(1);
      if (g === "again") return [...rest, currentId];
      return rest;
    });
    if (g !== "again") setDone(d => (d.includes(currentId) ? d : [...d, currentId]));
    if (queue.length === 1 && g !== "again") onComplete?.();
  };

  const restart = () => { setQueue(cards.map(c => c.id)); setDone([]); setFlipped(false); };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-semibold text-foreground">{done.length} / {total} aprendidas</span>
        <span>{queue.length} en cola</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-alt overflow-hidden">
        <motion.div className="h-full bg-primary" animate={{ width: `${total ? (done.length / total) * 100 : 0}%` }} transition={{ type: "spring", stiffness: 120, damping: 24 }}/>
      </div>

      {finished ? (
        <div className="rounded-2xl border border-border bg-surface-alt/40 p-8 text-center space-y-3">
          <p className="text-2xl">🎉</p>
          <p className="text-base font-bold text-foreground">¡Mazo terminado!</p>
          <p className="text-sm text-muted">Repasaste las {total} tarjetas.</p>
          <button type="button" onClick={restart} className="mt-2 h-10 px-5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-hover active:scale-[0.98] transition-all">Repasar de nuevo</button>
        </div>
      ) : current ? (
        <>
          <div style={{ perspective: 1200 }}>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentId}
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                <button type="button" onClick={() => setFlipped(f => !f)} className="w-full text-left" style={{ perspective: 1200 }}>
                  <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: "spring", stiffness: 220, damping: 24 }} style={{ height, transformStyle: "preserve-3d", position: "relative" }}>
                    <div className="absolute inset-0 rounded-2xl border border-border bg-surface p-6 flex flex-col items-center justify-center text-center gap-3 shadow-sm" style={{ backfaceVisibility: "hidden" }}>
                      {current.tag && <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">{current.tag}</span>}
                      <p className="text-lg font-bold text-foreground leading-snug" style={{ textWrap: "pretty" }}>{current.front}</p>
                      <span className="mt-1 text-[11px] text-muted">Tocá para ver la respuesta</span>
                    </div>
                    <div className="absolute inset-0 rounded-2xl border border-primary/40 bg-primary/6 p-6 flex flex-col items-center justify-center text-center gap-3" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Respuesta</span>
                      <p className="text-base font-semibold text-foreground leading-relaxed" style={{ textWrap: "pretty" }}>{current.back}</p>
                    </div>
                  </motion.div>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {flipped ? (
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map(g => (
                <button key={g.id} type="button" onClick={() => grade(g.id)}
                  className="h-11 rounded-xl text-xs font-bold text-white active:scale-[0.97] transition-all"
                  style={{ background: `var(--color-${g.tone})` }}>
                  {g.label}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-center text-xs text-muted">Dala vuelta para calificar qué tan bien la sabías</p>
          )}
        </>
      ) : null}
    </div>
  );
}
