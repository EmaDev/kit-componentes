"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

export interface SidebarLink {
  label: string;
  href: string;
  icon: ReactNode;
  badge?: string | number;
}

export interface SidebarSection {
  title?: string;
  links: SidebarLink[];
}

interface SidebarProps {
  brand?: ReactNode;
  sections: SidebarSection[];
  footer?: ReactNode;
  defaultCollapsed?: boolean;
  className?: string;
}

export function SideBar({
  brand,
  sections,
  footer,
  defaultCollapsed = false,
  className = "",
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 256 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className={[
        "h-screen sticky top-0 shrink-0",
        "bg-surface border-r border-border",
        "flex flex-col overflow-hidden",
        className,
      ].join(" ")}
    >
      {/* Brand + collapse */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="overflow-hidden whitespace-nowrap"
            >
              {brand}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed((v) => !v)}
          className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-surface-alt shrink-0"
          aria-label={collapsed ? "Expandir" : "Colapsar"}
        >
          <motion.svg
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </motion.svg>
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5">
        {sections.map((section, si) => (
          <div key={si} className={si > 0 ? "mt-5" : ""}>
            <AnimatePresence initial={false}>
              {!collapsed && section.title && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-2 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted overflow-hidden whitespace-nowrap"
                >
                  {section.title}
                </motion.div>
              )}
            </AnimatePresence>

            <ul className="flex flex-col gap-0.5">
              {section.links.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      className={[
                        "group relative flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm",
                        "transition-colors duration-150",
                        active
                          ? "text-primary"
                          : "text-foreground hover:bg-surface-alt",
                      ].join(" ")}
                      title={collapsed ? link.label : undefined}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          transition={{ type: "spring", stiffness: 320, damping: 28 }}
                          className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                        />
                      )}
                      <span className="w-5 h-5 shrink-0 inline-flex items-center justify-center">
                        {link.icon}
                      </span>

                      <AnimatePresence initial={false}>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            className="flex-1 whitespace-nowrap overflow-hidden font-medium"
                          >
                            {link.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {link.badge != null && (
                        <motion.span
                          layout
                          className={[
                            "ml-auto inline-flex items-center justify-center text-[10px] font-bold rounded-full",
                            collapsed
                              ? "absolute -top-1 -right-1 w-4 h-4"
                              : "min-w-[20px] h-5 px-1.5",
                            active
                              ? "bg-primary text-white"
                              : "bg-surface-alt text-foreground",
                          ].join(" ")}
                        >
                          {link.badge}
                        </motion.span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="border-t border-border p-3">{footer}</div>
      )}
    </motion.aside>
  );
}
