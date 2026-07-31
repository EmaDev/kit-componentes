"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export interface MatchPair {
  id: string;
  term: string;
  definition: string;
}

interface MatchingPairsProps {
  pairs: MatchPair[];
  onComplete?: () => void;
  className?: string;
}

interface Tile { key: string; pairId: string; label: string; kind: "term" | "definition"; }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Juego de emparejar términos con definiciones: seleccionás dos tarjetas, si coinciden quedan fijas. */
export function MatchingPairs({ pairs, onComplete, className = "" }: MatchingPairsProps) {
  const tiles = useMemo<Tile[]>(() => shuffle([
    ...pairs.map(p => ({ key: `${p.id}-t`, pairId: p.id, label: p.term, kind: "term" as const })),
    ...pairs.map(p => ({ key: `${p.id}-d`, pairId: p.id, label: p.definition, kind: "definition" as const })),
  ]), [pairs]);

  const [selected, setSelected] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  const byKey = new Map(tiles.map(t => [t.key, t]));
  const done = matched.size === pairs.length;

  const pick = (key: string) => {
    if (selected.includes(key) || matched.has(byKey.get(key)!.pairId) || selected.length === 2) return;
    const next = [...selected, key];
    setSelected(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      const [a, b] = next.map(k => byKey.get(k)!);
      if (a.pairId === b.pairId && a.kind !== b.kind) {
        window.setTimeout(() => {
          setMatched(m => { const s = new Set(m); s.add(a.pairId); return s; });
          setSelected([]);
          if (matched.size + 1 === pairs.length) onComplete?.();
        }, 300);
      } else {
        setWrong(next);
        window.setTimeout(() => { setWrong([]); setSelected([]); }, 550);
      }
    }
  };

  const restart = () => { setSelected([]); setMatched(new Set()); setWrong([]); setMoves(0); };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-semibold text-foreground">{matched.size} / {pairs.length} emparejados</span>
        <span>{moves} intentos</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {tiles.map(t => {
          const isMatched = matched.has(t.pairId);
          const isSelected = selected.includes(t.key);
          const isWrong = wrong.includes(t.key);
          return (
            <motion.button
              key={t.key} type="button" onClick={() => pick(t.key)} disabled={isMatched}
              animate={isWrong ? { x: [0, -5, 5, -3, 0] } : {}}
              className={[
                "min-h-16 rounded-xl border px-3 py-2.5 text-sm font-medium text-left flex items-center transition-colors",
                isMatched ? "border-success/40 bg-success/8 text-success" :
                isWrong ? "border-danger bg-danger/10 text-danger" :
                isSelected ? "border-primary bg-primary/8 text-foreground" :
                "border-border bg-surface hover:border-primary/40 hover:bg-surface-alt/60 text-foreground",
              ].join(" ")}
            >
              {t.label}
            </motion.button>
          );
        })}
      </div>
      {done && (
        <div className="rounded-xl bg-success/10 text-success text-sm font-bold text-center py-3 flex items-center justify-center gap-3">
          ¡Completado en {moves} intentos!
          <button type="button" onClick={restart} className="text-xs font-bold underline underline-offset-2">Reintentar</button>
        </div>
      )}
    </div>
  );
}
