"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";

export type SortDir = "asc" | "desc";

export interface Column<T> {
  /** clave del dato en la fila */
  key: keyof T & string;
  header: ReactNode;
  /** ancho CSS, ej. "180px" o "1fr" */
  width?: string;
  align?: "left" | "center" | "right";
  /** permitir ordenar por esta columna. Default: true */
  sortable?: boolean;
  /** render custom de la celda */
  render?: (row: T, index: number) => ReactNode;
  /** valor usado para ordenar/filtrar si difiere del crudo */
  sortValue?: (row: T) => string | number;
  /** ocultar en pantallas chicas */
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  /** clave única por fila */
  rowKey: (row: T) => string;
  /** selección con checkbox */
  selectable?: boolean;
  selected?: string[];
  onSelectedChange?: (keys: string[]) => void;
  /** buscador sobre todas las columnas */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** filas por página. 0 = sin paginar */
  pageSize?: number;
  /** alto de fila */
  density?: "compact" | "normal" | "comfortable";
  /** header fijo al hacer scroll */
  stickyHeader?: boolean;
  /** alto máximo del área scrolleable, ej. "420px" */
  maxHeight?: string;
  onRowClick?: (row: T) => void;
  /** menú/acciones al final de cada fila */
  rowActions?: (row: T) => ReactNode;
  emptyState?: ReactNode;
  /** barra de herramientas a la derecha del buscador */
  toolbar?: ReactNode;
  caption?: string;
}

const DENSITY = { compact: "h-9", normal: "h-12", comfortable: "h-14" };

