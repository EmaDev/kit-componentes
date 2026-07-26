# PackageApp

> Organismo raíz "todo en uno" para la base de una PWA: header, navegación inferior, notificaciones, splash, instalación, conectividad, permisos y un `BottomSheet` global, compuesto sobre los átomos de la librería.

**Import**
```tsx
import { PackageApp, useAppSheet } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para no tener que reensamblar a mano, sección por sección, todas las piezas típicas de una PWA (header, bottom nav, splash, prompt de instalación, banner de conexión, safe areas). Se monta en el `layout.tsx` de una sección — o del root — y envuelve `children` (las pantallas de esa sección) con la estructura completa: `SplashScreen` inicial, `PwaInstallPrompt`, `OfflineBanner`/`OfflineFallback`, `AppHeader` con campana de notificaciones opcional, área de contenido, `BottomNav`, un `BottomSheet` global reusable vía `useAppSheet()`, y `SnackbarProvider` para que cualquier pantalla hija use `useSnackbar()` sin configurar nada más.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás una o dos piezas sueltas (por ejemplo, únicamente `AppHeader` + `BottomNav` sin splash ni prompt de instalación), armalas a mano — `PackageApp` asume que querés el paquete completo y expone flags para apagar partes, no para no tenerlas montadas en absoluto.
- Si necesitás layouts muy distintos entre secciones de la misma app (una con bottom nav, otra sin), usá un `PackageApp` por sección (por `layout.tsx`) en vez de uno global — es exactamente para eso que `header` es una prop requerida por instancia, no un valor fijo.
- Para permisos específicos de una sola pantalla o feature puntual (no de toda la sección), usá `PermissionGate` directamente donde se necesita, en vez de `requiredPermissions` (que gatea **toda** la sección antes de mostrar cualquier `children`).
- Para el "sin conexión" de un fetch puntual que falló (no de toda la app), usá `OfflineFallback` directo en esa pantalla — `offline="fallback"` en `PackageApp` es una decisión de toda la sección.

## Props

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `appName` | `string` | — (requerido) | Nombre de la app, usado en el `SplashScreen` y en `PwaInstallPrompt`. |
| `children` | `ReactNode` | — (requerido) | Contenido de la sección/pantalla. |
| `header` | `Omit<AppHeaderProps, "children">` | — (requerido) | Props de `AppHeader` para esta sección (título, `onBack`, `actions`, etc). |
| `navItems` | `BottomNavItem[]` | `undefined` | Tabs de `BottomNav`. Si se omite, no se renderiza navegación inferior. |
| `notifications` | `PackageAppNotifications` | `undefined` | Si se pasa, agrega una campana con badge al header que abre `NotificationPanel` en el `BottomSheet` global. |
| `requiredPermissions` | `PackageAppPermission[]` | `undefined` | Permisos que deben concederse (uno por uno, con `PermissionGate`) antes de mostrar `children`. |
| `splash` | `boolean \| PackageAppSplashProps` | `true` | `SplashScreen` inicial. `false` lo desactiva; un objeto configura duración, variante, textos, etc. |
| `installPrompt` | `boolean \| Omit<PwaInstallPromptProps, "appName">` | `true` | `PwaInstallPrompt` (banner Android + sheet iOS). `false` lo desactiva. |
| `offline` | `"banner" \| "fallback" \| false` | `"banner"` | Estrategia de conectividad: banner no bloqueante (`OfflineBanner`), reemplazo total de `children` mientras esté offline (`OfflineFallback`), o ninguna. |
| `updatePrompt` | `boolean \| UpdatePromptProps` | `false` | Aviso de nueva versión del service worker (`UpdatePrompt`). Apagado por default porque necesita un `swUrl` real registrado. |
| `nativeShell` | `boolean \| NativeShellProps` | `{ onlyWhenInstalled: true }` | Bloqueos de experiencia nativa + altura real de viewport (`NativeShell`). `false` los desactiva del todo. |
| `snackbarPosition` | `SnackbarPosition` | `"bottom-center"` | Posición de los snacks del `SnackbarProvider` interno. |
| `className` | `string` | `""` | Clases del contenedor de la sección (header + main + nav). |
| `contentClassName` | `string` | `""` | Clases del `<main>` donde se renderiza `children`. |

### Tipos exportados

```ts
interface PackageAppNotifications {
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

interface PackageAppPermission {
  kind: PermissionKind;   // "camera" | "microphone" | "geolocation" | "notifications" | "clipboard-read" | "persistent-storage"
  reason: string;
  title?: string;
  icon?: ReactNode;
  cta?: string;
}

interface PackageAppSplashProps {
  minDuration?: number;
  until?: () => Promise<unknown>;
  waitForFonts?: boolean;
  oncePerSession?: boolean;
  variant?: SplashVariant;
  tagline?: string;
  version?: string;
  footnote?: string;
  icon?: ReactNode;
  background?: "surface" | "brand" | "dark" | string;
}

type AppSheetOptions = Omit<BottomSheetProps, "open" | "onClose" | "children">;
```

`useAppSheet()` devuelve `{ openSheet(content, options?), closeSheet() }` — controla el `BottomSheet` global que `PackageApp` ya montó, para no repetir estado local (`useState` + `<BottomSheet open={..}>`) en cada pantalla.

## Ejemplos

### Uso básico en un `layout.tsx` de sección
```tsx
// app/(app)/layout.tsx
import { PackageApp } from "lib-kit-components";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PackageApp
      appName="Mi App"
      header={{ title: "Inicio", largeTitle: true, searchable: true }}
      navItems={[
        { label: "Inicio", href: "/", icon: <HomeIcon /> },
        { label: "Buscar", href: "/buscar", icon: <SearchIcon /> },
        { label: "Perfil", href: "/perfil", icon: <UserIcon /> },
      ]}
    >
      {children}
    </PackageApp>
  );
}
```

### Con notificaciones (campana en el header + BottomSheet)
```tsx
<PackageApp
  appName="Mi App"
  header={{ title: "Bandeja" }}
  notifications={{
    items: notifications,
    onRead: (id) => markAsRead(id),
    onReadAll: markAllAsRead,
    onDismiss: (id) => dismiss(id),
  }}
