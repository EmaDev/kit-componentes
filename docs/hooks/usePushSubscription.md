# usePushSubscription

> Suscripción a Web Push (VAPID): pide permiso, crea la suscripción del navegador y la sincroniza con tu backend. Complementa a `useNotificationPermission` — ese pide el permiso de notificaciones; este además crea y mantiene la suscripción push real.

**Import**
```ts
import { usePushSubscription } from "lib-kit-components";
```

## Cuándo usarlo

Cuando tu app necesita enviar **notificaciones push reales desde el servidor** (no sólo notificaciones locales disparadas por el cliente) — por ejemplo, avisar de un nuevo mensaje o el estado de un pedido incluso con la app cerrada. Necesitás un backend que sepa hablar el protocolo Web Push con VAPID (par de claves pública/privada) para poder enviar los push a las suscripciones que este hook crea.

## Cuándo NO usarlo / alternativas

- Si sólo necesitás notificaciones disparadas **desde el propio cliente** mientras la pestaña/app está abierta (sin servidor), usá `useNotificationPermission`, que es mucho más simple y no requiere VAPID.
- `NotificationOptIn` cubre el opt-in de **permiso** de notificaciones con una UI lista; combinalo con este hook si además necesitás la suscripción push real contra tu backend.

## Firma

```ts
function usePushSubscription(options: {
  publicKey: string;
  onSubscribe?: (sub: PushSubscription) => Promise<void> | void;
  onUnsubscribe?: (sub: PushSubscription) => Promise<void> | void;
}): {
  supported: boolean;
  subscribed: boolean;
  subscription: PushSubscription | null;
  busy: boolean;
  error: string | null;
  subscribe: () => Promise<PushSubscription | null>;
  unsubscribe: () => Promise<void>;
}
```

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `publicKey` | `string` | Clave pública VAPID de tu backend, en base64 url-safe. |
| `onSubscribe` | `(sub: PushSubscription) => Promise<void> \| void` | Se llama tras crear la suscripción — mandala a tu backend acá (`sub.toJSON()` da `endpoint` + `keys`). |
| `onUnsubscribe` | `(sub: PushSubscription) => Promise<void> \| void` | Se llama **antes** de dar de baja la suscripción en el navegador — avisale a tu backend que la elimine. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `supported` | `boolean` | El navegador soporta Service Worker + Push API + Notifications. |
| `subscribed` | `boolean` | Hay una suscripción activa. |
| `subscription` | `PushSubscription \| null` | La suscripción actual, si existe. |
| `busy` | `boolean` | Hay una operación de suscribir/desuscribir en curso. |
| `error` | `string \| null` | Mensaje del último error. |
| `subscribe` | `() => Promise<PushSubscription \| null>` | Pide el permiso de notificaciones (si hace falta) y crea la suscripción. |
| `unsubscribe` | `() => Promise<void>` | Da de baja la suscripción actual, tras avisar a tu backend vía `onUnsubscribe`. |

## Ejemplos

### Opt-in de push con sincronización al backend
```tsx
const push = usePushSubscription({
  publicKey: process.env.NEXT_PUBLIC_VAPID_KEY!,
  onSubscribe: (sub) => api.post("/push/subscribe", sub.toJSON()),
  onUnsubscribe: (sub) => api.post("/push/unsubscribe", { endpoint: sub.endpoint }),
});

<button onClick={push.subscribed ? push.unsubscribe : push.subscribe} disabled={push.busy}>
  {push.subscribed ? "Desactivar notificaciones" : "Activar notificaciones"}
</button>
```

## Requisitos / dependencias

- Requiere un service worker registrado y activo (`navigator.serviceWorker.ready`) — usalo junto con `useServiceWorker` o tu propio registro de SW.
- Requiere HTTPS (o `localhost`) y un par de claves VAPID generadas en tu backend.

## Notas y comportamiento

- Al montar, el hook consulta si ya existe una suscripción (`reg.pushManager.getSubscription()`) sin pedir ningún permiso — así `subscribed`/`subscription` reflejan el estado real desde el primer render útil, sin acción del usuario.
- `subscribe()` primero pide el permiso de notificaciones (`Notification.requestPermission()`); si el usuario lo rechaza, la función lanza y `error` queda seteado, sin llegar a crear la suscripción push.
- Si ya existe una suscripción activa, `subscribe()` la reutiliza (`getSubscription() ?? subscribe(...)`) en vez de crear una nueva — es seguro llamarlo más de una vez.
- La clave pública VAPID se convierte de base64 url-safe a `Uint8Array` internamente (`urlBase64ToUint8Array`) — pasala tal cual la genera tu backend, sin decodificar vos mismo.
- `unsubscribe()` llama a tu `onUnsubscribe` **antes** de invocar `subscription.unsubscribe()` del navegador — así tu backend todavía tiene el `endpoint` disponible para borrar el registro correspondiente.
