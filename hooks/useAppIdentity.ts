"use client";

import { useCallback, useEffect } from "react";
import { usePersistentState } from "./usePersistentState";

export interface AppIdentity {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  /** dataURL del ícono base (idealmente 512x512, fondo sólido) */
  icon: string | null;
  /** dataURL del ícono maskable (mismo arte con ~20% de padding) */
  maskableIcon: string | null;
}

export const APP_IDENTITY_DEFAULTS: AppIdentity = {
  name: "Scaffolding · Tu app",
  shortName: "Scaffolding",
  description: "Descripción corta que se ve en la ficha de instalación.",
  themeColor: "#2563eb",
  backgroundColor: "#ffffff",
  icon: null,
  maskableIcon: null,
};

interface UseAppIdentityOptions {
  storageKey?: string;
  /** pisar meta theme-color, favicon y <title> en cuanto cambia. Default: true */
  applyLive?: boolean;
}

/**
 * Config editable de identidad de la app (nombre, colores, íconos), persistida
 * localmente. `buildManifest()` la combina con tu manifest.json real para
 * generar el JSON final; `downloadManifest()` lo descarga listo para pisar
 * `public/manifest.json` (y regenerar los PNG de `/icons` a partir del ícono).
 */
export function useAppIdentity({ storageKey = "app.identity", applyLive = true }: UseAppIdentityOptions = {}) {
  const [identity, setIdentity, { hydrated, reset }] = usePersistentState<AppIdentity>(storageKey, APP_IDENTITY_DEFAULTS);

  const update = useCallback(
    (patch: Partial<AppIdentity>) => setIdentity((prev) => ({ ...prev, ...patch })),
    [setIdentity],
  );

  useEffect(() => {
    if (!applyLive || !hydrated) return;
    let meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    meta.content = identity.themeColor;
    document.title = identity.name;

    if (identity.icon) {
      let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = identity.icon;
    }
  }, [identity, applyLive, hydrated]);

  const buildManifest = useCallback(
    (base: Record<string, unknown> = {}) => ({
      ...base,
      name: identity.name,
      short_name: identity.shortName,
      description: identity.description,
      theme_color: identity.themeColor,
      background_color: identity.backgroundColor,
      icons: [
        ...(identity.icon
          ? [
              { src: identity.icon, sizes: "512x512", type: "image/png" },
              { src: identity.icon, sizes: "192x192", type: "image/png" },
            ]
          : ((base as { icons?: unknown[] }).icons ?? [])),
        ...(identity.maskableIcon
          ? [{ src: identity.maskableIcon, sizes: "512x512", type: "image/png", purpose: "maskable" }]
          : []),
      ],
    }),
    [identity],
  );

  const downloadManifest = useCallback(
    (base?: Record<string, unknown>) => {
      const manifest = buildManifest(base);
      const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "manifest.json";
      a.click();
      URL.revokeObjectURL(url);
    },
    [buildManifest],
  );

  return { identity, update, set: setIdentity, reset, hydrated, buildManifest, downloadManifest };
}
