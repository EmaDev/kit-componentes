"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { usePwaInstall, type PwaPlatform } from "../hooks/usePwaInstall";

interface PwaInstallPromptProps {
  /** Nombre de la app que se muestra en el prompt. */
  appName: string;
  /** Descripción corta (1 línea). */
  tagline?: string;
  /** Icono de la app — puede ser un <img> o un ReactNode (svg, etc). */
  icon?: ReactNode;
  /** Forzar un modo (útil para testing del UI sin que el navegador sea elegible). */
  forcePlatform?: PwaPlatform;
  /** Texto principal del CTA en Android. */
  installLabel?: string;
  /** Texto secundario. */
  dismissLabel?: string;
  /** Días que recordamos el dismiss antes de volver a ofrecer. Default: 14. */
  snoozeDays?: number;
}

export function PwaInstallPrompt({
  appName,
  tagline = "Instala la app para acceso rápido, soporte offline y notificaciones.",
  icon,
  forcePlatform,
  installLabel = "Instalar",
  dismissLabel = "Ahora no",
  snoozeDays = 14,
}: PwaInstallPromptProps) {
  const pwa = usePwaInstall({ snoozeDays });
  const platform = forcePlatform ?? pwa.platform;
  const visible = forcePlatform ? true : pwa.canInstall;

  return (
    <AnimatePresence>
      {visible &&
        (platform === "ios" ? (
          <IosInstallSheet
            key="ios"
            appName={appName}
            tagline={tagline}
            icon={icon}
            onDismiss={pwa.dismiss}
          />
        ) : (
          <AndroidInstallBanner
            key="android"
            appName={appName}
            tagline={tagline}
            icon={icon}
            installLabel={installLabel}
            dismissLabel={dismissLabel}
            onInstall={pwa.install}
            onDismiss={pwa.dismiss}
          />
        ))}
    </AnimatePresence>
  );
}

// =============================================================
//  Android / Desktop — banner flotante con prompt nativo
// =============================================================

interface AndroidProps {
  appName: string;
  tagline: string;
  icon?: ReactNode;
  installLabel: string;
  dismissLabel: string;
  onInstall: () => Promise<"accepted" | "dismissed" | "unsupported">;
  onDismiss: () => void;
}

function AndroidInstallBanner({
  appName, tagline, icon, installLabel, dismissLabel, onInstall, onDismiss,
}: AndroidProps) {
  const [busy, setBusy] = useState(false);
  const handleInstall = async () => {
    setBusy(true);
    await onInstall();
    setBusy(false);
  };

  return (
    <motion.div
      role="dialog"
      aria-label={`Instalar ${appName}`}
      initial={{ y: 100, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 100, opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 280, damping: 28 }}
      className={[
        "fixed z-[120] left-1/2 -translate-x-1/2",
        "bottom-[max(1rem,calc(env(safe-area-inset-bottom)+1rem))]",
        "w-[min(420px,calc(100vw-1.5rem))]",
        "bg-surface border border-border rounded-2xl shadow-2xl shadow-black/15",
        "p-4 flex items-center gap-3",
      ].join(" ")}
    >
      <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center overflow-hidden shadow-md shadow-primary/25">
        {icon ?? <DefaultAppIcon />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight truncate">
          Instalar {appName}
        </p>
        <p className="text-xs text-muted mt-0.5 leading-relaxed line-clamp-2">
          {tagline}
        </p>
      </div>

      <div className="flex flex-col gap-1.5 shrink-0">
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={busy}
          onClick={handleInstall}
          className="h-9 px-4 rounded-lg bg-primary text-white text-xs font-semibold shadow-sm shadow-primary/30 hover:bg-primary-hover transition-colors disabled:opacity-60"
        >
          {busy ? "…" : installLabel}
        </motion.button>
        <button
          onClick={onDismiss}
          className="h-7 px-3 text-[11px] text-muted hover:text-foreground transition-colors"
        >
          {dismissLabel}
        </button>
      </div>
    </motion.div>
  );
}

// =============================================================
//  iOS Safari — bottom sheet con instrucciones manuales
// =============================================================

interface IosProps {
  appName: string;
  tagline: string;
  icon?: ReactNode;
  onDismiss: () => void;
}

function IosInstallSheet({ appName, tagline, icon, onDismiss }: IosProps) {
  // Permite cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onDismiss();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onDismiss}
        className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm"
      />

      {/* Sheet */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`Instalar ${appName}`}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className={[
          "fixed z-[120] left-0 right-0 bottom-0",
          "sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:bottom-6",
          "sm:w-[440px]",
          "bg-surface border-t border-border sm:border sm:rounded-3xl rounded-t-3xl",
          "shadow-2xl shadow-black/30 overflow-hidden",
          "pb-[max(1.5rem,env(safe-area-inset-bottom))]",
        ].join(" ")}
      >
        {/* Handle */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <span className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="px-6 pt-4 pb-2 flex items-start gap-3">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center overflow-hidden shadow-md shadow-primary/25">
            {icon ?? <DefaultAppIcon />}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-base font-semibold text-foreground leading-tight">
              Instalar {appName}
            </p>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">
              {tagline}
            </p>
          </div>
          <button
            onClick={onDismiss}
            aria-label="Cerrar"
            className="shrink-0 w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Steps */}
        <ol className="px-6 pt-3 pb-5 space-y-3">
          {STEPS.map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex items-start gap-3"
            >
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div className="flex-1 pt-0.5">
                <p className="text-sm text-foreground leading-snug">
                  {step.text}
                  {step.icon && (
                    <span className="inline-flex align-middle ml-1 -mt-0.5 w-6 h-6 rounded-md bg-surface-alt border border-border items-center justify-center text-primary">
                      {step.icon}
                    </span>
                  )}
                </p>
                {step.hint && (
                  <p className="text-[11px] text-muted mt-0.5">{step.hint}</p>
                )}
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Arrow indicator pointing down to Safari toolbar */}
        <div className="px-6 pb-3 -mt-1 hidden sm:flex items-center justify-center">
          <span className="text-[11px] text-muted">
            Mantené Safari abierto · este menú no aparece en otros navegadores
          </span>
        </div>
        <motion.div
          initial={{ y: -4, opacity: 0.6 }}
          animate={{ y: 4, opacity: 1 }}
          transition={{ duration: 0.9, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="sm:hidden flex justify-center pb-1 text-primary"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </motion.div>
      </motion.div>
    </>
  );
}

const ShareIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);
const PlusIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
const CheckIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const STEPS: { text: string; icon?: ReactNode; hint?: string }[] = [
  {
    text: "Tocá el botón Compartir",
    icon: ShareIcon,
    hint: "Lo encontrás en la barra inferior de Safari.",
  },
  {
    text: "Buscá 'Agregar a inicio'",
    icon: PlusIcon,
    hint: "Deslizá hacia abajo en el menú de compartir.",
  },
  {
    text: "Tocá 'Agregar' arriba a la derecha",
    icon: CheckIcon,
    hint: "Listo: el ícono aparece en tu pantalla de inicio.",
  },
];

function DefaultAppIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
    </svg>
  );
}
