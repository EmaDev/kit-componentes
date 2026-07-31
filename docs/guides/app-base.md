# Guía: la base de una app (PWA)

> Qué componentes de la librería hay que integrar —y en qué orden— para tener la base de una app: safe areas, splash, capa PWA (instalador, conectividad, actualizaciones), navegación de pantalla (`HeroTabs` en pantallas raíz, `AppHeaderTabs` en pantallas de detalle), un `BottomNav` de rutas, un `FabActionSheets` con tres acciones y la capa de avisos (`SnackbarProvider` + `NotificationSidebar`).

No hay un componente "todo en uno": la base se arma con 10-12 piezas que se montan **una sola vez** en el shell de la app. Hecho eso, cada pantalla nueva ya nace con splash, insets, instalación, aviso de conexión, navegación, acción principal, feedback transitorio y centro de notificaciones resueltos.

Demo corriendo en el playground: grupo **Base de app** (`#appbase`, `#appbase-live`, `#appbase-code`) y la ruta real en `dev/src/app/ejemplos/app-base/`.

## Cuándo usar esta guía

- Estás arrancando una app mobile-first / PWA con Next.js App Router y querés el shell completo antes de escribir la primera pantalla.
- Ya tenés pantallas hechas pero les falta la capa de plataforma (instalación, offline, safe areas, splash).

### Cuándo NO

- **Sitio de contenido o dashboard desktop**: no necesitás splash ni instalador; usá `Navbar` o `SideBar` y listo. El `BottomNav` de esta guía es `md:hidden` — en desktop desaparece.
- **Una sola pantalla suelta** (landing, checkout embebido): montar el shell entero es de más; agarrá sólo la pieza que necesites (`SafeArea`, o `InstallButton` en el header).

## Las seis capas

| # | Capa | Piezas | Se monta en |
|---|---|---|---|
| 1 | Shell nativo y safe areas | [NativeShell](../components/NativeShell.md), [SafeArea](../components/SafeArea.md) (`SafeAreaSpacer`), [ViewportLock](../components/ViewportLock.md) | shell (una vez) |
| 2 | Arranque | [useSplash](../hooks/useSplash.md) + [SplashScreen](../components/SplashScreen.md) | shell (una vez) |
| 3 | Capa PWA | [PwaInstallPrompt](../components/PwaInstallPrompt.md), [InstallButton](../components/InstallButton.md), [OfflineBanner](../components/OfflineBanner.md), [UpdatePrompt](../components/UpdatePrompt.md), [OfflineFallback](../components/OfflineFallback.md), [PwaStatus](../components/PwaStatus.md), [NotificationOptIn](../components/NotificationOptIn.md) | shell + una pantalla de ajustes |
| 4 | Navegación | [HeroTabs](../components/Hero.md) `variant="underline"` (pantalla raíz), [AppHeaderTabs](../components/AppHeaderTabs.md) (pantalla de detalle), [BottomNav](../components/BottomNav.md) (rutas) | tabs por pantalla · BottomNav en el shell |
| 5 | Acción principal | [FabActionSheets](../components/FabActionSheets.md) | shell (una vez) |
| 6 | Avisos | [SnackbarProvider](../components/Snackbar.md) (transitorio) + [NotificationSidebar](../components/NotificationPanel.md) (persistente) | shell (una vez) |

## Orden de montaje

El orden importa: define quién tapa a quién y qué se remonta al navegar.

```
SnackbarProvider              ← provider: cualquier pantalla puede usar useSnackbar()
└── NativeShell               ← publica --sa-*, --app-height; bloqueos sólo si está instalada
    ├── SplashScreen          ← fixed, z-200: tapa todo mientras carga
    ├── OfflineBanner         ← fixed top, z-130
    ├── PwaInstallPrompt      ← fixed bottom, z-120
    ├── UpdatePrompt          ← fixed bottom, z-125
    ├── SafeArea (fillViewport, edges left/right)
    │   └── <main>            ← acá entra `children`: HeroTabs / AppHeaderTabs + contenido
    ├── BottomNav             ← fixed bottom, z-40, md:hidden
    ├── FabActionSheets       ← FAB fixed z-90; sus BottomSheet abren en z-140/150
    └── NotificationSidebar   ← fixed, z-50 (drawer + backdrop), controlado desde el shell
```

