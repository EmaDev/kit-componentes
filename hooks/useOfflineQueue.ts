"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { idb } from "./idb";

export type QueueItemStatus = "pending" | "sending" | "failed";

export interface QueuedItem<T = unknown> {
  id: string;
  /** tipo de acción, lo usás para decidir cómo enviarla */
  kind: string;
  payload: T;
  createdAt: number;
  attempts: number;
  status: QueueItemStatus;
  /** último error legible */
  error?: string;
}

interface UseOfflineQueueOptions<T> {
  /** clave del store — permite varias colas independientes */
  name?: string;
  /** cómo se envía cada item. Devolvé (o lanzá) para marcar éxito/fracaso */
  send: (item: QueuedItem<T>) => Promise<void>;
  /** intentos antes de marcar como fallido definitivo. Default: 5 */
  maxAttempts?: number;
  /** backoff en ms: intento → espera. Default: 1s, 2s, 4s… tope 30s */
  backoff?: (attempt: number) => number;
  /** procesar automáticamente al recuperar conexión. Default: true */
  autoFlush?: boolean;
  /** registrar Background Sync en el service worker. Default: true */
  backgroundSync?: boolean;
}

const defaultBackoff = (n: number) => Math.min(30000, 1000 * 2 ** n);
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Cola de mutaciones offline: encolá la acción, se persiste en IndexedDB y
 * se reintenta con backoff cuando vuelve la conexión. Si el navegador soporta
 * Background Sync, además pide al service worker que despierte la cola.
 */
export function useOfflineQueue<T = unknown>({
  name = "default",
  send,
  maxAttempts = 5,
  backoff = defaultBackoff,
  autoFlush = true,
  backgroundSync = true,
}: UseOfflineQueueOptions<T>) {
  const [items, setItems] = useState<QueuedItem<T>[]>([]);
  const [flushing, setFlushing] = useState(false);
  const [ready, setReady] = useState(false);
  const key = `queue:${name}`;
  const sendRef = useRef(send);
  sendRef.current = send;
  const flushingRef = useRef(false);

  const persist = useCallback(
    (next: QueuedItem<T>[]) => {
      setItems(next);
      idb.set("queue", key, next);
    },
    [key],
  );

  useEffect(() => {
    let alive = true;
    idb.get<QueuedItem<T>[]>("queue", key).then((stored) => {
      if (!alive) return;
      // lo que quedó "sending" en un cierre abrupto vuelve a pending
      setItems((stored ?? []).map((i) => (i.status === "sending" ? { ...i, status: "pending" } : i)));
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [key]);

  const flush = useCallback(async () => {
    if (flushingRef.current) return;
    flushingRef.current = true;
    setFlushing(true);

    let queue = await idb.get<QueuedItem<T>[]>("queue", key);
    queue = (queue ?? []).slice();

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status === "failed" && item.attempts >= maxAttempts) continue;
      if (typeof navigator !== "undefined" && !navigator.onLine) break;

      queue[i] = { ...item, status: "sending" };
      setItems(queue.slice());
      try {
        await sendRef.current(queue[i]);
        queue.splice(i, 1);
        i--;
      } catch (e) {
        const attempts = item.attempts + 1;
        queue[i] = {
          ...item,
          attempts,
          status: attempts >= maxAttempts ? "failed" : "pending",
          error: e instanceof Error ? e.message : String(e),
        };
        setItems(queue.slice());
        await idb.set("queue", key, queue);
        if (attempts < maxAttempts) {
          await new Promise((r) => setTimeout(r, backoff(attempts)));
          i--; // reintentar el mismo
        }
      }
      await idb.set("queue", key, queue);
    }

    setItems(queue);
    await idb.set("queue", key, queue);
    flushingRef.current = false;
    setFlushing(false);
  }, [backoff, key, maxAttempts]);

  const enqueue = useCallback(
    async (kind: string, payload: T) => {
      const item: QueuedItem<T> = {
        id: uid(),
        kind,
        payload,
        createdAt: Date.now(),
        attempts: 0,
        status: "pending",
      };
      const current = (await idb.get<QueuedItem<T>[]>("queue", key)) ?? [];
      const next = [...current, item];
      persist(next);

      if (backgroundSync && typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        try {
          const reg = (await navigator.serviceWorker.ready) as ServiceWorkerRegistration & {
            sync?: { register: (tag: string) => Promise<void> };
          };
          await reg.sync?.register(`sync:${name}`);
        } catch {
          /* sin Background Sync: nos apoyamos en el evento online */
        }
      }
      if (typeof navigator === "undefined" || navigator.onLine) flush();
      return item.id;
    },
    [backgroundSync, flush, key, name, persist],
  );

  const remove = useCallback(
    async (id: string) => {
      const current = (await idb.get<QueuedItem<T>[]>("queue", key)) ?? [];
      persist(current.filter((i) => i.id !== id));
    },
    [key, persist],
  );

  const retry = useCallback(
    async (id?: string) => {
      const current = (await idb.get<QueuedItem<T>[]>("queue", key)) ?? [];
      persist(
        current.map((i) =>
          !id || i.id === id ? { ...i, status: "pending" as const, attempts: 0, error: undefined } : i,
        ),
      );
      flush();
    },
    [flush, key, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  useEffect(() => {
    if (!autoFlush || !ready) return;
    const onOnline = () => flush();
    window.addEventListener("online", onOnline);
    if (navigator.onLine && items.length) flush();
    return () => window.removeEventListener("online", onOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFlush, ready]);

  const pending = items.filter((i) => i.status !== "failed").length;
  const failed = items.filter((i) => i.status === "failed").length;

  return { items, pending, failed, flushing, ready, enqueue, flush, retry, remove, clear };
}
