"use client";

import { useMemo, useState, type ReactNode } from "react";
import { NativeShell } from "../../../../../components/NativeShell";
import { SafeArea } from "../../../../../components/SafeArea";
import { SplashScreen } from "../../../../../components/SplashScreen";
import { OfflineBanner } from "../../../../../components/OfflineBanner";
import { PwaInstallPrompt } from "../../../../../components/PwaInstallPrompt";
import { BottomNav, type BottomNavItem } from "../../../../../components/BottomNav";
import { FabActionSheets, type FabSheetAction } from "../../../../../components/FabActionSheets";
import { SnackbarProvider, useSnackbar } from "../../../../../components/Snackbar";
import { NotificationSidebar, type AppNotification } from "../../../../../components/NotificationPanel";
import { NotificationsCtx } from "./notifications-context";
import { Button } from "../../../../../components/Button";
import { Input } from "../../../../../components/Input";
import { Select } from "../../../../../components/Select";
import { ShareButton } from "../../../../../components/ShareButton";
import { useSplash } from "../../../../../hooks/useSplash";
import { ActivityIcon, HomeIcon, PlusIcon, SearchIcon, ShareIcon, UserIcon } from "./_components/icons";

const APP_NAME = "Base App";

/* 1 · Navegación de rutas (mobile). En desktop se esconde sola (md:hidden). */
const NAV_ITEMS: BottomNavItem[] = [
  { label: "Inicio", href: "/ejemplos/app-base", icon: <HomeIcon /> },
  { label: "Actividad", href: "/ejemplos/app-base/actividad", icon: <ActivityIcon />, badge: 2 },
  { label: "Perfil", href: "/ejemplos/app-base/perfil", icon: <UserIcon /> },
];

/* 2 · Las tres acciones básicas del FAB, cada una con su propio sheet. */
function NuevoForm() {
  const { snack } = useSnackbar();
  const [title, setTitle] = useState("");

  return (
    <div className="flex flex-col gap-3 py-1">
      <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Select
        label="Categoría"
        defaultValue="tarea"
        options={[
          { value: "tarea", label: "Tarea" },
          { value: "nota", label: "Nota" },
          { value: "gasto", label: "Gasto" },
        ]}
      />
      <Button
        fullWidth
        onClick={() => {
          snack({ message: title ? `"${title}" creado` : "Ítem creado", variant: "success" });
          setTitle("");
        }}
      >
        Crear
      </Button>
      <p className="text-[11px] text-muted">
        El sheet lo cierra el usuario (arrastrando, tocando el backdrop o con Escape):{" "}
        <code>FabActionSheets</code> maneja su apertura por dentro y no expone un <code>close()</code> al contenido.
      </p>
    </div>
  );
}

function BuscarPanel() {
  const [q, setQ] = useState("");
  const results = ["Pago de servicios", "Transferencia a Ana", "Recarga de celular", "Sueldo"].filter((r) =>
    r.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-3 py-1">
      <Input
        label="Buscar"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        leftIcon={<SearchIcon />}
        autoFocus
      />
      <ul className="flex flex-col gap-1.5">
        {results.map((r) => (
          <li key={r} className="rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-foreground">
            {r}
          </li>
        ))}
        {results.length === 0 && <li className="py-4 text-center text-sm text-muted">Sin resultados</li>}
      </ul>
    </div>
  );
}

function CompartirPanel() {
  return (
    <div className="flex flex-col items-start gap-3 py-1">
      <p className="text-sm leading-relaxed text-muted">
        Usa la hoja nativa del sistema cuando existe (<code>navigator.share</code>) y cae a un sheet propio con
        copiar link / WhatsApp / mail cuando no.
      </p>
      <ShareButton title={APP_NAME} text="Mirá esta app" />
    </div>
  );
}

