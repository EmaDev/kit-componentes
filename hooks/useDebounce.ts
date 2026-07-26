"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Retrasa un valor: buscadores, autoguardado, validaciones. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Versión callback: se ejecuta como mucho una vez cada `delay`. */
export function useDebouncedCallback<A extends unknown[]>(fn: (...args: A) => void, delay = 300) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cb = useRef(fn);
  cb.current = fn;

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return useCallback(
    (...args: A) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => cb.current(...args), delay);
    },
    [delay],
  );
}

/** Limita la frecuencia: scroll, resize, drag. */
export function useThrottledCallback<A extends unknown[]>(fn: (...args: A) => void, ms = 100) {
  const last = useRef(0);
  const cb = useRef(fn);
  cb.current = fn;

  return useCallback(
    (...args: A) => {
      const now = Date.now();
      if (now - last.current < ms) return;
      last.current = now;
      cb.current(...args);
    },
    [ms],
  );
}
