"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartLine {
  productId: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  add: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

/**
 * `skipHydration` evita el mismatch de SSR: el server siempre renderiza el
 * carrito vacío, y recién en el cliente `CartHydrator` dispara la lectura
 * real de localStorage después del primer render.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (productId, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === productId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === productId ? { ...l, qty: l.qty + qty } : l
              ),
            };
          }
          return { lines: [...state.lines, { productId, qty }] };
        }),
      setQty: (productId, qty) =>
        set((state) => ({
          lines:
            qty <= 0
              ? state.lines.filter((l) => l.productId !== productId)
              : state.lines.map((l) => (l.productId === productId ? { ...l, qty } : l)),
        })),
      remove: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "ejemplos-ecommerce-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

export function useCartQty(productId: string) {
  return useCartStore((s) => s.lines.find((l) => l.productId === productId)?.qty ?? 0);
}

export function useCartCount() {
  return useCartStore((s) => s.lines.reduce((acc, l) => acc + l.qty, 0));
}
