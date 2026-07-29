"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, type ReactNode } from "react";
import type { TabItem } from "./Tabs";

export type TabsCarouselSize = "sm" | "md" | "lg";

const SIZES: Record<TabsCarouselSize, string> = {
  sm: "h-8 text-[13px]",
  md: "h-10 text-sm",
  lg: "h-11 text-[15px]",
};

interface TabsCarouselProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  size?: TabsCarouselSize;
  /** paneles opcionales: el contenido se desliza en la dirección del cambio, como un carrusel */
  panels?: Record<string, ReactNode>;
  className?: string;
}

/**
 * Tabs minimalistas con una línea corta centrada que crece con spring bajo el tab
 * activo, y paneles que se deslizan horizontalmente según hacia dónde se navega.
 */
export function TabsCarousel({
  items, value, onChange, size = "md", panels, className = "",
}: TabsCarouselProps) {
  const prevIndex = useRef(items.findIndex((i) => i.id === value));
  const idx = items.findIndex((i) => i.id === value);
  const dir = idx > prevIndex.current ? 1 : idx < prevIndex.current ? -1 : 0;
  prevIndex.current = idx;

  const move = (d: 1 | -1) => {
    const enabled = items.filter((i) => !i.disabled);
    const curIdx = enabled.findIndex((i) => i.id === value);
    const next = enabled[(curIdx + d + enabled.length) % enabled.length];
    if (next) onChange(next.id);
  };

  return (
    <div className={className}>
      <div
        role="tablist"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
        }}
        className="relative flex items-center gap-6 border-b border-border"
      >
        {items.map((item) => {
          const active = item.id === value;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={active}
              disabled={item.disabled}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(item.id)}
              className={[
                "relative inline-flex items-center gap-1.5 font-semibold whitespace-nowrap outline-none pb-3",
                SIZES[size],
                item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                active ? "text-foreground" : "text-muted hover:text-foreground",
              ].join(" ")}
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge != null && (
                <span className={[
                  "rounded-full px-1.5 min-w-[18px] h-[18px] inline-flex items-center justify-center text-[10px] font-bold tabular-nums",
                  active ? "bg-primary text-white" : "bg-surface-alt text-muted border border-border",
                ].join(" ")}>
                  {item.badge}
                </span>
              )}
              {active && (
                <motion.span
                  layoutId="tabs-carousel-line"
                  transition={{ type: "spring", stiffness: 480, damping: 32 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-0 h-[3px] w-8 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}
      </div>

      {panels && (
        <div className="relative pt-5 min-w-0 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={value}
              initial={{ opacity: 0, x: dir * 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -28 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            >
              {panels[value]}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
