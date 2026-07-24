"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useServiceWorker } from "../hooks/useServiceWorker";

interface UpdatePromptProps {
  /** ruta del service worker. Default: "/sw.js" */
  swUrl?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  dismissLabel?: string;
  /** cada cuánto revisar si hay versión nueva (ms). Default: 1h */
  checkIntervalMs?: number;
  /** forzar visible para testear el UI */
  forceVisible?: boolean;
}

/**
 * Avisa cuando hay una versión nueva de la app cacheada y lista.
 * Al aceptar, activa el service worker nuevo y recarga.
 */
export function UpdatePrompt({
  swUrl = "/sw.js",
  title = "Nueva versión disponible",
  description = "Recargá para usar la última versión de la app.",
  actionLabel = "Actualizar",
  dismissLabel = "Después",
  checkIntervalMs,
  forceVisible = false,
}: UpdatePromptProps) {
  const sw = useServiceWorker({ url: swUrl, checkIntervalMs });
  const [hidden, setHidden] = useState(false);
  const visible = forceVisible || (sw.updateAvailable && !hidden);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="alert"
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className={[
            "fixed z-[125] left-1/2 -translate-x-1/2",
            "bottom-[max(1rem,calc(env(safe-area-inset-bottom)+1rem))]",
            "w-[min(420px,calc(100vw-1.5rem))]",
            "bg-surface border border-border rounded-2xl shadow-2xl shadow-black/15",
            "p-4 flex items-center gap-3",
          ].join(" ")}
        >
          <span className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <motion.span
              animate={sw.updating ? { rotate: 360 } : { rotate: 0 }}
              transition={sw.updating ? { duration: 0.9, repeat: Infinity, ease: "linear" } : { duration: 0.2 }}
              className="flex"
            >
              <RefreshIcon />
            </motion.span>
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">{description}</p>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={sw.applyUpdate}
              disabled={sw.updating}
              className="h-9 px-4 rounded-lg bg-primary text-white text-xs font-semibold shadow-sm shadow-primary/30 hover:bg-primary-hover transition-colors disabled:opacity-60"
            >
              {sw.updating ? "…" : actionLabel}
            </motion.button>
            <button
              onClick={() => setHidden(true)}
              className="h-7 px-3 text-[11px] text-muted hover:text-foreground transition-colors"
            >
              {dismissLabel}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <polyline points="3 4 3 9 8 9" />
    </svg>
  );
}
