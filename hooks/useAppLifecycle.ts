"use client";

import { useEffect, useRef, useState } from "react";

interface LifecycleHandlers {
  /** la app volvió a primer plano (cambio de pestaña, desbloqueo, multitarea) */
  onResume?: (msHidden: number) => void;
  /** la app pasó a segundo plano */
  onHide?: () => void;
  /** último momento útil para persistir estado (pagehide / freeze) */
  onPersist?: () => void;
  /** si estuvo oculta más de esto, `staleFor` avisa que conviene refrescar */
  staleAfter?: number;
}

/**
 * Ciclo de vida de la app: foreground/background, tiempo fuera y el último
 * gancho fiable para guardar antes de que el sistema congele la pestaña
 * (en móvil `beforeunload` no se dispara: hay que usar `pagehide`).
 */
export function useAppLifecycle({
  onResume,
  onHide,
  onPersist,
  staleAfter = 60_000,
}: LifecycleHandlers = {}) {
  const [visible, setVisible] = useState(true);
  const [lastResume, setLastResume] = useState(() => Date.now());
  const [staleFor, setStaleFor] = useState(0);
  const hiddenAt = useRef<number | null>(null);
  const handlers = useRef({ onResume, onHide, onPersist });
  handlers.current = { onResume, onHide, onPersist };

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        hiddenAt.current = Date.now();
        setVisible(false);
        handlers.current.onHide?.();
      } else {
        const away = hiddenAt.current ? Date.now() - hiddenAt.current : 0;
        hiddenAt.current = null;
        setVisible(true);
        setStaleFor(away);
        setLastResume(Date.now());
        handlers.current.onResume?.(away);
      }
    };
    const onPageHide = () => handlers.current.onPersist?.();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("freeze", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("freeze", onPageHide);
    };
  }, []);

  return {
    visible,
    /** ms que estuvo en segundo plano la última vez */
    staleFor,
    /** estuvo fuera lo suficiente como para refrescar datos */
    isStale: staleFor > staleAfter,
    lastResume,
  };
}
