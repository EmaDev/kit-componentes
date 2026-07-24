"use client";

import { motion } from "framer-motion";
import { Fragment, type ReactNode } from "react";

export interface Crumb {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface BreadcrumbsProps {
  items: Crumb[];
  /** máximo de items visibles; el resto colapsa en "…". Default: 4 */
  maxItems?: number;
  separator?: ReactNode;
  onNavigate?: (item: Crumb, index: number) => void;
  /** el último item no es clickeable. Default: true */
  lastIsCurrent?: boolean;
  className?: string;
}

/**
 * Ruta de navegación con colapso automático cuando hay demasiados niveles:
 * siempre deja visible el primero y los dos últimos.
 */
export function Breadcrumbs({
  items, maxItems = 4, separator, onNavigate, lastIsCurrent = true, className = "",
}: BreadcrumbsProps) {
  const collapsed = items.length > maxItems;
  const shown: (Crumb | "ellipsis")[] = collapsed
    ? [items[0], "ellipsis", ...items.slice(-2)]
    : items;

  const sep = separator ?? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );

  return (
    <nav aria-label="Ruta de navegación" className={`flex items-center gap-1 min-w-0 ${className}`}>
      <ol className="flex items-center gap-1 min-w-0">
        {shown.map((item, i) => {
          const isLast = i === shown.length - 1;
          if (item === "ellipsis") {
            return (
              <Fragment key="ellipsis">
                <li className="flex items-center">
                  <span
                    title={items.slice(1, -2).map((c) => c.label).join(" / ")}
                    className="px-1.5 h-7 inline-flex items-center rounded-md text-muted hover:text-foreground hover:bg-surface-alt transition-colors cursor-default text-sm font-semibold"
                  >
                    …
                  </span>
                </li>
                <li aria-hidden className="text-muted/50 shrink-0">{sep}</li>
              </Fragment>
            );
          }
          const current = isLast && lastIsCurrent;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li className="min-w-0">
                {current ? (
                  <span aria-current="page" className="inline-flex items-center gap-1.5 px-1.5 h-7 text-sm font-semibold text-foreground truncate">
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </span>
                ) : (
                  <motion.a
                    whileTap={{ scale: 0.96 }}
                    href={item.href ?? "#"}
                    onClick={(e) => { if (onNavigate) { e.preventDefault(); onNavigate(item, i); } }}
                    className="inline-flex items-center gap-1.5 px-1.5 h-7 rounded-md text-sm text-muted hover:text-foreground hover:bg-surface-alt transition-colors truncate"
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </motion.a>
                )}
              </li>
              {!isLast && <li aria-hidden className="text-muted/50 shrink-0">{sep}</li>}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
