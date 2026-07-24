"use client";

import { useEffect } from "react";

export interface NativeFeelOptions {
  /** bloquear pinch-zoom, doble-tap zoom y ctrl+scroll zoom. Default: true */
  blockZoom?: boolean;
  /** bloquear el pull-to-refresh y el rebote de scroll del body. Default: true */
  blockOverscroll?: boolean;
  /** bloquear el menú contextual (long-press / click derecho). Default: true */
  blockContextMenu?: boolean;
  /** bloquear la selección de texto fuera de inputs. Default: true */
  blockTextSelection?: boolean;
  /**
   * Reescribir el <meta name="viewport"> con user-scalable=no.
   * Necesario en iOS, donde el pinch-zoom del navegador no se puede cancelar
   * desde JS. Default: true
   */
  patchViewportMeta?: boolean;
  /** desactivar todo (ej. si el usuario activó una preferencia de accesibilidad) */
  disabled?: boolean;
}

const VIEWPORT_CONTENT =
  "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";

/**
 * Convierte la web app en una experiencia "nativa": sin zoom accidental,
 * sin pull-to-refresh, sin menú de long-press ni selección de texto.
 *
 * Montalo UNA vez, lo más arriba posible (layout raíz o <ViewportLock/>).
 * Todo es reversible: al desmontar restaura el estado anterior.
 *
 * ⚠️ Accesibilidad: bloquear el zoom rompe WCAG 1.4.4. Hacelo sólo en apps
 * instaladas / tipo juego, y ofrecé un control de tamaño de texto propio.
 * Podés atarlo a la instalación: `useNativeFeel({ disabled: !isStandalone })`.
 */
export function useNativeFeel(options: NativeFeelOptions = {}) {
  const {
    blockZoom = true,
    blockOverscroll = true,
    blockContextMenu = true,
    blockTextSelection = true,
    patchViewportMeta = true,
    disabled = false,
  } = options;

  useEffect(() => {
    if (disabled || typeof document === "undefined") return;

    const cleanups: (() => void)[] = [];
    const html = document.documentElement;
    const body = document.body;

    // ---- 1. viewport meta (única vía para frenar el pinch-zoom en iOS) ----
    if (blockZoom && patchViewportMeta) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "viewport";
        document.head.appendChild(meta);
        const created = meta;
        cleanups.push(() => created.remove());
      } else {
        const prev = meta.content;
        const existing = meta;
        cleanups.push(() => { existing.content = prev; });
      }
      meta.content = VIEWPORT_CONTENT;
    }

    // ---- 2. gestos de zoom ----
    if (blockZoom) {
      // Safari: gesturestart/change/end
      const killGesture = (e: Event) => e.preventDefault();
      ["gesturestart", "gesturechange", "gestureend"].forEach((t) =>
        document.addEventListener(t, killGesture, { passive: false })
      );
      cleanups.push(() =>
        ["gesturestart", "gesturechange", "gestureend"].forEach((t) =>
          document.removeEventListener(t, killGesture)
        )
      );

      // Chromium/Android: pinch llega como touchmove multi-touch
      const killPinch = (e: TouchEvent) => {
        if (e.touches.length > 1) e.preventDefault();
      };
      document.addEventListener("touchmove", killPinch, { passive: false });
      cleanups.push(() => document.removeEventListener("touchmove", killPinch));

      // doble-tap zoom: cancelamos el segundo tap rápido
      let lastTouch = 0;
      const killDoubleTap = (e: TouchEvent) => {
        const now = Date.now();
        if (now - lastTouch < 320) e.preventDefault();
        lastTouch = now;
      };
      document.addEventListener("touchend", killDoubleTap, { passive: false });
      cleanups.push(() => document.removeEventListener("touchend", killDoubleTap));

      // desktop: ctrl/cmd + scroll y ctrl + +/-/0
      const killWheelZoom = (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) e.preventDefault();
      };
      const killKeyZoom = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && ["+", "-", "=", "0"].includes(e.key)) e.preventDefault();
      };
      window.addEventListener("wheel", killWheelZoom, { passive: false });
      window.addEventListener("keydown", killKeyZoom);
      cleanups.push(() => {
        window.removeEventListener("wheel", killWheelZoom);
        window.removeEventListener("keydown", killKeyZoom);
      });

      const prevTouchAction = html.style.touchAction;
      html.style.touchAction = "pan-x pan-y";
      cleanups.push(() => { html.style.touchAction = prevTouchAction; });
    }

    // ---- 3. overscroll / pull-to-refresh ----
    if (blockOverscroll) {
      const prevHtml = html.style.overscrollBehavior;
      const prevBody = body.style.overscrollBehavior;
      html.style.overscrollBehavior = "none";
      body.style.overscrollBehavior = "none";
      cleanups.push(() => {
        html.style.overscrollBehavior = prevHtml;
        body.style.overscrollBehavior = prevBody;
      });
    }

    // ---- 4. menú contextual ----
    if (blockContextMenu) {
      const kill = (e: Event) => {
        const t = e.target as HTMLElement | null;
        // dejamos el menú nativo en campos de texto (pegar, autocompletar)
        if (t?.closest("input, textarea, [contenteditable='true']")) return;
        e.preventDefault();
      };
      document.addEventListener("contextmenu", kill);
      cleanups.push(() => document.removeEventListener("contextmenu", kill));
    }

    // ---- 5. selección de texto ----
    if (blockTextSelection) {
      const prevSelect = body.style.userSelect;
      const prevCallout = body.style.getPropertyValue("-webkit-touch-callout");
      body.style.userSelect = "none";
      body.style.setProperty("-webkit-touch-callout", "none");
      cleanups.push(() => {
        body.style.userSelect = prevSelect;
        if (prevCallout) body.style.setProperty("-webkit-touch-callout", prevCallout);
        else body.style.removeProperty("-webkit-touch-callout");
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [
    blockZoom, blockOverscroll, blockContextMenu,
    blockTextSelection, patchViewportMeta, disabled,
  ]);
}
