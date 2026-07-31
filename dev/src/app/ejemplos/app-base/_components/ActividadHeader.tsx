"use client";

import type { ReactNode } from "react";
import { AppHeaderTabs, type AppHeaderTab } from "../../../../../../components/AppHeaderTabs";
import { useNotifications } from "../notifications-context";
import { BellIcon } from "./icons";

const TABS: AppHeaderTab[] = [
  { id: "todo", label: "Todo" },
  { id: "sesiones", label: "Sesiones", count: 2 },
  { id: "sincronizacion", label: "Sincronización", count: 2 },
  { id: "backups", label: "Backups" },
  { id: "seguridad", label: "Seguridad" },
  { id: "facturacion", label: "Facturación", count: 1 },
];

/**
 * Único "use client" de esta pantalla: existe sólo porque `onBack` y el
 * `onClick` de la campana son funciones, que no cruzan el límite servidor →
 * cliente. Los `panels` llegan ya renderizados desde el Server Component.
 */
export function ActividadHeader({ panels }: { panels: Record<string, ReactNode> }) {
  const { unread, open } = useNotifications();

  return (
    <AppHeaderTabs
      title="Actividad"
      subtitle="Últimos 30 días"
      onBack={() => history.back()}
      tabs={TABS}
      panels={panels}
      actions={[
        {
          id: "notif",
          label: "Notificaciones",
          icon: <BellIcon />,
          badge: unread || false,
          onClick: open,
        },
      ]}
    />
  );
}
