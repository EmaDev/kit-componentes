"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWebAuthn } from "../hooks/useWebAuthn";
import { useHaptics } from "../hooks/useHaptics";

interface BiometricGateProps {
  open: boolean;
  /** desbloqueo correcto */
  onUnlock: () => void;
  appName?: string;
  title?: string;
  description?: string;
  /** alternativa cuando no hay biometría o el usuario la rechaza (PIN, login) */
  onFallback?: () => void;
  fallbackLabel?: string;
  /** intentar apenas se abre. Default: true */
  auto?: boolean;
  /** verificación de la credencial contra tu backend */
  verify?: (credential: PublicKeyCredential, kind: "register" | "login") => Promise<boolean>;
}

/**
 * Pantalla de desbloqueo biométrico (Face ID / huella / Windows Hello) vía
 * WebAuthn. Si el dispositivo no lo soporta, cae directo al método alternativo.
 */
export function BiometricGate({
  open,
  onUnlock,
  appName = "Mi App",
  title = "Desbloqueá la app",
  description = "Usá tu huella o tu rostro para continuar.",
  onFallback,
  fallbackLabel = "Usar PIN",
  auto = true,
  verify,
}: BiometricGateProps) {
  const { authenticate, available, supported, busy, error } = useWebAuthn({ appName, verify });
  const { haptic } = useHaptics();
  const [failed, setFailed] = useState(false);

  const attempt = async () => {
    setFailed(false);
    const ok = await authenticate();
    if (ok) {
      haptic("success");
      onUnlock();
    } else {
      haptic("error");
      setFailed(true);
    }
  };

  useEffect(() => {
    if (open && auto && supported && available) attempt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, available, supported]);

  const unavailable = !supported || !available;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-surface flex flex-col items-center justify-center px-8 text-center"
        >
          <motion.span
            animate={busy ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={busy ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : undefined}
            className={`w-20 h-20 rounded-3xl inline-flex items-center justify-center ${failed ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary"}`}
            style={failed ? { animation: "shake 0.4s ease" } : undefined}
          >
            <FingerprintIcon />
          </motion.span>

          <p className="mt-6 text-lg font-bold text-foreground">{title}</p>
          <p className="mt-1.5 text-sm text-muted leading-relaxed max-w-xs">
            {unavailable
              ? "Este dispositivo no tiene biometría configurada."
              : failed
                ? (error ?? "No pudimos verificarte. Probá de nuevo.")
                : busy
                  ? "Esperando la verificación…"
                  : description}
          </p>

          <div className="mt-7 flex flex-col items-center gap-2 w-full max-w-[240px]">
            {!unavailable && (
              <button
                onClick={attempt}
                disabled={busy}
                className="w-full h-11 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-60"
              >
                {busy ? "Verificando…" : failed ? "Reintentar" : "Desbloquear"}
              </button>
            )}
            {onFallback && (
              <button
                onClick={onFallback}
                className="w-full h-10 rounded-xl text-sm font-semibold text-primary hover:bg-primary/10 active:scale-95 transition-all"
              >
                {fallbackLabel}
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FingerprintIcon() {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 11v3a6 6 0 0 0 .6 2.6" />
      <path d="M8.5 11a3.5 3.5 0 0 1 7 0v3a9 9 0 0 0 .5 3" />
      <path d="M5.5 12a6.5 6.5 0 0 1 13 0v2.5" />
      <path d="M3 10a9 9 0 0 1 15.4-5.1" />
      <path d="M5.8 18.5A9 9 0 0 1 3 14" />
    </svg>
  );
}
