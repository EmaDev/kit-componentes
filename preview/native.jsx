// =============================================================
//  Native shell — preview: safe areas, inmersivo, teclado, haptics
// =============================================================

const HAPTIC_PATTERNS = {
  selection: [8], tap: [12],
  impactLight: [10], impactMedium: [22], impactHeavy: [38],
  success: [14, 60, 26], warning: [26, 70, 26],
  error: [38, 60, 38, 60, 38], toggle: [10, 40, 10],
};

// ---- Visualizador de safe areas ---------------------------------
function SafeAreaVisualizer({ device = "iphone", edges, gutter = 0, avoidKeyboard = false, keyboard = false }) {
  // insets simuladas por dispositivo (el hook real las lee de env())
  const presets = {
    iphone:  { top: 47, right: 0, bottom: 34, left: 0, label: "iPhone · Dynamic Island" },
    iphoneL: { top: 0, right: 48, bottom: 21, left: 48, label: "iPhone · horizontal" },
    android: { top: 24, right: 0, bottom: 16, left: 0, label: "Android · status bar" },
    flat:    { top: 0, right: 0, bottom: 0, left: 0, label: "Sin insets" },
  };
  const sa = presets[device];
  const on = (e) => edges === "all" || (Array.isArray(edges) && edges.includes(e));
  const kbInset = keyboard ? 210 : 0;

  const pad = {
    paddingTop: on("top") ? sa.top + gutter : 0,
    paddingRight: on("right") ? sa.right + gutter : 0,
    paddingBottom: (on("bottom") ? sa.bottom + gutter : 0) + (avoidKeyboard ? kbInset : 0),
    paddingLeft: on("left") ? sa.left + gutter : 0,
  };

  return (
    <div className="relative w-[260px] h-[520px] rounded-[38px] bg-surface border-[9px] border-foreground/90 overflow-hidden shadow-2xl shadow-black/20 shrink-0">
      {/* zonas inseguras */}
      {["top","right","bottom","left"].map(e => {
        const size = sa[e];
        if (!size) return null;
        const horiz = e === "left" || e === "right";
        return (
          <div key={e} className="absolute bg-danger/12 border-danger/40"
            style={{
              [e]: 0,
              ...(horiz ? { top: 0, bottom: 0, width: size } : { left: 0, right: 0, height: size }),
              [`border${e[0].toUpperCase()}${e.slice(1)}Width`]: 0,
              borderStyle: "dashed",
              borderWidth: horiz ? "0 1px" : "1px 0",
            }}/>
        );
      })}

      {/* notch / island */}
      {device === "iphone" && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 rounded-full bg-foreground/90 z-20"/>
      )}
      {device === "android" && (
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-foreground/90 z-20"/>
      )}
      {/* home indicator */}
      {(device === "iphone" || device === "iphoneL") && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-foreground/40 z-20"/>
      )}

      {/* contenido dentro del SafeArea */}
      <div className="absolute inset-0 flex flex-col" style={{ ...pad, transition: "padding 0.22s cubic-bezier(0.16,1,0.3,1)" }}>
        <div className="flex-1 m-1 rounded-2xl border-2 border-primary bg-primary/[0.07] flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-primary/25 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"/>
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Área segura</span>
          </div>
          <div className="flex-1 p-3 space-y-2 overflow-hidden">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-9 rounded-lg bg-surface border border-border"/>
            ))}
          </div>
          <div className="px-3 pb-2">
            <div className="h-9 rounded-lg bg-primary/80"/>
          </div>
        </div>
      </div>

      {/* teclado simulado */}
      {keyboard && (
        <div className="absolute inset-x-0 bottom-0 z-30 bg-surface-alt border-t border-border"
          style={{ height: 210, animation: "pwaSlideUp 0.28s cubic-bezier(0.16,1,0.3,1)" }}>
          <div className="grid grid-cols-10 gap-1 p-2 h-full content-start">
            {Array.from({length:30}).map((_,i) => (
              <div key={i} className="h-7 rounded bg-surface border border-border"/>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Lectura en vivo del viewport / teclado ---------------------
function ViewportReadout() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const vv = window.visualViewport;
    const sync = () => setData({
      inner: window.innerHeight,
      visual: Math.round(vv?.height ?? window.innerHeight),
      offset: Math.round(vv?.offsetTop ?? 0),
      kb: Math.max(0, Math.round(window.innerHeight - (vv?.height ?? window.innerHeight) - (vv?.offsetTop ?? 0))),
      scroll: Math.round(window.scrollY),
    });
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("scroll", sync, { passive: true });
    vv?.addEventListener("resize", sync);
    vv?.addEventListener("scroll", sync);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("scroll", sync);
      vv?.removeEventListener("resize", sync);
      vv?.removeEventListener("scroll", sync);
    };
  }, []);
  if (!data) return null;

  const rows = [
    { label: "window.innerHeight", value: `${data.inner}px` },
    { label: "visualViewport.height", value: `${data.visual}px` },
    { label: "--app-height", value: `${data.visual}px` },
    { label: "--kb-inset (teclado)", value: `${data.kb}px`, tone: data.kb > 120 ? "warn" : "off" },
  ];
  const dot = { ok: "bg-success", warn: "bg-accent", off: "bg-muted/50" };

  return (
    <dl className="divide-y divide-border rounded-xl border border-border overflow-hidden">
      {rows.map(r => (
        <div key={r.label} className="px-3.5 py-2 flex items-center justify-between gap-4 bg-surface">
          <dt className="text-[11px] text-muted font-mono">{r.label}</dt>
          <dd className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <span className={`w-1.5 h-1.5 rounded-full ${dot[r.tone ?? "ok"]}`}/>
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

Object.assign(window, { SafeAreaVisualizer, ViewportReadout, HAPTIC_PATTERNS });
