"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNotificationPermission } from "../hooks/useNotificationPermission";
import { usePwaInstall } from "../hooks/usePwaInstall";

interface NotificationOptInProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  dismissLabel?: string;
  /** texto cuando el usuario bloqueó las notificaciones */
  deniedHint?: string;
  /** se llama con el resultado del pedido de permiso */
  onResult?: (status: "granted" | "denied" | "default" | "unsupported") => void;
  /** en iOS el permiso sólo existe con la PWA instalada: mostramos ese aviso. Default: true */
  requireInstalledOnIos?: boolean;
  /** forzar visible para testear el UI */
  forceVisible?: boolean;
}

/**
 * Tarjeta de opt-in de notificaciones. No pide permiso al cargar
 * (eso hace que el usuario bloquee): explica el valor y pide en un gesto.
 */
export function NotificationOptIn({
  title = "Activar notificaciones",
  description = "Te avisamos sólo de lo importante. Podés desactivarlas cuando quieras.",
  actionLabel = "Activar",
  dismissLabel = "No, gracias",
  deniedHint = "Están bloqueadas. Habilitalas desde los ajustes del navegador.",
  onResult,
  requireInstalledOnIos = true,
  forceVisible = false,
}: NotificationOptInProps) {
  const { status, request } = useNotificationPermission();
  const pwa = usePwaInstall({ delay: 0 });
  const [hidden, setHidden] = useState(false);
  const [busy, setBusy] = useState(false);

  const needsInstallFirst =
    requireInstalledOnIos && pwa.platform === "ios" && !pwa.isStandalone;

  const visible =
    forceVisible ||
    (!hidden && (status === "default" || status === "denied"));

  const handleAsk = async () => {
    setBusy(true);
    const result = await request();
    setBusy(false);
    onResult?.(result);
    if (result === "granted") setHidden(true);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="rounded-2xl border border-border bg-surface p-4 flex items-start gap-3 overflow-hidden"
        >
          <span className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <motion.span
              animate={{ rotate: [0, -12, 12, -8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              className="flex origin-top"
            >
              <BellIcon />
            </motion.span>
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight">{title}</p>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">
              {status === "denied"
                ? deniedHint
                : needsInstallFirst
                  ? "Primero agregá la app a tu pantalla de inicio para poder recibir notificaciones."
                  : description}
            </p>

            {status !== "denied" && !needsInstallFirst && (
              <div className="flex items-center gap-2 mt-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleAsk}
                  disabled={busy}
                  className="h-8 px-3.5 rounded-lg bg-primary text-white text-xs font-semibold shadow-sm shadow-primary/30 hover:bg-primary-hover transition-colors disabled:opacity-60"
                >
                  {busy ? "…" : actionLabel}
                </motion.button>
                <button
                  onClick={() => setHidden(true)}
                  className="h-8 px-3 text-xs text-muted hover:text-foreground transition-colors"
                >
                  {dismissLabel}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setHidden(true)}
            aria-label="Cerrar"
            className="shrink-0 w-7 h-7 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}
