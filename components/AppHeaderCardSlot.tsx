"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { HeaderAction } from "./AppHeader";

interface AppHeaderCardSlotProps {
  /** botón superior izquierdo (grilla/menú por defecto) */
  leading?: ReactNode;
  onLeadingClick?: () => void;
  actions?: HeaderAction[];
  /** contenido de la card flotante; si no se pasa, queda vacía */
  card?: ReactNode;
  cardMinHeight?: number;
  safeArea?: boolean;
  className?: string;
}

/**
 * Header hero con degradado violeta y esquinas inferiores muy redondeadas.
 * Una card flotante (vacía por defecto) queda centrada, mitad dentro y mitad
 * fuera del header, con sombra propia — lista para que el consumidor la llene.
 */
export function AppHeaderCardSlot({
  leading, onLeadingClick, actions = [], card, cardMinHeight = 96, safeArea = true, className = "",
}: AppHeaderCardSlotProps) {
  return (
    <header
      className={["relative z-10 rounded-b-[36px] bg-gradient-to-br from-[#6d5bf0] to-[#4b3fce] text-white overflow-visible", className].join(" ")}
      style={safeArea ? { paddingTop: "var(--sa-top, env(safe-area-inset-top, 0px))" } : undefined}
    >
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="h-14 px-4 flex items-center justify-between"
      >
        <button
          onClick={onLeadingClick}
          aria-label="Menú"
          className="w-9 h-9 rounded-xl bg-white/15 inline-flex items-center justify-center hover:bg-white/25 active:scale-90 transition-all"
        >
          {leading ?? <GridIcon />}
        </button>

        <div className="flex items-center gap-2">
          {actions.map((a) => (
            <button
              key={a.id}
              onClick={a.onClick}
              disabled={a.disabled}
              aria-label={a.label}
              className="relative w-9 h-9 rounded-xl inline-flex items-center justify-center hover:bg-white/15 active:scale-90 transition-all disabled:opacity-40"
            >
              {a.icon}
              {a.badge !== undefined && a.badge !== false && (
                <span
                  className={[
                    "absolute rounded-full bg-white text-[#4b3fce] font-bold flex items-center justify-center ring-2 ring-[#4b3fce]/50",
                    typeof a.badge === "number" ? "top-0 right-0 min-w-4 h-4 px-1 text-[9px]" : "top-1.5 right-1.5 w-2 h-2",
                  ].join(" ")}
                >
                  {typeof a.badge === "number" ? (a.badge > 99 ? "99+" : a.badge) : null}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="px-4 pb-0" style={{ transform: `translateY(${cardMinHeight / 2}px)` }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 22, delay: 0.08 }}
          className="rounded-2xl bg-surface border border-border shadow-[0_18px_36px_-10px_rgb(0_0_0/0.28)]"
          style={{ minHeight: cardMinHeight }}
        >
          {card}
        </motion.div>
      </div>

      <div style={{ height: cardMinHeight / 2 }} />
    </header>
  );
}

function GridIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
