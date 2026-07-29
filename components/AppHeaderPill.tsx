"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion } from "framer-motion";
import type { HeaderAction } from "./AppHeader";
import { SearchIcon } from "./HeaderIcons";

interface AppHeaderPillProps {
  title: string;
  leading?: ReactNode;
  actions?: HeaderAction[];
  searchPlaceholder?: string;
  onSearch?: (q: string) => void;
  scrollRef?: RefObject<HTMLElement | null>;
  safeArea?: boolean;
  className?: string;
}

/**
 * Header minimalista de dos filas con forma fija: barra chica arriba y, siempre
 * visible debajo, una píldora de búsqueda que se estira con spring al enfocarse.
 */
export function AppHeaderPill({
  title, leading, actions = [], searchPlaceholder = "Buscar…", onSearch, scrollRef, safeArea = true, className = "",
}: AppHeaderPillProps) {
  const [scrolled, setScrolled] = useState(false);
  const [focused, setFocused] = useState(false);
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

  return (
    <header
      className={[
        "sticky top-0 z-40 rounded-b-[24px] transition-colors duration-200",
        scrolled ? "bg-surface/90 backdrop-blur-xl border-b border-border" : "bg-surface border-b border-transparent",
        className,
      ].join(" ")}
      style={safeArea ? { paddingTop: "var(--sa-top, env(safe-area-inset-top, 0px))" } : undefined}
    >
      <div className="h-11 px-3.5 flex items-center gap-2">
        {leading}
        <p className="flex-1 min-w-0 text-[13px] font-semibold text-muted truncate">{title}</p>
        <div className="shrink-0 flex items-center gap-0.5">
          {actions.map((a) => (
            <button key={a.id} onClick={a.onClick} disabled={a.disabled} aria-label={a.label}
              className={[
                "relative w-8 h-8 rounded-full inline-flex items-center justify-center hover:bg-surface-alt active:scale-90 transition-all disabled:opacity-40",
                a.tone === "primary" ? "text-primary" : a.tone === "danger" ? "text-danger" : "text-foreground",
              ].join(" ")}>
              {a.icon}
              {a.badge !== undefined && a.badge !== false && (
                <span className={[
                  "absolute rounded-full bg-danger text-white font-bold flex items-center justify-center ring-2 ring-surface",
                  typeof a.badge === "number" ? "top-0 right-0 min-w-3.5 h-3.5 px-0.5 text-[8px]" : "top-1 right-1 w-1.5 h-1.5",
                ].join(" ")}>
                  {typeof a.badge === "number" ? (a.badge > 99 ? "99+" : a.badge) : null}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-3.5 pb-3">
        <motion.div
          onClick={() => inputRef.current?.focus()}
          animate={{ scale: focused ? 1.015 : 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className={[
            "flex items-center gap-2 h-10 rounded-full px-3.5 border cursor-text",
            focused ? "border-primary bg-surface shadow-[0_0_0_3px_rgb(var(--color-primary-rgb)/0.14)]" : "border-border bg-surface-alt",
          ].join(" ")}
        >
          <span className="text-muted"><SearchIcon /></span>
          <input
            ref={inputRef}
            value={query}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => { setQuery(e.target.value); onSearch?.(e.target.value); }}
            placeholder={searchPlaceholder}
            className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted outline-none"
          />
        </motion.div>
      </div>
    </header>
  );
}
