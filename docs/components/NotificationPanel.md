# NotificationPanel

> Panel de notificaciones agrupadas por fecha (Hoy / Ayer / Esta semana / Anteriores), con filtro Todas/No leídas, marcar todo como leído, descartar individual y vaciar. `NotificationBell` es el mismo panel dentro de un botón de campana con popover y badge de no leídas; `NotificationSidebar` es el mismo panel como drawer de altura completa con backdrop.

**Import**
```tsx
import {
  NotificationPanel,
  NotificationSidebar,
  NotificationBell,
  relativeTime,
  groupLabel,
  type AppNotification,
  type NotificationTone,
  type NotificationPanelProps,
  type NotificationSidebarProps,
  type NotificationBellProps,
} from "lib-kit-components";
```

## Cuándo usarlo

Los tres comparten exactamente la misma lista, el mismo agrupado y las mismas props de datos — cambia sólo la superficie:

- **`NotificationPanel`** — embebido en una pantalla o sección dedicada a notificaciones (tab "Notificaciones", columna de un dashboard). Tiene alto acotado por `maxHeight`.
- **`NotificationBell`** — el patrón típico de header: campana con badge de no leídas que abre el panel en un popover anclado, con click-outside y `Escape`.
- **`NotificationSidebar`** — un centro de notificaciones dedicado: drawer de altura completa que entra desde un costado con backdrop, bloquea el scroll del body y cierra con `Escape`. Elegilo cuando la lista es larga, tiene acciones por item, o el popover de la campana queda demasiado chico — sobre todo en mobile, donde un popover de 380px no entra cómodo.

## Cuándo NO usarlo / alternativas

- Para feedback transitorio de una acción puntual ("Guardado", "Error al subir"), usá `Toast`, no `NotificationPanel` (que es para un historial persistente).
- Si necesitás una sola notificación a la vez con "deshacer" (no un historial), usá `Snackbar`.
- `AppHeader` ya tiene su propio slot de `actions` con badge — podés usar `NotificationBell` como uno de esos `actions` si necesitás también otros botones de icono en la misma fila.
- Si el drawer no es de notificaciones sino de navegación o filtros genéricos, usá `SideBar` o `BottomSheet` — `NotificationSidebar` trae la lista de notificaciones cableada adentro.

## Props — NotificationPanel

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `items` | `AppNotification[]` | — (requerido) | Notificaciones a mostrar. |
| `filter` | `"all" \| "unread"` | `undefined` (interno) | Filtro controlado. Si se omite, el panel maneja su propio estado. |
| `onFilterChange` | `(f: "all" \| "unread") => void` | `undefined` | Se llama al cambiar de tab, controlado o no. |
| `onRead` | `(id: string) => void` | `undefined` | Se llama al hacer click en una notificación no leída. |
| `onReadAll` | `() => void` | `undefined` | Marcar todas como leídas. Sin esto, no se muestra el botón. |
| `onDismiss` | `(id: string) => void` | `undefined` | Descartar una notificación individual. Sin esto, no se muestra el botón ×. |
| `onClear` | `() => void` | `undefined` | Vaciar todas. Sin esto, no se muestra el botón. |
| `onItemClick` | `(n: AppNotification) => void` | `undefined` | Se llama siempre al hacer click en una fila (leída o no). |
| `title` | `string` | `"Notificaciones"` | Título del panel. |
| `emptyTitle` | `string` | `"Estás al día"` | Título del estado vacío. |
| `emptyHint` | `string` | `"No tenés notificaciones nuevas."` | Texto del estado vacío. |
| `footer` | `ReactNode` | `undefined` | Contenido fijo al pie del panel. |
| `maxHeight` | `number \| string` | `380` | Alto máximo del área con scroll. |
| `className` | `string` | `""` | Clases adicionales para el contenedor. |

## Props — NotificationSidebar

Todas las de `NotificationPanel` **menos `maxHeight`** (el drawer siempre ocupa el alto disponible) más:

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `open` | `boolean` | — (requerido) | Si el drawer está abierto. Siempre controlado. |
| `onClose` | `() => void` | — (requerido) | Se llama al tocar el backdrop, el botón × o `Escape`. |
| `side` | `"left" \| "right"` | `"right"` | Lado desde el que se despliega. |
| `width` | `number` | `400` | Ancho en px. Se limita a `calc(100vw - 2.5rem)` en pantallas chicas. |
| `className` | `string` | `""` | Clases adicionales para el panel del drawer (no para el backdrop). |

## Props — NotificationBell

Todas las de `NotificationPanel` (menos `className`, redefinida abajo) más:

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `align` | `"start" \| "end"` | `"end"` | Alineación del popover respecto del botón. |
| `panelWidth` | `number` | `380` | Ancho del popover. |
| `className` | `string` | `""` | Clases adicionales para el contenedor relativo del botón (no del panel). |

## Tipos exportados