Capas fijas, de menor a mayor: `BottomNav` (40) → **`NotificationSidebar` (50)** → FAB (90) → `Snackbar` (110) → `PwaInstallPrompt` (120) → `UpdatePrompt` (125) → `OfflineBanner` (130) → `BottomSheet` (140/150) → `SplashScreen` (200). Si agregás algo `fixed` propio, elegí su `z` sabiendo esto.

⚠️ **El `z-50` de `NotificationSidebar` está por debajo del FAB (90) y de los banners PWA (120-130), y no es configurable** — el `className` que le pasás va al panel del drawer, no al backdrop, así que no podés subirlo de forma confiable. En la práctica significa que el FAB queda flotando **encima** del backdrop del drawer. La solución es no renderizar el FAB mientras el drawer está abierto (`{!notifOpen && <FabActionSheets … />}`), que es lo que hace el shell de más abajo. Que el `Snackbar` (110) quede por encima del drawer, en cambio, es deseable: la confirmación de "marqué todas como leídas" se ve igual.

## 1 · Shell nativo y safe areas

```tsx
<NativeShell onlyWhenInstalled>
  <SafeArea edges={["left", "right"]} fillViewport className="flex flex-col bg-surface text-foreground">
    <main className="min-w-0 flex-1 pb-20 md:pb-8">{children}</main>
  </SafeArea>
</NativeShell>
```

- `NativeShell` no aplica padding: publica `--sa-top/right/bottom/left`, `--app-height` y `--kb-inset` como CSS vars en `<html>`, esconde la barra de direcciones y bloquea zoom/overscroll/long-press. Con `onlyWhenInstalled` (recomendado) esos bloqueos aplican **sólo** con la PWA instalada, así el zoom del navegador normal queda intacto (WCAG 1.4.4). Si sólo querés los bloqueos y nada más, usá `ViewportLock`.
- `SafeArea` con `edges={["left","right"]}`: el borde superior lo resuelve tu cabecera y el inferior el `BottomNav` (que ya trae `pb-[env(safe-area-inset-bottom)]`). Aplicar los cuatro bordes acá te deja un doble padding abajo.
- `fillViewport` usa `min-height: var(--app-height, 100dvh)` — la altura real, sin el salto de `100vh` cuando aparece/desaparece la barra del navegador.
- `pb-20 md:pb-8` en el `<main>` es lo que evita que el último ítem quede debajo del `BottomNav`. Para el final de una lista scrolleable, `<SafeAreaSpacer edge="bottom" min={8} />` mide exactamente la inset.
- En desktop las insets son `0px`; recién en un iPhone/Android con notch o home indicator hay valores reales. No lo "arregles" con paddings fijos.

## 2 · Arranque: splash

```tsx
const { visible, progress } = useSplash({
  minDuration: 1500,        // evita el flash si todo carga rápido
  oncePerSession: true,     // sessionStorage: no se repite al navegar entre rutas
  until: () => loadSession(), // opcional: esperar sesión/config/primer fetch
});

<SplashScreen
  visible={visible}
  progress={progress}       // requerido por variant="bars"
  appName="Mi App"
  tagline="La base, ya armada"
  variant="bars"            // fade · pulse · orbit · bars · zoom · wipe
  background="brand"
  version="1.0.0"
/>
```

- `useSplash` ya espera `document.fonts.ready` (`waitForFonts`, default `true`) — con eso no ves el cambio de tipografía a mitad de la primera pantalla.
- `visible` arranca en `true`, así que el splash aparece en cuanto hidrata el shell. El HTML del servidor se renderiza igual detrás: el splash no bloquea el SSR de la pantalla.
- El splash es `fixed inset-0 z-200`: tapa el instalador y el banner de conexión mientras está visible. Correcto — nada debería competir con el arranque.

## 3 · Capa PWA

Archivos mínimos en el proyecto consumidor:

