"use client";

import { useRef } from "react";

export type SwipeDirection = "left" | "right" | "up" | "down";

interface SwipeOptions {
  /** px mínimos para contar como swipe. Default: 50 */
  threshold?: number;
  /** px/ms mínimos: un flick corto también cuenta. Default: 0.3 */
  velocity?: number;
  onSwipe?: (dir: SwipeDirection, distance: number) => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

/**
 * Gestos de swipe sobre cualquier elemento: devuelve props listos para pegar.
 * Distingue eje dominante, así no se pelea con el scroll vertical.
 */
export function useSwipe({ threshold = 50, velocity = 0.3, onSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }: SwipeOptions = {}) {
  const start = useRef<{ x: number; y: number; t: number } | null>(null);

  return {
    onPointerDown: (e: React.PointerEvent) => {
      start.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (!start.current) return;
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      const dt = Math.max(1, Date.now() - start.current.t);
      start.current = null;

      const horizontal = Math.abs(dx) > Math.abs(dy);
      const distance = horizontal ? dx : dy;
      const speed = Math.abs(distance) / dt;
      if (Math.abs(distance) < threshold && speed < velocity) return;

      const dir: SwipeDirection = horizontal ? (dx < 0 ? "left" : "right") : dy < 0 ? "up" : "down";
      onSwipe?.(dir, Math.abs(distance));
      ({ left: onSwipeLeft, right: onSwipeRight, up: onSwipeUp, down: onSwipeDown })[dir]?.();
    },
    onPointerCancel: () => {
      start.current = null;
    },
  };
}
