# useNotificationPermission

> Maneja el permiso de Notifications API del navegador: estado actual, si se puede pedir, pedirlo, y disparar una notificación local de prueba.

**Import**
```ts
import { useNotificationPermission, type NotificationStatus } from "lib-kit-components";
```

## Cuándo usarlo

Usalo para construir tu propio flujo de opt-in a notificaciones (por ejemplo un modal contextual que explica el beneficio antes de pedir permiso, en vez de pedirlo apenas carga la página) en lugar del componente `NotificationOptIn` prearmado, que usa este hook internamente. También sirve para lógica que no es puramente de UI, como decidir si mostrar un badge de "activá las notificaciones" en la configuración de la cuenta, o para disparar una notificación de prueba desde un botón de "probar notificaciones" en un panel de ajustes.

## Firma

```ts
function useNotificationPermission(): {
  status: NotificationStatus;
  canAsk: boolean;
  request: () => Promise<NotificationStatus>;
  notify: (title: string, options?: NotificationOptions) => Promise<boolean>;
}
```

`NotificationStatus = "unsupported" | "default" | "granted" | "denied"` (tipo exportado). No recibe parámetros.

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `status` | `NotificationStatus` | Estado actual del permiso. `"unsupported"` si el navegador no tiene la API `Notification`; si la tiene, refleja `Notification.permission` (`"default"`, `"granted"` o `"denied"`). |
| `canAsk` | `boolean` | Atajo de `status === "default"`: el usuario todavía no decidió, así que tiene sentido pedir permiso. |
| `request` | `() => Promise<NotificationStatus>` | Pide el permiso al navegador (`Notification.requestPermission()`) y actualiza `status` con el resultado. |
| `notify` | `(title: string, options?: NotificationOptions) => Promise<boolean>` | Dispara una notificación local. Devuelve `true`/`false` según si se pudo mostrar. |

## Ejemplos

### Opt-in básico
```tsx
import { useNotificationPermission } from "lib-kit-components";

function NotifyOptIn() {
  const { canAsk, status, request } = useNotificationPermission();

  if (!canAsk) return null; // ya decidió, o no soportado

  return (
    <button onClick={() => request()}>Activar notificaciones</button>
  );
}
```

### Notificación de prueba
```tsx
function TestNotificationButton() {
  const { status, notify } = useNotificationPermission();
  return (
    <button
      disabled={status !== "granted"}
      onClick={() => notify("¡Todo listo!", { body: "Las notificaciones están activadas." })}
    >
      Enviar notificación de prueba
    </button>
  );
}
```

### Mensaje distinto según el estado (incluyendo "denegado")
```tsx
function NotificationStatusHint() {
  const { status } = useNotificationPermission();

  switch (status) {
    case "unsupported": return <p>Tu navegador no soporta notificaciones.</p>;
    case "denied": return <p>Bloqueaste las notificaciones. Habilitalas desde la configuración del sitio en tu navegador.</p>;
    case "granted": return <p>Notificaciones activadas ✓</p>;
    default: return null; // "default": todavía no se pidió
  }
}
```

## Notas y comportamiento

- **iOS**: las notificaciones web sólo funcionan si la PWA ya está **instalada en la pantalla de inicio** (modo standalone) y en iOS 16.4+; dentro de una pestaña normal de Safari, `"Notification" in window` puede directamente no existir o el flujo no tener efecto real. Combiná este hook con `usePlatform().isStandalone` o `usePwaInstall().isStandalone` para condicionar el opt-in en iOS.
- Una vez que el navegador queda en `"denied"`, **no hay forma de volver a pedir permiso por código**: es una restricción del navegador, no del hook. `request()` seguiría devolviendo `"denied"` sin mostrar ningún diálogo. El usuario tiene que cambiarlo manualmente desde la configuración del sitio.
- `notify()` intenta primero mostrar la notificación a través del service worker activo (`registration.showNotification(...)`), y si no hay un service worker registrado, cae a `new Notification(...)` directamente. El camino por service worker es **necesario en Chrome para Android**, que no permite instanciar `Notification` directamente fuera de un service worker. Para máxima compatibilidad cruzada, registrá un service worker (ver `useServiceWorker`) antes de depender de `notify()`.
- `notify()` revalida `Notification.permission` en vivo antes de disparar (no confía ciegamente en el `status` del estado de React), así que evita el caso borde de un `status` desactualizado.
- SSR-safe: todo el acceso a `Notification`/`window` está guardado con checks de `typeof window === "undefined"`; el estado inicial es `"unsupported"` tanto en servidor como en cliente hasta que el `useEffect` de montaje corrige el valor real.
- Pedir permiso (`request()`) generalmente requiere haberse originado en una interacción directa del usuario (click, tap) en la mayoría de los navegadores; llamarlo automáticamente al montar un componente puede ser ignorado o rechazado silenciosamente por el navegador.
