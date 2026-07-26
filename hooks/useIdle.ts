"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseIdleOptions {
  /** ms de inactividad antes de marcar idle. Default: 5 min */
  timeout?: number;
  /** aviso previo en ms (para el modal "¿seguís ahí?"). Default: 30 s */
  warnBefore?: number;
  onIdle?: () => void;
  onWarn?: () => void;
  /** contar como actividad el volver a la app. Default: true */
  activityOnFocus?: boolean;
}

const EVENTS = ["pointerdown", "keydown", "wheel", "touchstart", "scroll"];

/**
 * Inactividad del usuario: cerrar sesión, bloquear con PIN o pausar polling.
 * Devuelve el aviso previo para poder preguntar antes de cerrar la sesión.
 */
export function useIdle({ timeout = 5 * 60_000, warnBefore = 30_000, onIdle, onWarn, activityOnFocus = true }: UseIdleOptions = {}) {
  const [idle, setIdle] = useState(false);
  const [warning, setWarning] = useState(false);
  const [remaining, setRemaining] = useState(timeout);
  const lastActivity = useRef(Date.now());
  const cbs = useRef({ onIdle, onWarn });
  cbs.current = { onIdle, onWarn };

  const reset = useCallback(() => {
    lastActivity.current = Date.now();
    setIdle(false);
    setWarning(false);
    setRemaining(timeout);
  }, [timeout]);

  useEffect(() => {
    const onActivity = () => {
      if (!idle) lastActivity.current = Date.now();
    };
    EVENTS.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    if (activityOnFocus) window.addEventListener("focus", onActivity);

    const tick = setInterval(() => {
      const elapsed = Date.now() - lastActivity.current;
      const left = Math.max(0, timeout - elapsed);
      setRemaining(left);

      if (elapsed >= timeout) {
        setIdle((was) => {
          if (!was) cbs.current.onIdle?.();
          return true;
        });
      } else if (elapsed >= timeout - warnBefore) {
        setWarning((was) => {
          if (!was) cbs.current.onWarn?.();
          return true;
        });
      } else {
        setWarning(false);
      }
    }, 1000);

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, onActivity));
      window.removeEventListener("focus", onActivity);
      clearInterval(tick);
    };
  }, [activityOnFocus, idle, timeout, warnBefore]);

  return { idle, warning, remaining, secondsLeft: Math.ceil(remaining / 1000), reset };
}
