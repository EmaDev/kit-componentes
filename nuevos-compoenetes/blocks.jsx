// =============================================================
//  PREVIEW · Bloques de app (1/2)
//  ChipCarousel · Keypad · PinLock · AmountPad
// =============================================================

const buzz = (ms) => { try { navigator.vibrate?.(ms); } catch {} };

// ---- ChipCarousel -----------------------------------------------
const CHIP_SIZES = {
  sm: { h: 34, pad: "px-3", text: "text-xs", img: 20, radius: 17 },
  md: { h: 42, pad: "px-3.5", text: "text-sm", img: 26, radius: 21 },
  lg: { h: 56, pad: "px-4", text: "text-sm", img: 36, radius: 16 },
};

function PreviewChipCarousel({
  chips, value, onChange, multi = false, variant = "soft", size = "md",
  clearable = true, arrows = true, gap = 8, className = "",
}) {
  const track = useRef(null);
  const drag = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  const s = CHIP_SIZES[size];
  const selected = Array.isArray(value) ? value : value ? [value] : [];

  const readEdges = () => {
    const el = track.current;
    if (!el) return;
    setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
  };

  useEffect(() => {
    readEdges();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(readEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, [chips.length]);

  const toggle = (chip) => {
    if (chip.disabled || drag.current?.moved) return;
    buzz(8);
    if (multi) onChange?.(selected.includes(chip.id) ? selected.filter(v => v !== chip.id) : [...selected, chip.id]);
    else onChange?.(selected[0] === chip.id && clearable ? "" : chip.id);
  };

  const nudge = dir => track.current?.scrollBy({ left: dir * Math.max(160, track.current.clientWidth * 0.7), behavior: "smooth" });

  const chipClasses = on => {
    if (variant === "cover") return on ? "text-white ring-2 ring-primary" : "text-white ring-1 ring-white/15";
    if (variant === "solid") return on ? "bg-primary text-white border-primary shadow-sm shadow-primary/30" : "bg-surface-alt text-foreground border-border hover:bg-border/50";
    if (variant === "outline") return on ? "bg-primary/[0.08] text-primary border-primary" : "bg-transparent text-foreground border-border hover:border-muted/60";
    return on ? "bg-primary/12 text-primary border-primary/30" : "bg-surface-alt/70 text-foreground border-border/70 hover:bg-surface-alt";
  };

  return (
    <div className={cx("relative", className)}>
      <div ref={track} onScroll={readEdges}
        onPointerDown={e => { drag.current = { x: e.clientX, scroll: track.current.scrollLeft, moved: false }; }}
        onPointerMove={e => {
          if (!drag.current) return;
          const dx = e.clientX - drag.current.x;
          if (Math.abs(dx) > 4) drag.current.moved = true;
          track.current.scrollLeft = drag.current.scroll - dx;
        }}
        onPointerUp={() => setTimeout(() => { drag.current = null; }, 0)}
        onPointerCancel={() => { drag.current = null; }}
        className="flex overflow-x-auto snap-x snap-mandatory py-0.5 cursor-grab active:cursor-grabbing"
        style={{ gap, scrollbarWidth: "none", msOverflowStyle: "none", touchAction: "pan-x pan-y" }}
        role="listbox" aria-orientation="horizontal" aria-multiselectable={multi}>
        {chips.map(chip => {
          const on = selected.includes(chip.id);
          if (variant === "cover") {
            return (
              <button key={chip.id} role="option" aria-selected={on} disabled={chip.disabled} onClick={() => toggle(chip)}
                className={cx("relative shrink-0 snap-start overflow-hidden rounded-2xl transition-all active:scale-[0.97] disabled:opacity-40", chipClasses(on))}
                style={{ width: size === "lg" ? 148 : 116, height: size === "lg" ? 92 : 72 }}>
                {chip.image && <img src={chip.image} alt="" draggable={false} className="absolute inset-0 w-full h-full object-cover"/>}
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"/>
                <span className="absolute inset-x-0 bottom-0 p-2 text-left">
                  <span className="flex items-center gap-1.5">
                    {chip.icon && <span className="opacity-90 [&_svg]:w-3.5 [&_svg]:h-3.5">{chip.icon}</span>}
                    <span className="text-xs font-semibold leading-tight truncate">{chip.label}</span>
                  </span>
                  {chip.sub && <span className="block text-[10px] text-white/70 truncate">{chip.sub}</span>}
                </span>
              </button>
            );
          }
          return (
            <button key={chip.id} role="option" aria-selected={on} disabled={chip.disabled} onClick={() => toggle(chip)}
              className={cx("shrink-0 snap-start inline-flex items-center border font-semibold select-none transition-all active:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none",
                s.pad, s.text, chipClasses(on))}
              style={{ height: s.h, borderRadius: s.radius, gap: size === "sm" ? 6 : 8 }}>
              {chip.image ? (
                <img src={chip.image} alt="" draggable={false} className="rounded-full object-cover shrink-0 -ml-1" style={{ width: s.img, height: s.img }}/>
              ) : chip.icon ? (
                <span className="shrink-0 opacity-90 [&_svg]:w-[1.05em] [&_svg]:h-[1.05em]">{chip.icon}</span>
              ) : null}
              <span className="flex flex-col items-start leading-tight min-w-0">
                <span className="truncate">{chip.label}</span>
                {chip.sub && size === "lg" && <span className={cx("text-[11px] font-medium", on ? "opacity-70" : "text-muted")}>{chip.sub}</span>}
              </span>
              {chip.count != null && (
                <span className={cx("rounded-full px-1.5 text-[10px] font-bold tabular-nums", on ? "bg-black/10" : "bg-foreground/10 text-muted")}>{chip.count}</span>
              )}
            </button>
          );
        })}
      </div>

      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-8 transition-opacity"
        style={{ opacity: edges.left ? 1 : 0, background: "linear-gradient(90deg, var(--color-surface), transparent)" }}/>
      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-8 transition-opacity"
        style={{ opacity: edges.right ? 1 : 0, background: "linear-gradient(270deg, var(--color-surface), transparent)" }}/>

      {arrows && [["left", edges.left], ["right", edges.right]].map(([side, show]) => show ? (
        <button key={side} onClick={() => nudge(side === "left" ? -1 : 1)} aria-label={side === "left" ? "Anterior" : "Siguiente"}
          className={cx("hidden sm:grid place-items-center absolute top-1/2 -translate-y-1/2 w-7 h-7 rounded-full z-10 bg-surface/90 backdrop-blur border border-border text-foreground shadow-md shadow-black/10 hover:bg-surface active:scale-90 transition-all",
            side === "left" ? "-left-1" : "-right-1")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: side === "left" ? "rotate(180deg)" : "none" }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      ) : null)}
    </div>
  );
}

// ---- Keypad ------------------------------------------------------
const KP_SIZES = { sm: { h: 48, num: "text-xl", gap: 8 }, md: { h: 60, num: "text-2xl", gap: 10 }, lg: { h: 72, num: "text-3xl", gap: 12 } };
const KP_LETTERS = { 2:"ABC", 3:"DEF", 4:"GHI", 5:"JKL", 6:"MNO", 7:"PQRS", 8:"TUV", 9:"WXYZ" };

function PreviewKeypad({ onKey, extraKey = null, size = "md", letters = false, disabled = false, onBackspaceLong, className = "" }) {
  const s = KP_SIZES[size];
  const timer = useRef(null);
  const keys = ["1","2","3","4","5","6","7","8","9", extraKey, "0", "backspace"];

  return (
    <div className={cx("grid grid-cols-3", className)} style={{ gap: s.gap }} role="group" aria-label="Teclado numérico">
      {keys.map((k, i) => {
        if (k == null) return <span key={`e${i}`} aria-hidden="true"/>;
        const isBack = k === "backspace";
        return (
          <button key={k} disabled={disabled} aria-label={isBack ? "Borrar" : k}
            onClick={() => { if (!disabled) { buzz(8); onKey(k); } }}
            onPointerDown={isBack && onBackspaceLong ? () => { timer.current = setTimeout(() => { buzz(20); onBackspaceLong(); }, 550); } : undefined}
            onPointerUp={isBack ? () => clearTimeout(timer.current) : undefined}
            onPointerLeave={isBack ? () => clearTimeout(timer.current) : undefined}
            className={cx("rounded-2xl font-semibold tabular-nums select-none text-foreground grid place-items-center leading-none",
              "transition-transform duration-100 active:scale-[0.94] disabled:opacity-40",
              isBack ? "bg-transparent border border-transparent hover:bg-surface-alt" : "bg-surface-alt/70 border border-border/70 hover:bg-surface-alt active:bg-border/60")}
            style={{ height: s.h, touchAction: "manipulation" }}>
            {isBack ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"/><line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
              </svg>
            ) : (
              <span className="flex flex-col items-center gap-0.5">
                <span className={s.num}>{k}</span>
                {letters && KP_LETTERS[k] && <span className="text-[9px] font-bold tracking-[0.16em] text-muted">{KP_LETTERS[k]}</span>}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---- PinLock -----------------------------------------------------
function PreviewPinLock({
  open, mode = "pin", length = 4, onUnlock, onSuccess, maxAttempts = 5,
  appName = "Tu app", title, hint, onBiometric, onForgot, fullscreen = false, className = "",
}) {
  const [code, setCode] = useState("");
  const [state, setState] = useState("idle");
  const [attempts, setAttempts] = useState(0);
  const [reveal, setReveal] = useState(false);
  const locked = attempts >= maxAttempts;

  const submit = useCallback(async value => {
    setState("checking");
    const ok = await onUnlock(value);
    if (ok) {
      buzz([10, 40, 10]); setState("ok");
      setTimeout(() => { onSuccess?.(); setCode(""); setState("idle"); }, 420);
    } else {
      buzz([50, 30, 50]); setState("error");
      setAttempts(a => a + 1);
      setTimeout(() => { setCode(""); setState("idle"); }, 620);
    }
  }, [onUnlock, onSuccess]);

  const push = k => {
    if (locked || state === "checking" || state === "ok") return;
    if (k === "backspace") return setCode(c => c.slice(0, -1));
    setCode(c => {
      if (c.length >= length) return c;
      const next = c + k;
      if (next.length === length) submit(next);
      return next;
    });
  };

  useEffect(() => { if (!open) { setCode(""); setState("idle"); setAttempts(0); } }, [open]);

  if (!open) return null;

  const heading = title ?? (mode === "pin" ? "Ingresá tu PIN" : "Ingresá tu contraseña");
  const message = locked ? "Demasiados intentos. Probá más tarde."
    : state === "error" ? `Código incorrecto · ${Math.max(0, maxAttempts - attempts)} intentos restantes`
    : hint ?? "Necesario para desbloquear la app";

  return (
    <div role="dialog" aria-modal="true" aria-label={heading}
      className={cx(fullscreen ? "fixed inset-0 z-[180]" : "absolute inset-0 z-30", "flex flex-col bg-surface/95 backdrop-blur-xl select-none", className)}
      style={{ paddingTop: 26, paddingBottom: 18, animation: "fadeIn 0.25s both" }}>
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 min-h-0">
        <div className="w-14 h-14 rounded-2xl grid place-items-center bg-primary/10 text-primary">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2.5"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{appName}</p>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight text-foreground">{heading}</h2>
          <p className={cx("mt-1.5 text-xs leading-relaxed", state === "error" || locked ? "text-danger font-semibold" : "text-muted")}>{message}</p>
        </div>

        {mode === "pin" ? (
          <div className="flex items-center gap-3" aria-live="polite" style={{ animation: state === "error" ? "shake 0.4s" : undefined }}>
            {Array.from({ length }).map((_, i) => {
              const filled = i < code.length;
              return (
                <span key={i} className="rounded-full transition-all duration-200"
                  style={{
                    width: filled ? 15 : 12, height: filled ? 15 : 12,
                    background: state === "error" ? "var(--color-danger)" : state === "ok" ? "var(--color-success)" : filled ? "var(--color-primary)" : "var(--color-border)",
                    transform: filled ? "scale(1)" : "scale(0.92)",
                  }}/>
              );
            })}
          </div>
        ) : (
          <form className="w-full max-w-xs" onSubmit={e => { e.preventDefault(); if (code) submit(code); }}
            style={{ animation: state === "error" ? "shake 0.4s" : undefined }}>
            <div className={cx("flex items-center h-12 rounded-xl border bg-surface px-3 gap-2 transition-colors", state === "error" ? "border-danger" : "border-border focus-within:border-primary")}>
              <input type={reveal ? "text" : "password"} value={code} disabled={locked} onChange={e => setCode(e.target.value)} placeholder="••••••••"
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted"/>
              <button type="button" onClick={() => setReveal(r => !r)} aria-label="Ver contraseña" className="text-muted hover:text-foreground transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            <button type="submit" disabled={!code || locked || state === "checking"}
              className="mt-3 w-full h-12 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-[0.98] disabled:opacity-40 transition-all">
              {state === "checking" ? "Verificando…" : "Desbloquear"}
            </button>
          </form>
        )}
      </div>

      {mode === "pin" && (
        <div className="px-6 w-full max-w-[320px] mx-auto">
          <PreviewKeypad onKey={push} disabled={locked || state === "checking" || state === "ok"} onBackspaceLong={() => setCode("")}/>
        </div>
      )}

      <div className="mt-3 flex items-center justify-center gap-5 px-6">
        {onBiometric && !locked && (
          <button onClick={onBiometric} className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:opacity-80 active:scale-95 transition-all">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
              <path d="M12 3a9 9 0 0 0-9 9v3"/><path d="M21 15v-3a9 9 0 0 0-4.5-7.8"/><path d="M8 21a13 13 0 0 1-1-5.5V12a5 5 0 0 1 10 0v3.5"/><path d="M12 12v4"/>
            </svg>
            Usar biometría
          </button>
        )}
        {onForgot && (
          <button onClick={onForgot} className="text-xs font-medium text-muted hover:text-foreground transition-colors">
            ¿Olvidaste tu {mode === "pin" ? "PIN" : "contraseña"}?
          </button>
        )}
      </div>
    </div>
  );
}

// ---- AmountPad ---------------------------------------------------
function PreviewAmountPad({
  open, onClose, onConfirm, title = "¿Cuánto querés cargar?", subtitle,
  currency = "ARS", locale = "es-AR", balance, min = 1, max,
  quickAmounts = [1000, 5000, 10000], cta = "Continuar", decimals = true,
  fullscreen = false, className = "",
}) {
  const [raw, setRaw] = useState("");
  const [cents, setCents] = useState(null);
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);

  const value = (raw === "" ? 0 : parseInt(raw, 10)) + (cents ? parseInt(cents.padEnd(2, "0"), 10) / 100 : 0);
  const nf = useMemo(() => new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }), [locale]);
  const money = n => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
  const symbol = money(0).replace(/[\d.,\s]/g, "");

  const ceiling = max ?? balance;
  const overflow = ceiling != null && value > ceiling;
  const valid = value >= min && !overflow;

  const reject = () => { buzz([40, 20, 40]); setShake(true); setTimeout(() => setShake(false), 380); };

  const push = k => {
    if (busy) return;
    if (k === "backspace") {
      if (cents != null) return cents.length > 0 ? setCents(cents.slice(0, -1)) : setCents(null);
      return setRaw(r => r.slice(0, -1));
    }
    if (k === "," || k === ".") {
      if (!decimals || cents != null) return;
      return setCents("");
    }
    if (cents != null) return cents.length >= 2 ? reject() : setCents(cents + k);
    if (raw.length >= 9) return reject();
    setRaw(r => (r === "" && k === "0" ? "" : r + k));
  };

  const setQuick = n => { buzz(8); setRaw(String(Math.trunc(n))); setCents(null); };

  const confirm = async () => {
    if (!valid) return reject();
    setBusy(true); buzz([10, 40, 10]);
    try { await onConfirm(value); } finally { setBusy(false); setRaw(""); setCents(null); }
  };

  useEffect(() => { if (!open) { setRaw(""); setCents(null); } }, [open]);
  if (!open) return null;

  const display = `${nf.format(raw === "" ? 0 : parseInt(raw, 10))}${cents != null ? `,${cents}` : ""}`;
  const digits = display.replace(/\D/g, "").length;
  const fontSize = digits > 9 ? 34 : digits > 7 ? 40 : digits > 5 ? 48 : 56;

  return (
    <div role="dialog" aria-modal="true" aria-label={title}
      className={cx(fullscreen ? "fixed inset-0 z-[170]" : "absolute inset-0 z-30", "flex flex-col bg-surface select-none", className)}
      style={{ paddingTop: 8, paddingBottom: 12, animation: "fadeIn 0.22s both" }}>
      <div className="flex items-center justify-between px-4 h-12 shrink-0">
        <button onClick={onClose} aria-label="Cerrar"
          className="w-10 h-10 -ml-2 rounded-full grid place-items-center text-foreground hover:bg-surface-alt active:scale-90 transition-all">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        {balance != null && (
          <span className="text-[11px] font-semibold text-muted">
            Disponible <span className="text-foreground tabular-nums">{money(balance)}</span>
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-2.5 px-5 min-h-0">
        <p className="text-[13px] font-semibold text-muted text-center">{title}</p>
        <div className="flex items-start gap-1.5 tabular-nums" style={{ animation: shake ? "shake 0.36s" : undefined }}>
          <span className="mt-1.5 text-xl font-semibold text-muted">{symbol}</span>
          <span className="font-bold tracking-tight leading-none transition-all duration-150"
            style={{ fontSize, color: overflow ? "var(--color-danger)" : value === 0 ? "var(--color-muted)" : "var(--color-foreground)" }}>
            {display}
          </span>
          <span aria-hidden="true" className="mt-2 w-[2px] h-7 rounded-full bg-primary" style={{ animation: "pwaBlink 1.1s steps(1) infinite" }}/>
        </div>
        <p className={cx("text-[11px] h-4 font-medium", overflow ? "text-danger" : "text-muted")}>
          {overflow ? `El máximo es ${money(ceiling)}` : subtitle ?? (value > 0 && value < min ? `Mínimo ${money(min)}` : "")}
        </p>

        <div className="flex flex-wrap justify-center gap-1.5 mt-1">
          {quickAmounts.map(n => (
            <button key={n} onClick={() => setQuick(n)}
              className="h-8 px-3 rounded-full text-[11px] font-bold bg-surface-alt/80 border border-border/70 text-foreground hover:bg-surface-alt active:scale-95 transition-all tabular-nums">
              +{nf.format(n)}
            </button>
          ))}
          {balance != null && (
            <button onClick={() => setQuick(balance)}
              className="h-8 px-3 rounded-full text-[11px] font-bold bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 active:scale-95 transition-all">
              Todo
            </button>
          )}
        </div>
      </div>

      <div className="px-4 w-full max-w-[380px] mx-auto shrink-0">
        <PreviewKeypad onKey={push} extraKey={decimals ? "," : null} size="sm" onBackspaceLong={() => { setRaw(""); setCents(null); }}/>
        <button onClick={confirm} disabled={busy}
          className="mt-3 w-full rounded-2xl text-sm font-bold transition-all active:scale-[0.98] disabled:opacity-60 grid place-items-center"
          style={{
            height: 48,
            background: valid ? "var(--color-primary)" : "var(--color-surface-alt)",
            color: valid ? "#fff" : "var(--color-muted)",
            boxShadow: valid ? "0 8px 24px -10px var(--color-primary)" : "none",
          }}>
          {busy ? "Procesando…" : valid ? `${cta} · ${money(value)}` : cta}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { PreviewChipCarousel, PreviewKeypad, PreviewPinLock, PreviewAmountPad, buzz });
