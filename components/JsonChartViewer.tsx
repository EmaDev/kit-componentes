"use client";
import { useMemo, useState } from "react";

export interface JsonChartViewerProps {
  data?: unknown;
  defaultView?: "chart" | "table" | "tree";
  defaultChartType?: "bar" | "line" | "area";
  className?: string;
}
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const SERIES_COLORS = ["var(--color-primary)", "var(--color-accent)", "var(--color-success)", "var(--color-danger)", "var(--color-muted)"];

const SAMPLE = [
  { mes: "Ene", ingresos: 18400, gastos: 11200, region: "AMBA" },
  { mes: "Feb", ingresos: 21750, gastos: 12900, region: "AMBA" },
  { mes: "Mar", ingresos: 19980, gastos: 13400, region: "Litoral" },
  { mes: "Abr", ingresos: 24310, gastos: 14150, region: "Litoral" },
  { mes: "May", ingresos: 26840, gastos: 15020, region: "Cuyo" },
];

function toRows(parsed: unknown): Record<string, unknown>[] | null {
  if (Array.isArray(parsed)) {
    if (parsed.length > 0 && parsed.every(r => r && typeof r === "object" && !Array.isArray(r))) return parsed as Record<string, unknown>[];
    return null;
  }
  if (parsed && typeof parsed === "object") {
    const entries = Object.entries(parsed as Record<string, unknown>);
    if (entries.length > 0 && entries.every(([, v]) => typeof v === "number")) return entries.map(([key, value]) => ({ key, value }));
  }
  return null;
}

function jsonTypeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  return typeof v;
}
function cellText(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/** Nodo colapsable del árbol — para JSON de cualquier forma, no sólo tablas de números. */
function JsonTreeNode({ keyName, value, depth }: { keyName: string | null; value: unknown; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const type = jsonTypeOf(value);
  const isComplex = type === "object" || type === "array";
  const entries = isComplex ? Object.entries(value as Record<string, unknown>) : [];
  const count = entries.length;

  const typeColor: Record<string, string> = {
    string: "text-success", number: "text-primary", boolean: "text-accent", null: "text-muted",
  };

  if (!isComplex) {
    return (
      <div className="flex items-baseline gap-1.5 py-0.5" style={{ paddingLeft: depth * 16 }}>
        {keyName !== null && <span className="text-[12px] font-semibold text-foreground">{keyName}:</span>}
        <span className={cn("text-[12px] font-mono", typeColor[type] ?? "text-foreground")}>
          {type === "string" ? `"${value}"` : cellText(value)}
        </span>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 py-0.5 w-full text-left hover:bg-surface-alt rounded-md transition-colors"
        style={{ paddingLeft: depth * 16 }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
          className={cn("text-muted shrink-0 transition-transform", open && "rotate-90")}><polyline points="9 18 15 12 9 6"/></svg>
        {keyName !== null && <span className="text-[12px] font-semibold text-foreground">{keyName}:</span>}
        <span className="text-[11px] text-muted">{type === "array" ? `Array(${count})` : `Object · ${count} campo${count === 1 ? "" : "s"}`}</span>
      </button>
      {open && (
        <div>
          {entries.map(([k, v]) => <JsonTreeNode key={k} keyName={type === "array" ? `[${k}]` : k} value={v} depth={depth + 1}/>)}
          {count === 0 && <p className="text-[11px] text-muted italic" style={{ paddingLeft: (depth + 1) * 16 }}>vacío</p>}
        </div>
      )}
    </div>
  );
}

/** Tabla genérica: filas de un array de objetos, clave/valor de un objeto plano, o lista simple. */
function JsonTable({ parsed }: { parsed: unknown }) {
  if (Array.isArray(parsed) && parsed.every(r => r && typeof r === "object" && !Array.isArray(r))) {
    const rows = parsed as Record<string, unknown>[];
    const keys = Array.from(rows.reduce((set, r) => { Object.keys(r).forEach(k => set.add(k)); return set; }, new Set<string>()));
    return (
      <div className="overflow-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt/70">
            <tr>{keys.map(k => <th key={k} className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted whitespace-nowrap">{k}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r, i) => (
              <tr key={i} className="hover:bg-surface-alt/40 transition-colors">
                {keys.map(k => (
                  <td key={k} className={cn("px-3 py-2 whitespace-nowrap", typeof r[k] === "number" ? "font-mono tabular-nums text-foreground" : "text-foreground/90")}
                    title={cellText(r[k])}>
                    {cellText(r[k])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (Array.isArray(parsed)) {
    return (
      <div className="overflow-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt/70"><tr><th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted">#</th><th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted">Valor</th></tr></thead>
          <tbody className="divide-y divide-border">
            {parsed.map((v, i) => <tr key={i} className="hover:bg-surface-alt/40 transition-colors"><td className="px-3 py-2 text-muted font-mono">{i}</td><td className="px-3 py-2 text-foreground/90" title={cellText(v)}>{cellText(v)}</td></tr>)}
          </tbody>
        </table>
      </div>
    );
  }

  if (parsed && typeof parsed === "object") {
    const entries = Object.entries(parsed as Record<string, unknown>);
    return (
      <div className="overflow-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-alt/70"><tr><th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted">Campo</th><th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted">Valor</th></tr></thead>
          <tbody className="divide-y divide-border">
            {entries.map(([k, v]) => <tr key={k} className="hover:bg-surface-alt/40 transition-colors"><td className="px-3 py-2 font-semibold text-foreground whitespace-nowrap">{k}</td><td className="px-3 py-2 text-foreground/90" title={cellText(v)}>{cellText(v)}</td></tr>)}
          </tbody>
        </table>
      </div>
    );
  }

  return <div className="rounded-xl border border-border p-4 text-sm font-mono text-foreground">{cellText(parsed)}</div>;
}

/** Pega o cargá JSON de cualquier forma y visualizalo como gráfico (si hay números), tabla legible o árbol colapsable. */
export function JsonChartViewer({ data, defaultView = "table", defaultChartType = "bar", className = "" }: JsonChartViewerProps) {
  const [raw, setRaw] = useState(() => JSON.stringify(data ?? SAMPLE, null, 2));
  const [view, setView] = useState<"chart" | "table" | "tree">(defaultView);
  const [chartType, setChartType] = useState<"bar" | "line" | "area">(defaultChartType);
  const [activeSeries, setActiveSeries] = useState<string[] | null>(null);
  const [hover, setHover] = useState<{ row: number; series: string } | null>(null);

  const { parsed, parseError } = useMemo(() => {
    try { return { parsed: JSON.parse(raw), parseError: null as string | null }; }
    catch { return { parsed: null, parseError: "JSON inválido — revisá comas, comillas y corchetes." }; }
  }, [raw]);

  const { rows, xKey, numericKeys } = useMemo(() => {
    if (parseError) return { rows: [] as Record<string, unknown>[], xKey: "", numericKeys: [] as string[] };
    const rows = toRows(parsed);
    if (!rows || rows.length === 0) return { rows: [] as Record<string, unknown>[], xKey: "", numericKeys: [] as string[] };
    const keys = Object.keys(rows[0]);
    const numericKeys = keys.filter(k => rows.every(r => typeof r[k] === "number"));
    const xKey = keys.find(k => !numericKeys.includes(k)) ?? keys[0];
    return { rows, xKey, numericKeys };
  }, [parsed, parseError]);

  const chartUnavailable = !parseError && numericKeys.length === 0;
  const seriesKeys = activeSeries ?? numericKeys;
  const visibleSeries = numericKeys.filter(k => seriesKeys.includes(k));
  const toggleSeries = (k: string) => setActiveSeries(cur => {
    const base = cur ?? numericKeys;
    return base.includes(k) ? base.filter(x => x !== k) : [...base, k];
  });

  const max = useMemo(() => {
    let m = 0;
    for (const r of rows) for (const k of visibleSeries) m = Math.max(m, Number(r[k]) || 0);
    return m || 1;
  }, [rows, visibleSeries]);

  const n = rows.length;
  const W = 100, H = 42;
  const pointsFor = (key: string) => rows.map((r, i) => {
    const x = n > 1 ? (i / (n - 1)) * W : W / 2;
    const y = H - ((Number(r[key]) || 0) / max) * H;
    return [x, y] as const;
  });
  const pathFor = (key: string) => pointsFor(key).map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const areaFor = (key: string) => {
    const pts = pointsFor(key);
    if (!pts.length) return "";
    return `${pathFor(key)} L${pts[pts.length - 1][0].toFixed(2)},${H} L${pts[0][0].toFixed(2)},${H} Z`;
  };
  const barGroupW = n > 0 ? W / n : W;
  const barW = visibleSeries.length > 0 ? (barGroupW * 0.7) / visibleSeries.length : 0;

  const VIEWS = [
    { id: "table", label: "Tabla" },
    { id: "tree", label: "Árbol" },
    { id: "chart", label: "Gráfico" },
  ] as const;

  return (
    <div className={cn("rounded-2xl border border-border bg-surface overflow-hidden", className)}>
      <div className="grid lg:grid-cols-[1fr_260px]">
        <div className="p-5">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-1 rounded-full bg-surface-alt p-1">
              {VIEWS.map(v => (
                <button key={v.id} type="button" disabled={v.id === "chart" && chartUnavailable} onClick={() => setView(v.id)}
                  className={cn("h-7 px-3 rounded-full text-[11px] font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed",
                    view === v.id ? "bg-primary text-white" : "text-muted hover:text-foreground")}>
                  {v.label}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => { setRaw(JSON.stringify(SAMPLE, null, 2)); setActiveSeries(null); }}
              className="text-[11px] font-semibold text-muted hover:text-primary transition-colors">Cargar ejemplo</button>
          </div>

          {parseError ? (
            <div className="h-52 rounded-xl border border-dashed border-danger/30 bg-danger/5 flex items-center justify-center px-6">
              <p className="text-xs text-danger text-center leading-relaxed">{parseError}</p>
            </div>
          ) : view === "tree" ? (
            <div className="max-h-[340px] overflow-auto rounded-xl border border-border p-3 bg-surface-alt/20">
              <JsonTreeNode keyName={null} value={parsed} depth={0}/>
            </div>
          ) : view === "table" ? (
            <div className="max-h-[340px] overflow-auto">
              <JsonTable parsed={parsed}/>
            </div>
          ) : chartUnavailable ? (
            <div className="h-52 rounded-xl border border-dashed border-border flex items-center justify-center px-6">
              <p className="text-xs text-muted text-center leading-relaxed">No hay columnas numéricas para graficar. Probá la vista Tabla o Árbol.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-1 mb-3">
                {(["bar", "line", "area"] as const).map(t => (
                  <button key={t} type="button" onClick={() => setChartType(t)}
                    className={cn("h-6 px-2.5 rounded-full text-[10px] font-bold capitalize transition-colors", chartType === t ? "bg-primary/15 text-primary" : "text-muted hover:text-foreground")}>
                    {t === "bar" ? "Barras" : t === "line" ? "Líneas" : "Área"}
                  </button>
                ))}
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-52" onMouseLeave={() => setHover(null)}>
                <line x1="0" y1={H} x2={W} y2={H} stroke="var(--color-border)" strokeWidth="0.4"/>
                {chartType === "bar" && visibleSeries.map((key, si) => (
                  <g key={key}>
                    {rows.map((r, i) => {
                      const val = Number(r[key]) || 0;
                      const h = (val / max) * H;
                      const x = i * barGroupW + (barGroupW - barW * visibleSeries.length) / 2 + si * barW;
                      return (
                        <rect key={i} x={x} y={H - h} width={barW * 0.86} height={h} rx="0.6"
                          fill={SERIES_COLORS[si % SERIES_COLORS.length]}
                          opacity={hover && hover.row === i && hover.series === key ? 1 : 0.85}
                          onMouseEnter={() => setHover({ row: i, series: key })}/>
                      );
                    })}
                  </g>
                ))}
                {chartType === "area" && visibleSeries.map((key, si) => (
                  <path key={key} d={areaFor(key)} fill={SERIES_COLORS[si % SERIES_COLORS.length]} opacity="0.18" stroke="none"/>
                ))}
                {(chartType === "line" || chartType === "area") && visibleSeries.map((key, si) => (
                  <g key={key}>
                    <path d={pathFor(key)} fill="none" stroke={SERIES_COLORS[si % SERIES_COLORS.length]} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
                    {pointsFor(key).map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r={hover && hover.row === i && hover.series === key ? 1.6 : 1}
                        fill={SERIES_COLORS[si % SERIES_COLORS.length]} onMouseEnter={() => setHover({ row: i, series: key })}/>
                    ))}
                  </g>
                ))}
              </svg>

              <div className="mt-2 flex justify-between text-[10px] text-muted px-0.5">
                {rows.map((r, i) => <span key={i} className="truncate max-w-[60px]">{String(r[xKey] ?? "")}</span>)}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {numericKeys.map((k, i) => {
                  const on = visibleSeries.includes(k);
                  return (
                    <button key={k} type="button" onClick={() => toggleSeries(k)}
                      className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold transition-opacity", !on && "opacity-40")}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: SERIES_COLORS[i % SERIES_COLORS.length] }}/>
                      {k}
                    </button>
                  );
                })}
                {hover && (
                  <span className="ml-auto text-[11px] text-foreground font-semibold tabular-nums">
                    {hover.series}: {Number(rows[hover.row]?.[hover.series]).toLocaleString("es-AR")}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="border-t lg:border-t-0 lg:border-l border-border p-4 flex flex-col min-h-0 bg-surface-alt/40">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">JSON de entrada</p>
          <textarea value={raw} onChange={e => setRaw(e.target.value)} spellCheck={false}
            className="flex-1 min-h-[220px] w-full resize-none rounded-xl border border-border bg-surface p-3 text-[11px] font-mono leading-relaxed text-foreground outline-none focus:border-primary transition-colors"/>
        </div>
      </div>
    </div>
  );
}
