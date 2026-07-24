"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** No incluido en lib.dom.d.ts desde TS 5.2+; ver Screen Orientation API. */
type OrientationLockType =
  | "any"
  | "natural"
  | "landscape"
  | "landscape-primary"
  | "landscape-secondary"
  | "portrait"
  | "portrait-primary"
  | "portrait-secondary";

interface UseImmersiveOptions {
  /**
   * Esconder la barra de direcciones del navegador en mobile haciendo
   * scroll a 1px al cargar y al rotar. Es la única vía en iOS Safari
   * (que no permite Fullscreen API en iPhone). Default: true
   */
  hideAddressBar?: boolean;
  /**
   * Publicar la altura real del viewport en `--app-height` (px).
   * Usalo en vez de 100vh para que no salte cuando aparece/desaparece
   * la barra del navegador. Default: true
   */
  trackViewportHeight?: boolean;
  /** pedir Fullscreen API al primer gesto del usuario (Android/desktop). Default: false */
  fullscreenOnInteraction?: boolean;
  /** mantener la pantalla encendida (Screen Wake Lock API). Default: false */
  keepAwake?: boolean;
  /** bloquear la orientación, ej. "portrait". Requiere fullscreen en varios navegadores. */
  lockOrientation?: OrientationLockType;
  disabled?: boolean;
}

interface UseImmersiveReturn {
  /** altura real del viewport en px */
  viewportHeight: number;
  /** está en fullscreen ahora */
  isFullscreen: boolean;
  /** el navegador soporta Fullscreen API */
  fullscreenSupported: boolean;
  /** el wake lock está activo */
  awake: boolean;
  enterFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  toggleFullscreen: () => Promise<void>;
  /** vuelve a esconder la barra de direcciones */
  hideBrowserBar: () => void;
}

/**
 * Modo inmersivo: esconde la barra del navegador, sigue la altura real del
 * viewport, y opcionalmente entra en fullscreen / mantiene la pantalla encendida.
 */
export function useImmersive(options: UseImmersiveOptions = {}): UseImmersiveReturn {
  const {
    hideAddressBar = true,
    trackViewportHeight = true,
    fullscreenOnInteraction = false,
    keepAwake = false,
    lockOrientation,
    disabled = false,
  } = options;

  const [viewportHeight, setViewportHeight] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [awake, setAwake] = useState(false);
  const wakeRef = useRef<WakeLockSentinel | null>(null);

  const fullscreenSupported =
    typeof document !== "undefined" && Boolean(document.fullscreenEnabled);

  const hideBrowserBar = useCallback(() => {
    // El truco: un scroll mínimo hace que el navegador colapse su chrome.
    if (window.scrollY > 1) return;
    window.scrollTo(0, 1);
    setTimeout(() => window.scrollTo(0, 0), 60);
  }, []);

  // ---- altura real del viewport ----
  useEffect(() => {
    if (disabled || !trackViewportHeight) return;
    const sync = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      setViewportHeight(h);
      document.documentElement.style.setProperty("--app-height", `${h}px`);
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
  }, [disabled, trackViewportHeight]);

  // ---- esconder la barra de direcciones ----
  useEffect(() => {
    if (disabled || !hideAddressBar) return;
    const t = setTimeout(hideBrowserBar, 120);
    window.addEventListener("orientationchange", hideBrowserBar);
    return () => {
      clearTimeout(t);
      window.removeEventListener("orientationchange", hideBrowserBar);
    };
  }, [disabled, hideAddressBar, hideBrowserBar]);

  // ---- fullscreen ----
  const enterFullscreen = useCallback(async () => {
    try {
      await document.documentElement.requestFullscreen?.();
      if (lockOrientation) {
        await (screen.orientation as unknown as { lock?: (o: string) => Promise<void> })
          .lock?.(lockOrientation)
          .catch(() => {});
      }
    } catch { /* el usuario lo rechazó o no está soportado */ }
  }, [lockOrientation]);

  const exitFullscreen = useCallback(async () => {
    try { await document.exitFullscreen?.(); } catch {}
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) await exitFullscreen();
    else await enterFullscreen();
  }, [enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const sync = () => setIsFullscreen(Boolean(document.fullscreenElement));
    sync();
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  useEffect(() => {
    if (disabled || !fullscreenOnInteraction) return;
    const once = () => { enterFullscreen(); cleanup(); };
    const cleanup = () => {
      window.removeEventListener("pointerdown", once);
      window.removeEventListener("keydown", once);
    };
    window.addEventListener("pointerdown", once, { once: true });
    window.addEventListener("keydown", once, { once: true });
    return cleanup;
  }, [disabled, fullscreenOnInteraction, enterFullscreen]);

  // ---- wake lock ----
  useEffect(() => {
    if (disabled || !keepAwake) return;
    let released = false;

    const request = async () => {
      try {
        const wl = (navigator as unknown as {
          wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinel> };
        }).wakeLock;
        if (!wl) return;
        const sentinel = await wl.request("screen");
        if (released) { sentinel.release(); return; }
        wakeRef.current = sentinel;
        setAwake(true);
        sentinel.addEventListener("release", () => setAwake(false));
      } catch { /* batería baja o no soportado */ }
    };

    request();
    // el lock se pierde al volver de background: lo re-pedimos
    const onVisible = () => { if (document.visibilityState === "visible") request(); };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      released = true;
      document.removeEventListener("visibilitychange", onVisible);
      wakeRef.current?.release().catch(() => {});
      wakeRef.current = null;
      setAwake(false);
    };
  }, [disabled, keepAwake]);

  return {
    viewportHeight, isFullscreen, fullscreenSupported, awake,
    enterFullscreen, exitFullscreen, toggleFullscreen, hideBrowserBar,
  };
}
