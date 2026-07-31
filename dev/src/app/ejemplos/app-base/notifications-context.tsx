"use client";

import { createContext, useContext } from "react";
import type { AppNotification } from "../../../../../components/NotificationPanel";

/**
 * Contexto mínimo del lado de la app: el shell es dueño del estado del drawer
 * y de la lista, y cada pantalla sólo pide `unread` + `open()` para dibujar
 * su campana. Así las pantallas siguen sin conocer a <NotificationSidebar/>.
 */
export const NotificationsCtx = createContext<{
  items: AppNotification[];
  unread: number;
  open: () => void;
} | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationsCtx);
  if (!ctx) throw new Error("useNotifications debe usarse dentro de <AppBaseShell>");
  return ctx;
}
