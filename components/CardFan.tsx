"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export interface FanCard { id: string; label: string; sublabel?: string; color?: string }
interface CardFanProps {
  cards: FanCard[];
  onPick?: (card: FanCard) => void;
  allowShuffle?: boolean;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Naipes en abanico: se despliegan al pasar el mouse/tocar, con shuffle y selección. */
export function CardFan({ cards: initial, onPick, allowShuffle = true, className = "" }: CardFanProps) {
  const [cards, setCards] = useState(initial);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const n = cards.length;
  const spread = Math.min(64, 360 / n);

  const pick = (c: FanCard) => { setPicked(c.id); onPick?.(c); };

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <div className="relative h-40 flex items-center justify-center" style={{ width: 220 }}
        onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
        onTouchStart={() => setOpen(o => !o)}>
        {cards.map((c, i) => {
          const rot = open ? (i - (n - 1) / 2) * (spread / (n > 1 ? n - 1 : 1)) : (i - (n - 1) / 2) * 2;
          const x = open ? (i - (n - 1) / 2) * 46 : (i - (n - 1) / 2) * 4;
          const y = open ? -Math.abs(i - (n - 1) / 2) * 6 : i * -0.5;
          return (
            <motion.button key={c.id} type="button" onClick={() => pick(c)}
              className="absolute w-20 h-28 rounded-xl border-2 border-white shadow-lg flex flex-col items-center justify-center text-white font-bold text-sm origin-bottom"
              style={{ background: c.color ?? "linear-gradient(135deg,#2563eb,#7c3aed)", zIndex: picked === c.id ? 50 : i }}
              animate={{ x, y, rotate: rot, scale: picked === c.id ? 1.15 : 1, opacity: picked && picked !== c.id ? 0.4 : 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}>
              <span>{c.label}</span>
              {c.sublabel && <span className="text-[10px] opacity-80 mt-0.5">{c.sublabel}</span>}
            </motion.button>
          );
        })}
      </div>
      {allowShuffle && (
        <button type="button" onClick={() => { setCards(shuffle(cards)); setPicked(null); }}
          className="h-9 px-4 rounded-full border border-border text-xs font-bold text-foreground hover:bg-surface-alt transition-colors">
          Mezclar
        </button>
      )}
    </div>
  );
}