```json
// public/manifest.json
{
  "name": "Mi App",
  "short_name": "MiApp",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#7c3aed",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

```js
// public/sw.js — lo mínimo que necesita UpdatePrompt
self.addEventListener("message", (e) => {
  if (e.data?.type === "SKIP_WAITING") self.skipWaiting();
});
```

Sin `manifest.json` linkeado y sin `display: "standalone"`, el navegador nunca dispara `beforeinstallprompt` y `PwaInstallPrompt` no aparece nunca (no está roto: no es elegible).

| Pieza | Qué hace | Dónde va |
|---|---|---|
| `PwaInstallPrompt` | Banner flotante en Android/desktop (usa el prompt nativo) y sheet con los 3 pasos manuales en iOS Safari. Recuerda el "Ahora no" por `snoozeDays` (14 default). | shell, una vez |
| `InstallButton` | Botón embebible que no interrumpe. `hideWhenUnavailable` (default `true`) lo esconde si no se puede instalar. En iOS usá `onIosClick` para abrir tus instrucciones. | header o pantalla de ajustes |
| `OfflineBanner` | Aparece solo al cortarse internet, confirma en verde al reconectar y avisa conexión lenta. Es `fixed` — se superpone a tu cabecera, no la empuja. | shell, una vez |
| `UpdatePrompt` | "Nueva versión disponible" cuando el service worker nuevo quedó esperando; al aceptar manda `SKIP_WAITING` y recarga. | shell, una vez (con `/sw.js` real) |
| `OfflineFallback` | Pantalla completa de "sin conexión" para un fetch que falló sin caché. | en la pantalla que falló, no en el shell |
| `PwaStatus` | Panel de diagnóstico (SW, display mode, permisos, storage). `observeOnly` para que no registre nada. | pantalla de ajustes / debug |
| `NotificationOptIn` | Pide permiso de notificaciones con contexto, nunca al cargar. | después de una acción que lo justifique |

Para probar el UI del instalador sin depender de la elegibilidad real del navegador: `<PwaInstallPrompt appName="Mi App" forcePlatform="ios" />` (su cierre es local al montaje, no consume el snooze real).

## 4 · Navegación: dos niveles, tres componentes

Son cosas distintas y conviven. Los dos primeros cambian la vista *dentro* de una pantalla; el tercero cambia de ruta:

| | `HeroTabs variant="underline"` | `AppHeaderTabs` | `BottomNav` |
|---|---|---|---|
| Cambia | la **vista dentro** de una pantalla (estado) | la **vista dentro** de una pantalla (estado) | la **ruta** (`next/link` + `usePathname()`) |
| Forma | hero: título grande, descripción, tabs debajo | header compacto: volver, título, acciones, tabs | barra inferior de íconos |
| Para | pantallas **raíz** (home, tab del `BottomNav`) | pantallas de **detalle** (con volver y acciones) | el nivel de rutas de toda la app |
| Se monta en | cada pantalla raíz | cada pantalla de detalle | el shell, una vez |
| Visible en | mobile y desktop | mobile y desktop | sólo mobile (`md:hidden`) |
| Estado activo | `value`/`onChange`, o interno si los omitís | `value`/`onChange`, o interno si los omitís | la URL actual |

La regla práctica: **si la pantalla tiene botón de volver, usá `AppHeaderTabs`; si es una raíz a la que se llega por el `BottomNav`, usá `HeroTabs`.** Comparten el mismo track scrolable (el de `AppHeaderTabs` está inspirado en el de `HeroTabs`), así que el comportamiento de los tabs es idéntico — cambia el marco.

```tsx
// Navegación de pantalla: HeroTabs underline, sticky, con el instalador en las acciones
const TABS: HeroTab[] = [
  { id: "resumen", label: "Resumen", icon: <BoltIcon /> },
  { id: "movimientos", label: "Movimientos", icon: <ListIcon />, count: 12 },
  { id: "metas", label: "Metas", icon: <TargetIcon />, count: 3 },
];

<HeroTabs
  sticky
  variant="underline"
  left={<AppBrand />}                                    // slot arriba del título
  title="Hola, Emanuel"
  description="Resumen de tu mes."
  actions={<InstallButton size="sm" variant="outline" />} // slot a la derecha del título
  tabs={TABS}
  panels={{ resumen: <Resumen />, movimientos: <Movimientos />, metas: <Metas /> }}
