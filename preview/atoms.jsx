// =============================================================
//  PREVIEW · Atomic components (versión visual con CSS anims)
//  El código real usa framer-motion; este preview mantiene
//  exactamente el mismo look y comportamiento usando Tailwind.
// =============================================================

const { useState, useEffect, useRef, useId, useMemo, useCallback, createContext, useContext } = React;

// -------------------- Helpers --------------------
const cx = (...c) => c.filter(Boolean).join(" ");

// -------------------- Icons --------------------
const Icon = ({ d, ...p }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    {d}
  </svg>
);
const I = {
  sun:    <Icon d={<g><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></g>}/>,
  moon:   <Icon d={<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>}/>,
  search: <Icon d={<g><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></g>}/>,
  mail:   <Icon d={<g><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></g>}/>,
  lock:   <Icon d={<g><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></g>}/>,
  eye:    <Icon d={<g><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></g>}/>,
  user:   <Icon d={<g><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></g>}/>,
  bell:   <Icon d={<g><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></g>}/>,
  settings:<Icon d={<g><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></g>}/>,
  home:   <Icon d={<g><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></g>}/>,
  layers: <Icon d={<g><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></g>}/>,
  inbox:  <Icon d={<g><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></g>}/>,
  chart:  <Icon d={<g><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></g>}/>,
  more:   <Icon d={<g><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></g>}/>,
  edit:   <Icon d={<g><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></g>}/>,
  copy:   <Icon d={<g><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></g>}/>,
  trash:  <Icon d={<g><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></g>}/>,
  check:  <Icon d={<polyline points="20 6 9 17 4 12"/>}/>,
  chevDown:<Icon d={<polyline points="6 9 12 15 18 9"/>}/>,
  chevLeft:<Icon d={<polyline points="15 18 9 12 15 6"/>}/>,
  chevRight:<Icon d={<polyline points="9 18 15 12 9 6"/>}/>,
  close:  <Icon d={<g><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></g>}/>,
  plus:   <Icon d={<g><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></g>}/>,
  flag:   <Icon d={<g><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></g>}/>,
  zap:    <Icon d={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>}/>,
  github: <Icon d={<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>}/>,
};

// =============================================================
//  COMPONENTES (versión preview con animaciones CSS/transición)
// =============================================================

// ---- Button -----------------------------------------------------
function Button({ variant="primary", size="md", loading=false, leftIcon, rightIcon, fullWidth, ripple=true, children, className="", onClick, ...rest }) {
  const variants = {
    primary:   "bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-px",
    secondary: "bg-surface-alt text-foreground border border-border hover:bg-border/50 hover:-translate-y-px",
    ghost:     "text-foreground hover:bg-surface-alt",
    outline:   "border-2 border-primary text-primary hover:bg-primary hover:text-white",
    danger:    "bg-danger text-white shadow-md shadow-danger/25 hover:brightness-110 hover:-translate-y-px",
    success:   "bg-success text-white shadow-md shadow-success/25 hover:brightness-110 hover:-translate-y-px",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm rounded-lg gap-1.5",
    md: "h-11 px-5 text-sm rounded-xl gap-2",
    lg: "h-13 px-7 text-base rounded-xl gap-2.5",
    icon: "h-11 w-11 rounded-xl",
  };

  const [ripples, setRipples] = useState([]);
  const rippleColor = (variant === "secondary" || variant === "ghost" || variant === "outline")
    ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.45)";

  const handleClick = (e) => {
    if (ripple && !rest.disabled && !loading) {
      const rect = e.currentTarget.getBoundingClientRect();
      const sz = Math.max(rect.width, rect.height) * 2.2;
      const id = Date.now() + Math.random();
      setRipples(prev => [...prev, {
        id,
        x: e.clientX - rect.left - sz/2,
        y: e.clientY - rect.top  - sz/2,
        size: sz,
      }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
    }
    onClick?.(e);
  };

  return (
    <button
      disabled={loading || rest.disabled}
      onClick={handleClick}
      className={cx(
        "relative inline-flex items-center justify-center font-medium overflow-hidden select-none",
        "transition-all duration-200 active:scale-[0.97]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant], sizes[size], fullWidth && "w-full", className
      )}
      {...rest}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={{ borderRadius: "inherit" }}>
        {ripples.map(r => (
          <span key={r.id}
            style={{
              position: "absolute",
              left: r.x, top: r.y,
              width: r.size, height: r.size,
              borderRadius: "9999px",
              background: rippleColor,
              transform: "scale(0)",
              opacity: 0.6,
              animation: "ripple 0.65s cubic-bezier(0.16,1,0.3,1) forwards",
            }}
          />
        ))}
      </span>

      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
            <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"/>
          </svg>
        </span>
      )}
      <span className={cx("inline-flex items-center justify-center relative", sizes[size].includes("gap") && "gap-[inherit]", loading && "opacity-0")}>
        {leftIcon}{children}{rightIcon}
      </span>
    </button>
  );
}

