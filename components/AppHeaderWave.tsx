"use client";

import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeaderAction } from "./AppHeader";
import { ChevronLeftIcon } from "./HeaderIcons";

interface AppHeaderWaveProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: HeaderAction[];
  children?: ReactNode;
  scrollRef?: RefObject<HTMLElement | null>;
  safeArea?: boolean;
  className?: string;
}

/**
 * Header hero con degradado y una forma fija de esquina inferior muy redondeada
 * ("wave"). El título grande se contrae hacia una barra chica fija al scrollear.
 */
export function AppHeaderWave({
  title, subtitle, onBack, actions = [], children, scrollRef, safeArea = true, className = "",
}: AppHeaderWaveProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const target: HTMLElement | Window = scrollRef?.current ?? window;
    const read = () => (scrollRef?.current ? scrollRef.current.scrollTop : window.scrollY);
    const onScroll = () => setCollapsed(read() > 60);
    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  return (
    <header
      className={["sticky top-0 z-40 rounded-b-[32px] bg-gradient-to-br from-primary to-accent text-white overflow-hidden", className].join(" ")}
      style={safeArea ? { paddingTop: "var(--sa-top, env(safe-area-inset-top, 0px))" } : undefined}
    >
      <div className="h-14 px-3 flex items-center gap-1">
        {onBack && (
          <button onClick={onBack} aria-label="Volver"
            className="shrink-0 w-10 h-10 rounded-full inline-flex items-center justify-center hover:bg-white/15 active:scale-90 transition-all">
            <ChevronLeftIcon />
          </button>
        )}
        <AnimatePresence initial={false}>
          {collapsed && (
            <motion.p key="small" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
              className="flex-1 min-w-0 px-1 text-[16px] font-bold truncate">
              {title}
            </motion.p>
          )}
        </AnimatePresence>
        <div className="flex-1" />
        <div className="shrink-0 flex items-center gap-0.5">
          {actions.map((a) => (
            <button key={a.id} onClick={a.onClick} disabled={a.disabled} aria-label={a.label}
              className="relative w-10 h-10 rounded-full inline-flex items-center justify-center hover:bg-white/15 active:scale-90 transition-all disabled:opacity-40">
              {a.icon}
              {a.badge !== undefined && a.badge !== false && (
                <span className={[
                  "absolute rounded-full bg-white text-primary font-bold flex items-center justify-center ring-2 ring-primary/60",
                  typeof a.badge === "number" ? "top-0.5 right-0 min-w-4 h-4 px-1 text-[9px]" : "top-1.5 right-1.5 w-2 h-2",
                ].join(" ")}>
                  {typeof a.badge === "number" ? (a.badge > 99 ? "99+" : a.badge) : null}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="overflow-hidden px-5"
          >
            <h1 className="text-[26px] font-bold tracking-tight leading-tight pb-1">{title}</h1>
            {subtitle && <p className="text-[13px] text-white/80 pb-4">{subtitle}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {children && <div className="px-4 pb-4">{children}</div>}
    </header>
  );
}
