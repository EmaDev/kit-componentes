// =============================================================
//  Spreadsheet — preview version (motor de fórmulas incluido)
// =============================================================

function ssColName(c) {
  let s = "", n = c;
  do { s = String.fromCharCode(65 + (n % 26)) + s; n = Math.floor(n/26) - 1; } while (n >= 0);
  return s;
}
function ssColIndex(name) {
  let n = 0;
  for (const ch of name.toUpperCase()) n = n*26 + (ch.charCodeAt(0)-64);
  return n - 1;
}
const ssCellId = (r,c) => `${ssColName(c)}${r+1}`;
function ssParseRef(ref) {
  const m = /^([A-Za-z]+)(\d+)$/.exec(ref.trim());
  return m ? { c: ssColIndex(m[1]), r: parseInt(m[2],10)-1 } : null;
}

const SS_FUNCS = {
  SUM: n => n.reduce((a,b)=>a+b, 0),
  AVERAGE: n => n.length ? n.reduce((a,b)=>a+b,0)/n.length : 0,
  AVG: n => n.length ? n.reduce((a,b)=>a+b,0)/n.length : 0,
  MIN: n => n.length ? Math.min(...n) : 0,
  MAX: n => n.length ? Math.max(...n) : 0,
  COUNT: n => n.length,
  ABS: n => Math.abs(n[0] ?? 0),
  ROUND: n => { const [v,d=0]=n; const f=Math.pow(10,d); return Math.round((v??0)*f)/f; },
};

class SsError extends Error {}

function ssEvaluate(grid, ref, seen = new Set()) {
  const raw = grid[ref];
  if (raw == null || raw === "") return "";
  if (!String(raw).startsWith("=")) return String(raw);
  if (seen.has(ref)) return "#CIRC!";
  const next = new Set(seen); next.add(ref);
  try {
    const v = ssEvalExpr(String(raw).slice(1), grid, next);
    if (!isFinite(v)) return "#DIV/0!";
    return String(Math.round(v*1e10)/1e10);
  } catch (e) {
    return e instanceof SsError ? e.message : "#ERROR!";
  }
}

function ssRangeRefs(from, to) {
  const a = ssParseRef(from), b = ssParseRef(to);
  if (!a || !b) throw new SsError("#REF!");
  const out = [];
  for (let r=Math.min(a.r,b.r); r<=Math.max(a.r,b.r); r++)
    for (let c=Math.min(a.c,b.c); c<=Math.max(a.c,b.c); c++) out.push(ssCellId(r,c));
  return out;
}

