"use client";

import { useCallback, useMemo, useRef, useState } from "react";

/* =============================================================
   Utilidades de referencia (A1 ↔ {r,c})
   ============================================================= */

export function colName(c: number): string {
  let s = "";
  let n = c;
  do { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n / 26) - 1; } while (n >= 0);
  return s;
}

export function colIndex(name: string): number {
  let n = 0;
  for (const ch of name.toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

export const cellId = (r: number, c: number) => `${colName(c)}${r + 1}`;

function parseRef(ref: string): { r: number; c: number } | null {
  const m = /^([A-Za-z]+)(\d+)$/.exec(ref.trim());
  if (!m) return null;
  return { c: colIndex(m[1]), r: parseInt(m[2], 10) - 1 };
}

/* =============================================================
   Evaluador de fórmulas — recursive descent, sin eval()
   Soporta: + - * / ^ ( ), números, refs (A1), rangos en funciones
   Funciones: SUM AVERAGE/AVG MIN MAX COUNT ABS ROUND
   ============================================================= */

type Grid = Record<string, string>;

const FUNCS: Record<string, (nums: number[]) => number> = {
  SUM: (n) => n.reduce((a, b) => a + b, 0),
  AVERAGE: (n) => (n.length ? n.reduce((a, b) => a + b, 0) / n.length : 0),
  AVG: (n) => (n.length ? n.reduce((a, b) => a + b, 0) / n.length : 0),
  MIN: (n) => (n.length ? Math.min(...n) : 0),
  MAX: (n) => (n.length ? Math.max(...n) : 0),
  COUNT: (n) => n.length,
  ABS: (n) => Math.abs(n[0] ?? 0),
  ROUND: (n) => {
    const [v, d = 0] = n;
    const f = Math.pow(10, d);
    return Math.round((v ?? 0) * f) / f;
  },
};

class FormulaError extends Error {}

/** Evalúa el valor mostrado de una celda, resolviendo fórmulas recursivamente. */
export function evaluateCell(grid: Grid, ref: string, seen = new Set<string>()): string {
  const raw = grid[ref];
  if (raw == null || raw === "") return "";
  if (!raw.startsWith("=")) return raw;
  if (seen.has(ref)) return "#CIRC!";

  const next = new Set(seen);
  next.add(ref);
  try {
    const value = evalExpression(raw.slice(1), grid, next);
    if (!isFinite(value)) return "#DIV/0!";
    return String(Math.round(value * 1e10) / 1e10);
  } catch (e) {
    return e instanceof FormulaError ? e.message : "#ERROR!";
  }
}

function cellNumber(grid: Grid, ref: string, seen: Set<string>): number {
  const shown = evaluateCell(grid, ref, seen);
  if (shown === "") return 0;
  if (shown.startsWith("#")) throw new FormulaError(shown);
  const n = parseFloat(shown.replace(",", "."));
  return isNaN(n) ? 0 : n;
}

function rangeRefs(from: string, to: string): string[] {
  const a = parseRef(from), b = parseRef(to);
  if (!a || !b) throw new FormulaError("#REF!");
  const out: string[] = [];
  for (let r = Math.min(a.r, b.r); r <= Math.max(a.r, b.r); r++) {
    for (let c = Math.min(a.c, b.c); c <= Math.max(a.c, b.c); c++) out.push(cellId(r, c));
  }
  return out;
}

function evalExpression(src: string, grid: Grid, seen: Set<string>): number {
  let i = 0;
  const s = src;

  const ws = () => { while (i < s.length && s[i] === " ") i++; };
  const peek = () => { ws(); return s[i]; };

  const parseArgs = (): number[] => {
    const args: number[] = [];
    ws();
    if (peek() === ")") { i++; return args; }
    for (;;) {
      ws();
      // ¿rango?
      const m = /^([A-Za-z]+\d+)\s*:\s*([A-Za-z]+\d+)/.exec(s.slice(i));
      if (m) {
        i += m[0].length;
        for (const ref of rangeRefs(m[1], m[2])) {
          const shown = evaluateCell(grid, ref, seen);
          if (shown.startsWith("#")) throw new FormulaError(shown);
          if (shown !== "") {
            const n = parseFloat(shown.replace(",", "."));
            if (!isNaN(n)) args.push(n);
          }
        }
      } else {
        args.push(parseSum());
      }
      ws();
      if (peek() === ";" || peek() === ",") { i++; continue; }
      break;
    }
    ws();
    if (s[i] !== ")") throw new FormulaError("#ERROR!");
    i++;
    return args;
  };

  const parseAtom = (): number => {
    ws();
    const ch = s[i];
    if (ch === "(") { i++; const v = parseSum(); ws(); if (s[i] !== ")") throw new FormulaError("#ERROR!"); i++; return v; }
    if (ch === "-") { i++; return -parseAtom(); }
    if (ch === "+") { i++; return parseAtom(); }

    // función
    const fn = /^([A-Za-z]+)\s*\(/.exec(s.slice(i));
    if (fn) {
      const name = fn[1].toUpperCase();
      if (!FUNCS[name]) throw new FormulaError("#NAME?");
      i += fn[0].length;
      return FUNCS[name](parseArgs());
    }
    // referencia
    const ref = /^[A-Za-z]+\d+/.exec(s.slice(i));
    if (ref) {
      i += ref[0].length;
      return cellNumber(grid, ref[0].toUpperCase(), seen);
    }
    // número
    const num = /^\d+(\.\d+)?/.exec(s.slice(i));
    if (num) { i += num[0].length; return parseFloat(num[0]); }
    throw new FormulaError("#ERROR!");
  };

  const parsePow = (): number => {
    let v = parseAtom();
    ws();
    while (s[i] === "^") { i++; v = Math.pow(v, parseAtom()); ws(); }
    return v;
  };
  const parseMul = (): number => {
    let v = parsePow();
    ws();
    while (s[i] === "*" || s[i] === "/") {
      const op = s[i++]; const rhs = parsePow();
      v = op === "*" ? v * rhs : v / rhs;
      ws();
    }
    return v;
  };
  const parseSum = (): number => {
    let v = parseMul();
    ws();
    while (s[i] === "+" || s[i] === "-") {
      const op = s[i++]; const rhs = parseMul();
      v = op === "+" ? v + rhs : v - rhs;
      ws();
    }
    return v;
  };

  const out = parseSum();
  ws();
  if (i < s.length) throw new FormulaError("#ERROR!");
  return out;
}

/* =============================================================
   Estado de la hoja: selección, edición, undo/redo, clipboard
   ============================================================= */

export interface Cursor { r: number; c: number }
export interface Range { r1: number; c1: number; r2: number; c2: number }

interface UseSpreadsheetOptions {
  rows: number;
  cols: number;
  initial?: Grid;
  onChange?: (grid: Grid) => void;
}

export function useSpreadsheet({ rows, cols, initial = {}, onChange }: UseSpreadsheetOptions) {
  const [grid, setGrid] = useState<Grid>(initial);
  const [cursor, setCursor] = useState<Cursor>({ r: 0, c: 0 });
  const [anchor, setAnchor] = useState<Cursor>({ r: 0, c: 0 });
  const [editing, setEditing] = useState<{ r: number; c: number; draft: string } | null>(null);
  const history = useRef<Grid[]>([]);
  const future = useRef<Grid[]>([]);

  const range: Range = useMemo(() => ({
    r1: Math.min(anchor.r, cursor.r), r2: Math.max(anchor.r, cursor.r),
    c1: Math.min(anchor.c, cursor.c), c2: Math.max(anchor.c, cursor.c),
  }), [anchor, cursor]);

  const inRange = useCallback((r: number, c: number) =>
    r >= range.r1 && r <= range.r2 && c >= range.c1 && c <= range.c2, [range]);

  const commit = useCallback((next: Grid) => {
    history.current = [...history.current.slice(-49), grid];
    future.current = [];
    setGrid(next);
    onChange?.(next);
  }, [grid, onChange]);

  const setCell = useCallback((r: number, c: number, value: string) => {
    const next = { ...grid };
    const id = cellId(r, c);
    if (value === "") delete next[id]; else next[id] = value;
    commit(next);
  }, [grid, commit]);

  const clearRange = useCallback(() => {
    const next = { ...grid };
    for (let r = range.r1; r <= range.r2; r++)
      for (let c = range.c1; c <= range.c2; c++) delete next[cellId(r, c)];
    commit(next);
  }, [grid, range, commit]);

  const undo = useCallback(() => {
    const prev = history.current.pop();
    if (!prev) return;
    future.current = [grid, ...future.current.slice(0, 49)];
    setGrid(prev);
    onChange?.(prev);
  }, [grid, onChange]);

  const redo = useCallback(() => {
    const [next, ...rest] = future.current;
    if (!next) return;
    future.current = rest;
    history.current = [...history.current, grid];
    setGrid(next);
    onChange?.(next);
  }, [grid, onChange]);

  /** TSV de la selección, para el portapapeles */
  const selectionToTsv = useCallback(() => {
    const lines: string[] = [];
    for (let r = range.r1; r <= range.r2; r++) {
      const row: string[] = [];
      for (let c = range.c1; c <= range.c2; c++) row.push(grid[cellId(r, c)] ?? "");
      lines.push(row.join("\t"));
    }
    return lines.join("\n");
  }, [grid, range]);

  /** pega TSV desde el cursor */
  const pasteTsv = useCallback((text: string) => {
    const lines = text.replace(/\r/g, "").split("\n");
    if (lines.at(-1) === "") lines.pop();
    const next = { ...grid };
    lines.forEach((line, dr) => {
      line.split("\t").forEach((val, dc) => {
        const r = cursor.r + dr, c = cursor.c + dc;
        if (r >= rows || c >= cols) return;
        const id = cellId(r, c);
        if (val === "") delete next[id]; else next[id] = val;
      });
    });
    commit(next);
  }, [grid, cursor, rows, cols, commit]);

  const move = useCallback((dr: number, dc: number, extend = false) => {
    setCursor((cur) => {
      const r = Math.max(0, Math.min(rows - 1, cur.r + dr));
      const c = Math.max(0, Math.min(cols - 1, cur.c + dc));
      if (!extend) setAnchor({ r, c });
      return { r, c };
    });
  }, [rows, cols]);

  const goTo = useCallback((r: number, c: number, extend = false) => {
    const rr = Math.max(0, Math.min(rows - 1, r));
    const cc = Math.max(0, Math.min(cols - 1, c));
    setCursor({ r: rr, c: cc });
    if (!extend) setAnchor({ r: rr, c: cc });
  }, [rows, cols]);

  const displayOf = useCallback((r: number, c: number) => evaluateCell(grid, cellId(r, c)), [grid]);
  const rawOf = useCallback((r: number, c: number) => grid[cellId(r, c)] ?? "", [grid]);

  /** estadísticas de la selección, como la barra de estado de Excel */
  const stats = useMemo(() => {
    const nums: number[] = [];
    let count = 0;
    for (let r = range.r1; r <= range.r2; r++) {
      for (let c = range.c1; c <= range.c2; c++) {
        const shown = evaluateCell(grid, cellId(r, c));
        if (shown === "") continue;
        count++;
        const n = parseFloat(shown.replace(",", "."));
        if (!isNaN(n)) nums.push(n);
      }
    }
    const sum = nums.reduce((a, b) => a + b, 0);
    return {
      count,
      numeric: nums.length,
      sum: Math.round(sum * 1e10) / 1e10,
      avg: nums.length ? Math.round((sum / nums.length) * 1e10) / 1e10 : 0,
      cells: (range.r2 - range.r1 + 1) * (range.c2 - range.c1 + 1),
    };
  }, [grid, range]);

  return {
    grid, setGrid: commit,
    cursor, anchor, setAnchor, range, inRange, goTo, move,
    editing, setEditing,
    setCell, clearRange, undo, redo,
    canUndo: history.current.length > 0,
    canRedo: future.current.length > 0,
    selectionToTsv, pasteTsv,
    displayOf, rawOf, stats,
  };
}
