"use client";

import { useEffect, useState } from "react";

/**
 * Media query reactiva, SSR-safe (false en el server, se corrige al hidratar).
 * Para breakpoints usá los helpers de abajo.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export const useIsMobile = () => useMediaQuery("(max-width: 639px)");
export const useIsTablet = () => useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const usePrefersDark = () => useMediaQuery("(prefers-color-scheme: dark)");
export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useIsLandscape = () => useMediaQuery("(orientation: landscape)");
/** la app corre instalada, sin barra del navegador */
export const useIsStandalone = () => useMediaQuery("(display-mode: standalone)");
