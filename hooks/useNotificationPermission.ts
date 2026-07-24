"use client";

import { useCallback, useEffect, useState } from "react";

export type NotificationStatus =
  | "unsupported"
  | "default"
  | "granted"
  | "denied";

interface UseNotificationPermissionReturn {
  status: NotificationStatus;
  /** se puede pedir permiso (aún no decidió) */
  canAsk: boolean;
  /** pide permiso al navegador */
  request: () => Promise<NotificationStatus>;
  /** dispara una notificación local de prueba (requiere granted) */
  notify: (title: string, options?: NotificationOptions) => Promise<boolean>;
}

/**
 * Maneja el permiso de notificaciones.
 * Ojo en iOS: sólo funciona con la PWA ya instalada en pantalla de inicio.
 */
export function useNotificationPermission(): UseNotificationPermissionReturn {
  const [status, setStatus] = useState<NotificationStatus>("unsupported");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setStatus(Notification.permission as NotificationStatus);
  }, []);

  const request = useCallback(async (): Promise<NotificationStatus> => {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
    try {
      const result = (await Notification.requestPermission()) as NotificationStatus;
      setStatus(result);
      return result;
    } catch {
      return status;
    }
  }, [status]);

  const notify = useCallback(async (title: string, options?: NotificationOptions) => {
    if (typeof window === "undefined" || !("Notification" in window)) return false;
    if (Notification.permission !== "granted") return false;
    try {
      // vía service worker si está disponible (necesario en Android/Chrome)
      const reg = await navigator.serviceWorker?.getRegistration?.();
      if (reg) await reg.showNotification(title, options);
      else new Notification(title, options);
      return true;
    } catch {
      return false;
    }
  }, []);

  return { status, canAsk: status === "default", request, notify };
}
