// =============================================================
//  Interacción & feedback — preview versions
//  Breadcrumbs · Checkbox · CreditCard (flip) · FAB · Stepper · Progress
// =============================================================

// ---- Breadcrumbs -------------------------------------------------
function PreviewBreadcrumbs({ items, maxItems = 4, onNavigate }) {
  const collapsed = items.length > maxItems;
  const shown = collapsed ? [items[0], "ellipsis", ...items.slice(-2)] : items;
  const sep = <span className="text-muted/50 shrink-0">{I.chevRight}</span>;
  return (
    <nav aria-label="Ruta" className="flex items-center gap-1 min-w-0">
      <ol className="flex items-center gap-1 min-w-0">
        {shown.map((item, i) => {
          const isLast = i === shown.length - 1;
          if (item === "ellipsis") return (
            <React.Fragment key="e">
              <li><span title={items.slice(1,-2).map(c=>c.label).join(" / ")}
                className="px-1.5 h-7 inline-flex items-center rounded-md text-muted hover:text-foreground hover:bg-surface-alt transition-colors text-sm font-semibold">…</span></li>
              <li aria-hidden>{sep}</li>
            </React.Fragment>
          );
          return (
            <React.Fragment key={i}>
              <li className="min-w-0">
                {isLast ? (
                  <span aria-current="page" className="inline-flex items-center gap-1.5 px-1.5 h-7 text-sm font-semibold text-foreground truncate">
                    {item.icon}<span className="truncate">{item.label}</span>
                  </span>
                ) : (
                  <a href="#" onClick={e=>{e.preventDefault(); onNavigate?.(item,i);}}
                    className="inline-flex items-center gap-1.5 px-1.5 h-7 rounded-md text-sm text-muted hover:text-foreground hover:bg-surface-alt active:scale-95 transition-all truncate">
                    {item.icon}<span className="truncate">{item.label}</span>
                  </a>
                )}
              </li>
              {!isLast && <li aria-hidden>{sep}</li>}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

// ---- Checkbox ----------------------------------------------------
const CB_SIZES = { sm:{box:16,text:"text-[13px]",r:"rounded-[4px]"}, md:{box:20,text:"text-sm",r:"rounded-[6px]"}, lg:{box:24,text:"text-base",r:"rounded-[7px]"} };
const CB_TONES = { primary:"bg-primary border-primary", success:"bg-success border-success", danger:"bg-danger border-danger" };

function PreviewCheckbox({ checked, onChange, indeterminate=false, label, description, disabled=false, size="md", tone="primary", error }) {
  const s = CB_SIZES[size];
  const on = checked || indeterminate;
  return (
    <div>
      <div className="flex items-start gap-2.5">
        <button type="button" role="checkbox" aria-checked={indeterminate ? "mixed" : checked} disabled={disabled}
          onClick={()=>onChange(!checked)}
          className={cx("relative shrink-0 border-2 flex items-center justify-center transition-all mt-0.5 active:scale-90",
            s.r, on ? `${CB_TONES[tone]} text-white` : "border-border bg-surface hover:border-muted",
            error && !on && "border-danger", disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer")}
          style={{ width:s.box, height:s.box }}>
          {indeterminate ? (
            <span className="block bg-current rounded-full" style={{ width:s.box*0.5, height:2, animation:"splashPop 0.15s both" }}/>
          ) : checked ? (
            <svg width={s.box*0.68} height={s.box*0.68} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation:"splashPop 0.2s both" }}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : null}
        </button>
        {(label || description) && (
          <label onClick={()=>!disabled && onChange(!checked)}
            className={cx("min-w-0 select-none", disabled ? "opacity-40" : "cursor-pointer")}>
            {label && <span className={cx("block font-medium text-foreground", s.text)}>{label}</span>}
            {description && <span className="block text-xs text-muted mt-0.5 leading-relaxed">{description}</span>}
          </label>
        )}
      </div>
      {error && <p className="text-xs text-danger mt-1.5 pl-[30px]" style={{ animation:"fadeInUp 0.2s both" }}>{error}</p>}
    </div>
  );
}

function PreviewCheckboxGroup({ options, value, onChange, label, selectAllLabel, size="md", tone="primary" }) {
  const selectable = options.filter(o=>!o.disabled).map(o=>o.value);
  const allOn = selectable.length>0 && selectable.every(v=>value.includes(v));
  const someOn = selectable.some(v=>value.includes(v)) && !allOn;
  return (
    <div role="group">
      {label && <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2.5">{label}</p>}
      <div className="flex flex-col gap-2.5">
        {selectAllLabel && (
          <>
            <PreviewCheckbox checked={allOn} indeterminate={someOn} size={size} tone={tone}
              label={<span className="font-semibold">{selectAllLabel}</span>}
              onChange={()=>onChange(allOn ? [] : selectable)}/>
            <div className="h-px bg-border"/>
          </>
        )}
        {options.map(o => (
          <PreviewCheckbox key={o.value} checked={value.includes(o.value)} size={size} tone={tone}
            label={o.label} description={o.description} disabled={o.disabled}
            onChange={()=>onChange(value.includes(o.value) ? value.filter(x=>x!==o.value) : [...value, o.value])}/>
        ))}
      </div>
    </div>
  );
}

// ---- CreditCard (flip) -------------------------------------------
const CARD_THEMES = {
  dark:  "linear-gradient(135deg,#1f2937 0%,#0b1220 100%)",
  brand: "linear-gradient(135deg,var(--color-primary) 0%,var(--color-accent) 100%)",
  steel: "linear-gradient(135deg,#64748b 0%,#334155 100%)",
};

function PreviewBrandMark({ brand }) {
  if (brand === "mastercard") return (
    <span className="shrink-0 flex items-center">
      <span className="w-6 h-6 rounded-full bg-[#eb001b]"/>
      <span className="w-6 h-6 rounded-full bg-[#f79e1b] -ml-3" style={{ mixBlendMode:"hard-light" }}/>
    </span>
  );
  if (brand === "visa") return <span className="shrink-0 text-[17px] font-black italic tracking-tight">VISA</span>;
  if (brand === "amex") return <span className="shrink-0 text-[11px] font-black leading-none text-right">AMERICAN<br/>EXPRESS</span>;
  return (
    <span className="shrink-0 flex gap-1">
      <span className="w-5 h-5 rounded-full bg-white/25"/>
      <span className="w-5 h-5 rounded-full bg-white/40 -ml-2.5"/>
    </span>
  );
}

function PreviewCreditCard({ data, theme="dark", masked=false, className="" }) {
  const [flipped, setFlipped] = useState(false);
  const bg = CARD_THEMES[theme] ?? theme;
  const groups = data.number.replace(/\s+/g,"").match(/.{1,4}/g) ?? [];
  const shown = masked ? groups.map((g,i)=> i<groups.length-1 ? "••••" : g) : groups;
  const face = "absolute inset-0 rounded-2xl overflow-hidden text-white shadow-xl shadow-black/25";

  return (
    <div className={cx("relative select-none cursor-pointer", className)}
      style={{ perspective:1400, aspectRatio:"1.586" }}
      onClick={()=>setFlipped(f=>!f)} role="button" tabIndex={0}
      onKeyDown={e=>{ if(e.key==="Enter"||e.key===" "){e.preventDefault(); setFlipped(f=>!f);} }}>
      <div className="relative w-full h-full"
        style={{ transformStyle:"preserve-3d", transform: flipped ? "rotateY(180deg)" : "none",
                 transition:"transform 0.65s cubic-bezier(0.34,1.36,0.64,1)" }}>
        {/* frente */}
        <div className={face} style={{ background:bg, backfaceVisibility:"hidden" }}>
          <span className="absolute -right-10 -top-16 w-52 h-52 rounded-full bg-white/10"/>
          <span className="absolute -right-24 -top-4 w-52 h-52 rounded-full bg-white/[0.06]"/>
          <div className="relative h-full p-5 flex flex-col">
            <div className="flex items-start justify-between">
              <span className="w-11 h-8 rounded-[5px] bg-gradient-to-br from-[#f7e7a1] to-[#c9a94a]"/>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">{data.label ?? "Débito"}</span>
            </div>
            <div className="mt-auto">
              <div className="flex items-center gap-3 font-mono text-[19px] tracking-[0.12em] tabular-nums">
                {shown.map((g,i)=><span key={i}>{g}</span>)}
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/50">Titular</p>
                  <p className="text-[13px] font-semibold uppercase tracking-wide truncate">{data.holder}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/50">Vence</p>
                  <p className="text-[13px] font-semibold tabular-nums">{data.expiry}</p>
                </div>
                <PreviewBrandMark brand={data.brand ?? "generic"}/>
              </div>
            </div>
          </div>
        </div>
        {/* dorso */}
        <div className={face} style={{ background:bg, backfaceVisibility:"hidden", transform:"rotateY(180deg)" }}>
          <div className="relative h-full flex flex-col">
            <div className="h-11 mt-5 bg-black/70"/>
            <div className="px-5 mt-4">
              <div className="rounded-md bg-white h-9 flex items-center justify-end px-3 gap-3">
                <span className="flex-1 h-4 rounded-sm" style={{ background:"repeating-linear-gradient(45deg,#e2e8f0 0 6px,#f8fafc 6px 12px)" }}/>
                <span className="font-mono text-[13px] font-bold text-[#0f172a] tabular-nums">{data.cvc}</span>
              </div>
              <p className="text-[9px] text-white/50 mt-2 uppercase tracking-[0.14em]">Código de seguridad</p>
            </div>
            <p className="mt-auto p-5 text-[9px] leading-relaxed text-white/40">
              Esta tarjeta es propiedad del emisor. El uso implica la aceptación de los términos vigentes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- FloatingButton (FAB) ----------------------------------------
const FAB_TONE = {
  primary:"bg-primary text-white shadow-primary/30", accent:"bg-accent text-white shadow-accent/30",
  success:"bg-success text-white shadow-success/30", danger:"bg-danger text-white shadow-danger/30",
};

function PreviewFab({ actions, tone="primary", size="lg", extended=false, label, scrollRef, onClick }) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const el = scrollRef?.current;
    if (!el) return;
    lastY.current = el.scrollTop;
    const onScroll = () => {
      const y = el.scrollTop, delta = y - lastY.current;
      if (Math.abs(delta) < 8) return;
      setHidden(delta > 0 && y > 60);
      if (delta > 0) setOpen(false);
      lastY.current = y;
    };
    el.addEventListener("scroll", onScroll, { passive:true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollRef]);

  const dim = size === "lg" ? 56 : 48;
  const hasActions = !!actions?.length;

  return (
    <div className="absolute bottom-4 right-4 z-[90] flex flex-col gap-3 items-end pointer-events-none">
      {open && hasActions && actions.map((a,i) => (
        <button key={a.label} onClick={()=>{ a.onClick?.(); setOpen(false); }}
          className="pointer-events-auto flex items-center gap-3"
          style={{ animation:`splashRise 0.3s ${i*0.045}s cubic-bezier(0.34,1.36,0.64,1) both` }}>
          <span className="rounded-lg bg-foreground text-surface text-xs font-semibold px-2.5 py-1.5 shadow-lg whitespace-nowrap">{a.label}</span>
          <span className={cx("w-11 h-11 rounded-full grid place-items-center shadow-lg", FAB_TONE[a.tone ?? "primary"])}>{a.icon}</span>
        </button>
      ))}

      <button onClick={()=> hasActions ? setOpen(o=>!o) : onClick?.()}
        aria-label={label} aria-expanded={hasActions ? open : undefined}
        className={cx("pointer-events-auto rounded-full grid place-items-center shadow-xl active:scale-90 transition-all",
          FAB_TONE[tone], extended && "px-5 gap-2 flex w-auto")}
        style={{ height:dim, width: extended ? undefined : dim,
                 transform: hidden ? "translateY(120px) scale(0.85)" : "none",
                 opacity: hidden ? 0 : 1,
                 transition:"transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease" }}>
        <span className="grid place-items-center transition-transform" style={{ transform: open ? "rotate(135deg)" : "none" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>
        {extended && label && <span className="text-sm font-semibold whitespace-nowrap">{label}</span>}
      </button>

      {open && hasActions && (
        <div onClick={()=>setOpen(false)}
          className="absolute inset-0 -z-10 bg-black/20 pointer-events-auto"
          style={{ position:"fixed", animation:"fadeIn 0.2s both" }}/>
      )}
    </div>
  );
}

// ---- Stepper -----------------------------------------------------
const ST_S = { sm:{btn:28,font:"text-[13px]",num:32}, md:{btn:36,font:"text-sm",num:40}, lg:{btn:44,font:"text-base",num:52} };

function StSpin() {
  return <span className="inline-block w-[15px] h-[15px] rounded-full border-2 border-current border-t-transparent" style={{ animation:"spin 0.7s linear infinite" }}/>;
}
function StPlus({ size="md" }) {
  const d = { sm:14, md:16, lg:20 }[size];
  return <svg width={d} height={d} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function StMinus({ size="md" }) {
  const d = { sm:14, md:16, lg:20 }[size];
  return <svg width={d} height={d} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}

function PreviewStepper({ value, onChange, min=0, max=99, step=1, size="md", variant="solid", collapsible=false, unit, disabled=false }) {
  const [busy, setBusy] = useState(null);
  const [expanded, setExpanded] = useState(!collapsible || value > min);
  const prev = useRef(value);
  const dir = value > prev.current ? 1 : -1;
  prev.current = value;
  const s = ST_S[size];

  const run = async (kind) => {
    if (disabled || busy) return;
    const next = kind === "inc" ? Math.min(max, value+step) : Math.max(min, value-step);
    if (next === value) return;
    setBusy(kind);
    try { await onChange(next); } finally { setBusy(null); }
    if (collapsible && next <= min) setExpanded(false);
  };

  const shell = { solid:"bg-surface-alt border border-border", outline:"border border-border bg-surface", pill:"bg-surface-alt border border-border rounded-full" }[variant];
  const round = variant === "pill" ? "rounded-full" : "rounded-lg";
  const btn = "relative grid place-items-center shrink-0 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed";

  if (collapsible && !expanded) {
    return (
      <button onClick={()=>{ setExpanded(true); run("inc"); }} disabled={disabled} aria-label="Agregar"
        className={cx(btn, round, "bg-primary text-white shadow-sm shadow-primary/30")}
        style={{ width:s.btn, height:s.btn }}>
        <StPlus size={size}/>
      </button>
    );
  }

  return (
    <div className={cx("inline-flex items-center gap-1 p-1", shell)} role="group" aria-label="Cantidad">
      <button onClick={()=>run("dec")} disabled={disabled || value<=min || busy!==null} aria-label="Restar"
        className={cx(btn, round, "text-foreground hover:bg-surface hover:shadow-sm")} style={{ width:s.btn, height:s.btn }}>
        {busy==="dec" ? <StSpin/> : <StMinus size={size}/>}
      </button>
      <div className="relative overflow-hidden text-center tabular-nums" style={{ width: unit ? s.num+18 : s.num, height:s.btn }}>
        <span key={value} className={cx("absolute inset-0 grid place-items-center font-semibold text-foreground", s.font)}
          style={{ animation:`stNum${dir>0?"Up":"Down"} 0.18s ease-out both` }}>
          {value}{unit && <span className="text-muted ml-0.5 text-[0.85em]">{unit}</span>}
        </span>
      </div>
      <button onClick={()=>run("inc")} disabled={disabled || value>=max || busy!==null} aria-label="Sumar"
        className={cx(btn, round, "text-foreground hover:bg-surface hover:shadow-sm")} style={{ width:s.btn, height:s.btn }}>
        {busy==="inc" ? <StSpin/> : <StPlus size={size}/>}
      </button>
    </div>
  );
}

function PreviewAddButton({ onAdd, label="Agregar", addedLabel="Agregado", size="md" }) {
  const [state, setState] = useState("idle");
  const h = { sm:"h-8 px-3 text-xs", md:"h-10 px-4 text-sm", lg:"h-12 px-5 text-base" }[size];
  const click = async () => {
    if (state !== "idle") return;
    setState("busy");
    try { await onAdd?.(); setState("done"); setTimeout(()=>setState("idle"), 1600); }
    catch { setState("idle"); }
  };
  return (
    <button onClick={click} disabled={state!=="idle"}
      className={cx("inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all active:scale-95", h,
        state==="done" ? "bg-success text-white" : "bg-primary text-white shadow-sm shadow-primary/30 hover:bg-primary-hover")}>
      <span key={state} className="inline-flex items-center gap-2" style={{ animation:"splashRise 0.16s both" }}>
        {state==="busy" ? <StSpin/> : state==="done" ? I.check : <StPlus size="sm"/>}
        {state==="done" ? addedLabel : label}
      </span>
    </button>
  );
}

// ---- Progress ----------------------------------------------------
const PR_FILL = { primary:"bg-primary", accent:"bg-accent", success:"bg-success", danger:"bg-danger" };
const PR_STROKE = { primary:"var(--color-primary)", accent:"var(--color-accent)", success:"var(--color-success)", danger:"var(--color-danger)" };
const PR_H = { xs:3, sm:5, md:8, lg:12 };

function PreviewProgressBar({ value, max=100, tone="primary", size="md", showValue=false, label, striped=false, segments }) {
  const indeterminate = value == null;
  const pct = indeterminate ? 0 : Math.max(0, Math.min(100, value/max*100));
  const h = PR_H[size];
  return (
    <div>
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-3 mb-1.5">
          {label && <span className="text-xs font-medium text-foreground">{label}</span>}
          {showValue && !indeterminate && <span className="text-xs font-semibold text-muted tabular-nums">{Math.round(pct)}%</span>}
        </div>
      )}
      {segments ? (
        <div className="flex items-center gap-1" role="progressbar">
          {Array.from({length:segments}, (_,i) => {
            const filled = !indeterminate && pct >= (i+1)/segments*100 - 0.001;
            return <span key={i} className={cx("flex-1 rounded-full transition-all", filled ? PR_FILL[tone] : "bg-muted")}
              style={{ height:h, opacity: filled ? 1 : 0.18, transitionDelay: filled ? `${i*40}ms` : "0ms" }}/>;
          })}
        </div>
      ) : (
        <div role="progressbar" className="relative w-full rounded-full bg-border overflow-hidden" style={{ height:h }}>
          {indeterminate ? (
            <span className={cx("absolute inset-y-0 w-1/3 rounded-full", PR_FILL[tone])}
              style={{ animation:"prIndet 1.3s ease-in-out infinite" }}/>
          ) : (
            <span className={cx("absolute inset-y-0 left-0 rounded-full overflow-hidden", PR_FILL[tone])}
              style={{ width:`${pct}%`, transition:"width 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
              {striped && (
                <span className="absolute inset-0 rounded-full opacity-25"
                  style={{ backgroundImage:"repeating-linear-gradient(45deg,#fff 0 6px,transparent 6px 12px)", backgroundSize:"17px 17px", animation:"prStripe 0.6s linear infinite" }}/>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function PreviewProgressRing({ value, max=100, size=72, thickness=7, tone="primary", children, showValue=true }) {
  const indeterminate = value == null;
  const pct = indeterminate ? 25 : Math.max(0, Math.min(100, value/max*100));
  const r = (size-thickness)/2, circ = 2*Math.PI*r;
  return (
    <div className="relative inline-grid place-items-center" style={{ width:size, height:size }}>
      <svg width={size} height={size} className="-rotate-90"
        style={indeterminate ? { animation:"spin 1s linear infinite" } : undefined}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={thickness}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={PR_STROKE[tone]} strokeWidth={thickness} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ - pct/100*circ}
          style={{ transition:"stroke-dashoffset 0.5s cubic-bezier(0.16,1,0.3,1)" }}/>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        {children ?? (showValue && !indeterminate && <span className="text-sm font-bold text-foreground tabular-nums">{Math.round(pct)}%</span>)}
      </div>
    </div>
  );
}

function PreviewStepsProgress({ steps, current, tone="primary" }) {
  return (
    <div className="flex items-start">
      {steps.map((s,i) => {
        const done = i < current, active = i === current;
        return (
          <div key={s} className="flex-1 flex flex-col items-center min-w-0">
            <div className="flex items-center w-full">
              <span className={cx("h-0.5 flex-1 rounded-full", i===0 ? "opacity-0" : (done||active) ? PR_FILL[tone] : "bg-border")}/>
              <span className={cx("shrink-0 w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold border-2 transition-all",
                  done && `${PR_FILL[tone]} border-transparent text-white`,
                  active && "bg-surface text-foreground",
                  !done && !active && "bg-surface border-border text-muted")}
                style={{ transform: active ? "scale(1.12)" : "none", borderColor: active ? PR_STROKE[tone] : undefined }}>
                {done ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation:"splashPop 0.2s both" }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : i+1}
              </span>
              <span className={cx("h-0.5 flex-1 rounded-full", i===steps.length-1 ? "opacity-0" : done ? PR_FILL[tone] : "bg-border")}/>
            </div>
            <span className={cx("mt-2 text-[11px] text-center leading-tight px-1 truncate max-w-full", active ? "font-semibold text-foreground" : "text-muted")}>{s}</span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, {
  PreviewBreadcrumbs, PreviewCheckbox, PreviewCheckboxGroup,
  PreviewCreditCard, PreviewFab, PreviewStepper, PreviewAddButton,
  PreviewProgressBar, PreviewProgressRing, PreviewStepsProgress,
});
