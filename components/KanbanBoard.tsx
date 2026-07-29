"use client";
import { useRef, useState } from "react";

export interface KanbanCard { id: string; title: string; description?: string; tag?: string; avatar?: string }
export interface KanbanColumn { id: string; title: string; cards: KanbanCard[]; limit?: number }

interface KanbanBoardProps {
  columns: KanbanColumn[];
  onChange?: (columns: KanbanColumn[]) => void;
  onCardClick?: (card: KanbanCard, columnId: string) => void;
  renderCard?: (card: KanbanCard) => React.ReactNode;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function moveCard(columns: KanbanColumn[], cardId: string, fromCol: string, toCol: string, toIndex: number): KanbanColumn[] {
  const from = columns.find(c => c.id === fromCol);
  const card = from?.cards.find(c => c.id === cardId);
  if (!card) return columns;
  return columns.map(col => {
    if (col.id === fromCol && col.id === toCol) {
      const without = col.cards.filter(c => c.id !== cardId);
      const clamped = Math.min(toIndex, without.length);
      return { ...col, cards: [...without.slice(0, clamped), card, ...without.slice(clamped)] };
    }
    if (col.id === fromCol) return { ...col, cards: col.cards.filter(c => c.id !== cardId) };
    if (col.id === toCol) {
      const clamped = Math.min(toIndex, col.cards.length);
      return { ...col, cards: [...col.cards.slice(0, clamped), card, ...col.cards.slice(clamped)] };
    }
    return col;
  });
}

/**
 * Tablero Kanban con drag & drop nativo: arrastrá tarjetas entre columnas o
 * reordená dentro de una misma columna. Sin dependencias externas.
 */
export function KanbanBoard({ columns, onChange, onCardClick, renderCard, className = "" }: KanbanBoardProps) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragFrom, setDragFrom] = useState<string | null>(null);
  const [over, setOver] = useState<{ col: string; index: number } | null>(null);
  const dragImg = useRef<HTMLDivElement>(null);

  const startDrag = (e: React.DragEvent, card: KanbanCard, colId: string) => {
    setDragId(card.id); setDragFrom(colId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", card.id);
  };

  const overCard = (e: React.DragEvent, colId: string, index: number) => {
    e.preventDefault();
    setOver({ col: colId, index });
  };

  const overColumnEnd = (e: React.DragEvent, colId: string, count: number) => {
    e.preventDefault();
    setOver({ col: colId, index: count });
  };

  const drop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragId && dragFrom && over) onChange?.(moveCard(columns, dragId, dragFrom, over.col, over.index));
    setDragId(null); setDragFrom(null); setOver(null);
  };

  const endDrag = () => { setDragId(null); setDragFrom(null); setOver(null); };

  return (
    <div className={cn("flex gap-4 overflow-x-auto pb-2", className)}>
      {columns.map(col => {
        const overHere = over?.col === col.id;
        const nearLimit = col.limit != null && col.cards.length >= col.limit;
        return (
          <div key={col.id} onDragOver={e => overColumnEnd(e, col.id, col.cards.length)} onDrop={drop}
            className="shrink-0 w-72 rounded-2xl border border-border bg-surface-alt/40 flex flex-col max-h-[560px]">
            <div className="shrink-0 flex items-center gap-2 px-3.5 py-3">
              <p className="text-sm font-bold text-foreground">{col.title}</p>
              <span className={cn("h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold inline-flex items-center justify-center", nearLimit ? "bg-danger/12 text-danger" : "bg-surface text-muted border border-border")}>
                {col.cards.length}{col.limit != null && `/${col.limit}`}
              </span>
            </div>

            <div className="flex-1 min-h-[40px] overflow-y-auto px-2.5 pb-2.5 space-y-2">
              {col.cards.map((card, i) => (
                <div key={card.id}>
                  {overHere && over?.index === i && dragId !== card.id && <div className="h-1 rounded-full bg-primary/60 mb-2"/>}
                  <div draggable onDragStart={e => startDrag(e, card, col.id)} onDragEnd={endDrag}
                    onDragOver={e => { e.stopPropagation(); overCard(e, col.id, i); }}
                    onClick={() => onCardClick?.(card, col.id)}
                    className={cn("rounded-xl border border-border bg-surface p-3 cursor-grab active:cursor-grabbing shadow-sm transition-opacity", dragId === card.id && "opacity-40")}>
                    {renderCard ? renderCard(card) : (
                      <>
                        {card.tag && <span className="inline-block mb-1.5 h-5 px-2 rounded-full bg-primary/10 text-primary text-[10px] font-bold">{card.tag}</span>}
                        <p className="text-[13px] font-semibold text-foreground leading-snug">{card.title}</p>
                        {card.description && <p className="mt-1 text-[12px] text-muted leading-relaxed">{card.description}</p>}
                        {card.avatar && (
                          <span className="mt-2 inline-flex w-6 h-6 rounded-full bg-gradient-to-br from-accent to-primary text-white text-[9px] font-bold items-center justify-center">{card.avatar}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              {overHere && over?.index === col.cards.length && <div className="h-1 rounded-full bg-primary/60"/>}
              {col.cards.length === 0 && !overHere && <p className="text-center text-[11px] text-muted/60 py-6">Sin tarjetas</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
