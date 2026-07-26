"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type StartViewTransition = (cb: () => void | Promise<void>) => { finished: Promise<void> };

/**
 * Transiciones entre pantallas con la View Transitions API, con degradación
 * limpia donde no existe (Safari viejo, Firefox): la navegación ocurre igual.
 *
 * Marcá los elementos que deben "volar" entre pantallas con
 * `style={{ viewTransitionName: "hero-" + id }}`.
 */
export function useViewTransition() {
  const [pending, setPending] = useState(false);
  const supported = typeof document !== "undefined" && "startViewTransition" in document;

  const transition = useCallback(
    async (update: () => void | Promise<void>, direction: "push" | "pop" | "none" = "none") => {
      if (!supported) {
        await update();
        return;
      }
      if (direction !== "none") document.documentElement.dataset.transition = direction;
      setPending(true);
      const vt = (document as unknown as { startViewTransition: StartViewTransition }).startViewTransition(update);
      try {
        await vt.finished;
      } finally {
        setPending(false);
        delete document.documentElement.dataset.transition;
      }
    },
    [supported],
  );

  return { transition, pending, supported };
}

/**
 * Pila de pantallas en memoria (para prototipos y flujos modales sin router):
 * push/pop con transición y soporte del botón atrás.
 */
export function useScreenStack<T extends string>(initial: T) {
  const [stack, setStack] = useState<T[]>([initial]);
  const { transition } = useViewTransition();
  const stackRef = useRef(stack);
  stackRef.current = stack;

  const push = useCallback(
    (screen: T) => {
      transition(() => setStack((s) => [...s, screen]), "push");
      window.history.pushState({ __screen: screen }, "");
    },
    [transition],
  );

  const pop = useCallback(() => {
    if (stackRef.current.length <= 1) return;
    transition(() => setStack((s) => s.slice(0, -1)), "pop");
  }, [transition]);

  useEffect(() => {
    const onPop = () => {
      if (stackRef.current.length > 1) transition(() => setStack((s) => s.slice(0, -1)), "pop");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [transition]);

  return { current: stack[stack.length - 1], stack, push, pop, depth: stack.length };
}
