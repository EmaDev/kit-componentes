"use client";

import { useCallback, useEffect, useState } from "react";

// Evento de Chromium para instalación de PWA
type BeforeInstallPromptEvent = Event & {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt: () => Promise<void>;
};

export type PwaPlatform = "android" | "ios" | "desktop" | "other";

interface UsePwaInstallOptions {
  /** ms a esperar antes de marcar como instalable (evita flicker al cargar) */
  delay?: number;
  /** clave de localStorage donde se persiste el dismiss. Default: "pwa-install-dismissed" */
  storageKey?: string;
  /** cuántos días respetar un dismiss antes de volver a mostrar. Default: 14 */
  snoozeDays?: number;
}

interface UsePwaInstallReturn {
  /** plataforma detectada */
  platform: PwaPlatform;
  /** si la app ya está corriendo como instalada */
  isStandalone: boolean;
  /** se puede ofrecer instalación (Android con evento listo, o iOS Safari) */
  canInstall: boolean;
  /** si el usuario lo descartó recientemente (todavía dentro del snooze) */
  dismissed: boolean;
  /** dispara el prompt nativo (Android/desktop). Devuelve "accepted" | "dismissed" | "unsupported" */
  install: () => Promise<"accepted" | "dismissed" | "unsupported">;
  /** persiste un dismiss para no volver a molestar durante `snoozeDays` */
  dismiss: () => void;
  /** borra el dismiss guardado (para testing) */
  reset: () => void;
}

function detectPlatform(): { platform: PwaPlatform; isStandalone: boolean } {
  if (typeof window === "undefined") return { platform: "other", isStandalone: false };
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
  const isAndroid = /android/i.test(ua);
  const isStandalone =
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // @ts-expect-error iOS-only API
    window.navigator.standalone === true;

  let platform: PwaPlatform = "other";
  if (isIOS) platform = "ios";
  else if (isAndroid) platform = "android";
  else platform = "desktop";

  return { platform, isStandalone };
}

export function usePwaInstall(options: UsePwaInstallOptions = {}): UsePwaInstallReturn {
  const {
    delay = 1500,
    storageKey = "pwa-install-dismissed",
    snoozeDays = 14,
  } = options;

  const [platform, setPlatform] = useState<PwaPlatform>("other");
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [ready, setReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Detección + listeners
  useEffect(() => {
    const info = detectPlatform();
    setPlatform(info.platform);
    setIsStandalone(info.isStandalone);

    // Lee dismiss persistido
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const at = parseInt(raw, 10);
        if (!Number.isNaN(at)) {
          const ageDays = (Date.now() - at) / (1000 * 60 * 60 * 24);
          if (ageDays < snoozeDays) setDismissed(true);
          else localStorage.removeItem(storageKey);
        }
      }
    } catch {
      /* localStorage bloqueado */
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setIsStandalone(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    const t = setTimeout(() => setReady(true), delay);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      clearTimeout(t);
    };
  }, [delay, snoozeDays, storageKey]);

  const install = useCallback(async (): Promise<"accepted" | "dismissed" | "unsupported"> => {
    if (!deferred) return "unsupported";
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      setDeferred(null);
      if (choice.outcome === "dismissed") {
        try { localStorage.setItem(storageKey, String(Date.now())); } catch {}
        setDismissed(true);
      }
      return choice.outcome;
    } catch {
      return "dismissed";
    }
  }, [deferred, storageKey]);

  const dismiss = useCallback(() => {
    try { localStorage.setItem(storageKey, String(Date.now())); } catch {}
    setDismissed(true);
  }, [storageKey]);

  const reset = useCallback(() => {
    try { localStorage.removeItem(storageKey); } catch {}
    setDismissed(false);
  }, [storageKey]);

  // canInstall: Android/desktop necesitan el evento listo; iOS Safari siempre puede mostrarse manualmente.
  const canInstall =
    ready &&
    !isStandalone &&
    !dismissed &&
    (platform === "ios" || deferred !== null);

  return { platform, isStandalone, canInstall, dismissed, install, dismiss, reset };
}
