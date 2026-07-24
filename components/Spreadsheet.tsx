"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { cellId, colName, useSpreadsheet } from "../hooks/useSpreadsheet";

interface SpreadsheetProps {
  rows?: number;
  cols?: number;
  initial?: Record<string, string>;
  onChange?: (grid: Record<string, string>) => void;
  /** ancho de columna en px. Default: 104 */
  colWidth?: number;
  /** alto de fila en px. Default: 32 */
  rowHeight?: number;
  /** alto del área scrolleable, ej. "420px" */
  height?: string;
  /** barra de fórmulas arriba. Default: true */
  showFormulaBar?: boolean;
  /** barra de estado con suma/promedio. Default: true */
  showStatusBar?: boolean;
  /** primera fila como encabezado con estilo. Default: false */
  headerRow?: boolean;
  readOnly?: boolean;
}

/**
 * Hoja de cálculo editable, con fórmulas y atajos de Excel.
 *
 * Atajos: flechas · Tab/⇧Tab · Enter/⇧Enter · ⌘/Ctrl+flechas (extremos) ·
 * ⇧+flechas (rango) · F2 o doble click (editar) · Esc (cancelar) ·
 * Delete/Backspace (limpiar) · ⌘/Ctrl+C/X/V · ⌘/Ctrl+Z/⇧Z (undo/redo) ·
 * ⌘/Ctrl+A (todo) · Home/End.
 *
 * Fórmulas: =A1+B2*2 · =SUM(A1:A10) · AVERAGE MIN MAX COUNT ABS ROUND
 */
