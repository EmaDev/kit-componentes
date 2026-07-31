"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface FlashcardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  /** tag chico arriba, ej. "Vocabulario" */
  tag?: string;
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  height?: number;
  className?: string;
}

/** Tarjeta de memorización: click o tecla para dar vuelta entre pregunta y respuesta. */
export function Flashcard({ front, back, tag, flipped, onFlip, height = 240, className = "" }: FlashcardProps) {
  const [local, setLocal] = useState(false);
  const isFlipped = flipped ?? local;
  const toggle = () => { const next = !isFlipped; setLocal(next); onFlip?.(next); };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isFlipped}
      className={`w-full text-left ${className}`}
      style={{ perspective: 1200 }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        style={{ height, transformStyle: "preserve-3d", position: "relative" }}
      >
        <div
          className="absolute inset-0 rounded-2xl border border-border bg-surface p-6 flex flex-col items-center justify-center text-center gap-3 shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          {tag && <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">{tag}</span>}
          <p className="text-lg font-bold text-foreground leading-snug" style={{ textWrap: "pretty" }}>{front}</p>
          <span className="mt-1 text-[11px] text-muted">Tocá para ver la respuesta</span>
        </div>
        <div
          className="absolute inset-0 rounded-2xl border border-primary/40 bg-primary/6 p-6 flex flex-col items-center justify-center text-center gap-3"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">Respuesta</span>
          <p className="text-base font-semibold text-foreground leading-relaxed" style={{ textWrap: "pretty" }}>{back}</p>
        </div>
      </motion.div>
    </button>
  );
}
