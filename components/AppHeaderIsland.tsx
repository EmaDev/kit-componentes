"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeaderAction } from "./AppHeader";
import { ChevronLeftIcon, SearchIcon } from "./HeaderIcons";

interface AppHeaderIslandProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  leading?: ReactNode;
  actions?: HeaderAction[];
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (q: string) => void;
  children?: ReactNode;
  scrollRef?: RefObject<HTMLElement | null>;
  safeArea?: boolean;
  className?: string;
}

/**
 * Cápsula flotante desprendida de los bordes (tipo "dynamic island"): forma fija
 * redondeada por completo que se encoge un poco y suma blur al scrollear.
 */
export function AppHeaderIsland({
  title, subtitle, onBack, leading, actions = [], searchable = false,
  searchPlaceholder = "Buscar…", onSearch, children, scrollRef, safeArea = true, className = "",
}: AppHeaderIslandProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const target: HTMLElement | Window = scrollRef?.current ?? window;
    const read = () => (scrollRef?.current ? scrollRef.current.scrollTop : window.scrollY);
    const onScroll = () => setScrolled(read() > 4);
    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  useEffect(() => { if (searching) inputRef.current?.focus(); }, [searching]);

  return (
    <div
      className={["sticky top-0 z-40 px-3 pt-3", className].join(" ")}
      style={safeArea ? { paddingTop: "calc(var(--sa-top, env(safe-area-inset-top, 0px)) + 12px)" } : undefined}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className={[
          "mx-auto flex items-center gap-1 rounded-full border border-border bg-surface/90 backdrop-blur-xl px-2",
          "shadow-[0_8px_24px_-6px_rgb(0_0_0/0.16)]",
        ].join(" ")}
        animate={{ height: scrolled ? 48 : 56, boxShadow: scrolled ? "0 10px 28px -6px rgb(0 0 0 / 0.22)" : "0 8px 24px -6px rgb(0 0 0 / 0.16)" }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {searching ? (
            <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex items-center gap-2 px-2">
              <span className="text-muted"><SearchIcon /></span>
              <input ref={inputRef} value={query} autoFocus
                onChange={(e) => { setQuery(e.target.value); onSearch?.(e.target.value); }}
                onKeyDown={(e) => e.key === "Escape" && setSearching(false)}
                placeholder={searchPlaceholder}
                className="flex-1 h-9 bg-transparent text-[14px] text-foreground placeholder:text-muted outline-none" />
              <button onClick={() => { setSearching(false); setQuery(""); onSearch?.(""); }}
                className="h-8 px-3 rounded-full text-[12px] font-semibold text-primary hover:bg-primary/10 active:scale-95 transition-all">
                Cancelar
              </button>
            </motion.div>
          ) : (
            <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 min-w-0 flex items-center gap-1">
              {onBack ? (
                <button onClick={onBack} aria-label="Volver"
                  className="shrink-0 w-9 h-9 rounded-full inline-flex items-center justify-center text-foreground hover:bg-surface-alt active:scale-90 transition-all">
                  <ChevronLeftIcon />
                </button>
              ) : leading && <div className="shrink-0 pl-2">{leading}</div>}
              <div className="min-w-0 flex-1 px-1.5">
                <p className="text-[14px] font-semibold text-foreground truncate leading-tight">{title}</p>
                {subtitle && <p className="text-[10px] text-muted truncate leading-tight">{subtitle}</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!searching && (
          <div className="shrink-0 flex items-center gap-0.5 pr-1">
            {searchable && (
              <button onClick={() => setSearching(true)} aria-label="Buscar"
                className="w-9 h-9 rounded-full inline-flex items-center justify-center text-foreground hover:bg-surface-alt active:scale-90 transition-all">
                <SearchIcon />
              </button>
            )}
            {actions.map((a) => (
              <button key={a.id} onClick={a.onClick} disabled={a.disabled} aria-label={a.label}
                className={[
                  "relative w-9 h-9 rounded-full inline-flex items-center justify-center hover:bg-surface-alt active:scale-90 transition-all disabled:opacity-40",
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
        )}
      </motion.div>

      {children && <div className="mt-2 mx-auto">{children}</div>}
    </div>
  );
}
