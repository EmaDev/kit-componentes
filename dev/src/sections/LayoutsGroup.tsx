"use client";

import { useState } from "react";
import { PackageApp, useAppSheet } from "../../../components/PackageApp";
import type { AppNotification } from "../../../components/NotificationPanel";
import type { BottomNavItem } from "../../../components/BottomNav";
import type { SplashVariant } from "../../../components/SplashScreen";
import { Button } from "../../../components/Button";
import { Section, Card, Row } from "../chrome/Section";
import { I } from "../chrome/Icon";

const NAV_ITEMS: BottomNavItem[] = [
  { label: "Inicio", href: "/", icon: I.zap },
  { label: "Ajustes", href: "/nav-demo/ajustes", icon: I.edit },
];

const NOTIFICATIONS: AppNotification[] = [
  {
    id: "1",
    title: "Nuevo pedido",
    description: "Pedido #A-1042 confirmado.",
    date: Date.now() - 1000 * 60 * 5,
    tone: "success",
  },
  {
    id: "2",
    title: "Stock bajo",
    description: "Quedan 3 unidades de 'Silla Aldama'.",
    date: Date.now() - 1000 * 60 * 60 * 3,
    tone: "warning",
    read: true,
  },
];

const SPLASH_VARIANTS: SplashVariant[] = ["fade", "pulse", "orbit", "bars", "zoom", "wipe"];

function DemoContent() {
  const { openSheet, closeSheet } = useAppSheet();
  return (
    <div className="p-4 flex flex-col gap-3">
      <p className="text-sm text-muted leading-relaxed">
        Esto es el <code>children</code> de <code>PackageApp</code>: cualquier pantalla de la sección se renderiza
        acá adentro, ya con header, bottom nav y snackbar/sheet globales resueltos.
      </p>
      <Row>
        <Button
          size="sm"
          onClick={() =>
            openSheet(
              <div className="py-2">
                <p className="text-sm text-foreground leading-relaxed">
                  Este panel vino de <code>useAppSheet()</code>, llamado desde una pantalla hija — sin{" "}
                  <code>useState</code> local ni un <code>BottomSheet</code> propio.
                </p>
                <Button size="sm" className="mt-3" onClick={closeSheet}>
                  Cerrar
                </Button>
              </div>,
              { title: "Sheet desde useAppSheet()", size: "sm" },
            )
          }
        >
          Abrir sheet con useAppSheet()
        </Button>
      </Row>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-10 rounded-lg bg-surface-alt" />
      ))}
    </div>
  );
}

function PackageAppSection() {
  const [notifications, setNotifications] = useState<AppNotification[]>(NOTIFICATIONS);
  const [variant, setVariant] = useState<SplashVariant>("zoom");
  const [splashKey, setSplashKey] = useState(0);

  return (
    <Section
      id="packageapp"
      title="PackageApp"
      description="Organismo raíz: AppHeader + BottomNav + NotificationPanel + Snackbar + BottomSheet global + PWA, todo compuesto. Corre de verdad acá adentro (nativeShell desactivado en este preview para no bloquear zoom/gestos del resto del playground)."
    >
      <Card>
        <Row className="mb-3">
          <select
            className="h-9 rounded-lg border border-border bg-surface px-2 text-sm"
            value={variant}
            onChange={(e) => setVariant(e.target.value as SplashVariant)}
          >
            {SPLASH_VARIANTS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <Button size="sm" onClick={() => setSplashKey((k) => k + 1)}>
            Mostrar splash
          </Button>
        </Row>

        <div className="rounded-2xl border border-border overflow-hidden h-[520px] relative">
          <PackageApp
            key={splashKey}
            appName="Mi App"
            header={{ title: "Inicio", largeTitle: true }}
            navItems={NAV_ITEMS}
            notifications={{
              items: notifications,
              onRead: (id) => setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n))),
              onReadAll: () => setNotifications((ns) => ns.map((n) => ({ ...n, read: true }))),
              onDismiss: (id) => setNotifications((ns) => ns.filter((n) => n.id !== id)),
            }}
            splash={{ oncePerSession: false, minDuration: 1600, variant, background: "brand" }}
            installPrompt={false}
            nativeShell={false}
            contentClassName="h-full overflow-y-auto"
          >
            <DemoContent />
          </PackageApp>
        </div>
        <p className="mt-3 text-xs text-muted">
          El <code>BottomNav</code> ancla al fondo real de la ventana (no de esta card), igual que en la sección de
          Navegación. El splash ocupa toda la pantalla real por 1.6s al presionar el botón.
        </p>
      </Card>

      <Card className="mt-4" title="Piezas que no se muestran en vivo acá">
        <pre className="text-[11px] bg-surface rounded-lg p-3 overflow-auto border border-border">
{`<PackageApp
  appName="Mi App"
  header={{ title: "Escanear" }}
  requiredPermissions={[
    { kind: "camera", reason: "Para escanear tu cupón necesitamos la cámara." },
  ]}
  nativeShell={{ onlyWhenInstalled: true }}   // default — bloquea zoom/gestos sólo instalada
  offline="fallback"                          // reemplaza children por OfflineFallback mientras esté offline
>
  {children}
</PackageApp>`}
        </pre>
        <p className="mt-2 text-xs text-muted">
          <code>requiredPermissions</code> pediría la cámara de verdad (interrumpiría la navegación del
          playground) y <code>nativeShell</code> por default bloquea zoom/gestos globales — por eso quedan sólo
          documentados acá, no montados en vivo.
        </p>
      </Card>
    </Section>
  );
}

export function LayoutsGroup() {
  return <PackageAppSection />;
}
