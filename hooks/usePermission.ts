"use client";

import { useCallback, useEffect, useState } from "react";

export type PermissionKind =
  | "camera"
  | "microphone"
  | "geolocation"
  | "notifications"
  | "clipboard-read"
  | "persistent-storage";

export type PermissionState = "unsupported" | "prompt" | "granted" | "denied";

/**
 * Estado de un permiso del navegador, reactivo (escucha el evento `change`
 * de la Permissions API). No pide el permiso: eso lo hace el hook o el
 * componente dueño de la feature (useCamera, useGeolocation…).
 */
export function usePermission(kind: PermissionKind) {
  const [state, setState] = useState<PermissionState>("prompt");

  useEffect(() => {
    let status: PermissionStatus | null = null;
    let alive = true;

    const sync = () => alive && status && setState(status.state as PermissionState);

    if (kind === "notifications" && typeof Notification !== "undefined") {
      setState(Notification.permission === "default" ? "prompt" : (Notification.permission as PermissionState));
    }

    navigator.permissions
      ?.query({ name: kind as PermissionName })
      .then((s) => {
        if (!alive) return;
        status = s;
        setState(s.state as PermissionState);
        s.addEventListener("change", sync);
      })
      .catch(() => alive && setState((prev) => (prev === "prompt" ? "unsupported" : prev)));

    return () => {
      alive = false;
      status?.removeEventListener("change", sync);
    };
  }, [kind]);

  /** dispara el pedido nativo del permiso correspondiente */
  const request = useCallback(async (): Promise<PermissionState> => {
    try {
      if (kind === "notifications") {
        const r = await Notification.requestPermission();
        const next = (r === "default" ? "prompt" : r) as PermissionState;
        setState(next);
        return next;
      }
      if (kind === "camera" || kind === "microphone") {
        const stream = await navigator.mediaDevices.getUserMedia(
          kind === "camera" ? { video: true } : { audio: true },
        );
        stream.getTracks().forEach((t) => t.stop());
        setState("granted");
        return "granted";
      }
      if (kind === "geolocation") {
        await new Promise<void>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(() => resolve(), reject),
        );
        setState("granted");
        return "granted";
      }
      if (kind === "persistent-storage") {
        const ok = (await navigator.storage?.persist?.()) ?? false;
        setState(ok ? "granted" : "denied");
        return ok ? "granted" : "denied";
      }
      return state;
    } catch {
      setState("denied");
      return "denied";
    }
  }, [kind, state]);

  return { state, request, granted: state === "granted", denied: state === "denied" };
}
