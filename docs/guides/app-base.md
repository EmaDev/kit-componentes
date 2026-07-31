# Guía: la base de una app (PWA)

> Qué componentes de la librería hay que integrar —y en qué orden— para tener la base de una app: safe areas, splash, capa PWA (instalador, conectividad, actualizaciones), un `HeroTabs` underline como navegación de pantalla, un `BottomNav` de rutas y un `FabActionSheets` con tres acciones básicas.

No hay un componente "todo en uno": la base se arma con 8-10 piezas que se montan **una sola vez** en el shell de la app. Hecho eso, cada pantalla nueva ya nace con splash, insets, instalación, aviso de conexión, navegación y acción principal resueltos.

Demo corriendo en el playground: grupo **Base de app** (`#appbase`, `#appbase-live`, `#appbase-code`) y la ruta real en `dev/src/app/ejemplos/app-base/`.

## Cuándo usar esta guía

- Estás arrancando una app mobile-first / PWA con Next.js App Router y querés el shell completo antes de escribir la primera pantalla.
- Ya tenés pantallas hechas pero les falta la capa de plataforma (instalación, offline, safe areas, splash).

### Cuándo NO

- **Sitio de contenido o dashboard desktop**: no necesitás splash ni instalador; usá `Navbar` o `SideBar` y listo. El `BottomNav` de esta guía es `md:hidden` — en desktop desaparece.
- **Una sola pantalla suelta** (landing, checkout embebido): montar el shell entero es de más; agarrá sólo la pieza que necesites (`SafeArea`, o `InstallButton` en el header).

## Las cinco capas

| # | Capa | Piezas | Se monta en |
|---|---|---|---|
| 1 | Shell nativo y safe areas | [NativeShell](../components/NativeShell.md), [SafeArea](../components/SafeArea.md) (`SafeAreaSpacer`), [ViewportLock](../components/ViewportLock.md) | shell (una vez) |
| 2 | Arranque | [useSplash](../hooks/useSplash.md) + [SplashScreen](../components/SplashScreen.md) | shell (una vez) |
| 3 | Capa PWA | [PwaInstallPrompt](../components/PwaInstallPrompt.md), [InstallButton](../components/InstallButton.md), [OfflineBanner](../components/OfflineBanner.md), [UpdatePrompt](../components/UpdatePrompt.md), [OfflineFallback](../components/OfflineFallback.md), [PwaStatus](../components/PwaStatus.md), [NotificationOptIn](../components/NotificationOptIn.md) | shell + una pantalla de ajustes |
| 4 | Navegación | [HeroTabs](../components/Hero.md) `variant="underline"` (pantalla), [BottomNav](../components/BottomNav.md) (rutas) | HeroTabs por pantalla · BottomNav en el shell |
| 5 | Acción principal | [FabActionSheets](../components/FabActionSheets.md) + [SnackbarProvider](../components/Snackbar.md) | shell (una vez) |

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
    │   └── <main>            ← acá entra `children`: HeroTabs + contenido de cada pantalla
    ├── BottomNav             ← fixed bottom, z-40, md:hidden
    └── FabActionSheets       ← FAB fixed z-90; sus BottomSheet abren en z-140/150
```

Capas fijas, de menor a mayor: `BottomNav` (40) → FAB (90) → `Snackbar` (110) → `PwaInstallPrompt` (120) → `UpdatePrompt` (125) → `OfflineBanner` (130) → `BottomSheet` (140/150) → `SplashScreen` (200). Si agregás algo `fixed` propio, elegí su `z` sabiendo esto.

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

## 4 · Navegación: dos niveles, dos componentes

Son cosas distintas y conviven:

| | `HeroTabs variant="underline"` | `BottomNav` |
|---|---|---|
| Cambia | la **vista dentro** de una pantalla (estado) | la **ruta** (`next/link` + `usePathname()`) |
| Se monta en | cada pantalla que lo necesite | el shell, una vez |
| Visible en | mobile y desktop | sólo mobile (`md:hidden`) |
| Estado activo | `value`/`onChange`, o interno si los omitís | la URL actual |

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
- Envolvé todo en `SnackbarProvider` con `gap={80}` para que la confirmación de cada acción no quede tapada por el `BottomNav`.

## Implementación completa

Tres archivos. El límite cliente/servidor va en el shell, **no** en el `layout.tsx` ni en las páginas: así cada pantalla sigue siendo Server Component y puede hacer `await fetch(...)`.

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

import {
  NativeShell, SafeArea, SplashScreen, OfflineBanner, PwaInstallPrompt, UpdatePrompt,
  BottomNav, FabActionSheets, SnackbarProvider, useSplash,
  type BottomNavItem, type FabSheetAction,
} from "lib-kit-components";
import { ActivityIcon, HomeIcon, PlusIcon, SearchIcon, ShareIcon, UserIcon } from "@/components/atoms/icons";
import { NuevoForm, BuscarPanel, CompartirPanel } from "@/components/organisms/quick-actions";

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
- [ ] FAB con `pb` suficiente para no pisar el `BottomNav`; `SnackbarProvider` con `gap`.
- [ ] `NativeShell` con `onlyWhenInstalled` (no bloquear el zoom del navegador normal).
- [ ] Probado en un ancho <768px (aparece `BottomNav`) y en desktop (no aparece, ¿hay `Navbar`?).
- [ ] Probado con DevTools → Network → Offline (`OfflineBanner`) y con la app instalada (safe areas reales).

## Notas y gotchas

- **`OfflineBanner` es `fixed`**: se superpone a la cabecera en vez de empujarla. Si tu cabecera tiene contenido crítico en la primera línea, considerá `position="bottom"`.
- **Splash y navegación**: con `oncePerSession: true` no se repite al cambiar de ruta ni al volver desde otra pantalla en la misma sesión; se muestra otra vez recién en una pestaña/sesión nueva.
- **`HeroTabs` no cambia la URL**: si querés que cada tab sea linkeable/compartible, usá rutas (`BottomNav` o tabs propios con `next/link`), no `HeroTabs`.
- **Permisos**: no los pidas en el shell al arrancar. Envolvé la feature puntual con `PermissionGate` (cámara, ubicación, notificaciones) cuando el usuario ya entendió para qué.
- **Desktop**: esta base es mobile-first. Para una app que también vive en escritorio, sumá `Navbar`/`SideBar` en el mismo shell (visibles con `md:`) — el `BottomNav` ya se esconde solo.
- La implementación de referencia completa, corriendo, está en `dev/src/app/ejemplos/app-base/` (playground → grupo **Base de app** → "Implementación completa, en vivo").
