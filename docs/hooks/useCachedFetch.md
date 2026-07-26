# useCachedFetch

> Stale-while-revalidate con persistencia en IndexedDB: pinta al toque lo último que se vio (aunque estés offline) mientras revalida en segundo plano.

**Import**
```ts
import { useCachedFetch } from "lib-kit-components";
```

## Cuándo usarlo

Para cualquier pantalla que dependa de un endpoint GET y deba mostrar algo útil incluso sin conexión: la primera pintura usa lo que haya en caché (si existe) sin esperar a la red, y en paralelo dispara el fetch real si hace falta revalidar. Es la base natural para combinar con `SyncStatus`/`OfflineFallback` — usá `fromCache`/`isStale` para decidir si mostrar un aviso, y `error` sin `data` como la señal de "no hay nada que mostrar" para `OfflineFallback`.

## Cuándo NO usarlo / alternativas

- Para mutaciones (POST/PUT/DELETE) que deban sobrevivir estar offline y reintentarse solas, usá `useOfflineQueue`, no `useCachedFetch` (que es sólo de lectura).
- Si tu proyecto ya usa SWR o React Query, usá esa librería — `useCachedFetch` existe para no traer una dependencia extra cuando sólo necesitás este patrón básico con persistencia en IndexedDB (en vez de sólo memoria).

## Firma

```ts
function useCachedFetch<T>(url: string, options?: {
  key?: string;
  maxAge?: number;
  enabled?: boolean;
  fetcher?: (url: string) => Promise<T>;
  revalidateOnFocus?: boolean;
}): {
  data: T | null;
  error: Error | null;
  loading: boolean;
  fromCache: boolean;
  isStale: boolean;
  updatedAt: number | null;
  refetch: () => void;
  invalidate: () => void;
}
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `key` | `string` | `url` | Clave de caché en IndexedDB. Usá una distinta de la url si necesitás cachear la misma url con variantes (ej. por usuario). |
| `maxAge` | `number` | `300000` (5 min) | Milisegundos tras los cuales el dato se considera viejo y se revalida. |
| `enabled` | `boolean` | `true` | Poné en `false` para no pedir todavía (ej. falta un id dependiente). |
| `fetcher` | `(url: string) => Promise<T>` | `fetch(url).then(r => r.json())` con chequeo de `r.ok` | Cómo obtener el dato — pasalo si necesitás headers, otro cliente HTTP, GraphQL, etc. |
| `revalidateOnFocus` | `boolean` | `true` | Revalida al volver a la pestaña/app o al recuperar conexión. |

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `data` | `T \| null` | Último dato disponible (de caché o de red). |
| `error` | `Error \| null` | Error del último intento de red (no se limpia por sí solo si `data` sigue siendo el de caché). |
| `loading` | `boolean` | Hay un fetch de red en curso. |
| `fromCache` | `boolean` | `data` viene de IndexedDB, todavía no se confirmó con la red en esta carga. |
| `isStale` | `boolean` | Pasó más de `maxAge` desde `updatedAt`. |
| `updatedAt` | `number \| null` | Timestamp del último fetch de red exitoso. |
| `refetch` | `() => void` | Fuerza una revalidación aunque el dato no esté vencido. |
| `invalidate` | `() => void` | Borra la entrada de caché (no dispara un refetch por sí solo). |

## Ejemplos

### Pantalla con fallback offline
```tsx
function ProductScreen({ id }: { id: string }) {
  const { data, error, loading, fromCache, refetch } = useCachedFetch<Product>(`/api/products/${id}`);

  if (error && !data) return <OfflineFallback onRetry={refetch} />;
  return (
    <>
      {fromCache && <SyncStatus pending={0} variant="chip" hideWhenSynced={false} />}
      <ProductDetail product={data} loading={loading} />
    </>
  );
}
```

### Con fetcher custom (headers, otro cliente)
```tsx
const { data } = useCachedFetch<User>("/api/me", {
  fetcher: (url) => api.get(url, { headers: { Authorization: `Bearer ${token}` } }),
  maxAge: 60_000,
});
```

### Deshabilitado hasta tener el id
```tsx
const { data } = useCachedFetch<Order>(`/api/orders/${orderId}`, { enabled: Boolean(orderId) });
```

## Notas y comportamiento

- La primera pintura es **siempre** lo que haya en caché (si existe), sin esperar a la red — `data` y `fromCache: true` se setean de forma síncrona-asíncrona apenas resuelve la lectura de IndexedDB, antes de que el fetch de red siquiera empiece.
- Si el dato en caché sigue "fresco" (`Date.now() - cached.at < maxAge`) y no se pidió `force` (vía `refetch`), **no se dispara ningún fetch de red** — el hook confía en la caché sin validar contra el servidor.
- Si `navigator.onLine` es `false`, el hook no intenta la request de red en absoluto (evita el timeout/error innecesario) — se queda con lo que haya en caché, sin marcar `error`.
- `revalidateOnFocus` escucha tanto `visibilitychange` (volver a la pestaña) como el evento `online` del navegador — cualquiera de los dos dispara una revalidación.
- `invalidate()` sólo borra la entrada de IndexedDB; no limpia `data` del estado en memoria ni dispara un refetch — llamalo junto con `refetch()` si querés "olvidar y volver a pedir" en el mismo gesto.
