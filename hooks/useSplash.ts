"use client";

import { useEffect, useRef, useState } from "react";

interface UseSplashOptions {
  /** ms mínimos que se muestra el splash (evita un flash molesto). Default: 1400 */
  minDuration?: number;
  /**
   * Promesa a esperar antes de ocultar (fuentes, sesión, primer fetch…).
   * Si se omite, sólo se respeta minDuration.
   */
  until?: () => Promise<unknown>;
  /** esperar a que las fuentes estén listas. Default: true */
  waitForFonts?: boolean;
  /** mostrar sólo una vez por sesión (sessionStorage). Default: false */
  oncePerSession?: boolean;
  /** clave de sessionStorage para oncePerSession */
  storageKey?: string;
}

interface UseSplashReturn {
  /** el splash debe estar visible */
  visible: boolean;
  /** 0 → 1, progreso estimado sobre minDuration */
  progress: number;
  /** ocultar manualmente */
  hide: () => void;
}

/**
 * Controla el ciclo de vida del splash: espera lo que haga falta,
 * garantiza una duración mínima y expone un progreso para la UI.
 */
export function useSplash(options: UseSplashOptions = {}): UseSplashReturn {
  const {
    minDuration = 1400,
    until,
    waitForFonts = true,
    oncePerSession = false,
    storageKey = "splash-shown",
  } = options;

  const [visible, setVisible] = useState(() => {
    if (!oncePerSession || typeof sessionStorage === "undefined") return true;
    try { return sessionStorage.getItem(storageKey) !== "1"; } catch { return true; }
  });
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    if (!visible) return;
    let raf: number;
    let cancelled = false;

    const tick = () => {
      const p = Math.min(1, (Date.now() - startRef.current) / minDuration);
      setProgress(p);
      if (p < 1 && !cancelled) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const jobs: Promise<unknown>[] = [
      new Promise((r) => setTimeout(r, minDuration)),
    ];
    if (waitForFonts && typeof document !== "undefined" && document.fonts) {
      jobs.push(document.fonts.ready.catch(() => {}));
    }
    if (until) jobs.push(until().catch(() => {}));

    Promise.all(jobs).then(() => {
      if (cancelled) return;
      setProgress(1);
      setVisible(false);
      if (oncePerSession) {
        try { sessionStorage.setItem(storageKey, "1"); } catch {}
      }
    });

    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [visible, minDuration, until, waitForFonts, oncePerSession, storageKey]);

  const hide = () => {
    setVisible(false);
    if (oncePerSession) {
      try { sessionStorage.setItem(storageKey, "1"); } catch {}
    }
  };

  return { visible, progress, hide };
}
