"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";
import type { TabItem } from "./Tabs";

interface TabsDockProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** paneles opcionales: entran con un pequeño salto (spring) */
  panels?: Record<string, ReactNode>;
  className?: string;
}

/**
 * Tabs estilo dock: iconos que se agrandan con un rebote elástico al activarse
 * (y un poco más al pasar el mouse), con un punto que aparece debajo del activo.
 * Pensado para navegación con icono + etiqueta corta (ej. bottom nav de escritorio).
 */
export function TabsDock({ items, value, onChange, panels, className = "" }: TabsDockProps) {
  const move = (d: 1 | -1) => {
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.id === value);
    const next = enabled[(idx + d + enabled.length) % enabled.length];
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
        className="inline-flex items-end gap-1 p-2 rounded-2xl bg-surface-alt border border-border"
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
              title={item.label}
              onClick={() => onChange(item.id)}
              className={[
                "relative flex flex-col items-center gap-1.5 rounded-xl px-3.5 py-2 outline-none",
                item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            >
              <motion.span
                animate={{ scale: active ? 1.22 : 1, y: active ? -3 : 0 }}
                whileHover={!item.disabled ? { scale: active ? 1.3 : 1.12, y: -4 } : undefined}
                whileTap={!item.disabled ? { scale: 0.9 } : undefined}
                transition={{ type: "spring", stiffness: 500, damping: 16 }}
                className={["flex items-center justify-center w-6 h-6", active ? "text-primary" : "text-muted"].join(" ")}
              >
                {item.icon}
              </motion.span>
              <span className={["text-[10px] font-semibold tracking-wide", active ? "text-foreground" : "text-muted"].join(" ")}>
                {item.label}
              </span>
              {item.badge != null && (
                <span className="absolute -top-0.5 right-1.5 rounded-full bg-danger text-white text-[9px] font-bold min-w-[15px] h-[15px] px-1 inline-flex items-center justify-center">
                  {item.badge}
                </span>
              )}
              <AnimatePresence>
                {active && (
                  <motion.span
                    layoutId="tabs-dock-dot"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-primary"
                  />
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      {panels && (
        <div className="relative pt-5 min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
            >
              {panels[value]}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
