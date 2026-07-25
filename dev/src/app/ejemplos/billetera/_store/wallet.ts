"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TransactionType = "send" | "receive" | "topup";

export interface Transaction {
  id: string;
  type: TransactionType;
  name: string;
  amount: number;
  date: string;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  /** no se persiste: cada carga de página vuelve a pedir el PIN */
  unlocked: boolean;
  unlock: () => void;
  lock: () => void;
  send: (name: string, amount: number) => void;
  topUp: (amount: number) => void;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function txId() {
  return Math.random().toString(36).slice(2, 9);
}

const SEED_TRANSACTIONS: Transaction[] = [
  { id: "seed-1", type: "receive", name: "Sofía Ibarra", amount: 8500, date: daysAgo(1) },
  { id: "seed-2", type: "send", name: "Bruno Aguirre", amount: 3200, date: daysAgo(2) },
  { id: "seed-3", type: "topup", name: "Carga de saldo", amount: 15000, date: daysAgo(3) },
  { id: "seed-4", type: "send", name: "Supermercado Día", amount: 6420.5, date: daysAgo(4) },
  { id: "seed-5", type: "receive", name: "Diego Ferreyra", amount: 2000, date: daysAgo(6) },
  { id: "seed-6", type: "send", name: "Camila Ríos", amount: 1500, date: daysAgo(8) },
];

/**
 * `skipHydration` + `partialize` evitan dos problemas a la vez: el mismatch
 * de SSR (balance/transacciones se leen recién en el cliente, vía
 * WalletHydrator) y que el PIN quede "recordado" entre recargas —
 * `unlocked` nunca se persiste, así que siempre arranca bloqueada.
 */
export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      balance: 125430.5,
      transactions: SEED_TRANSACTIONS,
      unlocked: false,
      unlock: () => set({ unlocked: true }),
      lock: () => set({ unlocked: false }),
      send: (name, amount) =>
        set((state) => ({
          balance: state.balance - amount,
          transactions: [
            { id: txId(), type: "send", name, amount, date: new Date().toISOString() },
            ...state.transactions,
          ],
        })),
      topUp: (amount) =>
        set((state) => ({
          balance: state.balance + amount,
          transactions: [
            { id: txId(), type: "topup", name: "Carga de saldo", amount, date: new Date().toISOString() },
            ...state.transactions,
          ],
        })),
    }),
    {
      name: "ejemplos-billetera",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ balance: state.balance, transactions: state.transactions }),
    }
  )
);
