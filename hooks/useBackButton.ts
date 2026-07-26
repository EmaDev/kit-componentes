"use client";

import { useEffect, useRef } from "react";

interface UseBackButtonOptions {
  /** mientras sea true, el botón atrás ejecuta onBack en vez de navegar */
  active: boolean;
  /** qué hacer con el gesto/botón atrás (cerrar el sheet, el modal, la galería…) */
  onBack: () => void;
  /** identificador del estado en el historial */
  id?: string;
}

/**
 * Captura el botón físico "atrás" de Android (y el gesto de swipe) empujando
 * una entrada sintética al historial mientras la capa esté abierta.
 * Sin esto, cerrar un modal con el botón atrás saca al usuario de la PWA.
 */
export function useBackButton({ active, onBack, id = "overlay" }: UseBackButtonOptions) {
  const pushed = useRef(false);
  const cb = useRef(onBack);
  cb.current = onBack;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onPop = (e: PopStateEvent) => {
      const state = e.state as { __overlay?: string } | null;
      if (pushed.current && state?.__overlay !== id) {
        pushed.current = false;
        cb.current();
      }
    };

    if (active && !pushed.current) {
      window.history.pushState({ __overlay: id }, "");
      pushed.current = true;
      window.addEventListener("popstate", onPop);
    }

    return () => {
      window.removeEventListener("popstate", onPop);
      // se cerró por UI (no por atrás): limpiamos la entrada que agregamos
      if (pushed.current && !active) {
        pushed.current = false;
        window.history.back();
      }
    };
  }, [active, id]);
}
