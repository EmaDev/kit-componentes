"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";
import { AppHeader, type HeaderAction } from "./AppHeader";
import { BottomNav, type BottomNavItem } from "./BottomNav";
import { NotificationPanel, type AppNotification } from "./NotificationPanel";
import { SnackbarProvider, type SnackbarPosition } from "./Snackbar";
import { SafeArea } from "./SafeArea";
import { BottomSheet } from "./BottomSheet";
import { SplashScreen, type SplashVariant } from "./SplashScreen";
import { PwaInstallPrompt } from "./PwaInstallPrompt";
import { OfflineBanner } from "./OfflineBanner";
import { OfflineFallback } from "./OfflineFallback";
import { UpdatePrompt } from "./UpdatePrompt";
import { PermissionGate } from "./PermissionGate";
import { NativeShell } from "./NativeShell";
import { useSplash } from "../hooks/useSplash";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import type { PermissionKind } from "../hooks/usePermission";

type PackageAppHeaderProps = Omit<ComponentProps<typeof AppHeader>, "children">;

export interface PackageAppNotifications {
  items: AppNotification[];
  onRead?: (id: string) => void;
  onReadAll?: () => void;
  onDismiss?: (id: string) => void;
  onClear?: () => void;
  onItemClick?: (n: AppNotification) => void;
  title?: string;
  emptyTitle?: string;
  emptyHint?: string;
}

export interface PackageAppPermission {
  kind: PermissionKind;
  /** por qué lo necesitás — se lo mostramos al usuario antes de pedirlo */
  reason: string;
  title?: string;
  icon?: ReactNode;
  cta?: string;
}

export interface PackageAppSplashProps {
  minDuration?: number;
  until?: () => Promise<unknown>;
  waitForFonts?: boolean;
  oncePerSession?: boolean;
  variant?: SplashVariant;
  tagline?: string;
  version?: string;
  footnote?: string;
  icon?: ReactNode;
  background?: ComponentProps<typeof SplashScreen>["background"];
}

export type AppSheetOptions = Omit<ComponentProps<typeof BottomSheet>, "open" | "onClose" | "children">;

interface AppSheetContextValue {
  /** abre el BottomSheet global con contenido arbitrario */
  openSheet: (content: ReactNode, options?: AppSheetOptions) => void;
  closeSheet: () => void;
}

const AppSheetContext = createContext<AppSheetContextValue | null>(null);

/** Acceso al BottomSheet global montado por `<PackageApp>` — evita repetir estado local por pantalla. */
export function useAppSheet(): AppSheetContextValue {
  const ctx = useContext(AppSheetContext);
  if (!ctx) throw new Error("useAppSheet must be used inside <PackageApp>");
  return ctx;
}

export interface PackageAppProps {
  /** Nombre de la app — usado en el Splash y en el prompt de instalación */
  appName: string;
  /** Contenido de la sección/pantalla (normalmente `children` de un `layout.tsx`) */
  children: ReactNode;

  /** Props de `AppHeader` para esta sección (sin `children`) */
  header: PackageAppHeaderProps;
  /** Tabs de navegación inferior (mobile). Si se omite, no se renderiza `BottomNav` */
  navItems?: BottomNavItem[];
  /** Agrega una campana al header que abre el historial de notificaciones en el BottomSheet global */
  notifications?: PackageAppNotifications;
  /**
   * Permisos requeridos antes de mostrar `children`, pedidos uno por uno con
   * `PermissionGate` (el siguiente sólo se pide una vez concedido el anterior).
   */
  requiredPermissions?: PackageAppPermission[];

  /** Splash inicial. `true` = configuración default, `false` = desactivado, objeto = config. Default: `true` */
  splash?: boolean | PackageAppSplashProps;
  /** Banner/sheet de instalación (Android + iOS). Default: `true` */
  installPrompt?: boolean | Omit<ComponentProps<typeof PwaInstallPrompt>, "appName">;
  /**
   * Estrategia de conectividad: `"banner"` (aviso no bloqueante, default),
   * `"fallback"` (reemplaza `children` por `OfflineFallback` mientras esté offline) o `false`.
   */
  offline?: "banner" | "fallback" | false;
  /** Aviso de nueva versión (service worker). Default: `false` (necesita un `swUrl` real). */
  updatePrompt?: boolean | ComponentProps<typeof UpdatePrompt>;
  /**
   * Bloqueos de experiencia nativa (zoom/overscroll/long-press) + altura real del viewport.
   * Default: `{ onlyWhenInstalled: true }` (recomendado por accesibilidad — ver `NativeShell`).
   */
  nativeShell?: boolean | ComponentProps<typeof NativeShell>;
  /** Posición de los snacks del `SnackbarProvider` interno. Default: `"bottom-center"` */
  snackbarPosition?: SnackbarPosition;

  className?: string;
  contentClassName?: string;
}

