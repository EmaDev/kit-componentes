"use client";

import { useEffect, useState } from "react";

export type OS = "ios" | "ipados" | "android" | "macos" | "windows" | "linux" | "unknown";
export type Browser = "safari" | "chrome" | "firefox" | "edge" | "samsung" | "webview" | "unknown";
export type FormFactor = "mobile" | "tablet" | "desktop";
export type DisplayMode = "browser" | "standalone" | "minimal-ui" | "fullscreen" | "twa";

export interface PlatformInfo {
  os: OS;
  browser: Browser;
  formFactor: FormFactor;
  /** cómo se está mostrando la app (standalone = instalada) */
  displayMode: DisplayMode;
  /** true si corre instalada como PWA (o TWA / WebView de app nativa) */
  isStandalone: boolean;
  isIos: boolean;
  isAndroid: boolean;
  /** iOS o Android */
  isMobileOs: boolean;
  /** dispositivo con pantalla táctil */
  isTouch: boolean;
  /** corre dentro de un WebView embebido (app nativa, Instagram, etc.) */
  isWebView: boolean;
  /** el dispositivo tiene safe areas > 0 (notch / dynamic island / home indicator) */
  hasSafeArea: boolean;
  /** insets reales en px, leídos de env(safe-area-inset-*) */
  safeArea: { top: number; right: number; bottom: number; left: number };
  /** el usuario pidió menos animación */
  prefersReducedMotion: boolean;
  /** densidad de pantalla */
  pixelRatio: number;
  /** true hasta que se resuelve en el cliente (evita mismatch de hidratación) */
  hydrating: boolean;
}

const EMPTY_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };

function readSafeArea() {
  if (typeof document === "undefined") return EMPTY_INSETS;
  // Se lee vía una var CSS calculada: env() no es accesible desde JS directamente.
  const probe = document.createElement("div");
  probe.style.cssText = [
    "position:fixed",
    "visibility:hidden",
    "pointer-events:none",
    "top:env(safe-area-inset-top,0px)",
    "right:env(safe-area-inset-right,0px)",
    "bottom:env(safe-area-inset-bottom,0px)",
    "left:env(safe-area-inset-left,0px)",
  ].join(";");
  document.documentElement.appendChild(probe);
  const cs = getComputedStyle(probe);
  const insets = {
    top: parseFloat(cs.top) || 0,
    right: parseFloat(cs.right) || 0,
    bottom: parseFloat(cs.bottom) || 0,
    left: parseFloat(cs.left) || 0,
  };
  probe.remove();
  return insets;
}

function detect(): Omit<PlatformInfo, "hydrating"> {
  if (typeof window === "undefined") {
    return {
      os: "unknown", browser: "unknown", formFactor: "desktop",
      displayMode: "browser", isStandalone: false, isIos: false, isAndroid: false,
      isMobileOs: false, isTouch: false, isWebView: false, hasSafeArea: false,
      safeArea: EMPTY_INSETS, prefersReducedMotion: false, pixelRatio: 1,
    };
  }

  const ua = navigator.userAgent;
  const uaLower = ua.toLowerCase();
  const maxTouch = navigator.maxTouchPoints || 0;
  const isTouch = maxTouch > 0 || "ontouchstart" in window;

  // --- OS ---
  const isIphone = /iPhone|iPod/.test(ua);
  // iPad moderno miente y dice "Macintosh": lo detectamos por touch points
  const isIpad = /iPad/.test(ua) || (/Macintosh/.test(ua) && maxTouch > 1);
  const isAndroid = /Android/i.test(ua);
  let os: OS = "unknown";
  if (isIphone) os = "ios";
  else if (isIpad) os = "ipados";
  else if (isAndroid) os = "android";
  else if (/Mac OS X/.test(ua)) os = "macos";
  else if (/Windows/.test(ua)) os = "windows";
  else if (/Linux|X11/.test(ua)) os = "linux";

  // --- Browser ---
  let browser: Browser = "unknown";
  if (/SamsungBrowser/i.test(ua)) browser = "samsung";
  else if (/Edg\//i.test(ua)) browser = "edge";
  else if (/Firefox|FxiOS/i.test(ua)) browser = "firefox";
  else if (/CriOS|Chrome/i.test(ua)) browser = "chrome";
  else if (/Safari/i.test(ua)) browser = "safari";

  // --- WebView embebido ---
  const isIosWebView = (isIphone || isIpad) && !/Safari/.test(ua);
  const isAndroidWebView = isAndroid && /; wv\)|Version\/[\d.]+ Chrome/.test(ua);
  const isInApp = /FBAN|FBAV|Instagram|Line\/|Twitter|WhatsApp|TikTok/i.test(uaLower);
  const isWebView = isIosWebView || isAndroidWebView || isInApp;
  if (isWebView && browser === "unknown") browser = "webview";

  // --- Display mode ---
  const modes: DisplayMode[] = ["fullscreen", "standalone", "minimal-ui"];
  let displayMode: DisplayMode = "browser";
  for (const m of modes) {
    if (window.matchMedia?.(`(display-mode: ${m})`).matches) { displayMode = m; break; }
  }
  // iOS Safari usa una API propia
  const iosStandalone = (navigator as unknown as { standalone?: boolean }).standalone === true;
  // Android TWA se anuncia por el referrer
  const isTwa = document.referrer.startsWith("android-app://");
  if (isTwa) displayMode = "twa";
  else if (iosStandalone) displayMode = "standalone";
  const isStandalone = displayMode !== "browser";

  // --- Form factor ---
  const shortest = Math.min(window.screen.width, window.screen.height);
  let formFactor: FormFactor = "desktop";
  if (isIpad || (isTouch && shortest >= 600 && shortest < 1100)) formFactor = "tablet";
  else if (isIphone || isAndroid || (isTouch && shortest < 600)) formFactor = "mobile";

  const safeArea = readSafeArea();

  return {
    os, browser, formFactor, displayMode, isStandalone,
    isIos: isIphone || isIpad,
    isAndroid,
    isMobileOs: isIphone || isIpad || isAndroid,
    isTouch, isWebView,
    hasSafeArea: safeArea.top > 0 || safeArea.bottom > 0,
    safeArea,
    prefersReducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    pixelRatio: window.devicePixelRatio || 1,
  };
}

/**
 * Detecta plataforma, navegador, form factor, modo de display y safe areas.
 * SSR-safe: durante el primer render devuelve valores neutros con
 * `hydrating: true`, y se resuelve al montar en el cliente.
 *
 * ```tsx
 * const { isIos, isStandalone, formFactor } = usePlatform();
 * if (isIos && !isStandalone) return <IosInstallHint />;
 * ```
 */
export function usePlatform(): PlatformInfo {
  const [info, setInfo] = useState<PlatformInfo>(() => ({
    ...detect(),
    hydrating: true,
  }));

  useEffect(() => {
    const sync = () => setInfo({ ...detect(), hydrating: false });
    sync();

    const mqs = [
      window.matchMedia("(display-mode: standalone)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];
    mqs.forEach((mq) => mq.addEventListener?.("change", sync));
    window.addEventListener("orientationchange", sync);
    window.addEventListener("resize", sync);

    return () => {
      mqs.forEach((mq) => mq.removeEventListener?.("change", sync));
      window.removeEventListener("orientationchange", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  return info;
}
