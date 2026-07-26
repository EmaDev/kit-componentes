# useAppBadge

> Contador numérico sobre el ícono de la app instalada (Android, Windows, macOS), vía la Badging API.

**Import**
```ts
import { useAppBadge } from "lib-kit-components";
```

## Cuándo usarlo

Para reflejar en el ícono de la PWA instalada un contador que ya tenés en la UI (mensajes sin leer, notificaciones pendientes, ítems del carrito) — el mismo patrón visual que las apps nativas de mail o mensajería. Pasale `count` para que se sincronice solo con cada cambio, o usá `set`/`clear` de forma imperativa si preferís controlarlo vos.

## Cuándo NO usarlo / alternativas

- Para el contador visible **dentro** de la UI de la app (un badge sobre un ícono de campana en el header), usá el prop `badge` de `HeaderAction` en `AppHeader`, o el badge propio de `NotificationBell` — `useAppBadge` es sólo el ícono de la app en el sistema operativo, no reemplaza ningún indicador dentro de la página.

## Firma

```ts
function useAppBadge(count?: number): {
  supported: boolean;
  set: (n: number) => Promise<boolean>;
  clear: () => Promise<boolean>;
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `count` | `number` | `undefined` | Si se pasa, el hook sincroniza el badge automáticamente en cada cambio de este valor (`0` limpia el badge). Omitilo para controlar el badge sólo con `set`/`clear`. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `supported` | `boolean` | El navegador expone `navigator.setAppBadge` (Chrome/Edge en Android, Windows y macOS con la PWA instalada; sin soporte en iOS Safari ni en pestañas de navegador comunes sin instalar). |
| `set` | `(n: number) => Promise<boolean>` | Pone el badge en `n` (o lo limpia si `n <= 0`). Devuelve si la llamada tuvo éxito. |
| `clear` | `() => Promise<boolean>` | Limpia el badge explícitamente. |

## Ejemplos

### Sincronizado con el contador de notificaciones sin leer
```tsx
function App({ notifications }: { notifications: AppNotification[] }) {
  const unread = notifications.filter((n) => !n.read).length;
  useAppBadge(unread);
  return <NotificationBell items={notifications} />;
}
```

### Control imperativo
```tsx
const { supported, set, clear } = useAppBadge();

async function onNewMessage() {
  if (supported) await set(unreadCount + 1);
}

async function onOpenInbox() {
  if (supported) await clear();
}
```

## Notas y comportamiento

- Sólo funciona con la PWA **instalada** en la mayoría de las plataformas — en una pestaña de navegador normal (sin instalar), `supported` suele ser `false` aunque el navegador soporte la API en general.
- `set(n)` con `n <= 0` llama a `clearAppBadge()` en vez de `setAppBadge(0)` — es la forma correcta de "sin badge" según la especificación (un badge en `0` no es lo mismo que ausencia de badge en algunas plataformas).
- Ambas llamadas están envueltas en `try/catch`: si el navegador rechaza la operación (por ejemplo, fuera de un contexto instalado), el hook devuelve `false` en vez de lanzar.
- No hay forma de leer el valor actual del badge desde la API del navegador — el hook no expone un estado `current`, sólo `set`/`clear` imperativos. Si necesitás mostrar el mismo número en la UI, mantenelo en tu propio estado (como en el ejemplo con `notifications`).
