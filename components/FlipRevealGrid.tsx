"use client";
import { useState } from "react";

export interface FlipItem { id: string; matchKey: string; front: React.ReactNode; label?: string }
interface FlipRevealGridProps {
  items: FlipItem[];
  columns?: number;
  memoryMode?: boolean;
  onMatch?: (a: FlipItem, b: FlipItem) => void;
  onComplete?: () => void;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Grilla de cartas que se dan vuelta en 3D — reveal simple o modo memoria (encontrar pares). */
export function FlipRevealGrid({ items, columns = 4, memoryMode = false, onMatch, onComplete, className = "" }: FlipRevealGridProps) {
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const click = (item: FlipItem) => {
    if (busy || flipped.includes(item.id) || matched.includes(item.id)) return;
    if (!memoryMode) { setFlipped(f => [...f, item.id]); return; }

    const next = [...flipped, item.id];
    setFlipped(next);
    if (next.length === 2) {
      setBusy(true);
      const [aId, bId] = next;
      const a = items.find(i => i.id === aId)!, b = items.find(i => i.id === bId)!;
      setTimeout(() => {
        if (a.matchKey === b.matchKey) {
          const newMatched = [...matched, aId, bId];
          setMatched(newMatched);
          onMatch?.(a, b);
          if (newMatched.length === items.length) onComplete?.();
        }
        setFlipped([]); setBusy(false);
      }, 700);
    }
  };

  return (
    <div className={cn("grid gap-3", className)} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}>
      {items.map(item => {
        const isFlipped = flipped.includes(item.id) || matched.includes(item.id);
        return (
          <button key={item.id} type="button" onClick={() => click(item)}
            className="relative aspect-[3/4] [perspective:800px]" disabled={matched.includes(item.id)}>
            <div className="absolute inset-0 rounded-xl transition-transform duration-500"
              style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)" }}>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center [backface-visibility:hidden]">
                <span className="w-6 h-6 rounded-full border-2 border-white/50"/>
              </div>
              <div className="absolute inset-0 rounded-xl border border-border bg-surface flex flex-col items-center justify-center gap-1 [backface-visibility:hidden]" style={{ transform: "rotateY(180deg)" }}>
                <div className="text-2xl">{item.front}</div>
                {item.label && <span className="text-[11px] font-semibold text-foreground">{item.label}</span>}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
