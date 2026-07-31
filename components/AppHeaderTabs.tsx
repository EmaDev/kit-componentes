"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HeaderAction } from "./AppHeader";
import { ChevronLeftIcon } from "./HeaderIcons";

export interface AppHeaderTab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface AppHeaderTabsProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  leading?: ReactNode;
  actions?: HeaderAction[];
  tabs: AppHeaderTab[];
  value?: string;
  onChange?: (id: string) => void;
  /** subrayado deslizante o pastilla */
  tabVariant?: "underline" | "pill";
  /** contenido por tab, renderizado debajo con transición */
  panels?: Record<string, ReactNode>;
  variant?: "solid" | "blur" | "transparent";
  scrollRef?: RefObject<HTMLElement | null>;
  safeArea?: boolean;
  sticky?: boolean;
  className?: string;
}

/**
 * AppHeader con una fila de tabs scrolables horizontalmente, inspirada en <HeroTabs>:
 * degradados en los bordes sólo cuando queda contenido fuera de vista, el tab activo
 * siempre se lleva a la vista, y las variantes underline/pill comparten el mismo track.
 * A diferencia de <AppHeader children>, los tabs son de primera clase (value/onChange/panels).
 */
export function AppHeaderTabs({
  title, subtitle, onBack, backLabel, leading, actions = [],
  tabs, value, onChange, tabVariant = "underline", panels,
  variant = "blur", scrollRef, safeArea = true, sticky = true, className = "",
}: AppHeaderTabsProps) {
  const [scrolled, setScrolled] = useState(false);
  const [inner, setInner] = useState(tabs[0]?.id);
  const active = value ?? inner;
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const target: HTMLElement | Window = scrollRef?.current ?? window;
    const read = () => (scrollRef?.current ? scrollRef.current.scrollTop : window.scrollY);
    const onScroll = () => setScrolled(read() > 4);
    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  const readEdges = () => {
    const el = track.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  };

  useEffect(() => {
    readEdges();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(readEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [tabs.length]);

  useEffect(() => {
    const el = track.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    const box = track.current;
    if (!el || !box) return;
    const l = el.offsetLeft, r = l + el.offsetWidth;
    if (l < box.scrollLeft + 12) box.scrollTo({ left: Math.max(0, l - 16), behavior: "smooth" });
    else if (r > box.scrollLeft + box.clientWidth - 12) box.scrollTo({ left: r - box.clientWidth + 16, behavior: "smooth" });
  }, [active]);

  const select = (id: string) => { setInner(id); onChange?.(id); };

  const bg =
    variant === "solid" ? "bg-surface"
      : variant === "blur" ? (scrolled ? "bg-surface/85 backdrop-blur-xl" : "bg-surface")
      : scrolled ? "bg-surface/85 backdrop-blur-xl" : "bg-transparent";

  return (
    <header
      className={[
        sticky ? "sticky top-0" : "relative", "z-40 transition-colors duration-200", bg,
        scrolled || variant === "solid" ? "border-b border-border" : "border-b border-transparent",
        className,
      ].join(" ")}
      style={safeArea ? { paddingTop: "var(--sa-top, env(safe-area-inset-top, 0px))" } : undefined}
    >
      <div className="h-14 px-2 flex items-center gap-1">
        {onBack ? (
          <button onClick={onBack} aria-label={backLabel ?? "Volver"}
            className="shrink-0 h-10 min-w-10 -ml-0.5 px-2 rounded-xl inline-flex items-center gap-0.5 text-foreground hover:bg-surface-alt active:scale-90 transition-all">
            <ChevronLeftIcon />
            {backLabel && <span className="text-[15px] font-medium pr-1">{backLabel}</span>}
          </button>
        ) : leading && <div className="shrink-0 pl-1.5 pr-0.5">{leading}</div>}

        <div className="min-w-0 flex-1 px-1.5">
          <p className="text-[15px] font-semibold text-foreground truncate leading-tight">{title}</p>
          {subtitle && <p className="text-[11px] text-muted truncate leading-tight">{subtitle}</p>}
        </div>

        {actions.length > 0 && (
          <div className="shrink-0 flex items-center gap-0.5 pr-0.5">
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
                    typeof a.badge === "number" ? "top-1 right-0.5 min-w-4 h-4 px-1 text-[10px]" : "top-2 right-2 w-2 h-2",
                  ].join(" ")}>
                    {typeof a.badge === "number" ? (a.badge > 99 ? "99+" : a.badge) : null}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <div ref={track} onScroll={readEdges}
          className="flex overflow-x-auto px-2"
          style={{ scrollbarWidth: "none", gap: tabVariant === "pill" ? 8 : 20, scrollSnapType: "x proximity" }}
          role="tablist" aria-orientation="horizontal"
        >
          {tabs.map((t) => {
            const on = t.id === active;
            if (tabVariant === "pill") {
              return (
                <button key={t.id} data-tab={t.id} role="tab" aria-selected={on} onClick={() => select(t.id)}
                  className={[
                    "my-2 inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold transition-all active:scale-[0.96]",
                    on ? "border-primary bg-primary text-white shadow-sm shadow-primary/30" : "border-border bg-surface-alt/60 text-muted hover:text-foreground",
                  ].join(" ")}
                  style={{ scrollSnapAlign: "start" }}
                >
                  {t.icon && <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{t.icon}</span>}
                  {t.label}
                  {t.count != null && <span className={`rounded-full px-1.5 text-[10px] font-bold tabular-nums ${on ? "bg-white/20" : "bg-foreground/10"}`}>{t.count}</span>}
                </button>
              );
            }
            return (
              <button key={t.id} data-tab={t.id} role="tab" aria-selected={on} onClick={() => select(t.id)}
                className={[
                  "relative inline-flex h-10 shrink-0 items-center gap-1.5 text-[13px] font-semibold transition-colors",
                  on ? "text-primary" : "text-muted hover:text-foreground",
                ].join(" ")}
                style={{ scrollSnapAlign: "start" }}
              >
                {t.icon && <span className="[&_svg]:h-3.5 [&_svg]:w-3.5">{t.icon}</span>}
                {t.label}
                {t.count != null && <span className="rounded-full bg-foreground/10 px-1.5 text-[10px] font-bold tabular-nums text-muted">{t.count}</span>}
                <span aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-[2.5px] rounded-full bg-primary transition-transform duration-200"
                  style={{ transform: on ? "scaleX(1)" : "scaleX(0)" }} />
              </button>
            );
          })}
        </div>
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-8 transition-opacity"
          style={{ opacity: edges.left ? 1 : 0, background: "linear-gradient(90deg, var(--color-surface), transparent)" }} />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-8 transition-opacity"
          style={{ opacity: edges.right ? 1 : 0, background: "linear-gradient(270deg, var(--color-surface), transparent)" }} />
      </div>

      {panels && (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }} className="px-4 py-4">
            {panels[active!]}
          </motion.div>
        </AnimatePresence>
      )}
    </header>
  );
}
