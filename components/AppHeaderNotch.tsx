"use client";

import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { motion } from "framer-motion";
import type { HeaderAction } from "./AppHeader";
import { ChevronLeftIcon } from "./HeaderIcons";

interface AppHeaderNotchProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** botón circular flotante en el hueco central (avatar, logo, acción principal) */
  center?: ReactNode;
  onCenterClick?: () => void;
  actions?: HeaderAction[];
  scrollRef?: RefObject<HTMLElement | null>;
  safeArea?: boolean;
  className?: string;
}

/**
 * Header con una muesca circular fija en el borde inferior que sostiene un
 * botón redondo flotante (perfil, logo, cámara…). El botón entra con un
 * rebote elástico al montar el header.
 */
export function AppHeaderNotch({
  title, subtitle, onBack, center, onCenterClick, actions = [], scrollRef, safeArea = true, className = "",
}: AppHeaderNotchProps) {
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
    <header
      className={["sticky top-0 z-40 relative bg-surface border-b border-border transition-shadow", scrolled ? "shadow-[0_6px_18px_-8px_rgb(0_0_0/0.2)]" : "", className].join(" ")}
      style={{
        ...(safeArea ? { paddingTop: "var(--sa-top, env(safe-area-inset-top, 0px))" } : {}),
        WebkitMaskImage: "radial-gradient(circle 26px at 50% 100%, transparent 98%, black 100%)",
        maskImage: "radial-gradient(circle 26px at 50% 100%, transparent 98%, black 100%)",
      }}
    >
      <div className="h-16 px-2 flex items-center gap-1">
        {onBack && (
          <button onClick={onBack} aria-label="Volver"
            className="shrink-0 w-10 h-10 rounded-xl inline-flex items-center justify-center text-foreground hover:bg-surface-alt active:scale-90 transition-all">
            <ChevronLeftIcon />
          </button>
        )}
        <div className="min-w-0 flex-1 px-1.5">
          <p className="text-[15px] font-semibold text-foreground truncate leading-tight">{title}</p>
          {subtitle && <p className="text-[11px] text-muted truncate leading-tight">{subtitle}</p>}
        </div>
        <div className="shrink-0 flex items-center gap-0.5 pr-10">
          {actions.map((a) => (
            <button key={a.id} onClick={a.onClick} disabled={a.disabled} aria-label={a.label}
              className={[
                "relative w-10 h-10 rounded-xl inline-flex items-center justify-center hover:bg-surface-alt active:scale-90 transition-all disabled:opacity-40",
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

      {center && (
        <motion.button
          onClick={onCenterClick}
          initial={{ scale: 0, y: 10 }}
          animate={{ scale: 1, y: 0 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 420, damping: 14 }}
          className="absolute left-1/2 -translate-x-1/2 -bottom-5 w-11 h-11 rounded-full bg-primary text-white shadow-lg shadow-primary/40 inline-flex items-center justify-center"
        >
          {center}
        </motion.button>
      )}
    </header>
  );
}
