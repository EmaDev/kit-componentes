"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

interface SyncStatusProps {
  /** cambios esperando salir */
  pending: number;
  /** cambios que agotaron los reintentos */
  failed?: number;
  /** hay un envío en curso */
  flushing?: boolean;
  /** momento del último envío exitoso */
  lastSyncedAt?: number | null;
  onRetry?: () => void;
  /** chip compacto (barra de app) o panel con detalle (ajustes) */
  variant?: "chip" | "panel";
  /** ocultarse cuando está todo sincronizado. Default: true en chip */
  hideWhenSynced?: boolean;
  className?: string;
}

type State = "offline" | "syncing" | "pending" | "failed" | "synced";

/**
 * Estado de la cola offline (useOfflineQueue): cuántos cambios faltan,
 * si se están enviando y qué falló. Compañero visual de la cola.
 */
export function SyncStatus({
  pending,
  failed = 0,
  flushing = false,
  lastSyncedAt = null,
  onRetry,
  variant = "chip",
  hideWhenSynced,
  className = "",
}: SyncStatusProps) {
  const { online } = useOnlineStatus();
  const state: State = failed
    ? "failed"
    : flushing
      ? "syncing"
      : !online && pending
        ? "offline"
        : pending
          ? "pending"
          : "synced";

  const copy: Record<State, string> = {
    offline: `${pending} ${pending === 1 ? "cambio" : "cambios"} sin enviar`,
    syncing: "Sincronizando…",
    pending: `${pending} ${pending === 1 ? "cambio pendiente" : "cambios pendientes"}`,
    failed: `${failed} ${failed === 1 ? "cambio no se pudo enviar" : "cambios no se pudieron enviar"}`,
    synced: "Todo sincronizado",
  };
  const tone: Record<State, string> = {
    offline: "bg-foreground/8 text-foreground",
    syncing: "bg-primary/10 text-primary",
    pending: "bg-accent/12 text-accent",
    failed: "bg-danger/12 text-danger",
    synced: "bg-success/12 text-success",
  };

  const hide = (hideWhenSynced ?? variant === "chip") && state === "synced";

  if (variant === "chip") {
    return (
      <AnimatePresence>
        {!hide && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            className={`inline-flex items-center gap-2 h-8 pl-2.5 pr-3 rounded-full text-xs font-semibold ${tone[state]} ${className}`}
          >
            <StateIcon state={state} />
            <span>{copy[state]}</span>
            {state === "failed" && onRetry && (
              <button onClick={onRetry} className="ml-0.5 underline underline-offset-2 hover:opacity-70">
                Reintentar
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className={`rounded-2xl border border-border bg-surface overflow-hidden ${className}`}>
      <div className="px-4 py-3 flex items-center gap-3">
        <span className={`shrink-0 w-9 h-9 rounded-xl inline-flex items-center justify-center ${tone[state]}`}>
          <StateIcon state={state} big />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">{copy[state]}</p>
          <p className="text-[11px] text-muted mt-0.5">
            {state === "offline"
              ? "Se enviarán solos cuando vuelva la conexión."
              : lastSyncedAt
                ? `Última sincronización ${relative(lastSyncedAt)}`
                : "Los cambios se guardan en el dispositivo."}
          </p>
        </div>
        {(state === "failed" || state === "pending") && onRetry && (
          <button
            onClick={onRetry}
            className="shrink-0 h-8 px-3 rounded-lg text-xs font-semibold bg-primary text-white shadow-sm shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}

function relative(at: number) {
  const s = Math.round((Date.now() - at) / 1000);
  if (s < 60) return "hace un momento";
  if (s < 3600) return `hace ${Math.floor(s / 60)} min`;
  if (s < 86400) return `hace ${Math.floor(s / 3600)} h`;
  return `hace ${Math.floor(s / 86400)} días`;
}

function StateIcon({ state, big }: { state: State; big?: boolean }) {
  const size = big ? 17 : 13;
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (state === "syncing")
    return (
      <motion.svg {...p} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <polyline points="21 4 21 9 16 9" />
      </motion.svg>
    );
  if (state === "synced")
    return <svg {...p}><polyline points="20 6 9 17 4 12" /></svg>;
  if (state === "failed")
    return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>;
  if (state === "offline")
    return (
      <svg {...p}>
        <path d="M18.5 19H9a7 7 0 0 1-.9-13.9" />
        <path d="M12.3 5.1A5 5 0 0 1 20 9a4 4 0 0 1 1.4 7.5" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </svg>
    );
  return (
    <svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}