export function Spreadsheet({
  rows = 24, cols = 8, initial = {}, onChange,
  colWidth = 104, rowHeight = 32, height = "420px",
  showFormulaBar = true, showStatusBar = true,
  headerRow = false, readOnly = false,
}: SpreadsheetProps) {
  const sheet = useSpreadsheet({ rows, cols, initial, onChange });
  const gridRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLInputElement>(null);
  const formulaRef = useRef<HTMLInputElement>(null);
  const [copiedRange, setCopiedRange] = useState<string | null>(null);

  const { cursor, range, editing } = sheet;
  const activeId = cellId(cursor.r, cursor.c);

  useEffect(() => {
    if (editing) editorRef.current?.focus();
  }, [editing]);

  const startEdit = (initialDraft?: string) => {
    if (readOnly) return;
    sheet.setEditing({
      r: cursor.r, c: cursor.c,
      draft: initialDraft ?? sheet.rawOf(cursor.r, cursor.c),
    });
  };

  const commitEdit = (move: "down" | "right" | "none" = "down") => {
    if (!editing) return;
    sheet.setCell(editing.r, editing.c, editing.draft.trim());
    sheet.setEditing(null);
    if (move === "down") sheet.move(1, 0);
    if (move === "right") sheet.move(0, 1);
    gridRef.current?.focus();
  };

  const onKeyDown = async (e: ReactKeyboardEvent) => {
    const meta = e.metaKey || e.ctrlKey;

    if (editing) {
      if (e.key === "Enter") { e.preventDefault(); commitEdit(e.shiftKey ? "none" : "down"); }
      else if (e.key === "Tab") { e.preventDefault(); commitEdit("right"); }
      else if (e.key === "Escape") { e.preventDefault(); sheet.setEditing(null); gridRef.current?.focus(); }
      return;
    }

    // navegación
    const nav: Record<string, [number, number]> = {
      ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1],
    };
    if (nav[e.key]) {
      e.preventDefault();
      const [dr, dc] = nav[e.key];
      if (meta) {
        sheet.goTo(dr === 0 ? cursor.r : dr < 0 ? 0 : rows - 1, dc === 0 ? cursor.c : dc < 0 ? 0 : cols - 1, e.shiftKey);
      } else {
        sheet.move(dr, dc, e.shiftKey);
      }
      return;
    }

    switch (e.key) {
      case "Tab":
        e.preventDefault(); sheet.move(0, e.shiftKey ? -1 : 1); return;
      case "Enter":
        e.preventDefault();
        if (readOnly) return;
        startEdit(); return;
      case "F2":
        e.preventDefault(); startEdit(); return;
      case "Escape":
        e.preventDefault(); setCopiedRange(null); return;
      case "Delete":
      case "Backspace":
        e.preventDefault(); if (!readOnly) sheet.clearRange(); return;
      case "Home":
        e.preventDefault(); sheet.goTo(meta ? 0 : cursor.r, 0, e.shiftKey); return;
      case "End":
        e.preventDefault(); sheet.goTo(meta ? rows - 1 : cursor.r, cols - 1, e.shiftKey); return;
    }

    if (meta) {
      const k = e.key.toLowerCase();
      if (k === "a") {
        e.preventDefault();
        sheet.setAnchor({ r: 0, c: 0 });
        sheet.goTo(rows - 1, cols - 1, true);
        return;
      }
      if (k === "c" || k === "x") {
        e.preventDefault();
        const tsv = sheet.selectionToTsv();
        try { await navigator.clipboard.writeText(tsv); } catch {}
        setCopiedRange(`${cellId(range.r1, range.c1)}:${cellId(range.r2, range.c2)}`);
        if (k === "x" && !readOnly) sheet.clearRange();
        return;
      }
      if (k === "v") {
        e.preventDefault();
        if (readOnly) return;
        try {
          const text = await navigator.clipboard.readText();
          if (text) sheet.pasteTsv(text);
        } catch { /* sin permiso: el usuario puede usar ⌘V nativo sobre el input */ }
        setCopiedRange(null);
        return;
      }
      if (k === "z") { e.preventDefault(); e.shiftKey ? sheet.redo() : sheet.undo(); return; }
      if (k === "y") { e.preventDefault(); sheet.redo(); return; }
      return;
    }

    // escribir directamente reemplaza el contenido
    if (!readOnly && e.key.length === 1 && !e.altKey) {
      e.preventDefault();
      startEdit(e.key);
    }
  };

  const onCellPointerDown = (r: number, c: number, e: React.PointerEvent) => {
    if (editing) commitEdit("none");
    sheet.goTo(r, c, e.shiftKey);
    gridRef.current?.focus();
  };

  const headerH = 28;
  const gutterW = 44;

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden select-none">
      {showFormulaBar && (
        <div className="flex items-stretch border-b border-border bg-surface-alt/40">
          <div className="w-[76px] shrink-0 flex items-center justify-center border-r border-border">
            <span className="text-xs font-mono font-semibold text-foreground">{activeId}</span>
          </div>
          <div className="w-8 shrink-0 flex items-center justify-center border-r border-border text-muted">
            <span className="text-[13px] font-serif italic">fx</span>
          </div>
          <input
            ref={formulaRef}
            value={editing ? editing.draft : sheet.rawOf(cursor.r, cursor.c)}
            readOnly={readOnly}
            onChange={(e) => sheet.setEditing({ r: cursor.r, c: cursor.c, draft: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); commitEdit("down"); formulaRef.current?.blur(); }
              if (e.key === "Escape") { sheet.setEditing(null); formulaRef.current?.blur(); }
            }}
            placeholder="Escribí un valor o =SUM(A1:A5)"
            className="flex-1 h-9 px-3 bg-transparent text-sm font-mono text-foreground placeholder:text-muted outline-none"
          />
        </div>
      )}

      <div
        ref={gridRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="grid"
        aria-label="Hoja de cálculo"
        className="relative overflow-auto outline-none focus:ring-2 focus:ring-primary/30 focus:ring-inset"
        style={{ height }}
      >
        <div style={{ width: gutterW + cols * colWidth, position: "relative" }}>
          {/* encabezado de columnas */}
          <div className="flex sticky top-0 z-20">
            <div
              className="sticky left-0 z-30 shrink-0 border-r border-b border-border bg-surface-alt"
              style={{ width: gutterW, height: headerH }}
            />
            {Array.from({ length: cols }, (_, c) => {
              const active = c >= range.c1 && c <= range.c2;
              return (
                <div
                  key={c}
                  onPointerDown={(e) => {
                    sheet.setAnchor({ r: 0, c });
                    sheet.goTo(rows - 1, c, true);
                    if (!e.shiftKey) { sheet.setAnchor({ r: 0, c }); sheet.goTo(rows - 1, c, true); }
                    gridRef.current?.focus();
                  }}
                  className={[
                    "shrink-0 flex items-center justify-center border-r border-b border-border text-[11px] font-semibold cursor-pointer transition-colors",
                    active ? "bg-primary/12 text-primary" : "bg-surface-alt text-muted hover:bg-surface-alt/70",
                  ].join(" ")}
                  style={{ width: colWidth, height: headerH }}
                >
                  {colName(c)}
                </div>
              );
            })}
          </div>

          {/* filas */}
          {Array.from({ length: rows }, (_, r) => {
            const rowActive = r >= range.r1 && r <= range.r2;
            return (
              <div key={r} className="flex">
                <div
                  onPointerDown={() => {
                    sheet.setAnchor({ r, c: 0 });
                    sheet.goTo(r, cols - 1, true);
                    gridRef.current?.focus();
                  }}
                  className={[
                    "sticky left-0 z-10 shrink-0 flex items-center justify-center border-r border-b border-border text-[11px] font-semibold tabular-nums cursor-pointer transition-colors",
                    rowActive ? "bg-primary/12 text-primary" : "bg-surface-alt text-muted hover:bg-surface-alt/70",
                  ].join(" ")}
                  style={{ width: gutterW, height: rowHeight }}
                >
                  {r + 1}
                </div>

                {Array.from({ length: cols }, (_, c) => {
                  const isCursor = cursor.r === r && cursor.c === c;
                  const isSel = sheet.inRange(r, c);
                  const isEditing = editing?.r === r && editing?.c === c;
                  const raw = sheet.rawOf(r, c);
                  const shown = sheet.displayOf(r, c);
                  const isFormula = raw.startsWith("=");
                  const isError = shown.startsWith("#");
                  const numeric = shown !== "" && !isNaN(parseFloat(shown)) && !isError;
                  const isHeaderCell = headerRow && r === 0;

                  return (
                    <div
                      key={c}
                      role="gridcell"
                      aria-selected={isSel}
                      onPointerDown={(e) => onCellPointerDown(r, c, e)}
                      onDoubleClick={() => startEdit()}
                      className={[
                        "relative shrink-0 border-r border-b border-border px-2 flex items-center overflow-hidden",
                        isHeaderCell ? "bg-surface-alt/70 font-semibold" : "",
                        isSel && !isCursor ? "bg-primary/[0.07]" : "",
                        isCursor ? "z-10" : "",
                        numeric ? "justify-end tabular-nums" : "justify-start",
                        isError ? "text-danger" : isFormula ? "text-foreground" : "text-foreground",
                      ].join(" ")}
                      style={{ width: colWidth, height: rowHeight }}
                    >
                      {isEditing ? (
                        <input
                          ref={editorRef}
                          value={editing.draft}
                          onChange={(e) => sheet.setEditing({ ...editing, draft: e.target.value })}
                          onBlur={() => commitEdit("none")}
                          className="absolute inset-0 w-full h-full px-2 bg-surface border-2 border-primary text-sm font-mono text-foreground outline-none z-20"
                        />
                      ) : (
                        <span className="text-[13px] truncate w-full" style={{ textAlign: numeric ? "right" : "left" }}>
                          {shown}
                        </span>
                      )}

                      {isCursor && !isEditing && (
                        <span className="absolute inset-0 border-2 border-primary pointer-events-none">
                          <span className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 bg-primary rounded-[1px]" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {showStatusBar && (
        <div className="px-3 py-2 border-t border-border bg-surface-alt/40 flex items-center gap-4 flex-wrap text-[11px] text-muted">
          <span className="font-mono font-semibold text-foreground">
            {range.r1 === range.r2 && range.c1 === range.c2
              ? activeId
              : `${cellId(range.r1, range.c1)}:${cellId(range.r2, range.c2)}`}
          </span>
          {sheet.stats.cells > 1 && (
            <>
              <span>Celdas: <b className="text-foreground font-semibold tabular-nums">{sheet.stats.cells}</b></span>
              <span>Con datos: <b className="text-foreground font-semibold tabular-nums">{sheet.stats.count}</b></span>
              {sheet.stats.numeric > 0 && (
                <>
                  <span>Suma: <b className="text-foreground font-semibold tabular-nums">{sheet.stats.sum}</b></span>
                  <span>Promedio: <b className="text-foreground font-semibold tabular-nums">{sheet.stats.avg}</b></span>
                </>
              )}
            </>
          )}
          {copiedRange && <span className="text-primary font-semibold">Copiado {copiedRange}</span>}
          <span className="ml-auto hidden sm:inline">
            F2 editar · ⌘C/V copiar · ⌘Z deshacer · ⇧+flechas rango
          </span>
        </div>
      )}
    </div>
  );
}
