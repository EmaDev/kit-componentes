"use client";

import { motion } from "framer-motion";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

interface OfflineFallbackProps {
  title?: string;
  description?: string;
  /** reintentar la carga */
  onRetry?: () => void;
  /** ir a lo que sí está guardado */
  onGoCached?: () => void;
  cachedLabel?: string;
  /** ocupar toda la pantalla o vivir dentro de una card */
  variant?: "full" | "inline";
  className?: string;
}

/**
 * Pantalla de "no hay conexión" para cuando un fetch falla y no hay caché.
 * Se actualiza sola: al volver la conexión ofrece recargar.
 */
export function OfflineFallback({
  title = "Sin conexión",
  description = "No pudimos cargar esta pantalla. Revisá tu conexión y volvé a intentar.",
  onRetry,
  onGoCached,
  cachedLabel = "Ver contenido guardado",
  variant = "full",
  className = "",
}: OfflineFallbackProps) {
  const { online } = useOnlineStatus();

  return (
    <div
      className={[
        "flex flex-col items-center justify-center text-center px-8",
        variant === "full" ? "min-h-[60dvh] py-16" : "py-12 rounded-2xl border border-border bg-surface-alt/40",
        className,
      ].join(" ")}
    >
      <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`w-16 h-16 rounded-2xl inline-flex items-center justify-center ${online ? "bg-success/12 text-success" : "bg-foreground/8 text-muted"}`}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.5 19H9a7 7 0 0 1-.9-13.9" />
          <path d="M12.3 5.1A5 5 0 0 1 20 9a4 4 0 0 1 1.4 7.5" />
          {!online && <line x1="2" y1="2" x2="22" y2="22" />}
        </svg>
      </motion.span>

      <p className="mt-5 text-lg font-bold text-foreground">{online ? "Conexión restablecida" : title}</p>
      <p className="mt-1.5 text-sm text-muted leading-relaxed max-w-xs">
        {online ? "Ya podés volver a cargar la pantalla." : description}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all"
          >
            Reintentar
          </button>
        )}
        {onGoCached && (
          <button
            onClick={onGoCached}
            className="h-10 px-4 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-surface-alt active:scale-95 transition-all"
          >
            {cachedLabel}
          </button>
        )}
      </div>
    </div>
  );
}