const FAB_ACTIONS: FabSheetAction[] = [
  {
    icon: <PlusIcon />,
    label: "Nuevo",
    sheetTitle: "Nuevo ítem",
    sheetDescription: "Cargá lo mínimo y listo.",
    content: <NuevoForm />,
  },
  {
    icon: <SearchIcon />,
    label: "Buscar",
    tone: "accent",
    sheetTitle: "Buscar",
    sheetSnapPoints: [0.5, 0.9],
    content: <BuscarPanel />,
  },
  {
    icon: <ShareIcon />,
    label: "Compartir",
    tone: "success",
    sheetTitle: "Compartir la app",
    content: <CompartirPanel />,
  },
];

/* 3 · Historial de notificaciones — en una app real viene del servidor / push. */
const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    title: "Pago acreditado",
    description: "Se acreditaron $48.200 de la factura #1042.",
    date: Date.now() - 4 * 60_000,
    tone: "success",
  },
  {
    id: "n2",
    title: "Lucía te mencionó",
    description: "«¿Revisamos la base de la app antes del viernes?»",
    date: Date.now() - 26 * 60_000,
    tone: "info",
  },
  {
    id: "n3",
    title: "Tu plan vence en 5 días",
    date: Date.now() - 7 * 3600_000,
    tone: "warning",
    read: true,
  },
  {
    id: "n4",
    title: "Reporte semanal listo",
    description: "MRR +8,4% · 12 cuentas nuevas.",
    date: Date.now() - 2 * 86400_000,
    tone: "neutral",
    read: true,
  },
];

/**
 * Shell de la app: splash, conectividad, instalación, safe areas, navegación
 * de rutas, acción principal y capa de avisos (snackbars + centro de
 * notificaciones). Es el único componente cliente "de arriba" — `children` lo
 * sigue resolviendo el Server Component que lo monta.
 */
export function AppBaseShell({ children }: { children: ReactNode }) {
  // oncePerSession: false sólo para la demo (que se vea el splash en cada recarga del frame).
  // En una app real va en true: no se repite al volver a esta sección en la misma sesión.
  const { visible: splashVisible, progress } = useSplash({ minDuration: 1500, oncePerSession: false });

  // Centro de notificaciones: el estado vive acá, el disparador lo pide cada pantalla.
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(SEED_NOTIFICATIONS);
  const unread = notifications.filter((n) => !n.read).length;

  const notifCtx = useMemo(
    () => ({ items: notifications, unread, open: () => setNotifOpen(true) }),
    [notifications, unread],
  );

  return (
    <SnackbarProvider position="bottom-center" gap={80}>
      <NotificationsCtx.Provider value={notifCtx}>
        {/* onlyWhenInstalled: los bloqueos de zoom/gestos sólo aplican con la PWA instalada (WCAG 1.4.4) */}
        <NativeShell onlyWhenInstalled>
          <SplashScreen
            visible={splashVisible}
            progress={progress}
            appName={APP_NAME}
            tagline="La base, ya armada"
            variant="bars"
            background="brand"
            version="1.0.0"
          />

          <OfflineBanner position="top" />
          <PwaInstallPrompt appName={APP_NAME} />
          {/* <UpdatePrompt /> — necesita un /sw.js registrado; ver la guía */}

          <SafeArea edges={["left", "right"]} fillViewport className="flex flex-col bg-surface text-foreground">
            <main className="min-w-0 flex-1 pb-20 md:pb-8">{children}</main>
          </SafeArea>

          <BottomNav items={NAV_ITEMS} />

          {/* el padding inferior sube el FAB por encima del BottomNav (64px) mientras la nav esté visible.
              Lo desmontamos con el drawer abierto: el FAB es z-90 y taparía su backdrop (z-50). */}
          {!notifOpen && (
            <FabActionSheets actions={FAB_ACTIONS} mainLabel="Acciones" className="pb-[4.5rem] md:pb-0" />
          )}

          <NotificationSidebar
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            side="right"
            items={notifications}
            onRead={(id) => setNotifications((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n)))}
            onReadAll={() => setNotifications((l) => l.map((n) => ({ ...n, read: true })))}
            onDismiss={(id) => setNotifications((l) => l.filter((n) => n.id !== id))}
          />
        </NativeShell>
      </NotificationsCtx.Provider>
    </SnackbarProvider>
  );
}
