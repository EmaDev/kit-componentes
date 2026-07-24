"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { usePwaInstall } from "../hooks/usePwaInstall";

interface InstallButtonProps {
  label?: string;
  /** texto cuando la app ya está instalada */
  installedLabel?: string;
  /** texto en iOS, donde la instalación es manual */
  iosLabel?: string;
  /** callback en iOS: abrí acá tu <PwaInstallPrompt forcePlatform="ios"> o un modal con los pasos */
  onIosClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  /** si true, se oculta cuando no se puede instalar (en vez de deshabilitarse) */
  hideWhenUnavailable?: boolean;
  className?: string;
}

/**
 * Botón de instalación embebible (settings, header, onboarding).
 * A diferencia de <PwaInstallPrompt>, no interrumpe: lo colocás donde quieras.
 */
export function InstallButton({
  label = "Instalar app",
  installedLabel = "App instalada",
  iosLabel = "Cómo instalar",
  onIosClick,
  variant = "primary",
  size = "md",
  icon,
  hideWhenUnavailable = true,
  className = "",
}: InstallButtonProps) {
  const pwa = usePwaInstall({ delay: 0 });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const installed = pwa.isStandalone || done;
  const isIos = pwa.platform === "ios";
  const available = installed || isIos || pwa.canInstall;

  if (!available && hideWhenUnavailable) return null;

  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-base gap-2",
  };
  const variants = {
    primary: "bg-primary text-white shadow-sm shadow-primary/30 hover:bg-primary-hover",
    outline: "border border-border text-foreground hover:bg-surface-alt",
    ghost: "text-primary hover:bg-primary/10",
  };

  const handleClick = async () => {
    if (installed) return;
    if (isIos) { onIosClick?.(); return; }
    setBusy(true);
    const outcome = await pwa.install();
    setBusy(false);
    if (outcome === "accepted") setDone(true);
  };

  return (
    <motion.button
      whileTap={installed ? undefined : { scale: 0.96 }}
      onClick={handleClick}
      disabled={busy || installed}
      aria-label={installed ? installedLabel : label}
      className={[
        "inline-flex items-center justify-center rounded-lg font-semibold transition-colors",
        "disabled:cursor-default",
        sizes[size],
        installed ? "bg-success/10 text-success" : variants[variant],
        !installed && !pwa.canInstall && !isIos ? "opacity-60" : "",
        className,
      ].join(" ")}
    >
      {installed ? <CheckIcon /> : (icon ?? <DownloadIcon />)}
      <span>{installed ? installedLabel : busy ? "…" : isIos ? iosLabel : label}</span>
    </motion.button>
  );
}

const svg = {
  width: 16, height: 16, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 2.5,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};
function DownloadIcon() {
  return (
    <svg {...svg}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function CheckIcon() {
  return <svg {...svg}><polyline points="20 6 9 17 4 12" /></svg>;
}
