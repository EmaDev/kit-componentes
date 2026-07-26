"use client";

import { useEffect, useState } from "react";

export type Quality = "fast" | "medium" | "slow" | "offline";

interface NetworkQuality {
  quality: Quality;
  effectiveType: string | null;
  downlink: number | null;
  rtt: number | null;
  saveData: boolean;
  /** cargar imágenes pesadas, video, prefetch */
  allowHeavy: boolean;
  /** sufijo o ancho sugerido para pedir la imagen */
  imageWidth: 480 | 800 | 1600;
}

type Conn = {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  addEventListener?: (t: string, cb: () => void) => void;
  removeEventListener?: (t: string, cb: () => void) => void;
};

/**
 * Calidad de conexión para carga adaptativa: bajá la resolución de las
 * imágenes, evitá autoplay y desactivá el prefetch cuando la red es mala
 * o el usuario activó "ahorro de datos".
 */
export function useNetworkQuality(): NetworkQuality {
  const [info, setInfo] = useState<Omit<NetworkQuality, "quality" | "allowHeavy" | "imageWidth">>({
    effectiveType: null,
    downlink: null,
    rtt: null,
    saveData: false,
  });
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const conn = (navigator as unknown as { connection?: Conn }).connection;
    const sync = () =>
      setInfo({
        effectiveType: conn?.effectiveType ?? null,
        downlink: conn?.downlink ?? null,
        rtt: conn?.rtt ?? null,
        saveData: Boolean(conn?.saveData),
      });
    sync();
    setOnline(navigator.onLine);
    conn?.addEventListener?.("change", sync);
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      conn?.removeEventListener?.("change", sync);
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const quality: Quality = !online
    ? "offline"
    : info.saveData || info.effectiveType === "2g" || info.effectiveType === "slow-2g"
      ? "slow"
      : info.effectiveType === "3g"
        ? "medium"
        : "fast";

  return {
    ...info,
    quality,
    allowHeavy: quality === "fast",
    imageWidth: quality === "fast" ? 1600 : quality === "medium" ? 800 : 480,
  };
}
