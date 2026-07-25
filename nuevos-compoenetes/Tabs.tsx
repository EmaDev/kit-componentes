"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, type ReactNode } from "react";

export type TabsVariant = "underline" | "pill" | "segmented" | "enclosed" | "vertical";
export type TabsSize = "sm" | "md" | "lg";

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

const SIZES: Record<TabsSize, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-[15px] gap-2",
};

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  /** los tabs se reparten todo el ancho */
  fitted?: boolean;
  /** scroll horizontal cuando no entran (con fades en los bordes) */
  scrollable?: boolean;
  /** paneles opcionales: se animan con crossfade al cambiar de tab */
  panels?: Record<string, ReactNode>;
  className?: string;
}

export function Tabs({
  items, value, onChange, variant = "underline", size = "md",
  fitted = false, scrollable = false, panels, className = "",
}: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const vertical = variant === "vertical";

  const move = (dir: 1 | -1) => {
    const enabled = items.filter((i) => !i.disabled);
    const idx = enabled.findIndex((i) => i.id === value);
    const next = enabled[(idx + dir + enabled.length) % enabled.length];
    if (next) onChange(next.id);
  };

  const list = (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={vertical ? "vertical" : "horizontal"}
      onKeyDown={(e) => {
        const prevKey = vertical ? "ArrowUp" : "ArrowLeft";
        const nextKey = vertical ? "ArrowDown" : "ArrowRight";
        if (e.key === nextKey) { e.preventDefault(); move(1); }
        if (e.key === prevKey) { e.preventDefault(); move(-1); }
      }}
      className={[
        "relative flex",
        vertical ? "flex-col gap-1 w-full" : "items-center",
        scrollable && !vertical ? "overflow-x-auto scrollbar-none" : "",
        variant === "underline" && !vertical ? "gap-1 border-b border-border" : "",
        variant === "pill" ? "gap-1.5" : "",
        variant === "segmented" ? "gap-1 p-1 rounded-xl bg-surface-alt border border-border" : "",
        variant === "enclosed" ? "gap-1 px-1 pt-1 rounded-t-xl bg-surface-alt border border-border border-b-0" : "",
      ].join(" ")}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={active}
            aria-controls={`panel-${item.id}`}
            disabled={item.disabled}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={[
              "relative inline-flex items-center justify-center font-medium whitespace-nowrap",
              "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
              SIZES[size],
              fitted && !vertical ? "flex-1" : "",
              vertical ? "justify-start w-full rounded-lg" : "",
              variant === "underline" ? "rounded-t-lg mb-px" : "",
              variant === "pill" ? "rounded-full" : "",
              variant === "segmented" ? "rounded-lg" : "",
              variant === "enclosed" ? "rounded-t-lg" : "",
              item.disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
              active ? "text-foreground" : "text-muted hover:text-foreground",
            ].join(" ")}
          >
            {active && (
              <motion.span
                layoutId={`tabs-ind-${variant}`}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                className={[
                  "absolute inset-0 -z-10",
                  variant === "underline" && !vertical
                    ? "border-b-2 border-primary rounded-none" : "",
                  variant === "pill" ? "rounded-full bg-primary/12" : "",
                  variant === "segmented" ? "rounded-lg bg-surface shadow-sm shadow-black/5" : "",
                  variant === "enclosed" ? "rounded-t-lg bg-surface border border-border border-b-surface" : "",
                  vertical ? "rounded-lg bg-primary/12" : "",
                ].join(" ")}
              />
            )}
            {item.icon && <span className={active ? "text-primary" : ""}>{item.icon}</span>}
            <span className={active && (variant === "pill" || vertical) ? "text-primary" : ""}>{item.label}</span>
            {item.badge != null && (
              <span className={[
                "ml-0.5 rounded-full px-1.5 min-w-[18px] h-[18px] inline-flex items-center justify-center",
                "text-[10px] font-bold tabular-nums",
                active ? "bg-primary text-white" : "bg-surface-alt text-muted border border-border",
              ].join(" ")}>
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const panel = panels && (
    <div className="relative min-w-0 flex-1">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={value}
          id={`panel-${value}`}
          role="tabpanel"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        >
          {panels[value]}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  if (vertical) {
    return (
      <div className={`flex gap-5 ${className}`}>
        <div className="w-48 shrink-0">{list}</div>
        {panel}
      </div>
    );
  }

  return (
    <div className={className}>
      {list}
      {panels && (
        <div className={variant === "enclosed"
          ? "rounded-b-xl border border-border border-t-0 p-5"
          : "pt-5"}>
          {panel}
        </div>
      )}
    </div>
  );
}
