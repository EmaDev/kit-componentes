"use client";

import { useCallback, useRef } from "react";
import { useHaptics } from "./useHaptics";

interface LongPressOptions {
  /** ms para considerar long-press. Default: 450 */
  delay?: number;
  /** cuántos px de movimiento cancelan el gesto. Default: 10 */
  tolerance?: number;
  /** vibrar al disparar. Default: true */
  haptic?: boolean;
  /** click normal si soltó antes del delay */
  onClick?: () => void;
}

/**
 * Long-press listo para usar: devuelve props para pegar en cualquier elemento.
 * Cancela si el dedo se mueve (para no pisar el scroll).
 */
export function useLongPress(onLongPress: () => void, { delay = 450, tolerance = 10, haptic: buzz = true, onClick }: LongPressOptions = {}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const fired = useRef(false);
  const { haptic } = useHaptics();
  const cb = useRef(onLongPress);
  cb.current = onLongPress;

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  return {
    onPointerDown: (e: React.PointerEvent) => {
      fired.current = false;
      start.current = { x: e.clientX, y: e.clientY };
      timer.current = setTimeout(() => {
        fired.current = true;
        if (buzz) haptic("tap");
        cb.current();
      }, delay);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (!start.current || !timer.current) return;
      if (Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > tolerance) clear();
    },
    onPointerUp: () => {
      const wasLong = fired.current;
      clear();
      if (!wasLong) onClick?.();
    },
    onPointerLeave: clear,
    onPointerCancel: clear,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };
}
