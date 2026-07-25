"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export interface BookChapter {
  id: string;
  title: string;
  /** párrafos de texto; también acepta HTML simple */
  paragraphs: string[];
}

export type ReaderTheme = "light" | "sepia" | "dark";

interface BookReaderProps {
  title: string;
  author?: string;
  chapters: BookChapter[];
  /** índice del capítulo inicial */
  defaultChapter?: number;
  /** una o dos columnas por pantalla (auto = dos en desktop) */
  spread?: "single" | "double" | "auto";
  theme?: ReaderTheme;
  onThemeChange?: (t: ReaderTheme) => void;
  fontSize?: number;
  onFontSizeChange?: (px: number) => void;
  /** guarda la posición (capítulo + página) */
  storageKey?: string;
  height?: number | string;
  onProgress?: (pct: number) => void;
  className?: string;
}

const THEMES: Record<ReaderTheme, { page: string; ink: string; soft: string; rule: string }> = {
  light: { page: "#ffffff", ink: "#1b2230", soft: "#6b7488", rule: "rgba(0,0,0,0.08)" },
  sepia: { page: "#f6efe2", ink: "#3b3226", soft: "#8a7c66", rule: "rgba(80,60,30,0.14)" },
  dark:  { page: "#14171d", ink: "#e6e8ee", soft: "#9aa1b1", rule: "rgba(255,255,255,0.1)" },
};

const SIZES = [15, 17, 19, 21, 24];

