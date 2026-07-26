# idb / ls

> Wrapper mínimo de IndexedDB sin dependencias, con fallback a `localStorage`. Es la capa de persistencia que usan internamente `usePersistentState`, `useOfflineQueue` y `useCachedFetch` — usalo directo sólo si necesitás guardar algo por fuera de esos tres.

**Import**
```ts
import { idb, ls, type StoreName } from "lib-kit-components";
```

## Cuándo usarlo

Cuando necesitás persistencia estructurada (más que un `localStorage.setItem` suelto) pero no querés traer una librería como `idb` o `dexie`: `idb` te da un `get`/`set`/`del`/`keys`/`all`/`clear` por store, sin boilerplate de `indexedDB.open`/transacciones/eventos. Casi nunca hace falta usarlo directo — preferí `usePersistentState` (para un valor tipo `useState` persistente) o `useCachedFetch` (para datos remotos cacheados). Usalo directo sólo si estás armando tu propia capa de persistencia con una forma distinta a esas dos.

`ls` es el mismo contrato pero sobre `localStorage`, síncrono, para cuando IndexedDB no está disponible (Safari en modo privado, algunos contextos de SSR) o cuando preferís algo síncrono y simple.

## Firma

```ts
function idbAvailable(): boolean;

const idb: {
  get: <T>(store: StoreName, key: string) => Promise<T | null>;
  set: (store: StoreName, key: string, value: unknown) => Promise<null>;
  del: (store: StoreName, key: string) => Promise<null>;
  keys: (store: StoreName) => Promise<IDBValidKey[] | null>;
  all: <T>(store: StoreName) => Promise<T[] | null>;
  clear: (store: StoreName) => Promise<null>;
};

const ls: {
  get: <T>(key: string) => T | null;
  set: (key: string, value: unknown) => void;
  del: (key: string) => void;
};

type StoreName = "kv" | "queue" | "cache";
```

## Parámetros

| Parámetro | Tipo | Descripción |
|---|---|---|
| `store` | `StoreName` | Uno de los tres object stores fijos de la base `scaffold-store`: `"kv"` (usado por `usePersistentState`), `"queue"` (por `useOfflineQueue`) y `"cache"` (por `useCachedFetch`). No se pueden crear stores nuevos en tiempo de ejecución. |
| `key` | `string` | Clave dentro del store. |
| `value` | `unknown` | Cualquier valor estructurable (clonable con la structured clone algorithm: objetos planos, arrays, `Date`, `Blob`, etc.). |

## Ejemplos

### Persistencia propia, fuera de los hooks de alto nivel
```ts
import { idb } from "lib-kit-components";

async function saveDraft(id: string, draft: Draft) {
  await idb.set("kv", `draft:${id}`, draft);
}

async function loadDraft(id: string) {
  return idb.get<Draft>("kv", `draft:${id}`);
}
```

### Fallback manual a localStorage
```ts
import { idb, idbAvailable, ls } from "lib-kit-components";

async function saveSetting(key: string, value: unknown) {
  if (idbAvailable()) await idb.set("kv", key, value);
  else ls.set(key, value);
}
```

## Notas y comportamiento

- Ninguna operación de `idb` lanza excepciones: si `indexedDB` no está disponible, si la transacción falla, o si el navegador bloquea el acceso (modo privado de Safari, por ejemplo), todas las funciones resuelven `null` en silencio. No hace falta envolver las llamadas en `try/catch`.
- La conexión a la base (`indexedDB.open`) se abre una sola vez y se cachea en un módulo-level `dbPromise` — todas las llamadas subsecuentes reutilizan la misma conexión, no se vuelve a abrir por cada operación.
- Los tres stores (`kv`, `queue`, `cache`) se crean automáticamente en `onupgradeneeded` la primera vez que se abre la base (`scaffold-store`, versión 1) — no hace falta ninguna configuración previa.
- `ls` no tiene manejo de cuota: si `localStorage.setItem` lanza (cuota llena, modo privado de Safari con cuota 0), el error se traga en un `try/catch` vacío — el valor simplemente no se guarda, sin aviso.
- `idb.get`/`idb.all`/`idb.keys` devuelven `null` tanto si la clave no existe como si hubo un error — no hay forma de distinguir "no existe" de "falló la lectura" desde el valor de retorno.
