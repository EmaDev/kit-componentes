"use client";

import { useCallback, useEffect, useState } from "react";

type BadgeNavigator = Navigator & {
  setAppBadge?: (count?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

/**
 * Contador en el ícono de la app instalada (Android, Windows, macOS).
 * Pasá `count` para que se sincronice solo, o usá set/clear a mano.
 */
export function useAppBadge(count?: number) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof navigator !== "undefined" && "setAppBadge" in navigator);
  }, []);

  const set = useCallback(async (n: number) => {
    const nav = navigator as BadgeNavigator;
    if (!nav.setAppBadge) return false;
    try {
      if (n > 0) await nav.setAppBadge(n);
      else await nav.clearAppBadge?.();
      return true;
    } catch {
      return false;
    }
  }, []);

  const clear = useCallback(async () => {
    const nav = navigator as BadgeNavigator;
    try {
      await nav.clearAppBadge?.();
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (count === undefined || !supported) return;
    set(count);
  }, [count, set, supported]);

  return { supported, set, clear };
}
