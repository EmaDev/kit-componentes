"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export interface NavLink {
  label: string;
  href: string;
  icon?: ReactNode;
}

interface NavbarProps {
  brand?: ReactNode;
  links?: NavLink[];
  actions?: ReactNode;
  sticky?: boolean;
  className?: string;
}

export function Navbar({
  brand,
  links = [],
  actions,
  sticky = true,
  className = "",
}: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className={[
        sticky ? "sticky top-0 z-40" : "",
        "w-full transition-all duration-300",
        scrolled
          ? "bg-surface/80 backdrop-blur-xl border-b border-border shadow-sm shadow-black/5"
          : "bg-surface/0 border-b border-transparent",
        className,
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">{brand}</div>

        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href} className="relative">
                <Link
                  href={l.href}
                  className={[
                    "relative inline-flex items-center gap-2 px-3.5 py-2 text-sm rounded-lg",
                    "transition-colors duration-200",
                    active
                      ? "text-foreground"
                      : "text-muted hover:text-foreground",
                  ].join(" ")}
                >
                  {l.icon}
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-surface-alt"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">{actions}</div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-10 h-10 inline-flex items-center justify-center rounded-lg text-foreground hover:bg-surface-alt"
            aria-label="Menu"
          >
            <div className="relative w-5 h-5">
              <motion.span
                animate={{
                  rotate: mobileOpen ? 45 : 0,
                  y: mobileOpen ? 0 : -5,
                }}
                className="absolute left-0 right-0 top-1/2 h-[2px] bg-current rounded-full"
              />
              <motion.span
                animate={{ opacity: mobileOpen ? 0 : 1 }}
                className="absolute left-0 right-0 top-1/2 h-[2px] bg-current rounded-full"
              />
              <motion.span
                animate={{
                  rotate: mobileOpen ? -45 : 0,
                  y: mobileOpen ? 0 : 5,
                }}
                className="absolute left-0 right-0 top-1/2 h-[2px] bg-current rounded-full"
              />
            </div>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-border bg-surface"
          >
            <ul className="px-4 py-3 flex flex-col gap-0.5">
              {links.map((l, i) => {
                const active = pathname === l.href;
                return (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={l.href}
                      className={[
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
                        active
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-surface-alt",
                      ].join(" ")}
                    >
                      {l.icon}
                      {l.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            {actions && (
              <div className="px-4 pb-4 pt-2 flex flex-wrap gap-2 border-t border-border">
                {actions}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
