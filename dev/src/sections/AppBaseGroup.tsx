"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../components/Button";
import { Section, Card, Row } from "../chrome/Section";

const DEMO_URL = "/ejemplos/app-base";

interface Layer {
  step: string;
  title: string;
  pieces: { name: string; role: string }[];
}

const LAYERS: Layer[] = [
  {
    step: "1",
    title: "Shell nativo y safe areas",
    pieces: [
      { name: "NativeShell", role: "publica --sa-*/--app-height y bloquea zoom/overscroll sólo si está instalada" },
      { name: "SafeArea", role: "padding real del notch / home indicator alrededor del contenido" },
      { name: "SafeAreaSpacer", role: "cierre de listas scrolleables para que el último ítem no quede tapado" },
    ],
  },
  {
    step: "2",
    title: "Arranque",
    pieces: [
      { name: "useSplash", role: "duración mínima + espera de fuentes/sesión, y progreso 0→1" },
      { name: "SplashScreen", role: "la pantalla en sí: 6 variantes, versión y marca" },
    ],
  },
  {
    step: "3",
    title: "Capa PWA",
    pieces: [
      { name: "PwaInstallPrompt", role: "banner Android + sheet con pasos en iOS" },
      { name: "InstallButton", role: "instalación no intrusiva desde ajustes/header" },
      { name: "OfflineBanner", role: "aviso de conexión caída, recuperada o lenta" },
      { name: "UpdatePrompt", role: "\"nueva versión disponible\" (necesita /sw.js)" },
      { name: "PwaStatus", role: "diagnóstico: SW, display mode, permisos, storage" },
    ],
  },
  {
    step: "4",
    title: "Navegación",
    pieces: [
      { name: "HeroTabs (underline)", role: "nav superior de la pantalla: cambia de vista por estado, no de ruta" },
      { name: "BottomNav", role: "nav de rutas fija abajo (mobile), activa por usePathname()" },
    ],
  },
  {
    step: "5",
    title: "Acción principal",
    pieces: [
      { name: "FabActionSheets", role: "FAB con 3 acciones; cada una abre su propio BottomSheet" },
      { name: "SnackbarProvider", role: "confirmación de lo que hizo cada acción, con gap sobre el BottomNav" },
    ],
  },
];

const SHELL_CODE = `// app/(app)/layout.tsx — Server Component: sólo delega
import { AppShell } from "./AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}`;

const APPSHELL_CODE = `// app/(app)/AppShell.tsx — el único límite cliente "de arriba"
"use client";

import {
  NativeShell, SafeArea, SplashScreen, OfflineBanner, PwaInstallPrompt, UpdatePrompt,
  BottomNav, FabActionSheets, SnackbarProvider, useSplash,
  type BottomNavItem, type FabSheetAction,
} from "lib-kit-components";

const NAV: BottomNavItem[] = [
  { label: "Inicio",    href: "/",          icon: <HomeIcon /> },
  { label: "Actividad", href: "/actividad", icon: <ActivityIcon />, badge: 2 },
  { label: "Perfil",    href: "/perfil",    icon: <UserIcon /> },
];

const ACTIONS: FabSheetAction[] = [
  { icon: <PlusIcon />,   label: "Nuevo",     sheetTitle: "Nuevo ítem", content: <NuevoForm /> },
  { icon: <SearchIcon />, label: "Buscar",    tone: "accent",  sheetSnapPoints: [0.5, 0.9], content: <BuscarPanel /> },
  { icon: <ShareIcon />,  label: "Compartir", tone: "success", content: <CompartirPanel /> },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { visible, progress } = useSplash({ minDuration: 1500, oncePerSession: true });

  return (
    <SnackbarProvider position="bottom-center" gap={80}>   {/* 80 = BottomNav (64) + margen */}
      <NativeShell onlyWhenInstalled>
        <SplashScreen visible={visible} progress={progress} appName="Mi App" variant="bars" background="brand" />

        <OfflineBanner position="top" />
        <PwaInstallPrompt appName="Mi App" />
        <UpdatePrompt />                                   {/* requiere /sw.js registrado */}

        <SafeArea edges={["left", "right"]} fillViewport className="flex flex-col bg-surface text-foreground">
          <main className="min-w-0 flex-1 pb-20 md:pb-8">{children}</main>
        </SafeArea>

        <BottomNav items={NAV} />
        <FabActionSheets actions={ACTIONS} mainLabel="Acciones" className="pb-[4.5rem] md:pb-0" />
      </NativeShell>
    </SnackbarProvider>
  );
}`;

const SCREEN_CODE = `// app/(app)/page.tsx — sigue siendo Server Component: HeroTabs es la nav de la pantalla
import { HeroTabs, type HeroTab } from "lib-kit-components";

const TABS: HeroTab[] = [
  { id: "resumen",     label: "Resumen",     icon: <BoltIcon /> },
  { id: "movimientos", label: "Movimientos", icon: <ListIcon />,   count: 12 },
  { id: "metas",       label: "Metas",       icon: <TargetIcon />, count: 3 },
];

export default async function HomePage() {
  const data = await getHomeData();   // fetch en el servidor

  return (
    <HeroTabs
      sticky variant="underline"
      title="Hola, Emanuel"
      actions={<InstallButton size="sm" variant="outline" />}
      tabs={TABS}
      panels={{
        resumen:     <ResumenPanel data={data} />,
        movimientos: <MovimientosPanel items={data.movimientos} />,
        metas:       <MetasPanel metas={data.metas} />,
      }}
    />
  );
}`;

