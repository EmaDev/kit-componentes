"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { idb } from "./idb";

interface CacheEntry<T> {
  data: T;
  at: number;
}

interface UseCachedFetchOptions<T> {
  /** clave de caché. Default: la url */
  key?: string;
  /** ms tras los cuales el dato se considera viejo. Default: 5 min */
  maxAge?: number;
  /** no pedir todavía (p. ej. falta el id) */
  enabled?: boolean;
  /** cómo obtener el dato. Default: fetch(url).then(r => r.json()) */
  fetcher?: (url: string) => Promise<T>;
  /** revalidar al volver a la app / recuperar conexión. Default: true */
  revalidateOnFocus?: boolean;
}

/**
 * Stale-while-revalidate con persistencia en IndexedDB: pinta al toque lo
 * último que se vio (aunque estés offline) y revalida en segundo plano.
 */
export function useCachedFetch<T>(url: string, opts: UseCachedFetchOptions<T> = {}) {
  const {
    key = url,
    maxAge = 5 * 60 * 1000,
    enabled = true,
    fetcher,
    revalidateOnFocus = true,
  } = opts;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const load = useCallback(
    async (force = false) => {
      if (!enabled) return;
      const cached = await idb.get<CacheEntry<T>>("cache", key);
      if (cached) {
        setData(cached.data);
        setUpdatedAt(cached.at);
        setFromCache(true);
      }
      const fresh = cached && Date.now() - cached.at < maxAge;
      if (fresh && !force) return;
      if (typeof navigator !== "undefined" && !navigator.onLine) return;

      setLoading(true);
      try {
        const result = fetcherRef.current
          ? await fetcherRef.current(url)
          : ((await fetch(url).then((r) => {
              if (!r.ok) throw new Error(`HTTP ${r.status}`);
              return r.json();
            })) as T);
        const at = Date.now();
        await idb.set("cache", key, { data: result, at } satisfies CacheEntry<T>);
        setData(result);
        setUpdatedAt(at);
        setFromCache(false);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setLoading(false);
      }
    },
    [enabled, key, maxAge, url],
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!revalidateOnFocus) return;
    const onWake = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onWake);
    window.addEventListener("online", onWake);
    return () => {
      document.removeEventListener("visibilitychange", onWake);
      window.removeEventListener("online", onWake);
    };
  }, [load, revalidateOnFocus]);

  const isStale = updatedAt !== null && Date.now() - updatedAt > maxAge;

  return {
    data,
    error,
    loading,
    /** el dato salió de la caché y no del servidor */
    fromCache,
    /** ya venció el maxAge */
    isStale,
    updatedAt,
    refetch: () => load(true),
    /** borra la entrada de caché */
    invalidate: () => idb.del("cache", key),
  };
}
