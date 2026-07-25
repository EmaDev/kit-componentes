"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Navbar, type NavLink } from "../../../../../components/Navbar";
import { BottomNav, type BottomNavItem } from "../../../../../components/BottomNav";
import { CartHydrator } from "./_store/CartHydrator";
import { useCartCount } from "./_store/cart";
import { CartIcon } from "./_components/icons";

const NAV_LINKS: NavLink[] = [{ label: "Catálogo", href: "/ejemplos/ecommerce" }];

function CartLink({ count }: { count: number }) {
  return (
    <Link
      href="/ejemplos/ecommerce/carrito"
      aria-label="Carrito"
      className="relative w-10 h-10 grid place-items-center rounded-lg text-foreground hover:bg-surface-alt transition-colors"
    >
      <CartIcon />
      {count > 0 && (
        <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[10px] font-bold grid place-items-center">
          {count}
        </span>
      )}
    </Link>
  );
}

export default function EcommerceLayout({ children }: { children: ReactNode }) {
  const count = useCartCount();

  const BOTTOM_ITEMS: BottomNavItem[] = [
    { label: "Catálogo", href: "/ejemplos/ecommerce", icon: <StoreIcon /> },
    { label: "Carrito", href: "/ejemplos/ecommerce/carrito", icon: <CartIcon />, badge: count },
  ];

  return (
    <div className="min-h-screen bg-surface text-foreground">
      <CartHydrator />
      <Navbar
        brand={
          <Link href="/ejemplos/ecommerce" className="font-bold text-foreground">
            Tienda demo
          </Link>
        }
        links={NAV_LINKS}
        actions={
          <div className="flex items-center gap-3">
            <Link href="/ejemplos" className="text-sm text-muted hover:text-foreground transition-colors">
              ← Ejemplos
            </Link>
            <CartLink count={count} />
          </div>
        }
      />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-8">{children}</main>
      <BottomNav items={BOTTOM_ITEMS} />
    </div>
  );
}

function StoreIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1.5-5.5A2 2 0 0 1 6.42 2h11.16a2 2 0 0 1 1.92 1.5L21 9" />
      <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
      <path d="M4 9v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9" />
    </svg>
  );
}
