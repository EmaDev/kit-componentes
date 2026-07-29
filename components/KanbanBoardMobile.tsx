"use client";
import { useRef, useState } from "react";
import type { KanbanCard, KanbanColumn } from "./KanbanBoard";

interface KanbanBoardMobileProps {
  columns: KanbanColumn[];
  onChange?: (columns: KanbanColumn[]) => void;
  onCardClick?: (card: KanbanCard, columnId: string) => void;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function reorderWithin(columns: KanbanColumn[], colId: string, from: number, to: number): KanbanColumn[] {
  return columns.map(col => {
    if (col.id !== colId) return col;
    const cards = [...col.cards];
    const [moved] = cards.splice(from, 1);
    cards.splice(Math.min(to, cards.length), 0, moved);
    return { ...col, cards };
  });
}
function moveAcross(columns: KanbanColumn[], cardId: string, fromCol: string, toCol: string): KanbanColumn[] {
  const from = columns.find(c => c.id === fromCol);
  const card = from?.cards.find(c => c.id === cardId);
  if (!card) return columns;
  return columns.map(col => {
    if (col.id === fromCol) return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
    if (col.id === toCol) return { ...col, cards: [...col.cards, card] };
    return col;
  });
}

/**
 * Kanban para pantallas táctiles: una columna a la vez (tabs con scroll),
 * reorden por arrastre vertical con pointer events (long-press) y traslado
 * entre columnas con una hoja de acciones — el drag-and-drop de escritorio
 * no es confiable en touch, así que se resuelve con dos gestos simples.
 */
export function KanbanBoardMobile({ columns, onChange, onCardClick, className = "" }: KanbanBoardMobileProps) {
  const [active, setActive] = useState(columns[0]?.id);
  const [moving, setMoving] = useState<{ card: KanbanCard; fromCol: string } | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragY, setDragY] = useState(0);
  const drag = useRef<{ startY: number; idx: number; h: number } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const col = columns.find(c => c.id === active) ?? columns[0];
  const cardH = 88;

  const pressStart = (e: React.PointerEvent, idx: number) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { startY: e.clientY, idx, h: cardH };
    setDragIdx(idx);
    setDragY(0);
  };
  const pressMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setDragY(e.clientY - drag.current.startY);
  };
  const pressEnd = () => {
    if (!drag.current || !col) return;
    const delta = Math.round(dragY / cardH);
    const to = Math.max(0, Math.min(col.cards.length - 1, drag.current.idx + delta));
    if (to !== drag.current.idx) onChange?.(reorderWithin(columns, col.id, drag.current.idx, to));
    drag.current = null; setDragIdx(null); setDragY(0);
  };

  const doMove = (toCol: string) => {
    if (moving) onChange?.(moveAcross(columns, moving.card.id, moving.fromCol, toCol));
    setMoving(null);
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div ref={tabsRef} className="shrink-0 flex gap-1.5 overflow-x-auto px-3 pt-3 pb-2 -mb-px">
        {columns.map(c => {
          const on = c.id === active;
          const nearLimit = c.limit != null && c.cards.length >= c.limit;
          return (
            <button key={c.id} type="button" onClick={() => setActive(c.id)}
              className={cn("shrink-0 h-9 px-3.5 rounded-full text-[13px] font-bold inline-flex items-center gap-1.5 transition-colors",
                on ? "bg-primary text-white" : "bg-surface-alt text-muted")}>
              {c.title}
              <span className={cn("h-4 min-w-4 px-1 rounded-full text-[10px] inline-flex items-center justify-center",
                on ? "bg-white/25" : nearLimit ? "bg-danger/15 text-danger" : "bg-surface text-muted")}>{c.cards.length}{c.limit != null && `/${c.limit}`}</span>
            </button>
          );
        })}
      </div>

      <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto px-3 pb-4 pt-1 space-y-2.5">
        {col?.cards.length === 0 && <p className="text-center text-[12px] text-muted/60 py-10">Sin tarjetas en «{col.title}»</p>}
        {col?.cards.map((card, i) => (
          <div key={card.id}
            className="relative rounded-2xl border border-border bg-surface p-3.5 shadow-sm"
            style={{
              transform: dragIdx === i ? `translateY(${dragY}px) scale(1.02)` : undefined,
              zIndex: dragIdx === i ? 20 : undefined,
              boxShadow: dragIdx === i ? "0 12px 24px rgba(0,0,0,0.14)" : undefined,
              transition: dragIdx === i ? "none" : "transform 160ms ease",
            }}>
            <div className="flex items-start gap-3">
              <button type="button" onPointerDown={e => pressStart(e, i)} onPointerMove={pressMove} onPointerUp={pressEnd} onPointerCancel={pressEnd}
                aria-label="Reordenar" className="shrink-0 w-9 h-9 -ml-1 rounded-lg text-muted/70 inline-flex items-center justify-center touch-none cursor-grab active:cursor-grabbing">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"/><circle cx="16" cy="6" r="1.6"/><circle cx="8" cy="12" r="1.6"/><circle cx="16" cy="12" r="1.6"/><circle cx="8" cy="18" r="1.6"/><circle cx="16" cy="18" r="1.6"/></svg>
              </button>
              <button type="button" onClick={() => onCardClick?.(card, col.id)} className="min-w-0 flex-1 text-left">
                {card.tag && <span className="inline-block mb-1 h-5 px-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold">{card.tag}</span>}
                <p className="text-[14px] font-semibold text-foreground leading-snug">{card.title}</p>
                {card.description && <p className="mt-0.5 text-[12px] text-muted leading-relaxed">{card.description}</p>}
              </button>
              <button type="button" onClick={() => setMoving({ card, fromCol: col.id })} aria-label="Mover a otra columna"
                className="shrink-0 w-9 h-9 rounded-lg text-primary bg-primary/8 inline-flex items-center justify-center active:scale-90 transition-transform">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {moving && (
        <div className="absolute inset-0 z-40 flex flex-col justify-end">
          <div onClick={() => setMoving(null)} className="absolute inset-0 bg-black/40"/>
          <div className="relative rounded-t-3xl bg-surface pb-4 pt-2.5 shadow-2xl">
            <span className="mx-auto block w-8 h-1 rounded-full bg-muted/40"/>
            <p className="px-5 pt-3 pb-1 text-[13px] font-bold text-muted">Mover «{moving.card.title}» a…</p>
            {columns.filter(c => c.id !== moving.fromCol).map(c => (
              <button key={c.id} type="button" onClick={() => doMove(c.id)}
                className="w-full h-14 px-5 flex items-center justify-between text-left active:bg-primary/8 transition-colors">
                <span className="text-[15px] font-semibold text-foreground">{c.title}</span>
                <span className="text-[11px] text-muted">{c.cards.length} tarjeta{c.cards.length === 1 ? "" : "s"}</span>
              </button>
            ))}
            <div className="px-5 pt-2">
              <button type="button" onClick={() => setMoving(null)} className="w-full h-10 rounded-full text-sm font-medium text-primary active:bg-primary/10 transition-colors">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