// ---- Input ------------------------------------------------------
function Input({ label, hint, error, leftIcon, rightIcon, className="", placeholder, type="text", defaultValue, ...rest }) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");
  const [shakeKey, setShakeKey] = useState(0);
  useEffect(() => { if (error) setShakeKey(k => k+1); }, [error]);
  const floated = focused || value.length > 0 || !!placeholder;

  return (
    <div className={cx("w-full", className)}>
      <div className="relative">
        {leftIcon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">{leftIcon}</span>}
        <input
          id={id} type={type} value={value} placeholder={focused ? placeholder : ""}
          onChange={(e)=>setValue(e.target.value)}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          key={shakeKey}
          style={error ? { animation: "shake 0.4s" } : undefined}
          className={cx(
            "peer w-full h-12 rounded-xl bg-surface text-foreground",
            "border-2 transition-colors duration-200",
            "px-4 pt-3 pb-1 text-sm outline-none",
            leftIcon && "pl-11",
            rightIcon && "pr-11",
            error ? "border-danger" : focused ? "border-primary" : "border-border hover:border-muted/40",
          )}
          {...rest}
        />
        {label && (
          <label htmlFor={id}
            className={cx(
              "absolute top-1/2 pointer-events-none text-sm font-medium bg-surface px-1 transition-all duration-200",
              leftIcon ? "left-10" : "left-3",
            )}
            style={{
              transform: floated ? "translateY(-22px) scale(0.82)" : "translateY(-50%)",
              transformOrigin: "left center",
              color: error ? "var(--color-danger)" : focused ? "var(--color-primary)" : "var(--color-muted)",
            }}
          >{label}</label>
        )}
        {rightIcon && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">{rightIcon}</span>}
      </div>
      {(error || hint) && (
        <p className={cx("mt-1.5 text-xs pl-1 transition-colors", error ? "text-danger" : "text-muted")}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

// ---- Textarea ---------------------------------------------------
function Textarea({ label, hint, error, maxLength, showCount=false, className="", defaultValue="", ...rest }) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = Math.min(ref.current.scrollHeight, 280) + "px";
  }, [value]);
  const floated = focused || value.length > 0;
  return (
    <div className={cx("w-full", className)}>
      <div className="relative">
        <textarea
          ref={ref} id={id} value={value} maxLength={maxLength} rows={3}
          onChange={(e)=>setValue(e.target.value)}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          className={cx(
            "w-full min-h-[88px] rounded-xl bg-surface text-foreground",
            "border-2 transition-colors duration-200 resize-none",
            "px-4 pt-5 pb-3 text-sm outline-none",
            error ? "border-danger" : focused ? "border-primary" : "border-border hover:border-muted/40",
          )}
          {...rest}
        />
        {label && (
          <label htmlFor={id}
            className="absolute top-3 left-3 pointer-events-none text-sm font-medium bg-surface px-1 transition-all duration-200"
            style={{
              transform: floated ? "translateY(-14px) scale(0.82)" : "translateY(0)",
              transformOrigin: "left center",
              color: error ? "var(--color-danger)" : focused ? "var(--color-primary)" : "var(--color-muted)",
            }}
          >{label}</label>
        )}
      </div>
      <div className="mt-1.5 flex justify-between gap-3 pl-1">
        <p className={cx("text-xs flex-1", error ? "text-danger" : "text-muted")}>{error || hint}</p>
        {showCount && maxLength != null && (
          <span className="text-xs tabular-nums shrink-0" style={{
            color: value.length >= maxLength ? "var(--color-danger)" : value.length > maxLength*0.85 ? "var(--color-accent)" : "var(--color-muted)",
          }}>{value.length}/{maxLength}</span>
        )}
      </div>
    </div>
  );
}

// ---- Select -----------------------------------------------------
function Select({ options, defaultValue, placeholder="Selecciona…", label, className="" }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={cx("relative w-full", className)}>
      {label && <label className="block text-xs font-medium text-muted mb-1.5 pl-1">{label}</label>}
      <button type="button" onClick={()=>setOpen(v=>!v)}
        className={cx(
          "w-full h-12 px-4 rounded-xl text-left flex items-center justify-between gap-2",
          "bg-surface text-foreground border-2 transition-colors duration-200 active:scale-[0.98]",
          open ? "border-primary" : "border-border hover:border-muted/40",
        )}
      >
        <span className="flex items-center gap-2 truncate text-sm">
          {selected?.icon}
          {selected ? <span>{selected.label}</span> : <span className="text-muted">{placeholder}</span>}
        </span>
        <span className="text-muted transition-transform duration-200 shrink-0" style={{ transform: open ? "rotate(180deg)" : "rotate(0)" }}>
          {I.chevDown}
        </span>
      </button>
      <ul className={cx(
          "absolute z-50 mt-2 w-full max-h-64 overflow-auto",
          "rounded-xl border border-border bg-surface shadow-xl shadow-black/5 p-1.5",
          "origin-top transition-all duration-150",
          open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
        )}
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <li key={opt.value}>
              <button type="button"
                onClick={() => { setValue(opt.value); setOpen(false); }}
                className={cx(
                  "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left",
                  "transition-colors duration-150",
                  active ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-surface-alt",
                )}
              >
                {opt.icon}
                <span className="flex-1 truncate">{opt.label}</span>
                {active && <span>{I.check}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---- Dropdown ---------------------------------------------------
function Dropdown({ trigger, items, align="end" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={()=>setOpen(v=>!v)} className="inline-flex">{trigger}</div>
      <div
        className={cx(
          "absolute z-50 mt-2 min-w-[220px] rounded-xl border border-border bg-surface shadow-xl shadow-black/10 p-1.5",
          align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left",
          "transition-all duration-150",
          open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
        )}
      >
        {items.map((item, i) =>
          item.divider ? (
            <div key={i} className="my-1.5 h-px bg-border" />
          ) : (
            <button key={i} type="button" disabled={item.disabled}
              onClick={() => { item.onClick?.(); setOpen(false); }}
              className={cx(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left",
                "transition-colors duration-150 disabled:opacity-40",
                item.destructive ? "text-danger hover:bg-danger/10" : "text-foreground hover:bg-surface-alt",
              )}
            >
              {item.icon && <span className="w-4 h-4 inline-flex items-center justify-center opacity-80">{item.icon}</span>}
              <span className="flex-1 truncate">{item.label}</span>
              {item.shortcut && <span className="text-[11px] text-muted font-mono">{item.shortcut}</span>}
            </button>
          )
        )}
      </div>
    </div>
  );
}

// ---- Spinner ----------------------------------------------------
function Spinner({ variant="ring", size="md", color, label }) {
  const px = { sm: 18, md: 28, lg: 44 }[size];
  const style = { color: color || "var(--color-primary)" };
  return (
    <div className="inline-flex items-center gap-2" style={style}>
      {variant === "ring" && (
        <svg width={px} height={px} viewBox="0 0 50 50" className="animate-spin">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="5"/>
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray="80 200"/>
        </svg>
      )}
      {variant === "dots" && (
        <div className="flex items-center gap-1.5" style={{ height: px }}>
          {[0,1,2].map(i => (
            <span key={i} className="block rounded-full bg-current"
              style={{ width: px/3.5, height: px/3.5, animation: `bounce 0.9s ${i*0.15}s infinite ease-in-out` }}/>
          ))}
        </div>
      )}
      {variant === "pulse" && (
        <div className="relative" style={{ width: px, height: px }}>
          <span className="absolute inset-0 rounded-full bg-current" style={{ animation: "pulse-ring 1.2s infinite ease-out" }}/>
          <span className="absolute inset-0 rounded-full bg-current" style={{ animation: "pulse-ring 1.2s 0.6s infinite ease-out" }}/>
          <span className="absolute inset-[28%] rounded-full bg-current"/>
        </div>
      )}
      {variant === "bars" && (
        <div className="flex items-end gap-1" style={{ height: px }}>
          {[0,1,2,3].map(i => (
            <span key={i} className="block w-[3px] rounded-full bg-current"
              style={{ height: px, transformOrigin: "bottom", animation: `barScale 0.9s ${i*0.12}s infinite ease-in-out` }}/>
          ))}
        </div>
      )}
      {label && <span className="text-sm text-muted">{label}</span>}
    </div>
  );
}

// ---- Toast ------------------------------------------------------
const ToastContext = createContext(null);
function useToast() { return useContext(ToastContext); }
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => setToasts(p => p.filter(t=>t.id!==id)), []);
  const toast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2,9);
    const full = { id, duration: 4000, variant: "info", ...t };
    setToasts(p => [...p, full]);
    if (full.duration > 0) setTimeout(()=>dismiss(id), full.duration);
    return id;
  }, [dismiss]);
  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-[360px] max-w-[calc(100vw-2rem)] pointer-events-none">
        {toasts.map(t => <ToastCard key={t.id} t={t} onClose={()=>dismiss(t.id)}/>)}
      </div>
    </ToastContext.Provider>
  );
}
function ToastCard({ t, onClose }) {
  const [out, setOut] = useState(false);
  const variant = t.variant ?? "info";
  const icons = {
    success: I.check, error: I.close, info: <Icon d={<g><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></g>}/>,
    warning: I.flag,
  };
  const colors = { success: "text-success", error: "text-danger", info: "text-primary", warning: "text-accent" };
  const bars   = { success: "bg-success", error: "bg-danger", info: "bg-primary", warning: "bg-accent" };
  useEffect(() => {
    if (!t.duration) return;
    const cancel = setTimeout(() => setOut(true), t.duration - 200);
    return () => clearTimeout(cancel);
  }, [t.duration]);
  return (
    <div
      className={cx(
        "pointer-events-auto relative overflow-hidden bg-surface border border-border rounded-xl shadow-xl shadow-black/10",
        "p-4 pr-3 flex items-start gap-3 transition-all duration-300",
        out ? "opacity-0 translate-x-[380px] scale-90" : "opacity-100 translate-x-0 scale-100",
      )}
      style={{ animation: "toastIn 0.35s cubic-bezier(0.16,1,0.3,1)" }}
    >
      <span className={cx("mt-0.5 shrink-0", colors[variant])}>{icons[variant]}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight">{t.title}</p>
        {t.description && <p className="mt-0.5 text-xs text-muted leading-relaxed">{t.description}</p>}
      </div>
      <button onClick={()=>{setOut(true); setTimeout(onClose,200);}}
        className="shrink-0 w-7 h-7 rounded-md inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
        <Icon d={<g><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></g>} width="14" height="14"/>
      </button>
      {t.duration > 0 && (
        <span className={cx("absolute bottom-0 left-0 h-[3px]", bars[variant])}
          style={{ animation: `toastBar ${t.duration}ms linear forwards` }}/>
      )}
    </div>
  );
}