>
  {children}
</PackageApp>
```

### Onboarding con permisos requeridos (cámara + ubicación) antes de usar la sección
```tsx
<PackageApp
  appName="Mi App"
  header={{ title: "Escanear" }}
  requiredPermissions={[
    { kind: "camera", reason: "Para escanear tu cupón necesitamos la cámara." },
    { kind: "geolocation", reason: "Para mostrarte el local más cercano." },
  ]}
>
  {children}
</PackageApp>
```

### Reutilizando el BottomSheet global desde una pantalla hija
```tsx
function ProductScreen() {
  const { openSheet, closeSheet } = useAppSheet();

  return (
    <Button onClick={() => openSheet(<FiltrosForm onApply={closeSheet} />, { title: "Filtros", size: "md" })}>
      Filtrar
    </Button>
  );
}
```

### Gate total de conectividad + splash con marca
```tsx
<PackageApp
  appName="Mi App"
  header={{ title: "Inicio" }}
  offline="fallback"
  splash={{ variant: "zoom", background: "brand", tagline: "Cargando tu cuenta…" }}
  installPrompt={{ snoozeDays: 30 }}
>
  {children}
</PackageApp>
```

## Requisitos / dependencias

- Marcado como `"use client"` — no puede usarse en un Server Component.
- Requiere Next.js: `AppHeader` no lo necesita, pero `BottomNav` (si se pasa `navItems`) usa `next/link`/`next/navigation` internamente, igual que el resto de los componentes de navegación de la librería.
- `useAppSheet()` lanza un error explícito si se llama fuera de un `<PackageApp>` — no hay fallback silencioso.
- Internamente monta, en este orden: `SnackbarProvider` → `AppSheetContext.Provider` → (`NativeShell` si `nativeShell !== false`) → `SplashScreen` + `OfflineBanner`/`PwaInstallPrompt`/`UpdatePrompt` → `SafeArea` (`edges={["left","right"]}`, ya que `AppHeader` y `BottomNav` resuelven top/bottom por su cuenta) → `AppHeader` → `<main>` → `BottomNav` → `BottomSheet` global.

## Notas y comportamiento

- `header` es **requerido**: `PackageApp` está pensado para montarse una vez por sección/`layout.tsx` con un título fijo para esa sección, no como wrapper único de toda la app con un título que cambie por pantalla.
- Con `notifications`, la campana se agrega **después** de las acciones que ya pases en `header.actions` — no reemplaza tus acciones existentes.
- `requiredPermissions` reutiliza `PermissionGate` anidando un gate por permiso (`reduceRight`): el segundo permiso recién se pide una vez concedido el primero. No hay botón de "saltear" — si necesitás que el usuario pueda avanzar sin conceder un permiso opcional, no lo incluyas acá y usá `PermissionGate` suelto en la pantalla puntual que lo necesite.
- `offline="fallback"` reemplaza **todo** `children` por `<OfflineFallback onRetry={() => location.reload()}>` mientras `navigator.onLine` sea `false` — es una decisión de toda la sección, no de una pantalla puntual con su propio fetch fallido.
- Cuando hay `navItems`, el `SnackbarProvider` interno recibe automáticamente más `gap` inferior (80px en vez de 16px) para que los snacks no queden tapados por el `BottomNav` (que sólo se ve en mobile, `md:hidden`). **Gotcha**: `PwaInstallPrompt` y `UpdatePrompt` son componentes con su propio offset inferior fijo (no configurable vía prop) — con `navItems` activo, en pantallas muy chicas pueden superponerse visualmente con el `BottomNav`; si te pasa, subí `installPrompt`/`updatePrompt` a `false` en las secciones que tengan bottom nav, o mostralos sólo desde una sección sin `navItems`.
- `nativeShell` viene con `onlyWhenInstalled: true` por default (no `false`, que es el default de `NativeShell` a secas) — es la opción recomendada por accesibilidad (WCAG 1.4.4): el zoom del navegador normal queda intacto y los bloqueos sólo aplican con la PWA instalada.
- El `<main>` no tiene `overflow` ni max-width propios (más allá de `flex-1 min-w-0`) — usá `contentClassName` para centrar/limitar el ancho del contenido si tu diseño lo requiere (ej. `contentClassName="max-w-2xl mx-auto px-4"`).
