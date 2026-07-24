"use client";

import { useEffect, useState } from "react";

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const EMPTY: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };

function measure(): SafeAreaInsets {
  if (typeof document === "undefined") return EMPTY;
  // env() no es legible desde JS: usamos un probe con las 4 insets aplicadas.
  const probe = document.createElement("div");
  probe.style.cssText = [
    "position:fixed",
    "visibility:hidden",
    "pointer-events:none",
    "top:env(safe-area-inset-top,0px)",
    "right:env(safe-area-inset-right,0px)",
    "bottom:env(safe-area-inset-bottom,0px)",
    "left:env(safe-area-inset-left,0px)",
  ].join(";");
  document.documentElement.appendChild(probe);
  const cs = getComputedStyle(probe);
  const insets = {
    top: parseFloat(cs.top) || 0,
    right: parseFloat(cs.right) || 0,
    bottom: parseFloat(cs.bottom) || 0,
    left: parseFloat(cs.left) || 0,
  };
  probe.remove();
  return insets;
}

interface UseSafeAreaOptions {
  /**
   * Publicar las insets como CSS vars en <html> (`--sa-top`, `--sa-right`,
   * `--sa-bottom`, `--sa-left`) para poder usarlas en CSS sin repetir env().
   * Default: true
   */
  publishCssVars?: boolean;
  /** mínimo a aplicar cuando el dispositivo no reporta insets (px). Default: 0 */
  fallback?: number;
}

interface UseSafeAreaReturn extends SafeAreaInsets {
  /** el dispositivo tiene notch / dynamic island / home indicator */
  hasInsets: boolean;
  /** shorthands listos para usar en style={{ padding: … }} */
  padding: { paddingTop: number; paddingRight: number; paddingBottom: number; paddingLeft: number };
  /** orientación actual */
  orientation: "portrait" | "landscape";
}

/**
 * Safe areas reactivas: se recalculan al rotar, al cambiar el tamaño y
 * cuando el navegador esconde/muestra su barra de direcciones.
 *
 * ```tsx
 * const sa = useSafeArea();
 * <header style={{ paddingTop: sa.top + 12 }} />
 * // o en CSS: padding-top: calc(var(--sa-top) + 12px);
 * ```
 */
export function useSafeArea(options: UseSafeAreaOptions = {}): UseSafeAreaReturn {
  const { publishCssVars = true, fallback = 0 } = options;
  const [insets, setInsets] = useState<SafeAreaInsets>(EMPTY);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");

  useEffect(() => {
    const sync = () => {
      const raw = measure();
      const next = {
        top: Math.max(raw.top, fallback),
        right: Math.max(raw.right, fallback),
        bottom: Math.max(raw.bottom, fallback),
        left: Math.max(raw.left, fallback),
      };
      setInsets(next);
      setOrientation(window.innerHeight >= window.innerWidth ? "portrait" : "landscape");

      if (publishCssVars) {
        const s = document.documentElement.style;
        s.setProperty("--sa-top", `${next.top}px`);
        s.setProperty("--sa-right", `${next.right}px`);
        s.setProperty("--sa-bottom", `${next.bottom}px`);
        s.setProperty("--sa-left", `${next.left}px`);
      }
    };

    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    window.visualViewport?.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      window.visualViewport?.removeEventListener("resize", sync);
    };
  }, [publishCssVars, fallback]);

  return {
    ...insets,
    hasInsets: insets.top > 0 || insets.bottom > 0 || insets.left > 0 || insets.right > 0,
    padding: {
      paddingTop: insets.top,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
    },
    orientation,
  };
}
