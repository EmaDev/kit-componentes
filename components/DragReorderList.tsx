"use client";
import { Reorder } from "framer-motion";
import { useState } from "react";

export interface ReorderItem { id: string; label: string; sublabel?: string }
interface DragReorderListProps { items: ReorderItem[]; onChange?: (items: ReorderItem[]) => void; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Lista simple con reorden por arrastre y asentamiento con física (playlist, favoritos). */
export function DragReorderList({ items: initial, onChange, className = "" }: DragReorderListProps) {
  const [items, setItems] = useState(initial);
  const update = (next: ReorderItem[]) => { setItems(next); onChange?.(next); };

  return (
    <Reorder.Group axis="y" values={items} onReorder={update} className={cn("space-y-2", className)}>
      {items.map(item => (
        <Reorder.Item key={item.id} value={item} whileDrag={{ scale: 1.03, boxShadow: "0 12px 24px rgba(0,0,0,0.14)", zIndex: 10 }}
          className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 cursor-grab active:cursor-grabbing">
          <span className="text-muted/60 shrink-0">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="6" r="1.6"/><circle cx="16" cy="6" r="1.6"/><circle cx="8" cy="12" r="1.6"/><circle cx="16" cy="12" r="1.6"/><circle cx="8" cy="18" r="1.6"/><circle cx="16" cy="18" r="1.6"/></svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold text-foreground">{item.label}</span>
            {item.sublabel && <span className="block text-xs text-muted">{item.sublabel}</span>}
          </span>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
