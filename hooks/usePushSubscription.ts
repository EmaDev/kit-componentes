"use client";

import { useCallback, useEffect, useState } from "react";

interface UsePushOptions {
  /** clave pública VAPID de tu backend (base64 url-safe) */
  publicKey: string;
  /** dar de alta la suscripción en tu servidor */
  onSubscribe?: (sub: PushSubscription) => Promise<void> | void;
  /** dar de baja en tu servidor */
  onUnsubscribe?: (sub: PushSubscription) => Promise<void> | void;
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

/**
 * Suscripción a Web Push (VAPID). Complementa a useNotificationPermission:
 * ese pide el permiso, este crea y sincroniza la suscripción con tu backend.
 */
export function usePushSubscription({ publicKey, onSubscribe, onUnsubscribe }: UsePushOptions) {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [supported, setSupported] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    setSupported(ok);
    if (!ok) return;
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then(setSubscription)
      .catch(() => setSubscription(null));
  }, []);

  const subscribe = useCallback(async () => {
    if (!supported) return null;
    setBusy(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") throw new Error("Permiso denegado");
      const reg = await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
        }));
      await onSubscribe?.(sub);
      setSubscription(sub);
      return sub;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return null;
    } finally {
      setBusy(false);
    }
  }, [onSubscribe, publicKey, supported]);

  const unsubscribe = useCallback(async () => {
    if (!subscription) return;
    setBusy(true);
    try {
      await onUnsubscribe?.(subscription);
      await subscription.unsubscribe();
      setSubscription(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, [onUnsubscribe, subscription]);

  return {
    supported,
    subscribed: Boolean(subscription),
    subscription,
    busy,
    error,
    subscribe,
    unsubscribe,
  };
}
