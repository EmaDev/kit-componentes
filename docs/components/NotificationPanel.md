# NotificationPanel

> Panel de notificaciones agrupadas por fecha (Hoy / Ayer / Esta semana / Anteriores), con filtro Todas/No leídas, marcar todo como leído, descartar individual y vaciar. `NotificationBell` es el mismo panel dentro de un botón de campana con popover y badge de no leídas.

**Import**
```tsx
import {
  NotificationPanel,
  NotificationBell,
  relativeTime,
  groupLabel,
  type AppNotification,
  type NotificationTone,
  type NotificationPanelProps,
  type NotificationBellProps,
} from "lib-kit-components";
```

## Cuándo usarlo

`NotificationPanel` para una pantalla o sección dedicada a notificaciones (tab "Notificaciones", panel lateral). `NotificationBell` cuando necesitás el patrón típico de header: ícono de campana con badge de no leídas que abre el mismo panel en un popover anclado, con click-outside y `Escape` para cerrar.

## Cuándo NO usarlo / alternativas

- Para feedback transitorio de una acción puntual ("Guardado", "Error al subir"), usá `Toast`, no `NotificationPanel` (que es para un historial persistente).
- Si necesitás una sola notificación a la vez con "deshacer" (no un historial), usá `Snackbar`.
- `AppHeader` ya tiene su propio slot de `actions` con badge — podés usar `NotificationBell` como uno de esos `actions` si necesitás también otros botones de icono en la misma fila.

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

- Usa `framer-motion` para la entrada/salida de filas, el badge animado y el popover de `NotificationBell`.
- Marcado como `"use client"`. No requiere ningún Provider.

## Notas y comportamiento

- El agrupado (`groupLabel`) y el orden (más reciente primero) se recalculan en un `useMemo` cada vez que cambian `items` o `filter` — no hace falta ordenar el array vos mismo.
- `avatar` tiene prioridad total sobre `icon`: si `avatar` está presente, el icono (custom o del `tone`) no se renderiza en absoluto.
- El punto de "no leída" (`!n.read`) se dibuja como un `<span>` absoluto independiente del ícono/avatar — no hace falta que vos lo agregues al `icon` custom.
- `onDismiss` y `onClear` son opt-in: si no los pasás, no aparece ni el botón × por fila (aparece sólo con `hover`/`focus` vía `group-hover`) ni el botón de vaciar en el header del panel.
- `NotificationBell` cierra el popover con click fuera del contenedor y con `Escape`, gestionado con listeners en `document` que sólo se agregan mientras `open` es `true`.
- El badge numérico de `NotificationBell` se corta en `"99+"` para conteos mayores a 99, y la campana hace un pequeño "wiggle" (`rotate` animado) cada vez que el conteo de no leídas pasa de 0.
