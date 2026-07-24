"use client";

import { type ReactNode } from "react";
import { useImmersive } from "../hooks/useImmersive";
import { useNativeFeel, type NativeFeelOptions } from "../hooks/useNativeFeel";
import { usePlatform } from "../hooks/usePlatform";
import { useSafeArea } from "../hooks/useSafeArea";

interface NativeShellProps extends NativeFeelOptions {
  children?: ReactNode;
  /** aplicar los bloqueos sólo con la PWA instalada (recomendado). Default: false */
  onlyWhenInstalled?: boolean;
  /** esconder la barra de direcciones del navegador en mobile. Default: true */
  hideAddressBar?: boolean;
  /** publicar --app-height con la altura real del viewport. Default: true */
  trackViewportHeight?: boolean;
  /** mantener la pantalla encendida. Default: false */
  keepAwake?: boolean;
  /** ocupar la altura real del viewport. Default: true */
  fillViewport?: boolean;
  className?: string;
}

/**
 * Raíz "todo en uno" para una web app que se sienta nativa:
 * bloqueos de zoom/overscroll/long-press, barra del navegador escondida,
 * altura real del viewport y safe areas publicadas como CSS vars
 * (`--sa-top`, `--sa-bottom`, `--app-height`, `--kb-inset`).
 *
 * ```tsx
 * // app/layout.tsx
 * <NativeShell onlyWhenInstalled>{children}</NativeShell>
 * ```
 *
 * No aplica padding: publica las vars y deja que cada pantalla decida
 * qué bordes respetar con <SafeArea/>.
 */
export function NativeShell({
  children,
  onlyWhenInstalled = false,
  hideAddressBar = true,
  trackViewportHeight = true,
  keepAwake = false,
  fillViewport = true,
  className = "",
  ...feel
}: NativeShellProps) {
  const { isStandalone, hydrating } = usePlatform();
  const blocked = hydrating || (onlyWhenInstalled && !isStandalone);

  useNativeFeel({ ...feel, disabled: feel.disabled || blocked });
  useImmersive({ hideAddressBar, trackViewportHeight, keepAwake });
  useSafeArea(); // publica --sa-*

  return (
    <div
      className={className}
      style={fillViewport ? { minHeight: "var(--app-height, 100dvh)" } : undefined}
    >
      {children}
    </div>
  );
}
