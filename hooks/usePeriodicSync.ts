"use client";

import { useCallback, useEffect, useState } from "react";

type PeriodicSyncManager = {
  register: (tag: string, options?: { minInterval: number }) => Promise<void>;
  unregister: (tag: string) => Promise<void>;
  getTags: () => Promise<string[]>;
};

/**
 * Actualización en segundo plano cada tantas horas (Chrome, sólo con la PWA
 * instalada y con "engagement" suficiente). Es un extra, nunca la única vía:
 * mantené siempre el refresh al volver a la app (useAppLifecycle).
 */
export function usePeriodicSync(tag = "refresh-content", minIntervalHours = 12) {
  const [registered, setRegistered] = useState(false);
  const [supported, setSupported] = useState(false);

  const getManager = useCallback(async () => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
    const reg = (await navigator.serviceWorker.ready) as ServiceWorkerRegistration & {
      periodicSync?: PeriodicSyncManager;
    };
    return reg.periodicSync ?? null;
  }, []);

  useEffect(() => {
    let alive = true;
    getManager().then(async (mgr) => {
      if (!alive) return;
      setSupported(Boolean(mgr));
      if (!mgr) return;
      const tags = await mgr.getTags().catch(() => [] as string[]);
      setRegistered(tags.includes(tag));
    });
    return () => {
      alive = false;
    };
  }, [getManager, tag]);

  const register = useCallback(async () => {
    const mgr = await getManager();
    if (!mgr) return false;
    try {
      // requiere permiso "periodic-background-sync"
      await mgr.register(tag, { minInterval: minIntervalHours * 60 * 60 * 1000 });
      setRegistered(true);
      return true;
    } catch {
      return false;
    }
  }, [getManager, minIntervalHours, tag]);

  const unregister = useCallback(async () => {
    const mgr = await getManager();
    await mgr?.unregister(tag).catch(() => {});
    setRegistered(false);
  }, [getManager, tag]);

  return { supported, registered, register, unregister };
}