/>
```

- La tira de tabs scrollea horizontal y **siempre deja visible el tab activo** (hace scroll solo); los degradados de los bordes avisan que hay más. Por eso funciona con 8 categorías igual que con 3.
- `sticky` fija la tira en `top-0 z-30` cuando el contenido scrollea; el título y la descripción se van.
- `count` dibuja el contador al lado del label; `variant="pill"` es la misma pieza con chips en vez de subrayado.
- Si omitís `value`/`onChange` queda no controlado (arranca en `tabs[0].id`) — suficiente para el caso típico, y permite renderizarlo desde un Server Component pasándole `panels` ya resueltos.

```tsx
// Pantalla de detalle: header compacto con volver, acciones y tabs pegados arriba
const TABS: AppHeaderTab[] = [
  { id: "pendientes", label: "Pendientes", count: 12 },
  { id: "camino",     label: "En camino",  count: 3 },
  { id: "entregados", label: "Entregados" },
  { id: "cancelados", label: "Cancelados" },
];

<AppHeaderTabs
  title="Pedidos"
  subtitle="Sucursal Centro"
  onBack={() => router.back()}
  variant="blur"                    // opaco arriba de todo, blur + borde al scrollear
  tabs={TABS}
  panels={{
    pendientes: <Pedidos estado="pendiente" />,
    camino:     <Pedidos estado="camino" />,
    entregados: <Pedidos estado="entregado" />,
    cancelados: <Pedidos estado="cancelado" />,
  }}
  actions={[
    { id: "notif", label: "Notificaciones", icon: <BellIcon />, badge: unread || false, onClick: openNotifications },
  ]}
/>
```

- Es `sticky top-0 z-40` por default, igual que el `BottomNav` — el header queda arriba y la nav abajo sin pelearse (uno es `top`, la otra `bottom`).
- Trae `safeArea` activado: agrega el `padding-top` de `env(safe-area-inset-top)` solo. **Por eso el `SafeArea` del shell va con `edges={["left","right"]}`** — si le sumaras `"top"`, tendrías el inset dos veces.
- El track de tabs scrollea horizontal y siempre trae el tab activo a la vista, con degradados en los bordes cuando hay contenido fuera de pantalla. Funciona igual con 4 tabs que con 10.
- `tabVariant="pill"` cambia el subrayado por pastillas rellenas, sin tocar nada más.
- El slot de `actions` es el lugar natural para la campana de notificaciones — ver la capa 6.
- No tiene `largeTitle` ni `searchable`: si querés título grande colapsable o buscador expandible en una pantalla de detalle, usá [AppHeader](../components/AppHeader.md) con `children` y poné los tabs vos.

```tsx
// Navegación de rutas: 3 accesos, badge en el del medio
const NAV: BottomNavItem[] = [
  { label: "Inicio",    href: "/",          icon: <HomeIcon /> },
  { label: "Actividad", href: "/actividad", icon: <ActivityIcon />, badge: 2 },
  { label: "Perfil",    href: "/perfil",    icon: <UserIcon /> },
];

<BottomNav items={NAV} />
```

- El item activo se resuelve con **igualdad exacta** de `pathname`: una subruta (`/actividad/123`) no marca el tab de `/actividad`. Si necesitás match por prefijo, pasá el `href` del tab que corresponda o envolvelo en tu propio componente.
- Requiere Next.js (`next/link`, `next/navigation`).
- En desktop no se ve: sumá un `Navbar` o `SideBar` para ese ancho si tu app también es de escritorio.

## 5 · Acción principal: FAB con tres acciones

```tsx
const ACTIONS: FabSheetAction[] = [
  { icon: <PlusIcon />,   label: "Nuevo",     sheetTitle: "Nuevo ítem",
    sheetDescription: "Cargá lo mínimo y listo.", content: <NuevoForm /> },
  { icon: <SearchIcon />, label: "Buscar",    tone: "accent",
    sheetSnapPoints: [0.5, 0.9], content: <BuscarPanel /> },
  { icon: <ShareIcon />,  label: "Compartir", tone: "success",
    content: <CompartirPanel /> },
];

