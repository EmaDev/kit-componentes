"use client";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useState } from "react";

export interface SwipeCard { id: string; title: string; subtitle?: string; image?: string }
interface SwipeableCardStackProps {
  cards: SwipeCard[];
  onSwipe?: (card: SwipeCard, dir: "left" | "right") => void;
  onEmpty?: () => void;
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function SwipeCardEl({ card, top, onSwipe }: { card: SwipeCard; top: boolean; onSwipe: (dir: "left" | "right") => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 120], [0, 1]);
  const nopeOpacity = useTransform(x, [-120, -20], [1, 0]);

  return (
    <motion.div drag={top ? "x" : false} style={{ x, rotate }} dragConstraints={{ left: 0, right: 0 }} dragElastic={1}
      onDragEnd={(_, info) => { if (info.offset.x > 100) onSwipe("right"); else if (info.offset.x < -100) onSwipe("left"); }}
      animate={{ scale: top ? 1 : 0.95, y: top ? 0 : 10 }}
      className="absolute inset-0 rounded-3xl border border-border bg-surface shadow-xl overflow-hidden cursor-grab active:cursor-grabbing select-none">
      {card.image
        ? <img src={card.image} alt="" className="absolute inset-0 w-full h-full object-cover"/>
        : <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary"/>}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
        <p className="text-lg font-bold">{card.title}</p>
        {card.subtitle && <p className="text-xs text-white/80 mt-0.5">{card.subtitle}</p>}
      </div>
      {top && (
        <>
          <motion.span style={{ opacity: likeOpacity }} className="absolute top-5 right-5 px-3 py-1 rounded-lg border-2 border-success text-success font-black text-lg -rotate-12">SÍ</motion.span>
          <motion.span style={{ opacity: nopeOpacity }} className="absolute top-5 left-5 px-3 py-1 rounded-lg border-2 border-danger text-danger font-black text-lg rotate-12">NO</motion.span>
        </>
      )}
    </motion.div>
  );
}

/** Pila de tarjetas deslizables (tipo Tinder): arrastre con física, para aprobar/descartar opciones. */
export function SwipeableCardStack({ cards: initial, onSwipe, onEmpty, className = "" }: SwipeableCardStackProps) {
  const [cards, setCards] = useState(initial);

  const swipe = (dir: "left" | "right") => {
    const [top, ...rest] = cards;
    if (!top) return;
    onSwipe?.(top, dir);
    setCards(rest);
    if (rest.length === 0) onEmpty?.();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative w-full max-w-xs mx-auto" style={{ height: 340 }}>
        <AnimatePresence>
          {cards.slice(0, 3).reverse().map((c, i, arr) => (
            <SwipeCardEl key={c.id} card={c} top={i === arr.length - 1} onSwipe={dir => swipe(dir)}/>
          ))}
        </AnimatePresence>
        {cards.length === 0 && <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-border grid place-items-center text-sm text-muted">No hay más tarjetas</div>}
      </div>
      {cards.length > 0 && (
        <div className="flex justify-center gap-4">
          <button type="button" onClick={() => swipe("left")} aria-label="Descartar" className="w-12 h-12 rounded-full border-2 border-danger text-danger inline-flex items-center justify-center hover:bg-danger/8 active:scale-90 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <button type="button" onClick={() => swipe("right")} aria-label="Aprobar" className="w-12 h-12 rounded-full border-2 border-success text-success inline-flex items-center justify-center hover:bg-success/8 active:scale-90 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}
