"use client";

import { useEffect } from "react";

/**
 * Sincroniza `<meta name="theme-color">`, que es lo que tiñe la barra de
 * estado en Android y la barra superior de la PWA instalada en iOS.
 * Llamalo por pantalla para que el "chrome" siga al color del header.
 *
 * ```tsx
 * useStatusBarColor("#0f172a");                    // fijo
 * useStatusBarColor({ light: "#fff", dark: "#0f172a" }); // según el tema
 * ```
 */
export function useStatusBarColor(color: string | { light: string; dark: string }) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const isPair = typeof color === "object";
    const ensure = (media?: string) => {
      const selector = media
        ? `meta[name="theme-color"][media="${media}"]`
        : 'meta[name="theme-color"]:not([media])';
      let meta = document.querySelector<HTMLMetaElement>(selector);
      let created = false;
      if (!meta) {
        meta = document.createElement("meta");
        meta.name = "theme-color";
        if (media) meta.media = media;
        document.head.appendChild(meta);
        created = true;
      }
      return { meta, created, prev: meta.content };
    };

    const entries = isPair
      ? [
          { ...ensure("(prefers-color-scheme: light)"), value: color.light },
          { ...ensure("(prefers-color-scheme: dark)"), value: color.dark },
        ]
      : [{ ...ensure(), value: color }];

    entries.forEach((e) => { e.meta.content = e.value; });

    return () => {
      entries.forEach((e) => {
        if (e.created) e.meta.remove();
        else e.meta.content = e.prev;
      });
    };
  }, [color]);
}
