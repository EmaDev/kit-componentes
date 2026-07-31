"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Fragment, useState, type ReactNode } from "react";
import type { Column } from "./DataTable";

interface ExpandableTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** contenido del panel al expandir una fila */
  renderDetail: (row: T, index: number) => ReactNode;
  /** permitir más de una fila abierta a la vez. Default: false (tipo acordeón) */
  multiple?: boolean;
  defaultExpanded?: string[];
  density?: "compact" | "normal";
  className?: string;
}

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const ALIGN = { left: "text-left", center: "text-center", right: "text-right" };
const ROW_H = { compact: "h-9", normal: "h-11" };

/** Tabla simple con fila expandible: click en una fila revela un panel de detalle animado. */
export function ExpandableTable<T>({
  columns, rows, rowKey, renderDetail, multiple = false,
  defaultExpanded = [], density = "normal", className = "",
}: ExpandableTableProps<T>) {
  const [open, setOpen] = useState<string[]>(defaultExpanded);

  const toggle = (k: string) =>
    setOpen((o) =>
      o.includes(k) ? o.filter((x) => x !== k) : multiple ? [...o, k] : [k]
    );

  return (
    <div className={cn("rounded-2xl border border-border bg-surface overflow-hidden", className)}>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-surface-alt/60 border-b border-border">
            <th className="w-9" />
            {columns.map((c) => (
              <th
                key={c.key}
                style={{ width: c.width }}
                className={cn("px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-muted whitespace-nowrap", ALIGN[c.align ?? "left"])}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const k = rowKey(row);
            const isOpen = open.includes(k);
            return (
              <Fragment key={k}>
                <tr
                  onClick={() => toggle(k)}
                  className={cn(ROW_H[density], "cursor-pointer border-b border-border transition-colors", isOpen ? "bg-primary/[0.04]" : "hover:bg-surface-alt/50", !isOpen && "last:border-0")}
                >
                  <td className="px-2 text-center">
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.18 }}
                      className="inline-flex text-muted"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </motion.span>
                  </td>
                  {columns.map((c) => (
                    <td key={c.key} className={cn("px-3.5 text-foreground", ALIGN[c.align ?? "left"])}>
                      {c.render ? c.render(row, i) : String(row[c.key] ?? "")}
                    </td>
                  ))}
                </tr>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <tr key={`${k}-detail`} className="border-b border-border last:border-0">
                      <td colSpan={columns.length + 1} className="p-0">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="px-4 py-3.5 bg-surface-alt/40">{renderDetail(row, i)}</div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