<FabActionSheets actions={ACTIONS} mainLabel="Acciones" className="pb-[4.5rem] md:pb-0" />
```

- Tres es el número cómodo: el speed dial abre las acciones con stagger sobre un backdrop y con más de 4-5 empieza a competir con un menú.
- **El `className` con `pb` es el que sube el FAB por encima del `BottomNav`.** El contenedor del FAB está anclado por `bottom`, así que el padding inferior lo empuja hacia arriba sin tocar el anclaje: `pb-[4.5rem]` = 64px de nav + 8px de aire, y `md:pb-0` lo devuelve abajo cuando la nav desaparece.
- `content` es contenido libre, pero **el sheet lo cierra el usuario** (arrastrando, backdrop o Escape): `FabActionSheets` maneja `openIdx` por dentro y no le pasa un `close()` al contenido. Si necesitás cerrarlo desde un botón propio, usá `FloatingButton` + tus propios `BottomSheet` controlados.
- `hideOnScroll` (default `true`) esconde el FAB al scrollear hacia abajo mirando `window`; si tu contenido scrollea dentro de un contenedor, pasale `scrollTarget`.
- El feedback de cada acción sale por `useSnackbar()` — ver la capa 6.

## 6 · Avisos: transitorio vs persistente

Dos piezas distintas para dos cosas que se confunden seguido:

| | `SnackbarProvider` + `useSnackbar()` | `NotificationSidebar` |
|---|---|---|
| Qué muestra | el resultado de **una acción que acaba de pasar** | el **historial** de lo que pasó mientras no mirabas |
| Vida | se va sola a los ~4s | queda hasta que la leas o la descartes |
| Origen | tu propio código, tras un submit/borrado | el servidor, push, otro usuario |
| Se monta | provider en el shell, envolviendo todo | drawer en el shell, controlado por estado |

Si mostrás un aviso importante sólo con `snack()`, el usuario que estaba mirando otra pantalla nunca se entera: eso va al historial. Y al revés, no metas "Guardado" en el historial de notificaciones — se llena de ruido.

### SnackbarProvider

Es el envoltorio **más externo** del shell, por fuera de `NativeShell`, para que cualquier pantalla pueda llamar a `useSnackbar()` sin importar dónde esté:

```tsx
<SnackbarProvider position="bottom-center" gap={80}>
  {/* todo el shell */}
</SnackbarProvider>
```

```tsx
// en cualquier componente cliente por debajo
const { snack, undo, dismiss } = useSnackbar();

snack({ message: "Pedido confirmado", variant: "success" });
undo("Movimiento eliminado", () => restaurar(id));   // atajo del patrón deshacer
```

- **`gap={80}` es el número clave de esta base**: la snackbar se ancla abajo y el `BottomNav` mide 64px. Con el `gap` default (`16`) queda tapada. 80 = 64 de nav + 16 de aire. Si tu app no monta `BottomNav`, dejá el default.
- Uno a la vez, cola FIFO: si disparás tres seguidos, se muestran en orden, no apilados. `duration: 0` la deja hasta que el usuario la cierre.
- Ya respeta safe-area y el teclado virtual — no le agregues padding inferior vos.
- `useSnackbar()` tira error si no hay provider arriba, así que el orden de montaje no es opcional.
- Es `z-110`: queda por encima del FAB, del `BottomNav` y del drawer de notificaciones, y por debajo de los banners PWA. Correcto — la confirmación de una acción tiene que verse siempre.

### NotificationSidebar

El drawer se monta **una vez en el shell**; el disparador (campana con badge) vive en el header de cada pantalla. Como las pantallas son Server Components, el estado va en el shell y se expone con un contexto mínimo del lado de tu app:

```tsx
// app/(app)/notifications-context.tsx
"use client";
import { createContext, useContext } from "react";
import type { AppNotification } from "lib-kit-components";

export const NotificationsCtx = createContext<{
  items: AppNotification[];
  unread: number;
  open: () => void;
} | null>(null);

export const useNotifications = () => {
  const ctx = useContext(NotificationsCtx);
  if (!ctx) throw new Error("useNotifications fuera del shell");
  return ctx;
};
```

Con eso, cualquier header pide la campana sin conocer el drawer:

```tsx
const { unread, open } = useNotifications();

