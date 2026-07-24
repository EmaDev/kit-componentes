"use client";

import { useNativeFeel, type NativeFeelOptions } from "../hooks/useNativeFeel";
import { usePlatform } from "../hooks/usePlatform";

interface ViewportLockProps extends NativeFeelOptions {
  /**
   * Aplicar los bloqueos SÓLO cuando la app corre instalada (standalone/TWA).
   * En el navegador se mantiene el zoom, que es lo correcto para accesibilidad.
   * Default: false (aplica siempre)
   */
  onlyWhenInstalled?: boolean;
  /** aplicar sólo en iOS/Android, nunca en escritorio. Default: false */
  onlyOnMobile?: boolean;
}

/**
 * Componente declarativo, sin UI: monta los bloqueos de zoom/overscroll/
 * long-press para lograr una experiencia 100% nativa.
 *
 * ```tsx
 * // app/layout.tsx
 * <ViewportLock onlyWhenInstalled />
 * ```
 */
export function ViewportLock({
  onlyWhenInstalled = false,
  onlyOnMobile = false,
  ...options
}: ViewportLockProps) {
  const { isStandalone, isMobileOs, hydrating } = usePlatform();

  const blocked =
    hydrating ||
    (onlyWhenInstalled && !isStandalone) ||
    (onlyOnMobile && !isMobileOs);

  useNativeFeel({ ...options, disabled: options.disabled || blocked });

  return null;
}
