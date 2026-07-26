"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface HeaderAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  /** punto o número sobre el icono */
  badge?: number | boolean;
  tone?: "default" | "primary" | "danger";
  disabled?: boolean;
}

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  /** flecha de regreso: si no pasás nada, no se muestra */
  onBack?: () => void;
  backLabel?: string;
  /** contenido a la izquierda cuando no hay back (avatar, logo, menú) */
  leading?: React.ReactNode;
  actions?: HeaderAction[];
  /** título grande estilo iOS que colapsa al scrollear */
  largeTitle?: boolean;
  /** centrar el título (iOS) en vez de alinearlo a la izquierda (Android) */
  centerTitle?: boolean;
  /** fondo: sólido, translúcido con blur, o transparente hasta scrollear */
  variant?: "solid" | "blur" | "transparent";
  /** buscador expandible en la barra */
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (q: string) => void;
  /** barra de progreso indeterminada (carga de la pantalla) */
  loading?: boolean;
  /** progreso real 0–1 (pisa a `loading`) */
  progress?: number;
  /** fila extra debajo del título: tabs, chips, filtros */
  children?: React.ReactNode;
  /** elemento scrolleable a observar. Default: la ventana */
  scrollRef?: React.RefObject<HTMLElement | null>;
  /** respetar el notch. Default: true */
  safeArea?: boolean;
  sticky?: boolean;
  className?: string;
}

/**
 * Header de aplicación: flecha de regreso, título (chico o grande colapsable),
 * acciones con badge, buscador expandible, barra de progreso y fila de tabs.
 * Al scrollear gana borde y fondo, como una app nativa.
 */
