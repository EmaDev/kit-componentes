"use client";

import { motion } from "framer-motion";
import { useNotificationPermission } from "../hooks/useNotificationPermission";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { usePwaInstall } from "../hooks/usePwaInstall";
import { useServiceWorker } from "../hooks/useServiceWorker";

interface PwaStatusProps {
  /** ruta del service worker a inspeccionar. Default: "/sw.js" */
  swUrl?: string;
  /** no registrar el SW desde acá (si ya lo registra otro componente). Default: true */
  observeOnly?: boolean;
  title?: string;
  /** mostrar el botón "Buscar actualización". Default: true */
  showActions?: boolean;
  className?: string;
}

type Tone = "ok" | "warn" | "off";

/**
 * Panel de diagnóstico PWA: instalación, conexión, service worker y
 * notificaciones. Útil en una pantalla de Ajustes o para debug en campo.
 */
export function PwaStatus({
  swUrl = "/sw.js",
  observeOnly = true,
  title = "Estado de la app",
  showActions = true,
  className = "",
}: PwaStatusProps) {
  const pwa = usePwaInstall({ delay: 0 });
  const net = useOnlineStatus();
  const sw = useServiceWorker({ url: swUrl, autoRegister: !observeOnly });
  const notif = useNotificationPermission();

  const platformLabel = {
    ios: "iOS · Safari",
    android: "Android",
    desktop: "Escritorio",
    other: "Desconocida",
  }[pwa.platform];

  const rows: { label: string; value: string; tone: Tone }[] = [
    {
      label: "Instalación",
      value: pwa.isStandalone ? "Instalada" : pwa.canInstall ? "Disponible" : "No disponible",
      tone: pwa.isStandalone ? "ok" : pwa.canInstall ? "warn" : "off",
    },
    {
      label: "Conexión",
      value: !net.online
        ? "Offline"
        : net.slowConnection
          ? `Lenta${net.effectiveType ? ` · ${net.effectiveType}` : ""}`
          : `Online${net.effectiveType ? ` · ${net.effectiveType}` : ""}`,
      tone: !net.online ? "off" : net.slowConnection ? "warn" : "ok",
    },
    {
      label: "Service worker",
      value: !sw.supported
        ? "No soportado"
        : sw.updateAvailable
          ? "Actualización lista"
          : sw.registered
            ? "Activo"
            : observeOnly
              ? "Observando"
              : "Inactivo",
      tone: !sw.supported ? "off" : sw.updateAvailable ? "warn" : sw.registered ? "ok" : "off",
    },
    {
      label: "Notificaciones",
      value: {
        granted: "Activadas",
        denied: "Bloqueadas",
        default: "Sin definir",
        unsupported: "No soportadas",
      }[notif.status],
      tone: notif.status === "granted" ? "ok" : notif.status === "default" ? "warn" : "off",
    },
    { label: "Plataforma", value: platformLabel, tone: "off" },
  ];

  const dot: Record<Tone, string> = {
    ok: "bg-success",
    warn: "bg-accent",
    off: "bg-muted/50",
  };

  return (
    <div className={`rounded-2xl border border-border bg-surface overflow-hidden ${className}`}>
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {showActions && sw.supported && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={sw.checkForUpdate}
            className="h-7 px-2.5 rounded-lg text-[11px] font-semibold text-primary hover:bg-primary/10 transition-colors inline-flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7" /><polyline points="3 4 3 9 8 9" />
            </svg>
            Buscar actualización
          </motion.button>
        )}
      </div>

      <dl className="divide-y divide-border">
        {rows.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="px-4 py-2.5 flex items-center justify-between gap-4"
          >
            <dt className="text-xs text-muted">{r.label}</dt>
            <dd className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <span className={`w-1.5 h-1.5 rounded-full ${dot[r.tone]}`} />
              {r.value}
            </dd>
          </motion.div>
        ))}
      </dl>
    </div>
  );
}