function ssEvalExpr(src, grid, seen) {
  let i = 0; const s = src;
  const ws = () => { while (i<s.length && s[i]===" ") i++; };
  const peek = () => { ws(); return s[i]; };

  const cellNum = ref => {
    const shown = ssEvaluate(grid, ref, seen);
    if (shown === "") return 0;
    if (shown.startsWith("#")) throw new SsError(shown);
    const n = parseFloat(shown.replace(",","."));
    return isNaN(n) ? 0 : n;
  };

  const parseArgs = () => {
    const args = []; ws();
    if (peek() === ")") { i++; return args; }
    for (;;) {
      ws();
      const m = /^([A-Za-z]+\d+)\s*:\s*([A-Za-z]+\d+)/.exec(s.slice(i));
      if (m) {
        i += m[0].length;
        for (const ref of ssRangeRefs(m[1], m[2])) {
          const shown = ssEvaluate(grid, ref, seen);
          if (shown.startsWith("#")) throw new SsError(shown);
          if (shown !== "") { const n = parseFloat(shown.replace(",",".")); if (!isNaN(n)) args.push(n); }
        }
      } else args.push(parseSum());
      ws();
      if (peek()===";" || peek()===",") { i++; continue; }
      break;
    }
    ws();
    if (s[i] !== ")") throw new SsError("#ERROR!");
    i++;
    return args;
  };

  const parseAtom = () => {
    ws();
    const ch = s[i];
    if (ch === "(") { i++; const v = parseSum(); ws(); if (s[i]!==")") throw new SsError("#ERROR!"); i++; return v; }
    if (ch === "-") { i++; return -parseAtom(); }
    if (ch === "+") { i++; return parseAtom(); }
    const fn = /^([A-Za-z]+)\s*\(/.exec(s.slice(i));
    if (fn) {
      const name = fn[1].toUpperCase();
      if (!SS_FUNCS[name]) throw new SsError("#NAME?");
      i += fn[0].length;
      return SS_FUNCS[name](parseArgs());
    }
    const ref = /^[A-Za-z]+\d+/.exec(s.slice(i));
    if (ref) { i += ref[0].length; return cellNum(ref[0].toUpperCase()); }
    const num = /^\d+(\.\d+)?/.exec(s.slice(i));
    if (num) { i += num[0].length; return parseFloat(num[0]); }
    throw new SsError("#ERROR!");
  };
  const parsePow = () => { let v = parseAtom(); ws(); while (s[i]==="^") { i++; v = Math.pow(v, parseAtom()); ws(); } return v; };
  const parseMul = () => {
    let v = parsePow(); ws();
    while (s[i]==="*" || s[i]==="/") { const op = s[i++]; const r = parsePow(); v = op==="*" ? v*r : v/r; ws(); }
    return v;
  };
  const parseSum = () => {
    let v = parseMul(); ws();
    while (s[i]==="+" || s[i]==="-") { const op = s[i++]; const r = parseMul(); v = op==="+" ? v+r : v-r; ws(); }
    return v;
  };

  const out = parseSum(); ws();
  if (i < s.length) throw new SsError("#ERROR!");
  return out;
}

function PreviewSpreadsheet({
  rows = 20, cols = 7, initial = {}, colWidth = 104, rowHeight = 32,
  height = "420px", showFormulaBar = true, showStatusBar = true, headerRow = false,
}) {
  const [grid, setGrid] = useState(initial);
  const [cursor, setCursor] = useState({ r:0, c:0 });
  const [anchor, setAnchor] = useState({ r:0, c:0 });
  const [editing, setEditing] = useState(null);
  const [copied, setCopied] = useState(null);
  const hist = useRef([]); const fut = useRef([]);
  const gridRef = useRef(null); const editorRef = useRef(null);

  const range = useMemo(() => ({
    r1: Math.min(anchor.r, cursor.r), r2: Math.max(anchor.r, cursor.r),
    c1: Math.min(anchor.c, cursor.c), c2: Math.max(anchor.c, cursor.c),
  }), [anchor, cursor]);
  const inRange = (r,c) => r>=range.r1 && r<=range.r2 && c>=range.c1 && c<=range.c2;

  const commit = next => { hist.current = [...hist.current.slice(-49), grid]; fut.current = []; setGrid(next); };
  const rawOf = (r,c) => grid[ssCellId(r,c)] ?? "";
  const displayOf = (r,c) => ssEvaluate(grid, ssCellId(r,c));

  const setCell = (r,c,value) => {
    const next = { ...grid }; const id = ssCellId(r,c);
    if (value === "") delete next[id]; else next[id] = value;
    commit(next);
  };
  const clearRange = () => {
    const next = { ...grid };
    for (let r=range.r1; r<=range.r2; r++) for (let c=range.c1; c<=range.c2; c++) delete next[ssCellId(r,c)];
    commit(next);
  };
  const undo = () => { const p = hist.current.pop(); if (!p) return; fut.current = [grid, ...fut.current]; setGrid(p); };
  const redo = () => { const [n, ...rest] = fut.current; if (!n) return; fut.current = rest; hist.current = [...hist.current, grid]; setGrid(n); };

  const move = (dr,dc,extend=false) => {
    const r = Math.max(0, Math.min(rows-1, cursor.r+dr));
    const c = Math.max(0, Math.min(cols-1, cursor.c+dc));
    setCursor({ r, c });
    if (!extend) setAnchor({ r, c });
  };
  const goTo = (r,c,extend=false) => {
    const rr = Math.max(0, Math.min(rows-1, r)), cc = Math.max(0, Math.min(cols-1, c));
    setCursor({ r:rr, c:cc });
    if (!extend) setAnchor({ r:rr, c:cc });
  };

  const selectionToTsv = () => {
    const lines = [];
    for (let r=range.r1; r<=range.r2; r++) {
      const row = [];
      for (let c=range.c1; c<=range.c2; c++) row.push(grid[ssCellId(r,c)] ?? "");
      lines.push(row.join("\t"));
    }
    return lines.join("\n");
  };
  const pasteTsv = text => {
    const lines = text.replace(/\r/g,"").split("\n");
    if (lines.at(-1) === "") lines.pop();
    const next = { ...grid };
    lines.forEach((line,dr) => line.split("\t").forEach((val,dc) => {
      const r = cursor.r+dr, c = cursor.c+dc;
      if (r>=rows || c>=cols) return;
      const id = ssCellId(r,c);
      if (val === "") delete next[id]; else next[id] = val;
    }));
    commit(next);
  };

  const stats = useMemo(() => {
    const nums = []; let count = 0;
    for (let r=range.r1; r<=range.r2; r++) for (let c=range.c1; c<=range.c2; c++) {
      const shown = ssEvaluate(grid, ssCellId(r,c));
      if (shown === "") continue;
      count++;
      const n = parseFloat(shown.replace(",","."));
      if (!isNaN(n)) nums.push(n);
    }
    const sum = nums.reduce((a,b)=>a+b,0);
    return {
      count, numeric: nums.length,
      sum: Math.round(sum*1e10)/1e10,
      avg: nums.length ? Math.round(sum/nums.length*1e10)/1e10 : 0,
      cells: (range.r2-range.r1+1)*(range.c2-range.c1+1),
    };
  }, [grid, range]);

  useEffect(() => { if (editing) editorRef.current?.focus(); }, [editing]);

  const activeId = ssCellId(cursor.r, cursor.c);
  const startEdit = draft => setEditing({ r:cursor.r, c:cursor.c, draft: draft ?? rawOf(cursor.r, cursor.c) });
  const commitEdit = (dir = "down") => {
    if (!editing) return;
    setCell(editing.r, editing.c, editing.draft.trim());
    setEditing(null);
    if (dir === "down") move(1,0);
    if (dir === "right") move(0,1);
    gridRef.current?.focus();
  };

  const onKeyDown = async e => {
    const meta = e.metaKey || e.ctrlKey;
    if (editing) {
      if (e.key === "Enter") { e.preventDefault(); commitEdit(e.shiftKey ? "none" : "down"); }
      else if (e.key === "Tab") { e.preventDefault(); commitEdit("right"); }
      else if (e.key === "Escape") { e.preventDefault(); setEditing(null); gridRef.current?.focus(); }
      return;
    }
    const nav = { ArrowUp:[-1,0], ArrowDown:[1,0], ArrowLeft:[0,-1], ArrowRight:[0,1] };
    if (nav[e.key]) {
      e.preventDefault();
      const [dr,dc] = nav[e.key];
      if (meta) goTo(dr===0 ? cursor.r : dr<0 ? 0 : rows-1, dc===0 ? cursor.c : dc<0 ? 0 : cols-1, e.shiftKey);
      else move(dr,dc,e.shiftKey);
      return;
    }
    switch (e.key) {
      case "Tab": e.preventDefault(); move(0, e.shiftKey ? -1 : 1); return;
      case "Enter": case "F2": e.preventDefault(); startEdit(); return;
      case "Escape": e.preventDefault(); setCopied(null); return;
      case "Delete": case "Backspace": e.preventDefault(); clearRange(); return;
      case "Home": e.preventDefault(); goTo(meta ? 0 : cursor.r, 0, e.shiftKey); return;
      case "End": e.preventDefault(); goTo(meta ? rows-1 : cursor.r, cols-1, e.shiftKey); return;
    }
    if (meta) {
      const k = e.key.toLowerCase();
      if (k === "a") { e.preventDefault(); setAnchor({r:0,c:0}); goTo(rows-1, cols-1, true); return; }
      if (k === "c" || k === "x") {
        e.preventDefault();
        try { await navigator.clipboard.writeText(selectionToTsv()); } catch {}
        setCopied(`${ssCellId(range.r1,range.c1)}:${ssCellId(range.r2,range.c2)}`);
        if (k === "x") clearRange();
        return;
      }
      if (k === "v") {
        e.preventDefault();
        try { const t = await navigator.clipboard.readText(); if (t) pasteTsv(t); } catch {}
        setCopied(null); return;
      }
      if (k === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
      if (k === "y") { e.preventDefault(); redo(); return; }
      return;
    }
    if (e.key.length === 1 && !e.altKey) { e.preventDefault(); startEdit(e.key); }
  };

  const headerH = 28, gutterW = 44;

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden select-none">
      {showFormulaBar && (
        <div className="flex items-stretch border-b border-border bg-surface-alt/40">
          <div className="w-[76px] shrink-0 flex items-center justify-center border-r border-border">
            <span className="text-xs font-mono font-semibold text-foreground">{activeId}</span>
          </div>
          <div className="w-8 shrink-0 flex items-center justify-center border-r border-border text-muted">
            <span className="text-[13px] italic" style={{ fontFamily:"serif" }}>fx</span>
          </div>
          <input
            value={editing ? editing.draft : rawOf(cursor.r, cursor.c)}
            onChange={e=>setEditing({ r:cursor.r, c:cursor.c, draft:e.target.value })}
            onKeyDown={e=>{
              if (e.key === "Enter") { e.preventDefault(); commitEdit("down"); e.currentTarget.blur(); }
              if (e.key === "Escape") { setEditing(null); e.currentTarget.blur(); }
            }}
            placeholder="Escribí un valor o =SUM(A1:A5)"
            className="flex-1 h-9 px-3 bg-transparent text-sm font-mono text-foreground placeholder:text-muted outline-none"/>
        </div>
      )}

      <div ref={gridRef} tabIndex={0} onKeyDown={onKeyDown} role="grid"
        className="relative overflow-auto outline-none focus:ring-2 focus:ring-primary/30"
        style={{ height }}>
        <div style={{ width: gutterW + cols*colWidth, position:"relative" }}>
          <div className="flex sticky top-0 z-20">
            <div className="sticky left-0 z-30 shrink-0 border-r border-b border-border bg-surface-alt"
              style={{ width:gutterW, height:headerH }}/>
            {Array.from({length:cols}, (_,c) => {
              const active = c>=range.c1 && c<=range.c2;
              return (
                <div key={c}
                  onPointerDown={()=>{ setAnchor({r:0,c}); goTo(rows-1, c, true); gridRef.current?.focus(); }}
                  className={cx("shrink-0 flex items-center justify-center border-r border-b border-border text-[11px] font-semibold cursor-pointer transition-colors",
                    active ? "bg-primary/12 text-primary" : "bg-surface-alt text-muted hover:bg-surface-alt/70")}
                  style={{ width:colWidth, height:headerH }}>
                  {ssColName(c)}
                </div>
              );
            })}
          </div>

          {Array.from({length:rows}, (_,r) => {
            const rowActive = r>=range.r1 && r<=range.r2;
            return (
              <div key={r} className="flex">
                <div onPointerDown={()=>{ setAnchor({r,c:0}); goTo(r, cols-1, true); gridRef.current?.focus(); }}
                  className={cx("sticky left-0 z-10 shrink-0 flex items-center justify-center border-r border-b border-border text-[11px] font-semibold tabular-nums cursor-pointer transition-colors",
                    rowActive ? "bg-primary/12 text-primary" : "bg-surface-alt text-muted hover:bg-surface-alt/70")}
                  style={{ width:gutterW, height:rowHeight }}>
                  {r+1}
                </div>
                {Array.from({length:cols}, (_,c) => {
                  const isCursor = cursor.r===r && cursor.c===c;
                  const isSel = inRange(r,c);
                  const isEditing = editing?.r===r && editing?.c===c;
                  const shown = displayOf(r,c);
                  const isError = shown.startsWith("#");
                  const numeric = shown !== "" && !isNaN(parseFloat(shown)) && !isError;
                  const isHeaderCell = headerRow && r===0;
                  return (
                    <div key={c}
                      onPointerDown={e=>{ if (editing) commitEdit("none"); goTo(r,c,e.shiftKey); gridRef.current?.focus(); }}
                      onDoubleClick={()=>startEdit()}
                      className={cx("relative shrink-0 border-r border-b border-border px-2 flex items-center overflow-hidden",
                        isHeaderCell && "bg-surface-alt/70 font-semibold",
                        isSel && !isCursor && "bg-primary/[0.07]",
                        isCursor && "z-10",
                        numeric ? "justify-end tabular-nums" : "justify-start",
                        isError && "text-danger")}
                      style={{ width:colWidth, height:rowHeight }}>
                      {isEditing ? (
                        <input ref={editorRef} value={editing.draft}
                          onChange={e=>setEditing({ ...editing, draft:e.target.value })}
                          onBlur={()=>commitEdit("none")}
                          className="absolute inset-0 w-full h-full px-2 bg-surface border-2 border-primary text-sm font-mono text-foreground outline-none z-20"/>
                      ) : (
                        <span className="text-[13px] truncate w-full" style={{ textAlign: numeric ? "right" : "left" }}>{shown}</span>
                      )}
                      {isCursor && !isEditing && (
                        <span className="absolute inset-0 border-2 border-primary pointer-events-none">
                          <span className="absolute -bottom-[3px] -right-[3px] w-1.5 h-1.5 bg-primary rounded-[1px]"/>
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
            {range.r1===range.r2 && range.c1===range.c2
              ? activeId
              : `${ssCellId(range.r1,range.c1)}:${ssCellId(range.r2,range.c2)}`}
          </span>
          {stats.cells > 1 && (
            <>
              <span>Celdas: <b className="text-foreground font-semibold tabular-nums">{stats.cells}</b></span>
              <span>Con datos: <b className="text-foreground font-semibold tabular-nums">{stats.count}</b></span>
              {stats.numeric > 0 && (
                <>
                  <span>Suma: <b className="text-foreground font-semibold tabular-nums">{stats.sum}</b></span>
                  <span>Promedio: <b className="text-foreground font-semibold tabular-nums">{stats.avg}</b></span>
                </>
              )}
            </>
          )}
          {copied && <span className="text-primary font-semibold">Copiado {copied}</span>}
          <span className="ml-auto hidden sm:inline">F2 editar · ⌘C/V copiar · ⌘Z deshacer · ⇧+flechas rango</span>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { PreviewSpreadsheet, ssEvaluate, ssCellId, ssColName });
