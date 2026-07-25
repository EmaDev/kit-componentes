"use client";

import { useEffect } from "react";
import { useCartStore } from "./cart";

/** Dispara la rehidratación desde localStorage una vez montado en el cliente. */
export function CartHydrator() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  return null;
}
