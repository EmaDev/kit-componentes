"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

interface OfflineBannerProps {
  /** posición del banner. Default: "top" */
  position?: "top" | "bottom";
  /** texto cuando no hay conexión */
  offlineLabel?: string;
  /** texto al recuperar conexión (se autooculta) */
  onlineLabel?: string;
  /** mostrar aviso de conexión lenta. Default: true */
  warnSlow?: boolean;
  /** texto de conexión lenta */
  slowLabel?: string;
}

/**
 * Barra de estado de conectividad. Aparece sola cuando se corta internet,
 * confirma en verde al reconectar y avisa si la conexión es lenta.
 */
export function OfflineBanner({
  position = "top",
  offlineLabel = "Sin conexión · estás viendo contenido guardado",
  onlineLabel = "Conexión restablecida",
  warnSlow = true,
  slowLabel = "Conexión lenta",
}: OfflineBannerProps) {
  const { online, justReconnected, slowConnection } = useOnlineStatus();

  const state = !online
    ? "offline"
    : justReconnected
      ? "back"
      : warnSlow && slowConnection
        ? "slow"
        : null;

  const tone = {
    offline: "bg-foreground text-surface",
    back: "bg-success text-white",
    slow: "bg-accent text-white",
  };
  const label = { offline: offlineLabel, back: onlineLabel, slow: slowLabel };

  const pos =
    position === "top"
      ? "top-0 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2"
      : "bottom-0 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2";

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ y: position === "top" ? "-100%" : "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: position === "top" ? "-100%" : "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className={`fixed inset-x-0 z-[130] px-4 ${pos} ${tone[state]} shadow-lg shadow-black/10`}
        >
          <div className="flex items-center justify-center gap-2 text-xs font-semibold">
            {state === "offline" ? <CloudOffIcon /> : state === "back" ? <CheckIcon /> : <GaugeIcon />}
            <span>{label[state]}</span>
            {state === "offline" && (
              <motion.span
                aria-hidden
                className="w-1.5 h-1.5 rounded-full bg-current"
                animate={{ opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const svg = {
  width: 14, height: 14, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 2.5,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};

function CloudOffIcon() {
  return (
    <svg {...svg}>
      <path d="M18.5 19H9a7 7 0 0 1-.9-13.9" />
      <path d="M12.3 5.1A5 5 0 0 1 20 9a4 4 0 0 1 1.4 7.5" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}
function CheckIcon() {
  return <svg {...svg}><polyline points="20 6 9 17 4 12" /></svg>;
}
function GaugeIcon() {
  return <svg {...svg}><path d="M12 14 8 9" /><path d="M3.5 18a9 9 0 1 1 17 0" /></svg>;
}
