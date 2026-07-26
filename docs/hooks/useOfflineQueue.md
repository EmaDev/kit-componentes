# useOfflineQueue

> Cola de mutaciones offline: encolá la acción, se persiste en IndexedDB y se reintenta con backoff exponencial cuando vuelve la conexión. Si el navegador soporta Background Sync, además le pide al service worker que despierte la cola aunque la pestaña se haya cerrado.

**Import**
```ts
import { useOfflineQueue, type QueuedItem, type QueueItemStatus } from "lib-kit-components";
```

## Cuándo usarlo

Para cualquier acción de escritura (comentario, like, pedido, formulario) que deba funcionar sin conexión: en vez de esperar a que el fetch termine, encolás la acción de inmediato (UI optimista) y el hook se encarga de enviarla apenas haya red, con reintentos automáticos. Combinalo con `SyncStatus` para mostrar el estado de la cola en la UI.

## Cuándo NO usarlo / alternativas

- Para lecturas (GET) con caché y revalidación, usá `useCachedFetch`, no esto — `useOfflineQueue` es sólo para mutaciones salientes.
- Si tu backend no tolera reintentos (la acción no es idempotente y reenviarla dos veces causa un efecto duplicado, como cobrar dos veces), diseñá `send` para que sea idempotente del lado del servidor (ej. con una key de idempotencia por `item.id`) antes de usar esta cola.

## Firma

```ts
function useOfflineQueue<T = unknown>(options: {
  name?: string;
  send: (item: QueuedItem<T>) => Promise<void>;
  maxAttempts?: number;
  backoff?: (attempt: number) => number;
  autoFlush?: boolean;
  backgroundSync?: boolean;
}): {
  items: QueuedItem<T>[];
  pending: number;
  failed: number;
  flushing: boolean;
  ready: boolean;
  enqueue: (kind: string, payload: T) => Promise<string>;
  flush: () => Promise<void>;
  retry: (id?: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  clear: () => void;
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `name` | `string` | `"default"` | Clave del store — usá una cola distinta por tipo de acción si necesitás procesarlas por separado. |
| `send` | `(item: QueuedItem<T>) => Promise<void>` | — (requerido) | Cómo se envía cada item. Resolvé para marcar éxito; lanzá para marcar fracaso y reintentar. |
| `maxAttempts` | `number` | `5` | Intentos antes de marcar el item como `"failed"` definitivo. |
| `backoff` | `(attempt: number) => number` | `1s, 2s, 4s, 8s… tope 30s` | Milisegundos de espera antes del próximo intento. |
| `autoFlush` | `boolean` | `true` | Procesa la cola automáticamente al recuperar conexión (evento `online`) y al montar si ya hay red. |
| `backgroundSync` | `boolean` | `true` | Registra una Background Sync (`sync:${name}`) en el service worker en cada `enqueue`, para reintentar aunque la pestaña se cierre (requiere que tu `sw.js` escuche el evento `sync`). |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `items` | `QueuedItem<T>[]` | Todos los items en la cola (pendientes, enviándose o fallidos). |
| `pending` | `number` | Items que no están en `"failed"` (pensalo como "todavía en juego"). |
| `failed` | `number` | Items que agotaron `maxAttempts`. |
| `flushing` | `boolean` | Hay un procesamiento de la cola en curso. |
| `ready` | `boolean` | Ya se terminó de leer el estado inicial desde IndexedDB (útil para no mostrar "0 pendientes" antes de tiempo). |
| `enqueue` | `(kind: string, payload: T) => Promise<string>` | Agrega un item y dispara `flush()` si hay conexión. Devuelve el `id` generado. |
| `flush` | `() => Promise<void>` | Procesa la cola ahora (secuencial, un item a la vez, respetando el backoff entre reintentos). |
| `retry` | `(id?: string) => Promise<void>` | Reintenta un item puntual (o todos los `"failed"` si se omite `id`), reseteando sus intentos a `0`. |
| `remove` | `(id: string) => Promise<void>` | Saca un item de la cola sin enviarlo. |
| `clear` | `() => void` | Vacía toda la cola. |

## Tipos exportados

```ts
type QueueItemStatus = "pending" | "sending" | "failed";

interface QueuedItem<T = unknown> {
  id: string;
  kind: string;
  payload: T;
  createdAt: number;
  attempts: number;
  status: QueueItemStatus;
  error?: string;
}
```

## Ejemplos

### Comentario con UI optimista
```tsx
const queue = useOfflineQueue<{ postId: string; text: string }>({
  name: "comments",
  send: (item) => api.postComment(item.payload),
});

async function onSubmit(text: string) {
  await queue.enqueue("create-comment", { postId, text }); // se ve al toque, se envía cuando pueda
}
```

### Estado visible + reintento manual
```tsx
<SyncStatus
  variant="panel"
  pending={queue.pending}
  failed={queue.failed}
  flushing={queue.flushing}
  onRetry={() => queue.retry()}
/>
```

## Notas y comportamiento

- Todo el estado de la cola vive en IndexedDB bajo la clave `queue:${name}` — sobrevive recargas de página y cierres de la app; al montar, cualquier item que haya quedado en `"sending"` por un cierre abrupto se resetea a `"pending"`.
- El procesamiento (`flush`) es **secuencial**, un item a la vez, en el orden en que se encolaron — no hay envío paralelo. Si un item falla y todavía le quedan intentos, el flush espera el `backoff` correspondiente **antes de pasar al siguiente item**, así que una cola larga con fallos puede tardar en procesarse completa.
- Si `navigator.onLine` pasa a `false` a mitad del `flush`, el loop corta inmediatamente (`break`) dejando el resto de los items como estaban — no sigue intentando en offline.
- La integración con Background Sync es best-effort: si el navegador no soporta `sync` (iOS Safari, Firefox), el registro falla en silencio y la cola sigue funcionando igual, apoyada sólo en el evento `online` de la propia pestaña — para que Background Sync tenga efecto real necesitás además manejar el evento `sync` en tu `public/sw.js`.
- `retry(id)` resetea `attempts` a `0` y `error` a `undefined` para ese item (o para todos los fallidos si no pasás `id`) y dispara un `flush()` — no hace falta llamar a `flush()` vos mismo después.
