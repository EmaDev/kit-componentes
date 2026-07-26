"use client";

/**
 * Wrapper mínimo de IndexedDB (sin dependencias) usado por
 * usePersistentState, useOfflineQueue y useCachedFetch.
 * Una sola base con un store key/value por nombre.
 */

const DB_NAME = "scaffold-store";
const DB_VERSION = 1;
export const STORES = ["kv", "queue", "cache"] as const;
export type StoreName = (typeof STORES)[number];

let dbPromise: Promise<IDBDatabase | null> | null = null;

export function idbAvailable(): boolean {
  return typeof indexedDB !== "undefined";
}

function open(): Promise<IDBDatabase | null> {
  if (!idbAvailable()) return Promise.resolve(null);
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        STORES.forEach((s) => {
          if (!db.objectStoreNames.contains(s)) db.createObjectStore(s);
        });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

function tx<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  run: (s: IDBObjectStore) => IDBRequest,
): Promise<T | null> {
  return open().then(
    (db) =>
      new Promise<T | null>((resolve) => {
        if (!db) return resolve(null);
        try {
          const t = db.transaction(store, mode);
          const req = run(t.objectStore(store));
          req.onsuccess = () => resolve(req.result as T);
          req.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      }),
  );
}

export const idb = {
  get: <T>(store: StoreName, key: string) => tx<T>(store, "readonly", (s) => s.get(key)),
  set: (store: StoreName, key: string, value: unknown) =>
    tx(store, "readwrite", (s) => s.put(value, key)),
  del: (store: StoreName, key: string) => tx(store, "readwrite", (s) => s.delete(key)),
  keys: (store: StoreName) => tx<IDBValidKey[]>(store, "readonly", (s) => s.getAllKeys()),
  all: <T>(store: StoreName) => tx<T[]>(store, "readonly", (s) => s.getAll()),
  clear: (store: StoreName) => tx(store, "readwrite", (s) => s.clear()),
};

/** Fallback a localStorage cuando IndexedDB no está (Safari privado, SSR…) */
export const ls = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* cuota llena o modo privado */
    }
  },
  del(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  },
};