/** Lector de texto paginado tipo Google Books: columnas, avance por página, tema y tipografía. */
export function BookReader({
  title, author, chapters, defaultChapter = 0, spread = "auto",
  theme: themeProp, onThemeChange, fontSize: fsProp, onFontSizeChange,
  storageKey, height = 560, onProgress, className = "",
}: BookReaderProps) {
  const [chapter, setChapter] = useState(defaultChapter);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [themeState, setThemeState] = useState<ReaderTheme>("light");
  const [fsState, setFsState] = useState(17);
  const [toc, setToc] = useState(false);
  const [turning, setTurning] = useState<"next" | "prev" | null>(null);
  const [cols, setCols] = useState(1);

  const theme = themeProp ?? themeState;
  const fontSize = fsProp ?? fsState;
  const t = THEMES[theme];

  const viewport = useRef<HTMLDivElement>(null);
  const flow = useRef<HTMLDivElement>(null);
  const restored = useRef(false);

  const setTheme = (v: ReaderTheme) => { setThemeState(v); onThemeChange?.(v); };
  const setFont = (v: number) => { setFsState(v); onFontSizeChange?.(v); };

  // posición guardada
  useEffect(() => {
    if (!storageKey || restored.current) return;
    restored.current = true;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as { c: number; p: number };
        if (typeof saved.c === "number") setChapter(Math.min(saved.c, chapters.length - 1));
        if (typeof saved.p === "number") setPage(saved.p);
      }
    } catch { /* storage bloqueado */ }
  }, [storageKey, chapters.length]);

  useEffect(() => {
    if (!storageKey || !restored.current) return;
    try { localStorage.setItem(storageKey, JSON.stringify({ c: chapter, p: page })); } catch { /* noop */ }
  }, [storageKey, chapter, page]);

  // columnas + cantidad de páginas (gap-aware: el paso del transform incluye el gap)
  const GAP = 44;
  const measure = useCallback(() => {
    const vp = viewport.current, fl = flow.current;
    if (!vp || !fl) return;
    const w = vp.clientWidth;
    if (w === 0) return;
    const n = spread === "single" ? 1 : spread === "double" ? 2 : w >= 720 ? 2 : 1;
    setCols(n);
    const total = Math.max(1, Math.ceil((fl.scrollWidth - 2) / (w + GAP)));
    setPages(total);
    setPage(p => Math.min(p, total - 1));
  }, [spread]);

  useLayoutEffect(measure, [measure, chapter, fontSize, theme, cols, chapters]);

  // el layout de columnas y las fuentes se resuelven después del primer paint
  useEffect(() => {
    const raf1 = requestAnimationFrame(() => { measure(); requestAnimationFrame(measure); });
    let cancelled = false;
    (document as Document & { fonts?: FontFaceSet }).fonts?.ready.then(() => { if (!cancelled) measure(); });
    const t = setTimeout(measure, 300);
    return () => { cancelled = true; cancelAnimationFrame(raf1); clearTimeout(t); };
  }, [measure, chapter, fontSize, theme, cols, chapters]);

  useEffect(() => {
    const ro = new ResizeObserver(measure);
    if (viewport.current) ro.observe(viewport.current);
    if (flow.current) ro.observe(flow.current);
    return () => ro.disconnect();
  }, [measure]);

  // progreso global
  useEffect(() => {
    const done = chapters.slice(0, chapter).length;
    const pct = ((done + (pages > 1 ? page / (pages - 1) : 1)) / chapters.length) * 100;
    onProgress?.(Math.min(100, Math.round(pct)));
  }, [chapter, page, pages, chapters.length, onProgress, chapters]);

  const go = useCallback((dir: 1 | -1) => {
    setTurning(dir === 1 ? "next" : "prev");
    setTimeout(() => setTurning(null), 260);
    setPage(p => {
      const next = p + dir;
      if (next >= 0 && next < pages) return next;
      if (next < 0 && chapter > 0) { setChapter(chapter - 1); return 0; }
      if (next >= pages && chapter < chapters.length - 1) { setChapter(chapter + 1); return 0; }
      return p;
    });
  }, [pages, chapter, chapters.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); go(-1); }
      if (e.key === "Escape") setToc(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const ch = chapters[chapter];
  const atStart = page === 0 && chapter === 0;
  const atEnd = page >= pages - 1 && chapter >= chapters.length - 1;
  const globalPct = Math.round(((chapter + (pages > 1 ? page / (pages - 1) : 1)) / chapters.length) * 100);

  return (
    <div className={`relative rounded-2xl border border-border overflow-hidden select-none ${className}`}
      style={{ background: t.page, height: typeof height === "number" ? `${height}px` : height }}>
      {/* barra superior */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-2 px-3 h-12"
        style={{ borderBottom: `1px solid ${t.rule}` }}>
        <button type="button" onClick={() => setToc(v => !v)} aria-label="Índice"
          className="w-9 h-9 rounded-lg inline-flex items-center justify-center transition-colors"
          style={{ color: t.soft }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[11px] font-semibold truncate" style={{ color: t.ink }}>{title}</p>
          {author && <p className="text-[10px] truncate" style={{ color: t.soft }}>{author}</p>}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setFont(SIZES[Math.max(0, SIZES.indexOf(fontSize) - 1)] ?? 15)}
            aria-label="Reducir texto" className="w-9 h-9 rounded-lg text-xs font-bold" style={{ color: t.soft }}>A−</button>
          <button type="button" onClick={() => setFont(SIZES[Math.min(SIZES.length - 1, SIZES.indexOf(fontSize) + 1)] ?? 24)}
            aria-label="Aumentar texto" className="w-9 h-9 rounded-lg text-sm font-bold" style={{ color: t.ink }}>A+</button>
          {(["light", "sepia", "dark"] as ReaderTheme[]).map(k => (
            <button key={k} type="button" onClick={() => setTheme(k)} aria-label={`Tema ${k}`}
              className="w-6 h-6 rounded-full border transition-transform active:scale-90"
              style={{
                background: THEMES[k].page,
                borderColor: theme === k ? "var(--color-primary)" : t.rule,
                borderWidth: theme === k ? 2 : 1,
              }}/>
          ))}
        </div>
      </div>

      {/* índice */}
      {toc && (
        <div className="absolute inset-y-0 left-0 z-30 w-64 max-w-[80%] overflow-y-auto p-4"
          style={{ background: t.page, borderRight: `1px solid ${t.rule}`, boxShadow: "8px 0 24px rgba(0,0,0,0.12)", paddingTop: "3.5rem" }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: t.soft }}>Índice</p>
          <ul className="space-y-1">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <button type="button"
                  onClick={() => { setChapter(i); setPage(0); setToc(false); }}
                  className="w-full text-left rounded-lg px-2.5 py-2 text-[13px] leading-snug transition-colors"
                  style={{
                    color: i === chapter ? "var(--color-primary)" : t.ink,
                    background: i === chapter ? "rgb(var(--color-primary-rgb) / 0.1)" : "transparent",
                    fontWeight: i === chapter ? 700 : 400,
                  }}>
                  <span className="tabular-nums mr-2" style={{ color: t.soft }}>{String(i + 1).padStart(2, "0")}</span>
                  {c.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* página */}
      <div ref={viewport} className="absolute inset-x-0 overflow-hidden"
        style={{ top: "3rem", bottom: "3rem", paddingInline: cols === 2 ? 32 : 22 }}>
        <div ref={flow}
          className="h-full"
          style={{
            columnCount: cols,
            columnGap: 44,
            columnFill: "auto",
            transform: `translateX(calc(${-page * 100}% - ${page * 44}px))`,
            transition: "transform 260ms cubic-bezier(.22,.61,.36,1)",
            opacity: turning ? 0.92 : 1,
            color: t.ink,
            fontSize,
            lineHeight: 1.72,
            textAlign: "justify",
            hyphens: "auto",
            textWrap: "pretty",
          }}>
          <h3 className="text-[0.95em] font-bold mb-3" style={{ color: t.ink, breakAfter: "avoid" }}>{ch.title}</h3>
          {ch.paragraphs.map((p, i) => (
            <p key={i} className="mb-[0.85em]" style={{ textIndent: i === 0 ? 0 : "1.2em" }}>{p}</p>
          ))}
        </div>
        {cols === 2 && (
          <span className="pointer-events-none absolute top-4 bottom-4 left-1/2 w-px" style={{ background: t.rule }}/>
        )}
      </div>

      {/* zonas de toque */}
      <button type="button" aria-label="Página anterior" onClick={() => go(-1)} disabled={atStart}
        className="absolute left-0 z-10 w-[18%] disabled:opacity-0" style={{ top: "3rem", bottom: "3rem" }}/>
      <button type="button" aria-label="Página siguiente" onClick={() => go(1)} disabled={atEnd}
        className="absolute right-0 z-10 w-[18%] disabled:opacity-0" style={{ top: "3rem", bottom: "3rem" }}/>

      {/* barra inferior */}
      <div className="absolute inset-x-0 bottom-0 z-20 h-12 px-3 flex items-center gap-3"
        style={{ borderTop: `1px solid ${t.rule}` }}>
        <button type="button" onClick={() => go(-1)} disabled={atStart} aria-label="Anterior"
          className="w-8 h-8 rounded-lg inline-flex items-center justify-center disabled:opacity-25 active:scale-90 transition-all" style={{ color: t.ink }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: t.rule }}>
            <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${globalPct}%` }}/>
          </div>
        </div>
        <span className="text-[10px] font-semibold tabular-nums shrink-0" style={{ color: t.soft }}>
          {page + 1}/{pages} · {globalPct}%
        </span>
        <button type="button" onClick={() => go(1)} disabled={atEnd} aria-label="Siguiente"
          className="w-8 h-8 rounded-lg inline-flex items-center justify-center disabled:opacity-25 active:scale-90 transition-all" style={{ color: t.ink }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
