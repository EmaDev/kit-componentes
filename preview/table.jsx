// =============================================================
//  DataTable — preview version
// =============================================================

const TABLE_DENSITY = { compact: "h-9", normal: "h-12", comfortable: "h-14" };

function PreviewCheck({ checked, indeterminate, onChange, label }) {
  return (
    <button role="checkbox" aria-checked={indeterminate ? "mixed" : checked} aria-label={label}
      onClick={onChange}
      className={cx(
        "w-[18px] h-[18px] rounded-[5px] border-2 flex items-center justify-center transition-all",
        checked || indeterminate ? "bg-primary border-primary text-white" : "border-border hover:border-muted"
      )}>
      {(checked || indeterminate) && (
        <span style={{ animation: "splashPop 0.15s ease-out both" }}>
          {indeterminate
            ? <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="4" width="8" height="2" rx="1" fill="currentColor"/></svg>
            : <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
        </span>
      )}
    </button>
  );
}

function PreviewDataTable({
  columns, rows, rowKey, selectable = false, searchable = false,
  searchPlaceholder = "Buscar…", pageSize = 0, density = "normal",
  stickyHeader = true, maxHeight, onRowClick, rowActions, toolbar,
}) {
  const [sort, setSort] = useState(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [sel, setSel] = useState([]);

  const filtered = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(r => columns.some(c => {
      const v = c.sortValue ? c.sortValue(r) : r[c.key];
      return String(v ?? "").toLowerCase().includes(q);
    }));
  }, [rows, query, columns]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const col = columns.find(c => c.key === sort.key);
    if (!col) return filtered;
    const get = r => col.sortValue ? col.sortValue(r) : r[col.key];
    return [...filtered].sort((a,b) => {
      const av = get(a), bv = get(b);
      if (typeof av === "number" && typeof bv === "number") return sort.dir === "asc" ? av-bv : bv-av;
      return sort.dir === "asc"
        ? String(av ?? "").localeCompare(String(bv ?? ""))
        : String(bv ?? "").localeCompare(String(av ?? ""));
    });
  }, [filtered, sort, columns]);

  const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const safePage = Math.min(page, pageCount - 1);
  const visible = pageSize > 0 ? sorted.slice(safePage*pageSize, safePage*pageSize+pageSize) : sorted;

  const allKeys = visible.map(rowKey);
  const allSel = allKeys.length > 0 && allKeys.every(k => sel.includes(k));
  const someSel = allKeys.some(k => sel.includes(k)) && !allSel;

  const grid = [
    selectable ? "44px" : null,
    ...columns.map(c => c.width ?? "minmax(120px, 1fr)"),
    rowActions ? "56px" : null,
  ].filter(Boolean).join(" ");

  const alignCls = { left:"justify-start text-left", center:"justify-center text-center", right:"justify-end text-right" };
  const onSort = (c) => {
    if (c.sortable === false) return;
    setSort(s => s?.key !== c.key ? { key:c.key, dir:"asc" } : s.dir === "asc" ? { key:c.key, dir:"desc" } : null);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      {(searchable || toolbar || sel.length > 0) && (
        <div className="px-4 py-3 border-b border-border flex items-center gap-3 flex-wrap">
          {searchable && (
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>
              </span>
              <input value={query} onChange={e=>{setQuery(e.target.value); setPage(0);}}
                placeholder={searchPlaceholder}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface-alt/50 text-sm text-foreground placeholder:text-muted outline-none focus:border-primary focus:bg-surface transition-colors"/>
            </div>
          )}
          {sel.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-semibold text-primary" style={{ animation:"fadeInUp 0.2s both" }}>
              <span className="rounded-full bg-primary/10 px-2.5 py-1">{sel.length} seleccionadas</span>
              <button onClick={()=>setSel([])} className="text-muted hover:text-foreground transition-colors">Limpiar</button>
            </div>
          )}
          {toolbar && <div className="ml-auto flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      <div className={maxHeight ? "overflow-auto" : "overflow-x-auto"} style={maxHeight ? { maxHeight } : undefined}>
        <div className="min-w-full text-sm" style={{ minWidth: 520 }}>
          <div className={cx("grid items-center bg-surface-alt/60 border-b border-border", stickyHeader && "sticky top-0 z-10 backdrop-blur")}
            style={{ gridTemplateColumns: grid }}>
            {selectable && (
              <div className="flex items-center justify-center h-11">
                <PreviewCheck checked={allSel} indeterminate={someSel} label="Seleccionar todo"
                  onChange={()=>setSel(allSel ? sel.filter(k=>!allKeys.includes(k)) : [...new Set([...sel, ...allKeys])])}/>
              </div>
            )}
            {columns.map(c => {
              const active = sort?.key === c.key;
              return (
                <div key={c.key} onClick={()=>onSort(c)}
                  className={cx("h-11 px-3 flex items-center gap-1.5 select-none",
                    c.sortable === false ? "" : "cursor-pointer hover:text-foreground",
                    active ? "text-foreground" : "text-muted",
                    alignCls[c.align ?? "left"],
                    c.hideOnMobile && "hidden sm:flex")}>
                  <span className="text-[11px] font-bold uppercase tracking-wider truncate">{c.header}</span>
                  {c.sortable !== false && (
                    <span className="shrink-0 transition-all" style={{ opacity: active ? 1 : 0.25, transform: active && sort.dir === "desc" ? "rotate(180deg)" : "none" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 4 18 9"/><polyline points="6 15 12 20 18 15"/></svg>
                    </span>
                  )}
                </div>
              );
            })}
            {rowActions && <div className="h-11"/>}
          </div>

          {visible.length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex flex-col items-center gap-2 text-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/></svg>
                <p className="text-sm font-medium">Sin resultados</p>
                {query && <p className="text-xs">Probá con otro término</p>}
              </div>
            </div>
          ) : visible.map((row, i) => {
            const k = rowKey(row);
            const isSel = sel.includes(k);
            return (
              <div key={k} onClick={()=>onRowClick?.(row)}
                className={cx("grid items-center border-b border-border last:border-0 transition-colors",
                  TABLE_DENSITY[density],
                  isSel ? "bg-primary/[0.05]" : "hover:bg-surface-alt/50",
                  onRowClick && "cursor-pointer")}
                style={{ gridTemplateColumns: grid, animation: `fadeInUp 0.2s ${Math.min(i*0.015,0.2)}s both` }}>
                {selectable && (
                  <div className="flex items-center justify-center" onClick={e=>e.stopPropagation()}>
                    <PreviewCheck checked={isSel} label={`Fila ${i+1}`}
                      onChange={()=>setSel(isSel ? sel.filter(x=>x!==k) : [...sel, k])}/>
                  </div>
                )}
                {columns.map(c => (
                  <div key={c.key} className={cx("px-3 flex items-center min-w-0 text-foreground",
                    alignCls[c.align ?? "left"], c.hideOnMobile && "hidden sm:flex")}>
                    <span className="truncate w-full">{c.render ? c.render(row, i) : String(row[c.key] ?? "")}</span>
                  </div>
                ))}
                {rowActions && (
                  <div className="flex items-center justify-center" onClick={e=>e.stopPropagation()}>{rowActions(row)}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {pageSize > 0 && sorted.length > 0 && (
        <div className="px-4 py-3 border-t border-border flex items-center justify-between gap-3">
          <p className="text-xs text-muted">
            {safePage*pageSize+1}–{Math.min((safePage+1)*pageSize, sorted.length)} de {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <button disabled={safePage===0} onClick={()=>setPage(safePage-1)} aria-label="Anterior"
              className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt disabled:opacity-30 transition-colors">
              {I.chevLeft}
            </button>
            <span className="px-3 text-xs font-semibold text-foreground tabular-nums">{safePage+1} / {pageCount}</span>
            <button disabled={safePage>=pageCount-1} onClick={()=>setPage(safePage+1)} aria-label="Siguiente"
              className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt disabled:opacity-30 transition-colors">
              {I.chevRight}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { PreviewDataTable, PreviewCheck });
