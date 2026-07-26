"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface VirtualListOptions {
  /** cantidad total de filas */
  count: number;
  /** alto de cada fila en px, o una función por índice */
  itemHeight: number | ((index: number) => number);
  /** filas extra arriba y abajo del viewport. Default: 6 */
  overscan?: number;
}

/**
 * Virtualización de listas largas: renderiza sólo lo visible.
 * A partir de ~500 filas es la diferencia entre scroll fluido y una app trabada.
 *
 * ```tsx
 * const { scrollRef, virtualItems, totalHeight } = useVirtualList({ count: rows.length, itemHeight: 72 });
 * <div ref={scrollRef} className="overflow-y-auto h-full">
 *   <div style={{ height: totalHeight, position: "relative" }}>
 *     {virtualItems.map(v => (
 *       <div key={v.index} style={{ position: "absolute", top: v.start, height: v.size, left: 0, right: 0 }}>
 *         <Row row={rows[v.index]}/>
 *       </div>
 *     ))}
 *   </div>
 * </div>
 * ```
 */
export function useVirtualList({ count, itemHeight, overscan = 6 }: VirtualListOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewport, setViewport] = useState(0);

  const sizeAt = useCallback(
    (i: number) => (typeof itemHeight === "function" ? itemHeight(i) : itemHeight),
    [itemHeight],
  );

  // offsets acumulados (barato para alturas fijas, correcto para variables)
  const offsets = useRef<number[]>([]);
  offsets.current = (() => {
    const arr = new Array<number>(count + 1);
    arr[0] = 0;
    for (let i = 0; i < count; i++) arr[i + 1] = arr[i] + sizeAt(i);
    return arr;
  })();

  const totalHeight = offsets.current[count] ?? 0;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrollTop(el.scrollTop);
    const ro = new ResizeObserver(() => setViewport(el.clientHeight));
    setViewport(el.clientHeight);
    el.addEventListener("scroll", onScroll, { passive: true });
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  const find = (y: number) => {
    const arr = offsets.current;
    let lo = 0;
    let hi = count;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid + 1] <= y) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  };

  const first = Math.max(0, find(scrollTop) - overscan);
  const last = Math.min(count - 1, find(scrollTop + viewport) + overscan);

  const virtualItems = [];
  for (let i = first; i <= last && count > 0; i++) {
    virtualItems.push({ index: i, start: offsets.current[i], size: sizeAt(i) });
  }

  const scrollToIndex = useCallback(
    (index: number, align: "start" | "center" = "start") => {
      const el = scrollRef.current;
      if (!el) return;
      const start = offsets.current[Math.max(0, Math.min(count - 1, index))] ?? 0;
      el.scrollTop = align === "center" ? start - el.clientHeight / 2 + sizeAt(index) / 2 : start;
    },
    [count, sizeAt],
  );

  return { scrollRef, virtualItems, totalHeight, scrollToIndex, range: { first, last } };
}
