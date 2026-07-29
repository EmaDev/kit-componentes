"use client";

import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { motion } from "framer-motion";
import type { HeaderAction } from "./AppHeader";
import { ChevronLeftIcon } from "./HeaderIcons";

interface AppHeaderCardProps {
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
 * Header como tarjeta flotante: forma fija (rounded-3xl) separada de los bordes
 * por un margen constante; la sombra gana elevación al scrollear, como si la
 * tarjeta "se levantara" sobre el contenido.
 */
export function AppHeaderCard({
  title, subtitle, onBack, actions = [], children, scrollRef, safeArea = true, className = "",
}: AppHeaderCardProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const target: HTMLElement | Window = scrollRef?.current ?? window;
    const read = () => (scrollRef?.current ? scrollRef.current.scrollTop : window.scrollY);
    const onScroll = () => setScrolled(read() > 4);
    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  return (
    <div
      className={["sticky top-0 z-40 px-3 pt-3 pb-1", className].join(" ")}
      style={safeArea ? { paddingTop: "calc(var(--sa-top, env(safe-area-inset-top, 0px)) + 12px)" } : undefined}
    >
      <motion.div
        className="rounded-3xl border border-border bg-surface overflow-hidden"
        animate={{
          boxShadow: scrolled ? "0 18px 40px -12px rgb(0 0 0 / 0.28)" : "0 2px 8px -2px rgb(0 0 0 / 0.08)",
          y: scrolled ? -1 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <div className="h-14 px-2 flex items-center gap-1">
          {onBack && (
            <button onClick={onBack} aria-label="Volver"
              className="shrink-0 w-10 h-10 rounded-2xl inline-flex items-center justify-center text-foreground hover:bg-surface-alt active:scale-90 transition-all">
              <ChevronLeftIcon />
            </button>
          )}
          <div className="min-w-0 flex-1 px-1.5">
            <p className="text-[15px] font-semibold text-foreground truncate leading-tight">{title}</p>
            {subtitle && <p className="text-[11px] text-muted truncate leading-tight">{subtitle}</p>}
          </div>
          <div className="shrink-0 flex items-center gap-0.5 pr-1">
            {actions.map((a) => (
              <button key={a.id} onClick={a.onClick} disabled={a.disabled} aria-label={a.label}
                className={[
                  "relative w-10 h-10 rounded-2xl inline-flex items-center justify-center hover:bg-surface-alt active:scale-90 transition-all disabled:opacity-40",
                  a.tone === "primary" ? "text-primary" : a.tone === "danger" ? "text-danger" : "text-foreground",
                ].join(" ")}>
                {a.icon}
                {a.badge !== undefined && a.badge !== false && (
                  <span className={[
                    "absolute rounded-full bg-danger text-white font-bold flex items-center justify-center ring-2 ring-surface",
                    typeof a.badge === "number" ? "top-0.5 right-0 min-w-4 h-4 px-1 text-[9px]" : "top-1.5 right-1.5 w-2 h-2",
                  ].join(" ")}>
                    {typeof a.badge === "number" ? (a.badge > 99 ? "99+" : a.badge) : null}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        {children && <div className="px-3 pb-3">{children}</div>}
      </motion.div>
    </div>
  );
}
