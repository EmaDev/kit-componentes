"use client";

import { useCallback, useEffect, useState } from "react";

interface StorageInfo {
  /** bytes usados por la app (caches + IDB + localStorage) */
  usage: number;
  /** cuota total que el navegador le da al origen */
  quota: number;
  /** 0–1 */
  ratio: number;
  /** el almacenamiento es persistente (el SO no lo borra por presión de disco) */
  persisted: boolean;
  supported: boolean;
}

/**
 * Cuánto espacio ocupa la app instalada, si el almacenamiento es persistente
 * y utilidades para limpiar las Cache Storage.
 */
export function useStorageEstimate() {
  const [info, setInfo] = useState<StorageInfo>({
    usage: 0,
    quota: 0,
    ratio: 0,
    persisted: false,
    supported: false,
  });

  const refresh = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
      setInfo((i) => ({ ...i, supported: false }));
      return;
    }
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    const persisted = (await navigator.storage.persisted?.()) ?? false;
    setInfo({ usage, quota, ratio: quota ? usage / quota : 0, persisted, supported: true });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** pide al navegador no borrar los datos ante presión de disco */
  const requestPersistence = useCallback(async () => {
    const ok = (await navigator.storage?.persist?.()) ?? false;
    await refresh();
    return ok;
  }, [refresh]);

  /** borra todas las Cache Storage (no toca IndexedDB ni localStorage) */
  const clearCaches = useCallback(async () => {
    if (typeof caches === "undefined") return 0;
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => caches.delete(k)));
    await refresh();
    return keys.length;
  }, [refresh]);

  return { ...info, refresh, requestPersistence, clearCaches };
}

/** 24.8 MB */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : decimals)} ${units[i]}`;
}
