"use client";

import { useEffect } from "react";
import { useWalletStore } from "./wallet";

/** Dispara la rehidratación de saldo/movimientos desde localStorage tras montar. */
export function WalletHydrator() {
  useEffect(() => {
    useWalletStore.persist.rehydrate();
  }, []);
  return null;
}
