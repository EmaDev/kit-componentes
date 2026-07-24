"use client";

import { useEffect, useState } from "react";

interface UseOnlineStatusReturn {
  /** hay conexión según el navegador */
  online: boolean;
  /** true durante unos segundos después de recuperar la conexión (para mostrar "¡De nuevo online!") */
  justReconnected: boolean;
  /** tipo de conexión efectiva si la Network Information API está disponible ("4g", "3g", "2g", "slow-2g") */
  effectiveType: string | null;
  /** conexión lenta declarada por el navegador (2g / slow-2g o saveData activo) */
  slowConnection: boolean;
}

type NetworkInformation = {
  effectiveType?: string;
  saveData?: boolean;
  addEventListener?: (t: string, cb: () => void) => void;
  removeEventListener?: (t: string, cb: () => void) => void;
};

function getConnection(): NetworkInformation | undefined {
  if (typeof navigator === "undefined") return undefined;
  return (navigator as unknown as { connection?: NetworkInformation }).connection;
}

/**
 * Estado de conectividad para apps PWA.
 * SSR-safe: asume online en el server y se corrige al hidratar.
 */
export function useOnlineStatus(reconnectedMs = 3000): UseOnlineStatusReturn {
  const [online, setOnline] = useState(true);
  const [justReconnected, setJustReconnected] = useState(false);
  const [effectiveType, setEffectiveType] = useState<string | null>(null);
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);

    const conn = getConnection();
    const syncConn = () => {
      const c = getConnection();
      setEffectiveType(c?.effectiveType ?? null);
      setSaveData(Boolean(c?.saveData));
    };
    syncConn();
    conn?.addEventListener?.("change", syncConn);

    let t: ReturnType<typeof setTimeout>;
    const onOnline = () => {
      setOnline(true);
      setJustReconnected(true);
      t = setTimeout(() => setJustReconnected(false), reconnectedMs);
    };
    const onOffline = () => {
      setOnline(false);
      setJustReconnected(false);
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      conn?.removeEventListener?.("change", syncConn);
      clearTimeout(t);
    };
  }, [reconnectedMs]);

  const slowConnection =
    saveData || effectiveType === "2g" || effectiveType === "slow-2g";

  return { online, justReconnected, effectiveType, slowConnection };
}
