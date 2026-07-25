// =============================================================
//  PREVIEW · Bloques de app (2/2)
//  RedirectTimer · ShareButton · CardGrid
// =============================================================

const RT_TARGETS = {
  whatsapp: { label: "WhatsApp", tone: "#25D366",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.13c-.24.68-1.42 1.3-1.96 1.35-.54.05-1.04.24-3.5-.72-2.96-1.17-4.8-4.25-4.95-4.45-.14-.2-1.15-1.54-1.15-2.94 0-1.4.73-2.09 1-2.38.26-.29.57-.36.76-.36l.55.01c.17 0 .41-.07.63.48.24.58.79 1.98.86 2.12.07.15.12.32.02.51-.1.2-.36.5-.53.72-.17.2-.28.32-.12.6.17.29.75 1.24 1.6 2 1.1.98 1.87 1.25 2.14 1.39.26.15.42.12.58-.07.17-.2.68-.79.86-1.06.19-.29.38-.24.63-.15.24.1 1.55.73 1.82.87.26.14.44.2.5.32.07.12.07.68-.17 1.35z"/></svg> },
  telegram: { label: "Telegram", tone: "#229ED9",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 18.7 19.5c-.24 1.06-.87 1.32-1.76.82l-4.86-3.58-2.34 2.26c-.26.26-.48.48-.98.48l.35-4.95 9.02-8.15c.39-.35-.09-.54-.6-.2L6.38 13.2l-4.78-1.5c-1.04-.32-1.06-1.04.22-1.54l18.66-7.2c.86-.32 1.62.2 1.42 1.34z"/></svg> },
  sms: { label: "SMS", tone: "var(--color-primary)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  mail: { label: "Email", tone: "var(--color-accent)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,6 12,13 2,6"/></svg> },
  url: { label: "Sitio", tone: "var(--color-foreground)",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.5 1.5"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7L12 19"/></svg> },
};

function buildRedirectHref(t, { phone = "", email = "", url = "", message = "" }) {
  const msg = encodeURIComponent(message);
  const num = phone.replace(/[^\d]/g, "");
  if (t === "whatsapp") return `https://wa.me/${num}${msg ? `?text=${msg}` : ""}`;
  if (t === "telegram") return `https://t.me/${phone.replace(/^@/, "")}${msg ? `?text=${msg}` : ""}`;
  if (t === "sms") return `sms:${num}${msg ? `?&body=${msg}` : ""}`;
  if (t === "mail") return `mailto:${email}${msg ? `?body=${msg}` : ""}`;
  return url || "#";
}

function PreviewRedirectTimer({
  target = "whatsapp", phone, email, url, message = "", editable = true,
  seconds = 8, autoStart = true, title, description, onRedirect, onCancel, className = "",
}) {
  const t = RT_TARGETS[target];
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(autoStart);
  const [text, setText] = useState(message);
  const [done, setDone] = useState(false);

  const href = buildRedirectHref(target, { phone, email, url, message: text });

  const go = useCallback(() => {
    setRunning(false); setDone(true);
    onRedirect?.(href);
  }, [href, onRedirect]);

  useEffect(() => { setText(message); }, [message]);
  useEffect(() => { setLeft(seconds); setDone(false); }, [seconds, target]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) { go(); return; }
    const id = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(id);
  }, [running, left, go]);

  const pct = 1 - Math.max(0, left) / seconds;
  const R = 26, C = 2 * Math.PI * R;

  return (
    <div className={cx("rounded-2xl border border-border bg-surface p-5", className)}>
      <div className="flex items-start gap-4">
        <div className="relative w-16 h-16 shrink-0 grid place-items-center">
          <svg width="64" height="64" viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
            <circle cx="32" cy="32" r={R} fill="none" stroke="var(--color-border)" strokeWidth="4"/>
            <circle cx="32" cy="32" r={R} fill="none" stroke={t.tone} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C * (1 - pct)} style={{ transition: "stroke-dashoffset 1s linear" }}/>
          </svg>
          <span className="text-lg font-bold tabular-nums text-foreground">{Math.max(0, left)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: t.tone }}>{t.label}</p>
          <p className="mt-0.5 text-base font-bold text-foreground tracking-tight">
            {title ?? (running ? `Te llevamos a ${t.label}…` : done ? `Abriendo ${t.label}` : "Redirección en pausa")}
          </p>
          <p className="mt-1 text-xs text-muted leading-relaxed">
            {description ?? (running
              ? `En ${Math.max(0, left)} segundo${left === 1 ? "" : "s"} se abre la conversación con el mensaje listo para enviar.`
              : "Revisá el mensaje y salí cuando quieras.")}
          </p>
        </div>
      </div>

      {editable && target !== "url" && (
        <label className="block mt-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">Mensaje</span>
          <textarea value={text} rows={3} onChange={e => setText(e.target.value)} onFocus={() => setRunning(false)}
            placeholder="Hola, quiero consultar por…"
            className="mt-1.5 w-full rounded-xl border border-border bg-surface-alt/50 px-3 py-2.5 text-sm text-foreground leading-relaxed outline-none focus:border-primary transition-colors resize-none"/>
          <span className="mt-1 block text-[11px] text-muted">{text.length} caracteres · se pre-carga en el chat</span>
        </label>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a href={href} target="_blank" rel="noopener noreferrer" onClick={go}
          className="h-11 px-4 rounded-xl text-sm font-bold text-white inline-flex items-center gap-2 active:scale-[0.97] transition-transform"
          style={{ background: t.tone, boxShadow: `0 8px 22px -12px ${t.tone}` }}>
          {t.icon} Ir ahora
        </a>
        <button onClick={() => { if (done) { setDone(false); setLeft(seconds); } setRunning(r => !r); }}
          className="h-11 px-4 rounded-xl text-sm font-semibold border border-border bg-surface text-foreground hover:bg-surface-alt active:scale-[0.97] transition-all">
          {running ? "Pausar" : done ? "Reiniciar" : "Reanudar"}
        </button>
        {onCancel && (
          <button onClick={() => { setRunning(false); onCancel(); }}
            className="h-11 px-3 rounded-xl text-sm font-medium text-muted hover:text-foreground transition-colors">
            Cancelar
          </button>
        )}
      </div>

      <p className="mt-3 text-[11px] font-mono text-muted break-all">{href}</p>
    </div>
  );
}

// ---- ShareButton -------------------------------------------------
const SB_SIZES = { sm: { h: 34, text: "text-xs", pad: "px-3", ic: 15 }, md: { h: 42, text: "text-sm", pad: "px-4", ic: 17 }, lg: { h: 50, text: "text-[15px]", pad: "px-5", ic: 19 } };

const SbIcon = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12"/><polyline points="8 7 12 3 16 7"/><path d="M20 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5"/>
  </svg>
);

