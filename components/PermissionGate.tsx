"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePermission, type PermissionKind } from "../hooks/usePermission";

interface PermissionGateProps {
  kind: PermissionKind;
  /** por qué lo necesitás — el usuario decide con esto */
  reason: string;
  title?: string;
  icon?: React.ReactNode;
  cta?: string;
  /** qué mostrar una vez concedido */
  children?: React.ReactNode;
  onGranted?: () => void;
  onDenied?: () => void;
  /** texto de ayuda cuando quedó bloqueado */
  deniedHelp?: string;
  className?: string;
}

const LABEL: Record<PermissionKind, string> = {
  camera: "la cámara",
  microphone: "el micrófono",
  geolocation: "tu ubicación",
  notifications: "las notificaciones",
  "clipboard-read": "el portapapeles",
  "persistent-storage": "el almacenamiento",
};

/**
 * Pide un permiso del navegador con contexto: explica primero, pide después
 * y contempla el estado bloqueado (donde el navegador ya no vuelve a preguntar).
 * Nunca pidas un permiso al cargar la app: perdés el pedido para siempre.
 */
export function PermissionGate({
  kind,
  reason,
  title,
  icon,
  cta = "Permitir",
  children,
  onGranted,
  onDenied,
  deniedHelp = "Habilitalo desde los ajustes del navegador para este sitio.",
  className = "",
}: PermissionGateProps) {
  const { state, request } = usePermission(kind);
  const [busy, setBusy] = useState(false);

  if (state === "granted") return <>{children}</>;

  const blocked = state === "denied";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border border-border bg-surface p-5 text-center ${className}`}
    >
      <span
        className={`inline-flex w-12 h-12 rounded-2xl items-center justify-center ${blocked ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary"}`}
      >
        {icon ?? <ShieldIcon />}
      </span>
      <p className="mt-3.5 text-sm font-semibold text-foreground">
        {title ?? `Necesitamos acceso a ${LABEL[kind]}`}
      </p>
      <p className="mt-1.5 text-xs text-muted leading-relaxed max-w-xs mx-auto">{blocked ? deniedHelp : reason}</p>

      {!blocked && (
        <button
          onClick={async () => {
            setBusy(true);
            const result = await request();
            setBusy(false);
            if (result === "granted") onGranted?.();
            else onDenied?.();
          }}
          disabled={busy || state === "unsupported"}
          className="mt-4 h-10 px-5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-50"
        >
          {state === "unsupported" ? "No disponible en este navegador" : busy ? "Esperando…" : cta}
        </button>
      )}
    </motion.div>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.4-3 8.3-7 9.4-4-1.1-7-5-7-9.4V6z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
