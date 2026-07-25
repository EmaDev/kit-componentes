"use client";

interface PaginationProps {
  /** página actual, 1-based */
  page: number;
  /** total de páginas (o pasá total + pageSize) */
  pageCount?: number;
  total?: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  /** páginas a cada lado de la actual. Default 1 */
  siblings?: number;
  /** botones « primera / última ». Default true */
  edges?: boolean;
  /** «41–60 de 248». Default true cuando hay total */
  summary?: boolean;
  /** en mobile colapsa a «‹ 3 / 12 ›». Default true */
  compactOnMobile?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/** Paginado numérico con elipsis, resumen de rango y tamaño de página. */
export function Pagination({
  page, pageCount, total, pageSize = 20, onPageChange, onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100], siblings = 1, edges = true,
  summary = true, compactOnMobile = true, size = "md", className = "",
}: PaginationProps) {
  const pages = pageCount ?? Math.max(1, Math.ceil((total ?? 0) / pageSize));
  const clamped = Math.min(Math.max(1, page), pages);

  const items: (number | "…")[] = (() => {
    const window = siblings * 2 + 5;
    if (pages <= window) return range(1, pages);
    const left = Math.max(clamped - siblings, 2);
    const right = Math.min(clamped + siblings, pages - 1);
    const out: (number | "…")[] = [1];
    if (left > 2) out.push("…");
    out.push(...range(left, right));
    if (right < pages - 1) out.push("…");
    out.push(pages);
    return out;
  })();

  const h = size === "sm" ? "h-8 min-w-8 text-xs" : "h-9 min-w-9 text-sm";
  const btn = `${h} px-2 rounded-lg font-semibold inline-flex items-center justify-center border transition-all active:scale-95 disabled:opacity-35 disabled:pointer-events-none`;
  const idle = "bg-surface border-border text-foreground hover:bg-surface-alt hover:border-muted/50";
  const on = "bg-primary border-primary text-white shadow-sm shadow-primary/30";

  const first = total ? (clamped - 1) * pageSize + 1 : 0;
  const last = total ? Math.min(clamped * pageSize, total) : 0;

  const arrow = (dir: -1 | 1, label: string) => (
    <button type="button" aria-label={label} disabled={dir === -1 ? clamped === 1 : clamped === pages}
      onClick={() => onPageChange(clamped + dir)} className={`${btn} ${idle}`}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: dir === -1 ? "rotate(180deg)" : undefined }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );

  const edge = (dir: -1 | 1, label: string) => (
    <button type="button" aria-label={label} disabled={dir === -1 ? clamped === 1 : clamped === pages}
      onClick={() => onPageChange(dir === -1 ? 1 : pages)} className={`${btn} ${idle}`}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: dir === -1 ? "rotate(180deg)" : undefined }}>
        <polyline points="7 18 13 12 7 6"/><polyline points="13 18 19 12 13 6"/>
      </svg>
    </button>
  );

  return (
    <nav aria-label="Paginado" className={`flex flex-wrap items-center gap-3 justify-between ${className}`}>
      {summary && total != null && (
        <p className="text-[11px] text-muted order-2 sm:order-1 tabular-nums">
          <span className="font-semibold text-foreground">{first}–{last}</span> de {total.toLocaleString("es-AR")}
        </p>
      )}

      <div className="flex items-center gap-1.5 order-1 sm:order-2">
        {edges && edge(-1, "Primera página")}
        {arrow(-1, "Página anterior")}

        {/* compacto en mobile */}
        {compactOnMobile && (
          <span className={`${h} px-3 rounded-lg border border-border bg-surface-alt inline-flex items-center justify-center font-semibold tabular-nums sm:hidden`}>
            {clamped} / {pages}
          </span>
        )}

        <span className={compactOnMobile ? "hidden sm:flex items-center gap-1.5" : "flex items-center gap-1.5"}>
          {items.map((it, i) =>
            it === "…" ? (
              <span key={`gap-${i}`} className={`${h} grid place-items-center text-muted select-none`}>…</span>
            ) : (
              <button key={it} type="button" aria-current={it === clamped ? "page" : undefined}
                onClick={() => onPageChange(it)} className={`${btn} ${it === clamped ? on : idle} tabular-nums`}>
                {it}
              </button>
            )
          )}
        </span>

        {arrow(1, "Página siguiente")}
        {edges && edge(1, "Última página")}
      </div>

      {onPageSizeChange && (
        <label className="flex items-center gap-2 text-[11px] text-muted order-3">
          Por página
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={`${h} px-2 rounded-lg border border-border bg-surface text-foreground font-semibold outline-none focus:border-primary transition-colors`}>
            {pageSizeOptions.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      )}
    </nav>
  );
}
