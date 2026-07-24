"use client";

import { useCallback, useMemo } from "react";

/** Patrones tipo iOS/Android, en ms. */
const PATTERNS = {
  selection: [8],
  tap: [12],
  impactLight: [10],
  impactMedium: [22],
  impactHeavy: [38],
  success: [14, 60, 26],
  warning: [26, 70, 26],
  error: [38, 60, 38, 60, 38],
  toggle: [10, 40, 10],
} as const;

export type HapticPattern = keyof typeof PATTERNS;

interface UseHapticsOptions {
  /** desactivar globalmente (ej. preferencia del usuario) */
  disabled?: boolean;
}

interface UseHapticsReturn {
  /** el dispositivo soporta vibración (iOS Safari NO la soporta) */
  supported: boolean;
  /** dispara un patrón con nombre */
  haptic: (pattern?: HapticPattern) => void;
  /** dispara un patrón custom en ms */
  vibrate: (pattern: number | number[]) => void;
}

/**
 * Feedback táctil con nombres semánticos, en vez de números mágicos.
 * Silencioso donde no hay soporte, y respeta prefers-reduced-motion.
 *
 * ```tsx
 * const { haptic } = useHaptics();
 * <button onClick={() => { haptic("success"); save(); }}>Guardar</button>
 * ```
 */
export function useHaptics(options: UseHapticsOptions = {}): UseHapticsReturn {
  const { disabled = false } = options;

  const supported = useMemo(
    () => typeof navigator !== "undefined" && typeof navigator.vibrate === "function",
    []
  );

  const vibrate = useCallback((pattern: number | number[]) => {
    if (disabled || typeof navigator === "undefined" || !navigator.vibrate) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    try { navigator.vibrate(pattern); } catch { /* bloqueado por el navegador */ }
  }, [disabled]);

  const haptic = useCallback((pattern: HapticPattern = "tap") => {
    vibrate([...PATTERNS[pattern]]);
  }, [vibrate]);

  return { supported, haptic, vibrate };
}
