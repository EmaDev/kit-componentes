"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import type { TabItem } from "./Tabs";

export type TabsGlowSize = "sm" | "md" | "lg";

const SIZES: Record<TabsGlowSize, string> = {
  sm: "h-8 px-3.5 text-[13px] gap-1.5",
  md: "h-10 px-4.5 text-sm gap-2",
  lg: "h-12 px-5 text-[15px] gap-2",
};

interface TabsGlowProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  size?: TabsGlowSize;
  /** paneles opcionales: crossfade + escala sutil al cambiar */
  panels?: Record<string, ReactNode>;
  className?: string;
}

/**
 * Tabs con pastilla flotante que se estira/comprime con overshoot elástico
 * (efecto "líquido") y un resplandor de color primario alrededor del tab activo.
 */
export function TabsGlow({
  items, value, onChange, size = "md", panels, className = "",
}: TabsGlowProps) {
  const move = (dir: 1 | -1) => {
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.id === value);
    const next = enabled[(idx + dir + enabled.length) % enabled.length];
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
        className="relative inline-flex items-center gap-1 p-1.5 rounded-full bg-surface-alt border border-border"
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
                "relative z-10 inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap outline-none transition-colors",
                SIZES[size],
                item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
                active ? "text-white" : "text-muted hover:text-foreground",
              ].join(" ")}
            >
              {active && (
                <motion.span
                  layoutId="tabs-glow-pill"
                  transition={{ type: "spring", stiffness: 340, damping: 22, mass: 0.9 }}
                  className="absolute inset-0 -z-10 rounded-full bg-primary shadow-[0_6px_20px_-4px_rgb(var(--color-primary-rgb)/0.55)]"
                />
              )}
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge != null && (
                <span className={[
                  "ml-0.5 rounded-full px-1.5 min-w-[18px] h-[18px] inline-flex items-center justify-center",
                  "text-[10px] font-bold tabular-nums",
                  active ? "bg-white/25 text-white" : "bg-surface text-muted border border-border",
                ].join(" ")}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {panels && (
        <div className="relative pt-5 min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={value}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {panels[value]}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