function PreviewShareButton({
  title, text, url, variant = "button", size = "md", label = "Compartir",
  forceFallback = false, onShared, className = "",
}) {
  const [sheet, setSheet] = useState(false);
  const [copied, setCopied] = useState(false);
  const s = SB_SIZES[size];
  const native = typeof navigator !== "undefined" && !!navigator.share && !forceFallback;
  const link = url ?? window.location.href;

  const share = async () => {
    buzz(8);
    if (native) {
      try { await navigator.share({ title, text, url: link }); onShared?.("native"); return; }
      catch (err) { if (err?.name === "AbortError") return; }
    }
    setSheet(true);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(link); } catch {}
    buzz([10, 30, 10]); setCopied(true); onShared?.("copy");
    setTimeout(() => { setCopied(false); setSheet(false); }, 1100);
  };

  const targets = [
    { id: "whatsapp", label: "WhatsApp", tone: "#25D366", href: `https://wa.me/?text=${encodeURIComponent(`${text ?? title ?? ""} ${link}`.trim())}` },
    { id: "telegram", label: "Telegram", tone: "#229ED9", href: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text ?? title ?? "")}` },
    { id: "mail", label: "Email", tone: "var(--color-accent)", href: `mailto:?subject=${encodeURIComponent(title ?? "")}&body=${encodeURIComponent(`${text ?? ""} ${link}`.trim())}` },
    { id: "sms", label: "Mensaje", tone: "var(--color-primary)", href: `sms:?&body=${encodeURIComponent(`${text ?? ""} ${link}`.trim())}` },
  ];

  const trigger =
    variant === "fab" ? (
      <button onClick={share} aria-label={label}
        className={cx("w-14 h-14 rounded-full grid place-items-center bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-90 transition-all", className)}>
        <SbIcon size={22}/>
      </button>
    ) : variant === "icon" || variant === "ghost" ? (
      <button onClick={share} aria-label={label}
        className={cx("grid place-items-center rounded-xl text-foreground transition-all active:scale-90",
          variant === "icon" ? "bg-surface-alt border border-border hover:bg-border/50" : "hover:bg-surface-alt", className)}
        style={{ width: s.h, height: s.h }}>
        <SbIcon size={s.ic}/>
      </button>
    ) : (
      <button onClick={share}
        className={cx("inline-flex items-center gap-2 rounded-xl font-semibold bg-surface-alt border border-border text-foreground hover:bg-border/50 hover:-translate-y-px active:scale-[0.97] active:translate-y-0 transition-all", s.pad, s.text, className)}
        style={{ height: s.h }}>
        <SbIcon size={s.ic}/> {label}
      </button>
    );

  return (
    <>
      {trigger}
      {sheet && (
        <div className="fixed inset-0 z-[190] flex items-end sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-label="Compartir">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" style={{ animation: "fadeIn 0.2s both" }} onClick={() => setSheet(false)}/>
          <div className="relative w-full sm:max-w-sm bg-surface border-t sm:border border-border sm:rounded-3xl rounded-t-3xl p-5 pb-6"
            style={{ animation: "pwaSlideUp 0.32s cubic-bezier(0.16,1,0.3,1) both" }}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden"/>
            <p className="text-base font-bold text-foreground tracking-tight">{label}</p>
            <p className="mt-0.5 text-xs text-muted truncate">{title ?? link}</p>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {targets.map(t => (
                <a key={t.id} href={t.href} target="_blank" rel="noopener noreferrer"
                  onClick={() => { onShared?.(t.id); setSheet(false); }}
                  className="flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-surface-alt active:scale-95 transition-all">
                  <span className="w-11 h-11 rounded-full grid place-items-center text-white" style={{ background: t.tone }}>
                    {RT_TARGETS[t.id === "sms" ? "sms" : t.id]?.icon ?? <SbIcon size={18}/>}
                  </span>
                  <span className="text-[10px] font-semibold text-muted">{t.label}</span>
                </a>
              ))}
            </div>

            <button onClick={copy}
              className="mt-4 w-full h-12 rounded-xl border border-border bg-surface-alt/60 px-3 flex items-center gap-3 text-left hover:bg-surface-alt active:scale-[0.99] transition-all">
              <span className={cx("w-8 h-8 rounded-lg grid place-items-center shrink-0", copied ? "bg-success/15 text-success" : "bg-foreground/10 text-foreground")}>
                {copied
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">{copied ? "¡Enlace copiado!" : "Copiar enlace"}</span>
                <span className="block text-[11px] text-muted truncate">{link}</span>
              </span>
            </button>

            <button onClick={() => setSheet(false)}
              className="mt-2 w-full h-11 rounded-xl text-sm font-semibold text-muted hover:bg-surface-alt transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ---- CardGrid ----------------------------------------------------
function PreviewCardGrid({
  items, renderItem, children, defaultColumns = 3, min = 1, max = 6,
  minCardWidth = 200, gap = 16, controls = true, controlStyle = "both",
  label = "Columnas", toolbar, onColumnsChange, className = "",
}) {
  const [cols, setCols] = useState(defaultColumns);
  const [width, setWidth] = useState(0);
  const shell = useRef(null);

  useEffect(() => {
    const el = shell.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el); setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const set = n => {
    const v = Math.min(max, Math.max(min, n));
    buzz(8); setCols(v); onColumnsChange?.(v);
  };

  const fit = width ? Math.max(min, Math.floor((width + gap) / (minCardWidth + gap))) : cols;
  const effective = Math.max(min, Math.min(cols, fit));
  const clamped = effective < cols;

  const pill = on => cx("h-8 min-w-8 px-2 rounded-lg text-xs font-bold tabular-nums border transition-all active:scale-95",
    on ? "bg-primary text-white border-primary shadow-sm shadow-primary/25" : "bg-surface text-foreground border-border hover:bg-surface-alt");

  return (
    <div className={className}>
      {(controls || toolbar) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {controls && (
            <>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mr-0.5">{label}</span>
              {(controlStyle === "buttons" || controlStyle === "both") && (
                <div className="inline-flex items-center rounded-xl border border-border bg-surface overflow-hidden">
                  <button onClick={() => set(cols - 1)} disabled={cols <= min} aria-label="Menos columnas"
                    className="w-9 h-8 grid place-items-center text-foreground hover:bg-surface-alt disabled:opacity-30 active:scale-90 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <span className="w-9 text-center text-xs font-bold tabular-nums text-foreground border-x border-border leading-8">{cols}</span>
                  <button onClick={() => set(cols + 1)} disabled={cols >= max} aria-label="Más columnas"
                    className="w-9 h-8 grid place-items-center text-foreground hover:bg-surface-alt disabled:opacity-30 active:scale-90 transition-all">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
              )}
              {(controlStyle === "pills" || controlStyle === "both") && (
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: max - min + 1 }, (_, i) => min + i).map(n => (
                    <button key={n} onClick={() => set(n)} className={pill(n === cols)} aria-pressed={n === cols}>{n}</button>
                  ))}
                </div>
              )}
              {clamped && (
                <span className="text-[11px] text-muted">mostrando <b className="text-foreground">{effective}</b> · no caben {cols}</span>
              )}
            </>
          )}
          {toolbar && <div className="ml-auto flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      <div ref={shell}>
        <div className="grid" style={{ gap, gridTemplateColumns: `repeat(${effective}, minmax(0, 1fr))`, transition: "gap 0.25s ease" }}>
          {items && renderItem ? items.map((it, i) => renderItem(it, i)) : children}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PreviewRedirectTimer, PreviewShareButton, PreviewCardGrid, buildRedirectHref, RT_TARGETS });
