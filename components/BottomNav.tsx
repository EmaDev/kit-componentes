"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export interface BottomNavItem {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
}

interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

export function BottomNav({ items, className = "" }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className={[
        "md:hidden fixed bottom-0 left-0 right-0 z-40",
        "bg-surface/85 backdrop-blur-xl",
        "border-t border-border",
        "pb-[env(safe-area-inset-bottom)]",
        className,
      ].join(" ")}
    >
      <ul
        className="grid h-16 px-2"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                className="relative h-full flex flex-col items-center justify-center gap-1 px-1"
              >
                {active && (
                  <motion.span
                    layoutId="bottomnav-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-full bg-primary"
                  />
                )}

                <motion.span
                  animate={{
                    scale: active ? 1.1 : 1,
                    y: active ? -2 : 0,
                    color: active
                      ? "var(--color-primary)"
                      : "var(--color-muted)",
                  }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  className="relative w-6 h-6 inline-flex items-center justify-center"
                >
                  {item.icon}
                  {item.badge != null && item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-danger text-white text-[9px] font-bold inline-flex items-center justify-center">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </motion.span>

                <motion.span
                  animate={{
                    color: active
                      ? "var(--color-primary)"
                      : "var(--color-muted)",
                    fontWeight: active ? 600 : 500,
                  }}
                  className="text-[10px] leading-none"
                >
                  {item.label}
                </motion.span>
              </Link>
            </li>
          );
        })}
      </ul>
    </motion.nav>
  );
}