<AppHeaderTabs
  title="Pedidos"
  tabs={TABS}
  actions={[{ id: "notif", label: "Notificaciones", icon: <BellIcon />, badge: unread || false, onClick: open }]}
/>
```

- **`NotificationSidebar` vs `NotificationBell`**: la campana trae su propio popover de 380px y no necesita estado externo — es más simple, pero en mobile un popover de 380px no entra cómodo. Para la base de una app mobile-first, el drawer de altura completa es la opción correcta; guardate `NotificationBell` para el header de escritorio.
- Es siempre controlado (`open` + `onClose`): no tiene estado interno de apertura.
- Bloquea el scroll del `body` mientras está abierto y lo restaura al cerrar; cierra con `Escape`, con el backdrop y con la ×.
- No hace focus trap. Si tu app tiene requisitos de accesibilidad estrictos, envolvé el contenido con tu propio trap.
- El `footer` es el lugar del "Ver todas" que lleva a una pantalla dedicada con el `NotificationPanel` embebido (mismo dato, misma lista, sin backdrop).
- Ojo con el `z-50` frente al FAB — ver el aviso en **Orden de montaje**.

## Implementación completa

Cuatro archivos (el contexto de notificaciones de más arriba, más estos tres). El límite cliente/servidor va en el shell, **no** en el `layout.tsx` ni en las páginas: así cada pantalla sigue siendo Server Component y puede hacer `await fetch(...)`.

```tsx
// app/(app)/layout.tsx — Server Component: sólo delega
import { AppShell } from "./AppShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
```

```tsx
// app/(app)/AppShell.tsx — el único límite cliente "de arriba"
"use client";