export function DataTable<T>({
  columns, rows, rowKey,
  selectable = false, selected, onSelectedChange,
  searchable = false, searchPlaceholder = "Buscar…",
  pageSize = 0, density = "normal", stickyHeader = true,
  maxHeight, onRowClick, rowActions, emptyState, toolbar, caption,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: string; dir: SortDir } | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [innerSel, setInnerSel] = useState<string[]>([]);

  const sel = selected ?? innerSel;
  const setSel = onSelectedChange ?? setInnerSel;

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      columns.some((c) => {
        const v = c.sortValue ? c.sortValue(r) : (r[c.key] as unknown);
        return String(v ?? "").toLowerCase().includes(q);
      })
    );
  }, [rows, query, columns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return filtered;
    const get = (r: T) => (col.sortValue ? col.sortValue(r) : (r[col.key] as unknown));
    return [...filtered].sort((a, b) => {
      const av = get(a), bv = get(b);
      if (typeof av === "number" && typeof bv === "number") {
        return sort.dir === "asc" ? av - bv : bv - av;
      }
      const as = String(av ?? ""), bs = String(bv ?? "");
      return sort.dir === "asc" ? as.localeCompare(bs) : bs.localeCompare(as);
    });
  }, [filtered, sort, columns]);

  const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const safePage = Math.min(page, pageCount - 1);
  const visible = pageSize > 0 ? sorted.slice(safePage * pageSize, safePage * pageSize + pageSize) : sorted;

  const allKeys = visible.map(rowKey);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => sel.includes(k));
  const someSelected = allKeys.some((k) => sel.includes(k)) && !allSelected;

  const toggleAll = () =>
    setSel(allSelected ? sel.filter((k) => !allKeys.includes(k)) : [...new Set([...sel, ...allKeys])]);
  const toggleOne = (k: string) =>
    setSel(sel.includes(k) ? sel.filter((x) => x !== k) : [...sel, k]);

  const onSort = (c: Column<T>) => {
    if (c.sortable === false) return;
    setSort((s) =>
      s?.key !== c.key ? { key: c.key, dir: "asc" } : s.dir === "asc" ? { key: c.key, dir: "desc" } : null
    );
  };

  const grid = [
    selectable ? "44px" : null,
    ...columns.map((c) => c.width ?? "minmax(120px, 1fr)"),
    rowActions ? "56px" : null,
  ].filter(Boolean).join(" ");

  const alignCls = { left: "justify-start text-left", center: "justify-center text-center", right: "justify-end text-right" };

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {(searchable || toolbar || sel.length > 0) && (
        <div className="px-4 py-3 border-b border-border flex items-center gap-3 flex-wrap">
          {searchable && (
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                <SearchIcon />
              </span>
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(0); }}
                placeholder={searchPlaceholder}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface-alt/50 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary focus:bg-surface transition-colors"
              />
            </div>
          )}
          <AnimatePresence>
            {sel.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                className="flex items-center gap-2 text-xs font-semibold text-primary"
              >
                <span className="rounded-full bg-primary/10 px-2.5 py-1">{sel.length} seleccionadas</span>
                <button onClick={() => setSel([])} className="text-muted hover:text-foreground transition-colors">
                  Limpiar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          {toolbar && <div className="ml-auto flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      <div className={maxHeight ? "overflow-auto" : "overflow-x-auto"} style={maxHeight ? { maxHeight } : undefined}>
        <div role="table" className="min-w-full text-sm" style={{ minWidth: 520 }}>
          {caption && <span className="sr-only">{caption}</span>}

          <div
            role="row"
            className={`grid items-center bg-surface-alt/60 border-b border-border ${stickyHeader ? "sticky top-0 z-10 backdrop-blur" : ""}`}
            style={{ gridTemplateColumns: grid }}
          >
            {selectable && (
              <div className="flex items-center justify-center h-11">
                <Check checked={allSelected} indeterminate={someSelected} onChange={toggleAll} label="Seleccionar todo" />
              </div>
            )}
            {columns.map((c) => {
              const active = sort?.key === c.key;
              return (
                <div
                  key={c.key}
                  role="columnheader"
                  aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : "none"}
                  onClick={() => onSort(c)}
                  className={[
                    "h-11 px-3 flex items-center gap-1.5 select-none",
                    c.sortable === false ? "" : "cursor-pointer hover:text-foreground",
                    active ? "text-foreground" : "text-muted",
                    alignCls[c.align ?? "left"],
                    c.hideOnMobile ? "hidden sm:flex" : "",
                  ].join(" ")}
                >
                  <span className="text-[11px] font-bold uppercase tracking-wider truncate">{c.header}</span>
                  {c.sortable !== false && (
                    <motion.span
                      animate={{ opacity: active ? 1 : 0.25, rotate: active && sort!.dir === "desc" ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <SortIcon />
                    </motion.span>
                  )}
                </div>
              );
            })}
            {rowActions && <div className="h-11" />}
          </div>

          {visible.length === 0 ? (
            <div className="py-16 text-center">
              {emptyState ?? (
                <div className="flex flex-col items-center gap-2 text-muted">
                  <SearchIcon />
                  <p className="text-sm font-medium">Sin resultados</p>
                  {query && <p className="text-xs">Probá con otro término</p>}
                </div>
              )}
            </div>
          ) : (
            visible.map((row, i) => {
              const k = rowKey(row);
              const isSel = sel.includes(k);
              return (
                <motion.div
                  key={k}
                  role="row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.015, 0.2) }}
                  onClick={() => onRowClick?.(row)}
                  className={[
                    "grid items-center border-b border-border last:border-0 transition-colors",
                    DENSITY[density],
                    isSel ? "bg-primary/[0.05]" : "hover:bg-surface-alt/50",
                    onRowClick ? "cursor-pointer" : "",
                  ].join(" ")}
                  style={{ gridTemplateColumns: grid }}
                >
                  {selectable && (
                    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                      <Check checked={isSel} onChange={() => toggleOne(k)} label={`Seleccionar fila ${i + 1}`} />
                    </div>
                  )}
                  {columns.map((c) => (
                    <div
                      key={c.key}
                      role="cell"
                      className={[
                        "px-3 flex items-center min-w-0 text-foreground",
                        alignCls[c.align ?? "left"],
                        c.hideOnMobile ? "hidden sm:flex" : "",
                      ].join(" ")}
                    >
                      <span className="truncate w-full">
                        {c.render ? c.render(row, i) : String(row[c.key] ?? "")}
                      </span>
                    </div>
                  ))}
                  {rowActions && (
                    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                      {rowActions(row)}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {pageSize > 0 && sorted.length > 0 && (
        <div className="px-4 py-3 border-t border-border flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            {safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, sorted.length)} de {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <PagerBtn disabled={safePage === 0} onClick={() => setPage(safePage - 1)} label="Anterior">
              <ChevronIcon dir="left" />
            </PagerBtn>
            <span className="px-3 text-xs font-semibold text-foreground tabular-nums">
              {safePage + 1} / {pageCount}
            </span>
            <PagerBtn disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)} label="Siguiente">
              <ChevronIcon dir="right" />
            </PagerBtn>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- piezas internas ---------- */

function Check({
  checked, indeterminate, onChange, label,
}: { checked: boolean; indeterminate?: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={label}
      onClick={onChange}
      className={[
        "w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all",
        checked || indeterminate ? "bg-primary border-primary text-white" : "border-border hover:border-muted",
      ].join(" ")}
    >
      <AnimatePresence>
        {(checked || indeterminate) && (
          <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
            {indeterminate ? (
              <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="4" width="8" height="2" rx="1" fill="currentColor" /></svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function PagerBtn({ children, disabled, onClick, label }: { children: ReactNode; disabled: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick} disabled={disabled} aria-label={label}
      className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
    >
      {children}
    </button>
  );
}

const svgBase = {
  viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
};
function SearchIcon() {
  return <svg width="16" height="16" {...svgBase}><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></svg>;
}
function SortIcon() {
  return <svg width="12" height="12" {...svgBase} strokeWidth={2.5}><polyline points="6 9 12 4 18 9" /><polyline points="6 15 12 20 18 15" /></svg>;
}
function ChevronIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" {...svgBase} strokeWidth={2.5}>
      <polyline points={dir === "left" ? "15 18 9 12 15 6" : "9 18 15 12 9 6"} />
    </svg>
  );
}