/**
 * Organismo raíz para armar la base de cualquier PWA de una: header, navegación
 * inferior, notificaciones, splash, instalación, conectividad, permisos y un
 * `BottomSheet` global (`useAppSheet()`), todo compuesto sobre los átomos de
 * la librería. Pensado para montarse en un `layout.tsx` de sección.
 *
 * ```tsx
 * <PackageApp
 *   appName="Mi App"
 *   header={{ title: "Inicio", largeTitle: true }}
 *   navItems={[{ label: "Inicio", href: "/", icon: <HomeIcon/> }]}
 * >
 *   {children}
 * </PackageApp>
 * ```
 */
export function PackageApp({
  appName,
  children,
  header,
  navItems,
  notifications,
  requiredPermissions,
  splash = true,
  installPrompt = true,
  offline = "banner",
  updatePrompt = false,
  nativeShell = { onlyWhenInstalled: true },
  snackbarPosition = "bottom-center",
  className = "",
  contentClassName = "",
}: PackageAppProps) {
  const splashCfg = splash === false ? null : splash === true ? {} : splash;
  const { visible: splashVisible, progress: splashProgress } = useSplash({
    minDuration: splashCfg?.minDuration,
    until: splashCfg?.until,
    waitForFonts: splashCfg?.waitForFonts,
    oncePerSession: splashCfg?.oncePerSession,
  });

  const { online } = useOnlineStatus();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetContent, setSheetContent] = useState<ReactNode>(null);
  const [sheetOptions, setSheetOptions] = useState<AppSheetOptions | undefined>();

  const openSheet = useCallback((content: ReactNode, options?: AppSheetOptions) => {
    setSheetContent(content);
    setSheetOptions(options);
    setSheetOpen(true);
  }, []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const sheetCtx = useMemo(() => ({ openSheet, closeSheet }), [openSheet, closeSheet]);

  const unread = notifications?.items.filter((n) => !n.read).length ?? 0;
  const notificationAction: HeaderAction | null = notifications
    ? {
        id: "__notifications",
        label: "Notificaciones",
        icon: <BellIcon />,
        badge: unread > 0 ? unread : false,
        onClick: () =>
          openSheet(
            <NotificationPanel
              items={notifications.items}
              onRead={notifications.onRead}
              onReadAll={notifications.onReadAll}
              onDismiss={notifications.onDismiss}
              onClear={notifications.onClear}
              onItemClick={(n) => {
                closeSheet();
                notifications.onItemClick?.(n);
              }}
              title={notifications.title}
              emptyTitle={notifications.emptyTitle}
              emptyHint={notifications.emptyHint}
              maxHeight="60dvh"
              className="border-0 shadow-none rounded-none"
            />,
            { size: "lg", showHandle: true },
          ),
      }
    : null;

  const headerActions = [...(header.actions ?? []), ...(notificationAction ? [notificationAction] : [])];

  const showOfflineFallback = offline === "fallback" && !online;
  const mainContent = showOfflineFallback
    ? <OfflineFallback onRetry={() => window.location.reload()} />
    : withPermissionGates(requiredPermissions, children);

  const hasNav = !!navItems && navItems.length > 0;
  const snackGap = hasNav ? 80 : 16; // 64px de BottomNav (mobile) + margen

  const shellProps = nativeShell === false ? null : nativeShell === true ? { onlyWhenInstalled: true } : nativeShell;

  const inner = (
    <>
      {splashCfg && (
        <SplashScreen
          visible={splashVisible}
          progress={splashProgress}
          appName={appName}
          tagline={splashCfg.tagline}
          version={splashCfg.version}
          footnote={splashCfg.footnote}
          icon={splashCfg.icon}
          variant={splashCfg.variant}
          background={splashCfg.background}
        />
      )}

      {offline === "banner" && <OfflineBanner />}

      {installPrompt !== false && (
        <PwaInstallPrompt appName={appName} {...(installPrompt === true ? {} : installPrompt)} />
      )}

      {updatePrompt !== false && <UpdatePrompt {...(updatePrompt === true ? {} : updatePrompt)} />}

      <SafeArea as="div" edges={["left", "right"]} className={`flex flex-col min-h-[var(--app-height,100dvh)] ${className}`}>
        <AppHeader {...header} actions={headerActions} />

        <main className={`flex-1 min-w-0 ${hasNav ? "pb-16" : ""} ${contentClassName}`}>{mainContent}</main>

        {hasNav && <BottomNav items={navItems!} />}
      </SafeArea>

      <BottomSheet open={sheetOpen} onClose={closeSheet} {...sheetOptions}>
        {sheetContent}
      </BottomSheet>
    </>
  );

  return (
    <SnackbarProvider position={snackbarPosition} gap={snackGap}>
      <AppSheetContext.Provider value={sheetCtx}>
        {shellProps ? <NativeShell {...shellProps}>{inner}</NativeShell> : inner}
      </AppSheetContext.Provider>
    </SnackbarProvider>
  );
}

function withPermissionGates(perms: PackageAppPermission[] | undefined, children: ReactNode): ReactNode {
  if (!perms || perms.length === 0) return children;
  return perms.reduceRight<ReactNode>(
    (acc, p) => (
      <PermissionGate key={p.kind} kind={p.kind} reason={p.reason} title={p.title} icon={p.icon} cta={p.cta}>
        {acc}
      </PermissionGate>
    ),
    children,
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