const TABS_CODE: { id: string; label: string; code: string }[] = [
  { id: "layout", label: "layout.tsx", code: SHELL_CODE },
  { id: "shell", label: "AppShell.tsx", code: APPSHELL_CODE },
  { id: "screen", label: "page.tsx", code: SCREEN_CODE },
];

function ChecklistSection() {
  return (
    <Section
      id="appbase"
      title="Base de app — qué integrar"
      description="Las cinco capas que hay que montar una vez para que cualquier pantalla nueva ya nazca con splash, safe areas, instalación, conectividad, navegación y acción principal. Guía completa: docs/guides/app-base.md."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {LAYERS.map((l) => (
          <Card key={l.step} className="flex flex-col">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/12 text-[11px] font-bold text-primary">
                {l.step}
              </span>
              <p className="text-sm font-bold text-foreground">{l.title}</p>
            </div>
            <ul className="flex flex-col gap-2">
              {l.pieces.map((p) => (
                <li key={p.name} className="text-xs leading-relaxed">
                  <code className="font-semibold text-foreground">{p.name}</code>
                  <span className="text-muted"> — {p.role}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function LiveSection() {
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <Section
      id="appbase-live"
      title="Implementación completa, en vivo"
      description="La app base corriendo de verdad en /ejemplos/app-base, embebida en un frame de ancho mobile: el iframe tiene su propio viewport, así que el BottomNav (md:hidden) y todo lo fixed se comportan como en un teléfono."
    >
      <Card>
        <Row className="mb-4">
          <Button size="sm" onClick={() => setReloadKey((k) => k + 1)}>
            Reiniciar (ver el splash)
          </Button>
          <Link href={DEMO_URL} target="_blank">
            <Button size="sm" variant="secondary">
              Abrir a pantalla completa ↗
            </Button>
          </Link>
        </Row>

        <div className="flex justify-center">
          <div className="w-[390px] max-w-full overflow-hidden rounded-[2rem] border-[10px] border-foreground/85 bg-surface shadow-2xl shadow-black/25">
            <iframe
              key={reloadKey}
              src={DEMO_URL}
              title="Base de app — implementación completa"
              className="block h-[760px] w-full"
            />
          </div>
        </div>

        <ul className="mt-4 flex flex-col gap-1.5 text-xs leading-relaxed text-muted">
          <li>
            · <strong className="text-foreground">Splash</strong> con barra de progreso real (
            <code>useSplash</code> + <code>SplashScreen variant=&quot;bars&quot;</code>) al cargar el frame.
          </li>
          <li>
            · <strong className="text-foreground">HeroTabs underline</strong> arriba, sticky, con el instalador
            (<code>InstallButton</code>) en el slot de acciones.
          </li>
          <li>
            · <strong className="text-foreground">BottomNav</strong> con tres rutas reales: navegá entre Inicio,
            Actividad y Perfil — el shell no se remonta.
          </li>
          <li>
            · <strong className="text-foreground">FabActionSheets</strong> abajo a la derecha (sobre el
            BottomNav): Nuevo, Buscar y Compartir, cada uno con su sheet.
          </li>
          <li>
            · En <strong className="text-foreground">Perfil</strong> están los botones para ver el instalador
            Android/iOS, <code>PwaStatus</code> y <code>SafeAreaSpacer</code>.
          </li>
          <li>
            · Las safe areas miden 0px en desktop: en un teléfono con notch el header y el nav se corren solos.
          </li>
        </ul>
      </Card>
    </Section>
  );
}

function CodeSection() {
  const [tab, setTab] = useState("shell");
  const active = TABS_CODE.find((t) => t.id === tab) ?? TABS_CODE[1];

  return (
    <Section
      id="appbase-code"
      title="El código de esa base"
      description="Tres archivos: el layout (servidor) delega en el shell (cliente), y cada pantalla queda libre para seguir siendo Server Component con su propio HeroTabs."
    >
      <Card>
        <Row className="mb-3">
          {TABS_CODE.map((t) => (
            <Button key={t.id} size="sm" variant={t.id === tab ? "primary" : "ghost"} onClick={() => setTab(t.id)}>
              {t.label}
            </Button>
          ))}
        </Row>
        <pre className="overflow-auto rounded-lg border border-border bg-surface p-3 text-[11px] leading-relaxed">
          {active.code}
        </pre>
        <p className="mt-3 text-xs text-muted">
          Gotchas: el <code>gap</code> del <code>SnackbarProvider</code> y el <code>pb</code> del FAB existen para
          no quedar tapados por el <code>BottomNav</code>; <code>UpdatePrompt</code> necesita un{" "}
          <code>/sw.js</code> que escuche <code>SKIP_WAITING</code>; y el sheet de una acción del FAB lo cierra el
          usuario (el componente no expone un <code>close()</code> al contenido).
        </p>
      </Card>
    </Section>
  );
}

export function AppBaseGroup() {
  return (
    <>
      <ChecklistSection />
      <LiveSection />
      <CodeSection />
    </>
  );
}
