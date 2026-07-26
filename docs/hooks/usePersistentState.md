# usePersistentState

> Un `useState` que sobrevive recargas de página y cierres de la app, persistiendo en IndexedDB (o `localStorage` como driver alternativo). SSR-safe: devuelve el valor inicial en el servidor y en el primer render del cliente, y expone `hydrated` para saber cuándo ya se leyó el valor guardado.

**Import**
```ts
import { usePersistentState } from "lib-kit-components";
```

## Cuándo usarlo

Para cualquier estado de UI que quieras que sobreviva un refresh o cerrar y reabrir la PWA: preferencias del usuario, filtros aplicados, un borrador de formulario, el último tab visitado. Es la pieza de más alto nivel sobre `idb`/`ls` — si sólo necesitás leer/escribir una vez (no un `useState` reactivo), usá `idb`/`ls` directo.

## Cuándo NO usarlo / alternativas

- Para datos que vienen de un servidor (no de interacción local), usá `useCachedFetch`, no esto.
- Para la cola de acciones pendientes de enviar, usá `useOfflineQueue`, que tiene su propia estructura (`QueuedItem[]`) sobre IndexedDB.
- Si necesitás sincronización entre pestañas del mismo origen, usá `driver: "local"` (ver notas) — el driver `"idb"` no dispara el evento `storage`.

## Firma

```ts
function usePersistentState<T>(
  key: string,
  initial: T,
  options?: { driver?: "idb" | "local"; syncTabs?: boolean }
): [
  T,
  (value: T | ((prev: T) => T)) => void,
  { hydrated: boolean; reset: () => void }
]
```

## Parámetros

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `key` | `string` | — (requerido) | Clave de persistencia. |
| `initial` | `T` | — (requerido) | Valor por defecto, usado en el servidor y hasta que se hidrate el valor guardado. |
| `driver` | `"idb" \| "local"` | `"idb"` | Dónde guardar. Cae solo a `"local"` (`localStorage`) si IndexedDB no está disponible en el entorno. |
| `syncTabs` | `boolean` | `true` | Sincroniza el valor entre pestañas del mismo origen — sólo tiene efecto con `driver: "local"`. |

## Valor de retorno

Tupla de 3 elementos, como `useState` pero con un tercer elemento de metadata:

| Índice | Tipo | Descripción |
|---|---|---|
| `[0]` | `T` | Valor actual. |
| `[1]` | `(v: T \| ((prev: T) => T)) => void` | Setter — soporta tanto el valor directo como una función `(prev) => next`, igual que `useState`. |
| `[2].hydrated` | `boolean` | `true` una vez que se terminó de leer el valor persistido (async). Antes de eso, `[0]` es `initial`. |
| `[2].reset` | `() => void` | Borra el valor persistido y vuelve a `initial`. |

## Ejemplos

### Preferencia de usuario simple
```tsx
const [tema, setTema] = usePersistentState<"claro" | "oscuro">("tema", "claro");
```

### Evitar el flash del valor por defecto antes de hidratar
```tsx
const [filtros, setFiltros, { hydrated }] = usePersistentState("filtros.productos", DEFAULT_FILTERS);

if (!hydrated) return <Skeleton />; // evita mostrar DEFAULT_FILTERS un instante antes del real
return <FilterBar value={filtros} onChange={setFiltros} />;
```

### Sincronizado entre pestañas
```tsx
const [carritoAbierto, setCarritoAbierto] = usePersistentState("ui.carrito.abierto", false, {
  driver: "local",
  syncTabs: true,
});
```

## Notas y comportamiento

- **SSR-safe por diseño**: en el servidor y en el primer render del cliente, el hook siempre devuelve `initial` — la lectura real desde IndexedDB/`localStorage` es asíncrona y ocurre en un `useEffect`, así que nunca hay mismatch de hidratación entre servidor y cliente. Usá `hydrated` (no `[0]` directamente) si necesitás distinguir "todavía no leí el valor guardado" de "el valor guardado es igual al default".
- `syncTabs` **sólo tiene efecto con `driver: "local"`**: escucha el evento `storage` del navegador, que únicamente se dispara para cambios en `localStorage` hechos desde *otra* pestaña. El driver `"idb"` no tiene ese mecanismo — si necesitás sincronización entre pestañas, usá `"local"`.
- Si pedís `driver: "idb"` pero IndexedDB no está disponible en el entorno (Safari en navegación privada, algunos webviews), el hook cae solo a `localStorage` para esa sesión (vía `idbAvailable()`) — el comportamiento sigue funcionando, pero sin persistencia real de IndexedDB.
- `reset()` borra la entrada persistida **y** vuelve el estado en memoria a `initial` en el mismo llamado — no hace falta llamar al setter después.