export function AppHeader({
  title,
  subtitle,
  onBack,
  backLabel,
  leading,
  actions = [],
  largeTitle = false,
  centerTitle = false,
  variant = "blur",
  searchable = false,
  searchPlaceholder = "Buscar…",
  onSearch,
  loading = false,
  progress,
  children,
  scrollRef,
  safeArea = true,
  sticky = true,
  className = "",
}: AppHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const target: HTMLElement | Window = scrollRef?.current ?? window;
    const read = () =>
      scrollRef?.current ? scrollRef.current.scrollTop : window.scrollY || document.documentElement.scrollTop;
    const onScroll = () => {
      const y = read();
      setScrolled(y > 4);
      setCollapsed(y > 44);
    };
    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  useEffect(() => {
    if (searching) inputRef.current?.focus();
  }, [searching]);

  const closeSearch = () => {
    setSearching(false);
    setQuery("");
    onSearch?.("");
  };

  const showBigTitle = largeTitle && !collapsed && !searching;
  const bg =
    variant === "solid"
      ? "bg-surface"
      : variant === "blur"
        ? scrolled
          ? "bg-surface/85 backdrop-blur-xl"
          : "bg-surface"
        : scrolled
          ? "bg-surface/85 backdrop-blur-xl"
          : "bg-transparent";

  return (
    <header
      className={[
        sticky ? "sticky top-0" : "relative",
        "z-40 transition-colors duration-200",
        bg,
        scrolled || variant === "solid" ? "border-b border-border" : "border-b border-transparent",
        className,
      ].join(" ")}
      style={safeArea ? { paddingTop: "var(--sa-top, env(safe-area-inset-top, 0px))" } : undefined}
    >
      <div className="h-14 px-2 flex items-center gap-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {searching ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="flex-1 flex items-center gap-2 px-1"
            >
              <span className="text-muted pl-1"><SearchIcon /></span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearch?.(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Escape" && closeSearch()}
                placeholder={searchPlaceholder}
                className="flex-1 h-10 bg-transparent text-[15px] text-foreground placeholder:text-muted outline-none"
              />
              <button
                onClick={closeSearch}
                className="h-9 px-3 rounded-lg text-[13px] font-semibold text-primary hover:bg-primary/10 active:scale-95 transition-all"
              >
                Cancelar
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="bar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
              className="flex-1 min-w-0 flex items-center gap-1"
            >
              {onBack ? (
                <button
                  onClick={onBack}
                  aria-label={backLabel ?? "Volver"}
                  className="shrink-0 h-10 min-w-10 -ml-0.5 px-2 rounded-xl inline-flex items-center gap-0.5 text-foreground hover:bg-surface-alt active:scale-90 transition-all"
                >
                  <ChevronLeftIcon />
                  {backLabel && <span className="text-[15px] font-medium pr-1">{backLabel}</span>}
                </button>
              ) : (
                leading && <div className="shrink-0 pl-1.5 pr-0.5">{leading}</div>
              )}

              <div
                className={[
                  "min-w-0 flex-1 px-1.5",
                  centerTitle ? "text-center" : "text-left",
                  onBack && centerTitle ? "-ml-10 pl-10" : "",
                ].join(" ")}
              >
                <AnimatePresence initial={false} mode="wait">
                  {!showBigTitle && (
                    <motion.p
                      key="small"
                      initial={{ opacity: 0, y: largeTitle ? 8 : 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: largeTitle ? 8 : 0 }}
                      transition={{ duration: 0.18 }}
                      className="text-[15px] font-semibold text-foreground truncate leading-tight"
                    >
                      {title}
                    </motion.p>
                  )}
                </AnimatePresence>
                {subtitle && !showBigTitle && (
                  <p className="text-[11px] text-muted truncate leading-tight">{subtitle}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!searching && (
          <div className="shrink-0 flex items-center gap-0.5 pr-0.5">
            {searchable && (
              <HeaderIconButton
                action={{ id: "__search", label: "Buscar", icon: <SearchIcon />, onClick: () => setSearching(true) }}
              />
            )}
            {actions.map((a) => (
              <HeaderIconButton key={a.id} action={a} />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {showBigTitle && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
            className="overflow-hidden px-4"
          >
            <h1 className="text-[28px] font-bold text-foreground tracking-tight leading-tight pb-2">{title}</h1>
            {subtitle && <p className="text-[13px] text-muted -mt-1 pb-2.5">{subtitle}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {children && <div className="px-2 pb-1.5">{children}</div>}

      {(loading || progress !== undefined) && (
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-primary/15 overflow-hidden">
          {progress !== undefined ? (
            <motion.div
              className="h-full bg-primary"
              animate={{ width: `${Math.round(Math.min(1, Math.max(0, progress)) * 100)}%` }}
              transition={{ type: "spring", stiffness: 180, damping: 26 }}
            />
          ) : (
            <motion.div
              className="h-full w-1/3 bg-primary"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      )}
    </header>
  );
}

function HeaderIconButton({ action }: { action: HeaderAction }) {
  const tone =
    action.tone === "primary" ? "text-primary" : action.tone === "danger" ? "text-danger" : "text-foreground";
  return (
    <button
      onClick={action.onClick}
      disabled={action.disabled}
      aria-label={action.label}
      className={`relative w-10 h-10 rounded-xl inline-flex items-center justify-center hover:bg-surface-alt active:scale-90 transition-all disabled:opacity-40 disabled:active:scale-100 ${tone}`}
    >
      {action.icon}
      {action.badge !== undefined && action.badge !== false && (
        <span
          className={[
            "absolute rounded-full bg-danger text-white font-bold flex items-center justify-center ring-2 ring-surface",
            typeof action.badge === "number"
              ? "top-1 right-0.5 min-w-4 h-4 px-1 text-[10px]"
              : "top-2 right-2 w-2 h-2",
          ].join(" ")}
        >
          {typeof action.badge === "number" ? (action.badge > 99 ? "99+" : action.badge) : null}
        </span>
      )}
    </button>
  );
}

const svg = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ChevronLeftIcon() {
  return <svg {...svg} width="22" height="22" strokeWidth={2.4}><polyline points="15 18 9 12 15 6" /></svg>;
}
function SearchIcon() {
  return (
    <svg {...svg}>
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.7" y2="16.7" />
    </svg>
  );
}