```ts
type NotificationTone = "info" | "success" | "warning" | "danger" | "neutral";

interface AppNotification {
  id: string;
  title: string;
  description?: string;
  date: Date | string | number;
  read?: boolean;
  tone?: NotificationTone;
  icon?: ReactNode;      // reemplaza al ícono del tone
  avatar?: string;       // si existe, reemplaza al ícono por completo
  href?: string;
  action?: { label: string; onClick: (n: AppNotification) => void };
}
```

## Funciones exportadas

```ts
function relativeTime(date: Date | string | number, now?: Date): string; // "hace 5 min", "hace 2 d"
function groupLabel(date: Date | string | number, now?: Date): string;   // "Hoy" | "Ayer" | "Esta semana" | "Anteriores"
```

## Ejemplos

### Panel en una pantalla dedicada
```tsx
const [items, setItems] = useState<AppNotification[]>(notifications);

<NotificationPanel
  items={items}
  onRead={(id) => setItems((l) => l.map((n) => (n.id === id ? { ...n, read: true } : n)))}
  onReadAll={() => setItems((l) => l.map((n) => ({ ...n, read: true })))}
  onDismiss={(id) => setItems((l) => l.filter((n) => n.id !== id))}
  onClear={() => setItems([])}
  onItemClick={(n) => n.href && router.push(n.href)}
/>
```

### Campana en el header
```tsx
<AppHeader title="Inicio">
  {/* como leading o dentro de un action custom */}
</AppHeader>

<NotificationBell
  items={items}
  onRead={markAsRead}
  onReadAll={markAllAsRead}
  align="end"
/>
```

### Centro de notificaciones como drawer
```tsx
const [open, setOpen] = useState(false);

<>
  <button onClick={() => setOpen(true)}>Ver notificaciones</button>

  <NotificationSidebar
    open={open}
    onClose={() => setOpen(false)}
    side="right"
    width={420}
    items={items}
    onRead={markAsRead}
    onReadAll={markAllAsRead}
    onDismiss={(id) => setItems((l) => l.filter((n) => n.id !== id))}
    onClear={() => setItems([])}
    footer={
      <button className="w-full h-9 text-xs font-semibold text-primary">
        Ver todas
      </button>
    }
  />
</>
```

### Con acción inline y avatar
```tsx
const items: AppNotification[] = [
  {
    id: "1",
    title: "Lucía comentó tu publicación",
    description: "«Me encanta cómo quedó el balcón»",
    date: Date.now() - 5 * 60_000,
    avatar: user.photo,
    action: { label: "Responder", onClick: (n) => openReply(n.id) },
  },
  {
    id: "2",
    title: "Pago confirmado",
    date: "2025-01-10T09:00:00Z",
    tone: "success",
    read: true,
  },
];
```

## Requisitos / dependencias

- Usa `framer-motion` para la entrada/salida de filas, el badge animado, el popover de `NotificationBell` y el deslizamiento de `NotificationSidebar`.
- Marcado como `"use client"`. No requiere ningún Provider.
- `NotificationSidebar` respeta `--sa-top` / `--sa-bottom` (o `env(safe-area-inset-*)` como fallback) en su fila de cierre y en el `footer` — ver `SafeArea` / `useSafeArea` si tu app los define.

## Notas y comportamiento

- El agrupado (`groupLabel`) y el orden (más reciente primero) se recalculan en un `useMemo` cada vez que cambian `items` o `filter` — no hace falta ordenar el array vos mismo.
- Los tres componentes comparten el mismo header y la misma lista internamente, así que el filtro, el agrupado, el estado vacío y el comportamiento de cada fila son idénticos. Cada instancia tiene su propio estado de filtro: abrir el sidebar no hereda el filtro del panel embebido (salvo que los controles vos con `filter`/`onFilterChange`).
- `NotificationSidebar` es siempre controlado (`open` + `onClose`), bloquea el scroll del `body` mientras está abierto restaurando el valor previo al cerrar, y se anuncia como `role="dialog" aria-modal="true"`. No hace focus trap: si necesitás atrapar el foco, envolvelo vos.
- `avatar` tiene prioridad total sobre `icon`: si `avatar` está presente, el icono (custom o del `tone`) no se renderiza en absoluto.
- El punto de "no leída" (`!n.read`) se dibuja como un `<span>` absoluto independiente del ícono/avatar — no hace falta que vos lo agregues al `icon` custom.
- `onDismiss` y `onClear` son opt-in: si no los pasás, no aparece ni el botón × por fila (aparece sólo con `hover`/`focus` vía `group-hover`) ni el botón de vaciar en el header del panel.
- `NotificationBell` cierra el popover con click fuera del contenedor y con `Escape`, gestionado con listeners en `document` que sólo se agregan mientras `open` es `true`.
- El badge numérico de `NotificationBell` se corta en `"99+"` para conteos mayores a 99, y la campana hace un pequeño "wiggle" (`rotate` animado) cada vez que el conteo de no leídas pasa de 0.