// ---- Modal ------------------------------------------------------
function Modal({ open, onClose, title, description, size="md", children, footer }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(()=>setVisible(true));
      const onKey = (e) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    } else if (mounted) {
      setVisible(false);
      const t = setTimeout(()=>setMounted(false), 400);
      return ()=>clearTimeout(t);
    }
  }, [open, onClose]);
  const sizes = { sm:"max-w-sm", md:"max-w-md", lg:"max-w-lg", xl:"max-w-2xl" };
  if (!mounted) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className={cx(
          "absolute inset-0 bg-black/50 transition-all ease-out",
          visible ? "opacity-100 backdrop-blur-md" : "opacity-0 backdrop-blur-none",
        )}
        style={{ transitionDuration: "400ms" }}
      />
      <div className={cx(
          "relative w-full bg-surface text-foreground rounded-2xl shadow-2xl shadow-black/30",
          "border border-border overflow-hidden flex flex-col max-h-[calc(100vh-2rem)]",
          sizes[size], "transition-all ease-out",
          visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2",
        )}
        style={{ transitionDuration: "300ms" }}
      >
        {(title || true) && (
          <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-2">
            <div className="flex-1 min-w-0">
              {title && <h2 className="text-lg font-semibold leading-snug">{title}</h2>}
              {description && <p className="mt-1 text-sm text-muted leading-relaxed">{description}</p>}
            </div>
            <button onClick={onClose}
              className="shrink-0 w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-all hover:rotate-90"
            >{I.close}</button>
          </div>
        )}
        <div className="px-6 py-4 flex-1 overflow-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-border bg-surface-alt/50 flex items-center justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Button, Input, Textarea, Select, Dropdown, Spinner, Modal, ToastProvider, useToast, cx, I, Icon });
