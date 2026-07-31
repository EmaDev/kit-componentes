"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { Column } from "./DataTable";

interface AnimatedTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** clickear el header ordena; las filas se reacomodan animadas (FLIP) */
  sortable?: boolean;
  /** al cambiar el valor de una celda entre renders, la resalta un instante */
  highlightChanges?: boolean;
  density?: "compact" | "normal";
  onRowClick?: (row: T) => void;
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const ALIGN = { left: "text-left", center: "text-center", right: "text-right" };
const ROW_H = { compact: "h-9", normal: "h-11" };

/**
 * Tabla liviana con dos animaciones listas para usar: reordenamiento suave
 * al ordenar por columna, y resalte breve en celdas que cambiaron de valor
 * (ideal para tableros con datos que se actualizan en vivo).
 */
export function AnimatedTable<T>({
  columns, rows, rowKey, sortable = true, highlightChanges = false,
  density = "normal", onRowClick, className = "",
}: AnimatedTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const canSort = (c: Column<T>) => sortable && c.sortable !== false;

  const onSort = (c: Column<T>) => {
    if (!canSort(c)) return;
    setSort((s) =>
      s?.key !== c.key ? { key: c.key, dir: "asc" } : s.dir === "asc" ? { key: c.key, dir: "desc" } : null
    );
  };

  const sorted = (() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    return [...rows].sort((a, b) => {
      const av: unknown = col.sortValue ? col.sortValue(a) : a[col.key];
      const bv: unknown = col.sortValue ? col.sortValue(b) : b[col.key];
      if (typeof av === "number" && typeof bv === "number") return sort.dir === "asc" ? av - bv : bv - av;
      const as = String(av ?? ""), bs = String(bv ?? "");
      return sort.dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
  })();

  return (
    <div className={cn("rounded-2xl border border-border bg-surface overflow-hidden", className)}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-surface-alt/60 border-b border-border">
            {columns.map((c) => {
              const active = sort?.key === c.key;
              const sortableCol = canSort(c);
              return (
                <th
                  key={c.key}
                  onClick={() => onSort(c)}
                  style={{ width: c.width }}
                  className={cn(
                    "px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap select-none",
                    ALIGN[c.align ?? "left"],
                    sortableCol ? "cursor-pointer hover:text-foreground" : "",
                    active ? "text-foreground" : "text-muted"
                  )}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {c.header}
                    {sortableCol && (
                      <motion.span
                        animate={{ opacity: active ? 1 : 0.25, rotate: active && sort!.dir === "desc" ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex shrink-0"
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 4 18 9" /><polyline points="6 15 12 20 18 15" />
                        </svg>
                      </motion.span>
                    )}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, i) => {
            const k = rowKey(row);
            return (
              <motion.tr
                key={k}
                layout
                transition={{ type: "spring", stiffness: 500, damping: 42 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onRowClick?.(row)}
                className={cn(ROW_H[density], "border-b border-border last:border-0 transition-colors bg-surface", onRowClick ? "cursor-pointer hover:bg-surface-alt/50" : "")}
              >
                {columns.map((c) => {
                  const value = c.render ? undefined : String(row[c.key] ?? "");
                  return (
                    <td key={c.key} className={cn("px-3.5 text-foreground", ALIGN[c.align ?? "left"])}>
                      {highlightChanges && !c.render ? (
                        <motion.span
                          key={value}
                          initial={{ backgroundColor: "color-mix(in oklab, var(--color-primary) 28%, transparent)" }}
                          animate={{ backgroundColor: "transparent" }}
                          transition={{ duration: 1.1, ease: "easeOut" }}
                          className="inline-block rounded px-1 -mx-1"
                        >
                          {value}
                        </motion.span>
                      ) : (
                        c.render ? c.render(row, i) : value
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
