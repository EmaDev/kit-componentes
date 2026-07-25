"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

export type SnackbarVariant = "neutral" | "success" | "error" | "info";
export type SnackbarPosition = "bottom-center" | "bottom-left" | "bottom-right" | "top-center";

export interface Snack {
  id: string;
  message: string;
  variant?: SnackbarVariant;
  /** ms visible. 0 = hasta que el usuario la cierre. Default 4000 */
  duration?: number;
  action?: { label: string; onClick: () => void };
  /** muestra la X de cierre. Default false (Material la evita si hay acción) */
  closeable?: boolean;
}

interface SnackbarContextValue {
  /** encola un snack; devuelve su id */
  snack: (s: Omit<Snack, "id">) => string;
  /** atajo para el patrón deshacer */
  undo: (message: string, onUndo: () => void, duration?: number) => string;
  dismiss: (id?: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used inside <SnackbarProvider>");
  return ctx;
}

const TONE: Record<SnackbarVariant, string> = {
  neutral: "text-foreground",
  success: "text-success",
  error: "text-danger",
  info: "text-primary",
};

const POS: Record<SnackbarPosition, string> = {
  "bottom-center": "left-1/2 -translate-x-1/2 bottom-0",
  "bottom-left": "left-0 bottom-0",
  "bottom-right": "right-0 bottom-0",
  "top-center": "left-1/2 -translate-x-1/2 top-0",
};

/**
 * Snackbar tipo Material: uno a la vez, cola FIFO, acción inline
 * («Deshacer»), barra de tiempo, swipe para descartar y respeto de
 * safe-area + teclado virtual.
 */
export function SnackbarProvider({
  children,
  position = "bottom-center",
  gap = 16,
}: {
  children: ReactNode;
  position?: SnackbarPosition;
  gap?: number;
}) {
  const [queue, setQueue] = useState<Snack[]>([]);
  const current = queue[0];

  const dismiss = useCallback((id?: string) => {
    setQueue((q) => (id ? q.filter((s) => s.id !== id) : q.slice(1)));
  }, []);

  const snack = useCallback((s: Omit<Snack, "id">) => {
    const id = Math.random().toString(36).slice(2, 9);
    setQueue((q) => [...q, { id, duration: 4000, variant: "neutral", ...s }]);
    return id;
  }, []);

  const undo = useCallback(
    (message: string, onUndo: () => void, duration = 6000) =>
      snack({ message, duration, action: { label: "Deshacer", onClick: onUndo } }),
    [snack]
  );

  const top = position === "top-center";

  return (
    <SnackbarContext.Provider value={{ snack, undo, dismiss }}>
      {children}
      <div
        className={`fixed z-[110] px-4 w-full sm:w-auto sm:min-w-[344px] sm:max-w-[560px] pointer-events-none ${POS[position]}`}
        style={
          top
            ? { paddingTop: `calc(var(--sa-top, 0px) + ${gap}px)` }
            : { paddingBottom: `calc(var(--kb-inset, 0px) + var(--sa-bottom, 0px) + ${gap}px)` }
        }
      >
        <AnimatePresence mode="wait">
          {current && (
            <SnackCard key={current.id} snack={current} top={top} onClose={() => dismiss(current.id)} />
          )}
        </AnimatePresence>
      </div>
    </SnackbarContext.Provider>
  );
}

function SnackCard({ snack, top, onClose }: { snack: Snack; top: boolean; onClose: () => void }) {
  const [hover, setHover] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!snack.duration || hover) return;
    timer.current = setTimeout(onClose, snack.duration);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [snack.duration, hover, onClose]);

  const y = top ? -24 : 24;

  return (
    <motion.div
      initial={{ opacity: 0, y, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y, scale: 0.96, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.4}
      onDragEnd={(_, i) => { if (Math.abs(i.offset.x) > 90) onClose(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="status"
      aria-live="polite"
      className="pointer-events-auto relative overflow-hidden rounded-xl bg-foreground text-surface shadow-xl shadow-black/25 pl-4 pr-2 py-3 flex items-center gap-3"
    >
      {snack.variant !== "neutral" && (
        <span className={`shrink-0 ${TONE[snack.variant ?? "neutral"]}`}>
          {snack.variant === "success" ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : snack.variant === "error" ? (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16.5" x2="12.01" y2="16.5"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="7.5" x2="12.01" y2="7.5"/></svg>
          )}
        </span>
      )}

      <p className="flex-1 text-sm font-medium leading-snug min-w-0">{snack.message}</p>

      {snack.action && (
        <button
          type="button"
          onClick={() => { snack.action!.onClick(); onClose(); }}
          className="shrink-0 h-8 px-3 rounded-lg text-xs font-bold uppercase tracking-wide text-primary hover:bg-surface/10 active:scale-95 transition-all"
        >
          {snack.action.label}
        </button>
      )}

      {(snack.closeable || !snack.action) && (
        <button type="button" onClick={onClose} aria-label="Cerrar"
          className="shrink-0 w-8 h-8 rounded-lg grid place-items-center opacity-60 hover:opacity-100 hover:bg-surface/10 transition-all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}

      {!!snack.duration && (
        <motion.span
          initial={{ scaleX: 1 }}
          animate={{ scaleX: hover ? 1 : 0 }}
          transition={{ duration: hover ? 0 : snack.duration / 1000, ease: "linear" }}
          style={{ originX: 0 }}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary/70"
        />
      )}
    </motion.div>
  );
}
