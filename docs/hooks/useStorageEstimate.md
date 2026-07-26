# useStorageEstimate

> Cuánto espacio ocupa la app instalada (Cache Storage + IndexedDB + localStorage), si el almacenamiento está marcado como persistente, y utilidades para pedir persistencia y limpiar las Cache Storage.

**Import**
```ts
import { useStorageEstimate, formatBytes } from "lib-kit-components";
```

## Cuándo usarlo

Para una pantalla de "Almacenamiento" o "Datos y caché" en los ajustes de la app (al estilo de las apps nativas), donde el usuario pueda ver cuánto ocupa la app y liberar espacio. También sirve para pedir almacenamiento persistente (`requestPersistence`) y así reducir el riesgo de que el navegador borre los datos offline de la app bajo presión de disco.

## Firma

```ts
function useStorageEstimate(): {
  usage: number;
  quota: number;
  ratio: number;
  persisted: boolean;
  supported: boolean;
  refresh: () => Promise<void>;
  requestPersistence: () => Promise<boolean>;
  clearCaches: () => Promise<number>;
}
```

No recibe parámetros.

## Valor de retorno

| Campo | Tipo | Descripción |
|---|---|---|
| `usage` | `number` | Bytes usados por el origen (Cache Storage + IndexedDB + localStorage combinados). |
| `quota` | `number` | Cuota total que el navegador le asigna a este origen. |
| `ratio` | `number` | `usage / quota`, entre 0 y 1. |
| `persisted` | `boolean` | El almacenamiento está marcado como persistente (el SO no lo borra por presión de disco). |
| `supported` | `boolean` | El navegador expone `navigator.storage.estimate`. |
| `refresh` | `() => Promise<void>` | Vuelve a leer usage/quota/persisted. |
| `requestPersistence` | `() => Promise<boolean>` | Pide al navegador no borrar los datos ante presión de disco. Devuelve si se concedió. |
| `clearCaches` | `() => Promise<number>` | Borra **todas** las Cache Storage del origen (no toca IndexedDB ni localStorage). Devuelve cuántas cachés se borraron. |

## Ejemplos

### Panel de ajustes de almacenamiento
```tsx
function StorageSettings() {
  const { usage, quota, ratio, persisted, requestPersistence, clearCaches } = useStorageEstimate();

  return (
    <div>
      <p>{formatBytes(usage)} de {formatBytes(quota)} usados ({Math.round(ratio * 100)}%)</p>
      {!persisted && <button onClick={requestPersistence}>Proteger datos offline</button>}
      <button onClick={async () => {
        const n = await clearCaches();
        toast({ title: `${n} cachés borradas` });
      }}>
        Vaciar caché
      </button>
    </div>
  );
}
```

## Notas y comportamiento

- `usage`/`quota` vienen de `navigator.storage.estimate()`, que en la mayoría de los navegadores da una cifra **aproximada** (no un byte exacto) — no la trates como precisa para decisiones críticas, sólo como referencia para el usuario.
- `clearCaches()` **sólo borra Cache Storage** (lo que usa un service worker con `caches.open`/`caches.put`) — no toca IndexedDB (donde viven `usePersistentState`, `useOfflineQueue`, `useCachedFetch`) ni `localStorage`. Si necesitás borrar todo, combinalo con llamadas explícitas a esos otros drivers.
- `requestPersistence()` no garantiza que el navegador conceda el pedido — la heurística depende del navegador (suele considerar factores como si la PWA está instalada, el engagement del usuario con el sitio, etc.). Siempre chequeá el `persisted` devuelto después de refrescar.
- Sin soporte (`supported: false`, ej. algunos navegadores viejos o contextos restringidos), todos los campos numéricos quedan en `0` y `persisted` en `false` — no hay excepciones lanzadas.