import { useMemo, useState } from "react";
import {
  NativeShell, SafeArea, SplashScreen, OfflineBanner, PwaInstallPrompt, UpdatePrompt,
  BottomNav, FabActionSheets, SnackbarProvider, NotificationSidebar, useSplash,
  type BottomNavItem, type FabSheetAction, type AppNotification,
} from "lib-kit-components";
import { ActivityIcon, HomeIcon, PlusIcon, SearchIcon, ShareIcon, UserIcon } from "@/components/atoms/icons";
import { NuevoForm, BuscarPanel, CompartirPanel } from "@/components/organisms/quick-actions";
import { NotificationsCtx } from "./notifications-context";

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

  // Centro de notificaciones: el estado vive acá, el disparador lo pide cada pantalla
  const [notifOpen, setNotifOpen] = useState(false);
  const [items, setItems] = useState<AppNotification[]>([]);
  const unread = items.filter((n) => !n.read).length;

  const notifCtx = useMemo(
    () => ({ items, unread, open: () => setNotifOpen(true) }),
    [items, unread],
  );

  return (
    <SnackbarProvider position="bottom-center" gap={80}>   {/* 80 = BottomNav (64) + margen */}
      <NotificationsCtx.Provider value={notifCtx}>
        <NativeShell onlyWhenInstalled>
          <SplashScreen visible={visible} progress={progress} appName="Mi App" variant="bars" background="brand" />

          <OfflineBanner position="top" />
          <PwaInstallPrompt appName="Mi App" />
          <UpdatePrompt />                                 {/* requiere /sw.js registrado */}

          <SafeArea edges={["left", "right"]} fillViewport className="flex flex-col bg-surface text-foreground">
            <main className="min-w-0 flex-1 pb-20 md:pb-8">{children}</main>
          </SafeArea>

          <BottomNav items={NAV} />

          {/* el FAB (z-90) taparía el backdrop del drawer (z-50): lo sacamos mientras está abierto */}
          {!notifOpen && (
            <FabActionSheets actions={ACTIONS} mainLabel="Acciones" className="pb-[4.5rem] md:pb-0" />
          )}

          <NotificationSidebar
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
            side="right"
            items={items}
            onRead={(id) => setItems((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n)))}
            onReadAll={() => setItems((l) => l.map((n) => ({ ...n, read: true })))}
            onDismiss={(id) => setItems((l) => l.filter((n) => n.id !== id))}
          />
        </NativeShell>
      </NotificationsCtx.Provider>
    </SnackbarProvider>
  );
}
```

```tsx
// app/(app)/page.tsx — sigue siendo Server Component
import { HeroTabs, InstallButton, type HeroTab } from "lib-kit-components";
import { getHomeData } from "@/lib/data/home";

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
      title={`Hola, ${data.user.name}`}
      actions={<InstallButton size="sm" variant="outline" />}
      tabs={TABS}
      panels={{
        resumen:     <ResumenPanel data={data} />,
        movimientos: <MovimientosPanel items={data.movimientos} />,
        metas:       <MetasPanel metas={data.metas} />,
      }}
    />
  );
}
```

## Checklist de integración

- [ ] `public/manifest.json` linkeado desde `metadata` y `display: "standalone"`.
- [ ] `public/sw.js` con el handler de `SKIP_WAITING` (si montás `UpdatePrompt`).
- [ ] `AppShell` es el único `"use client"` "de arriba"; `layout.tsx` y `page.tsx` sin él.
- [ ] `<main>` con padding inferior (`pb-20 md:pb-8`) y/o `SafeAreaSpacer` al final de las listas.
- [ ] FAB con `pb` suficiente para no pisar el `BottomNav`; `SnackbarProvider` con `gap={80}` (si no, la snackbar queda debajo de la nav).
- [ ] `SnackbarProvider` por fuera de todo — si `useSnackbar()` tira "must be used inside", es que quedó adentro.
- [ ] `NotificationSidebar` montado una sola vez en el shell, y el FAB oculto mientras está abierto.
- [ ] Pantallas de detalle con `AppHeaderTabs` (no `HeroTabs`) y `SafeArea` del shell sin `"top"` — el header ya lo aplica.
- [ ] `NativeShell` con `onlyWhenInstalled` (no bloquear el zoom del navegador normal).
- [ ] Probado en un ancho <768px (aparece `BottomNav`) y en desktop (no aparece, ¿hay `Navbar`?).
- [ ] Probado con DevTools → Network → Offline (`OfflineBanner`) y con la app instalada (safe areas reales).

## Notas y gotchas

- **`OfflineBanner` es `fixed`**: se superpone a la cabecera en vez de empujarla. Si tu cabecera tiene contenido crítico en la primera línea, considerá `position="bottom"`.
- **Splash y navegación**: con `oncePerSession: true` no se repite al cambiar de ruta ni al volver desde otra pantalla en la misma sesión; se muestra otra vez recién en una pestaña/sesión nueva.
- **`HeroTabs` y `AppHeaderTabs` no cambian la URL**: si querés que cada tab sea linkeable/compartible, usá rutas (`BottomNav` o tabs propios con `next/link`), no estos dos. Tampoco preserven el tab activo al navegar y volver: es estado de componente, se pierde al desmontar.
- **Doble safe-area arriba**: `AppHeaderTabs` trae `safeArea` en `true` y aplica el inset superior por su cuenta. Si además ponés `"top"` en el `SafeArea` del shell, en un iPhone con notch vas a ver el doble de espacio. Por eso el shell va con `edges={["left","right"]}`.
- **Filtro por instancia en las notificaciones**: si mostrás el drawer y además un `NotificationPanel` embebido en una pantalla dedicada, cada uno tiene su propio estado de filtro "Todas / No leídas". Si querés que compartan, controlalos vos con `filter`/`onFilterChange` desde el mismo estado.
- **El badge de la campana**: `HeaderAction.badge` es `number | boolean` y sólo se esconde con `undefined` o `false`. Un `0` se renderiza como un badge rojo con un "0" adentro, así que pasale `badge: unread || false`; con `true` dibuja un punto sin número.
- **Permisos**: no los pidas en el shell al arrancar. Envolvé la feature puntual con `PermissionGate` (cámara, ubicación, notificaciones) cuando el usuario ya entendió para qué.
- **Desktop**: esta base es mobile-first. Para una app que también vive en escritorio, sumá `Navbar`/`SideBar` en el mismo shell (visibles con `md:`) — el `BottomNav` ya se esconde solo.
- La implementación de referencia completa, corriendo, está en `dev/src/app/ejemplos/app-base/` (playground → grupo **Base de app** → "Implementación completa, en vivo").
