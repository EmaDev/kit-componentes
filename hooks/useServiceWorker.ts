"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseServiceWorkerOptions {
  /** ruta del service worker. Default: "/sw.js" */
  url?: string;
  /** registrar automáticamente al montar. Default: true */
  autoRegister?: boolean;
  /** cada cuántos ms buscar una versión nueva. 0 = desactivado. Default: 60min */
  checkIntervalMs?: number;
}

interface UseServiceWorkerReturn {
  /** el navegador soporta service workers */
  supported: boolean;
  /** el SW está activo y controlando la página */
  registered: boolean;
  /** hay una versión nueva esperando para activarse */
  updateAvailable: boolean;
  /** true mientras se aplica la actualización */
  updating: boolean;
  /** activa la versión nueva y recarga la página */
  applyUpdate: () => void;
  /** fuerza una búsqueda de actualización */
  checkForUpdate: () => Promise<void>;
}

/**
 * Registra el service worker y detecta cuándo hay una versión nueva
 * lista para activarse (patrón skipWaiting + controllerchange).
 *
 * El sw.js debe escuchar: self.addEventListener("message", e => {
 *   if (e.data?.type === "SKIP_WAITING") self.skipWaiting();
 * });
 */
export function useServiceWorker(options: UseServiceWorkerOptions = {}): UseServiceWorkerReturn {
  const { url = "/sw.js", autoRegister = true, checkIntervalMs = 60 * 60 * 1000 } = options;

  const [supported, setSupported] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updating, setUpdating] = useState(false);
  const regRef = useRef<ServiceWorkerRegistration | null>(null);
  const waitingRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    setSupported(true);
    if (!autoRegister) return;

    let interval: ReturnType<typeof setInterval>;
    let cancelled = false;

    const trackWaiting = (reg: ServiceWorkerRegistration) => {
      // ya hay uno esperando (usuario volvió con una versión nueva desplegada)
      if (reg.waiting && navigator.serviceWorker.controller) {
        waitingRef.current = reg.waiting;
        setUpdateAvailable(true);
      }
      reg.addEventListener("updatefound", () => {
        const incoming = reg.installing;
        if (!incoming) return;
        incoming.addEventListener("statechange", () => {
          if (incoming.state === "installed" && navigator.serviceWorker.controller) {
            waitingRef.current = incoming;
            setUpdateAvailable(true);
          }
        });
      });
    };

    navigator.serviceWorker
      .register(url)
      .then((reg) => {
        if (cancelled) return;
        regRef.current = reg;
        setRegistered(true);
        trackWaiting(reg);
        if (checkIntervalMs > 0) {
          interval = setInterval(() => reg.update().catch(() => {}), checkIntervalMs);
        }
      })
      .catch(() => setRegistered(false));

    // cuando el nuevo SW toma control, recargamos una sola vez
    let reloading = false;
    const onControllerChange = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      cancelled = true;
      clearInterval(interval);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, [url, autoRegister, checkIntervalMs]);

  const applyUpdate = useCallback(() => {
    const waiting = waitingRef.current ?? regRef.current?.waiting;
    if (!waiting) {
      window.location.reload();
      return;
    }
    setUpdating(true);
    waiting.postMessage({ type: "SKIP_WAITING" });
    // fallback si controllerchange no dispara
    setTimeout(() => window.location.reload(), 2500);
  }, []);

  const checkForUpdate = useCallback(async () => {
    try { await regRef.current?.update(); } catch { /* offline */ }
  }, []);

  return { supported, registered, updateAvailable, updating, applyUpdate, checkForUpdate };
}
