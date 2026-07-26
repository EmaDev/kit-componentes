"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { idb, idbAvailable, ls } from "./idb";

interface PersistentOptions {
  /** dónde guardar. Default: "idb" (cae solo a local si no está disponible) */
  driver?: "idb" | "local";
  /** sincronizar entre pestañas (sólo driver "local"). Default: true */
  syncTabs?: boolean;
}

type Setter<T> = T | ((prev: T) => T);

/**
 * useState que sobrevive recargas y cierres de la app.
 * SSR-safe: devuelve `initial` en el server y en el primer render, y
 * expone `hydrated` para no pisar el valor guardado con el default.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
  { driver = "idb", syncTabs = true }: PersistentOptions = {},
): [T, (v: Setter<T>) => void, { hydrated: boolean; reset: () => void }] {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const useIdb = driver === "idb" && idbAvailable();
  const initialRef = useRef(initial);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const stored = useIdb ? await idb.get<T>("kv", key) : ls.get<T>(key);
      if (!alive) return;
      if (stored !== null && stored !== undefined) setValue(stored);
      setHydrated(true);
    };
    load();
    return () => {
      alive = false;
    };
  }, [key, useIdb]);

  useEffect(() => {
    if (useIdb || !syncTabs) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== key) return;
      try {
        setValue(e.newValue ? (JSON.parse(e.newValue) as T) : initialRef.current);
      } catch {
        /* valor corrupto */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key, syncTabs, useIdb]);

  const update = useCallback(
    (next: Setter<T>) => {
      setValue((prev) => {
        const v = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        if (useIdb) idb.set("kv", key, v);
        else ls.set(key, v);
        return v;
      });
    },
    [key, useIdb],
  );

  const reset = useCallback(() => {
    if (useIdb) idb.del("kv", key);
    else ls.del(key);
    setValue(initialRef.current);
  }, [key, useIdb]);

  return [value, update, { hydrated, reset }];
}
