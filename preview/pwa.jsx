// =============================================================
//  PWA Install Prompt — preview versions (Android + iOS)
// =============================================================

// ---- Android banner ---------------------------------------------
function PwaAndroidBanner({ appName, tagline, icon, onInstall, onDismiss, installLabel="Instalar", dismissLabel="Ahora no" }) {
  const [busy, setBusy] = useState(false);
  return (
    <div
      role="dialog"
      className="fixed z-[120] left-1/2 -translate-x-1/2 bottom-6 w-[min(420px,calc(100vw-1.5rem))] bg-surface border border-border rounded-2xl shadow-2xl shadow-black/15 p-4 flex items-center gap-3"
      style={{ animation: "pwaSpringUp 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}
    >
      <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center overflow-hidden shadow-md shadow-primary/25">
        {icon ?? <Icon d={I.zap.props.children} width="22" height="22"/>}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight truncate">Instalar {appName}</p>
        <p className="text-xs text-muted mt-0.5 leading-relaxed line-clamp-2">{tagline}</p>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button onClick={async()=>{ setBusy(true); await onInstall?.(); setBusy(false); }}
          disabled={busy}
          className="h-9 px-4 rounded-lg bg-primary text-white text-xs font-semibold shadow-sm shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-60">
          {busy ? "…" : installLabel}
        </button>
        <button onClick={onDismiss} className="h-7 px-3 text-[11px] text-muted hover:text-foreground transition-colors">
          {dismissLabel}
        </button>
      </div>
    </div>
  );
}

// ---- iOS sheet --------------------------------------------------
function PwaIosSheet({ appName, tagline, icon, onDismiss }) {
  const shareIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
      <polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
    </svg>
  );
  const plusIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4"/>
      <line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
    </svg>
  );
  const steps = [
    { text: "Tocá el botón Compartir", icon: shareIcon, hint: "Lo encontrás en la barra inferior de Safari." },
    { text: "Buscá 'Agregar a inicio'", icon: plusIcon, hint: "Deslizá hacia abajo en el menú de compartir." },
    { text: "Tocá 'Agregar' arriba a la derecha", icon: I.check, hint: "Listo: el ícono aparece en tu pantalla de inicio." },
  ];

  useEffect(() => {
    const k = (e) => e.key === "Escape" && onDismiss?.();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onDismiss]);

  return (
    <>
      <div onClick={onDismiss}
        className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.3s ease-out" }}/>
      <div role="dialog"
        className="fixed z-[120] left-0 right-0 bottom-0 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:bottom-6 sm:w-[440px] bg-surface border-t border-border sm:border sm:rounded-3xl rounded-t-3xl shadow-2xl shadow-black/30 overflow-hidden"
        style={{ animation: "pwaSlideUp 0.45s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <span className="w-10 h-1 rounded-full bg-border"/>
        </div>

        <div className="px-6 pt-4 pb-2 flex items-start gap-3">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center shadow-md shadow-primary/25">
            {icon ?? <Icon d={I.zap.props.children} width="26" height="26"/>}
          </div>
          <div className="flex-1 min-w-0 pt-1">
            <p className="text-base font-semibold text-foreground leading-tight">Instalar {appName}</p>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">{tagline}</p>
          </div>
          <button onClick={onDismiss} aria-label="Cerrar"
            className="shrink-0 w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
            {I.close}
          </button>
        </div>

        <ol className="px-6 pt-3 pb-5 space-y-3">
          {steps.map((s, i) => (
            <li key={i} className="flex items-start gap-3"
              style={{ animation: `fadeInUp 0.35s ${0.1 + i*0.08}s both` }}>
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i+1}</span>
              <div className="flex-1 pt-0.5">
                <p className="text-sm text-foreground leading-snug">
                  {s.text}
                  {s.icon && (
                    <span className="inline-flex align-middle ml-1 -mt-0.5 w-6 h-6 rounded-md bg-surface-alt border border-border items-center justify-center text-primary">{s.icon}</span>
                  )}
                </p>
                {s.hint && <p className="text-[11px] text-muted mt-0.5">{s.hint}</p>}
              </div>
            </li>
          ))}
        </ol>

        <div className="px-6 pb-5 -mt-1 flex justify-center text-primary"
          style={{ animation: "pwaBob 1.4s ease-in-out infinite" }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
          </svg>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { PwaAndroidBanner, PwaIosSheet });

// =============================================================
//  PWA Molecules — preview versions
//  (OfflineBanner · UpdatePrompt · NotificationOptIn · PwaStatus · InstallButton)
// =============================================================

// ---- OfflineBanner ----------------------------------------------
function PwaOfflineBanner({ state = "offline", position = "top" }) {
  const tone = {
    offline: "bg-foreground text-surface",
    back:    "bg-success text-white",
    slow:    "bg-accent text-white",
  };
  const label = {
    offline: "Sin conexión · estás viendo contenido guardado",
    back:    "Conexión restablecida",
    slow:    "Conexión lenta",
  };
  const cloudOff = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18.5 19H9a7 7 0 0 1-.9-13.9"/><path d="M12.3 5.1A5 5 0 0 1 20 9a4 4 0 0 1 1.4 7.5"/><line x1="2" y1="2" x2="22" y2="22"/>
    </svg>
  );
  const gauge = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 14 8 9"/><path d="M3.5 18a9 9 0 1 1 17 0"/>
    </svg>
  );
  return (
    <div className={`w-full px-4 py-2 ${tone[state]} ${position === "top" ? "" : "mt-auto"}`}>
      <div className="flex items-center justify-center gap-2 text-xs font-semibold">
        {state === "offline" ? cloudOff : state === "back" ? I.check : gauge}
        <span>{label[state]}</span>
        {state === "offline" && (
          <span className="w-1.5 h-1.5 rounded-full bg-current" style={{ animation: "pwaBlink 1.6s ease-in-out infinite" }}/>
        )}
      </div>
    </div>
  );
}

// ---- UpdatePrompt -----------------------------------------------
function PwaUpdatePrompt({ onUpdate, onDismiss, floating = true }) {
  const [busy, setBusy] = useState(false);
  const refresh = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 9 8 9"/>
    </svg>
  );
  return (
    <div
      role="alert"
      className={[
        floating
          ? "fixed z-[125] left-1/2 -translate-x-1/2 bottom-6 w-[min(420px,calc(100vw-1.5rem))]"
          : "w-full",
        "bg-surface border border-border rounded-2xl shadow-2xl shadow-black/15 p-4 flex items-center gap-3",
      ].join(" ")}
      style={floating ? { animation: "pwaSpringUp 0.5s cubic-bezier(0.34,1.56,0.64,1)" } : undefined}
    >
      <span className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
        <span className="flex" style={busy ? { animation: "spin 0.9s linear infinite" } : undefined}>{refresh}</span>
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight">Nueva versión disponible</p>
        <p className="text-xs text-muted mt-0.5 leading-relaxed">Recargá para usar la última versión de la app.</p>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button onClick={()=>{ setBusy(true); setTimeout(()=>{ setBusy(false); onUpdate?.(); }, 1200); }}
          disabled={busy}
          className="h-9 px-4 rounded-lg bg-primary text-white text-xs font-semibold shadow-sm shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-60">
          {busy ? "…" : "Actualizar"}
        </button>
        <button onClick={onDismiss} className="h-7 px-3 text-[11px] text-muted hover:text-foreground transition-colors">Después</button>
      </div>
    </div>
  );
}

// ---- NotificationOptIn ------------------------------------------
function PwaNotificationOptIn({ status = "default", onAsk, onDismiss }) {
  const [busy, setBusy] = useState(false);
  const bell = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>
    </svg>
  );
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 flex items-start gap-3">
      <span className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
        <span className="flex origin-top" style={{ animation: "pwaBellSwing 1.2s ease-in-out infinite" }}>{bell}</span>
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight">Activar notificaciones</p>
        <p className="text-xs text-muted mt-0.5 leading-relaxed">
          {status === "denied"
            ? "Están bloqueadas. Habilitalas desde los ajustes del navegador."
            : status === "ios"
              ? "Primero agregá la app a tu pantalla de inicio para poder recibir notificaciones."
              : "Te avisamos sólo de lo importante. Podés desactivarlas cuando quieras."}
        </p>
        {status === "default" && (
          <div className="flex items-center gap-2 mt-3">
            <button onClick={()=>{ setBusy(true); setTimeout(()=>{ setBusy(false); onAsk?.(); }, 700); }}
              disabled={busy}
              className="h-8 px-3.5 rounded-lg bg-primary text-white text-xs font-semibold shadow-sm shadow-primary/30 hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-60">
              {busy ? "…" : "Activar"}
            </button>
            <button onClick={onDismiss} className="h-8 px-3 text-xs text-muted hover:text-foreground transition-colors">No, gracias</button>
          </div>
        )}
      </div>
      <button onClick={onDismiss} aria-label="Cerrar"
        className="shrink-0 w-7 h-7 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
        {I.close}
      </button>
    </div>
  );
}

// ---- PwaStatus ---------------------------------------------------
function PwaStatusPanel({ rows, title = "Estado de la app" }) {
  const dot = { ok: "bg-success", warn: "bg-accent", off: "bg-muted/50" };
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <button className="h-7 px-2.5 rounded-lg text-[11px] font-semibold text-primary hover:bg-primary/10 active:scale-95 transition-all inline-flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 9 8 9"/>
          </svg>
          Buscar actualización
        </button>
      </div>
      <dl className="divide-y divide-border">
        {rows.map((r, i) => (
          <div key={r.label} className="px-4 py-2.5 flex items-center justify-between gap-4"
            style={{ animation: `fadeInUp 0.3s ${i*0.05}s both` }}>
            <dt className="text-xs text-muted">{r.label}</dt>
            <dd className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <span className={`w-1.5 h-1.5 rounded-full ${dot[r.tone]}`}/>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ---- InstallButton ----------------------------------------------
function PwaInstallButton({ state = "available", size = "md", variant = "primary" }) {
  const sizes = { sm: "h-8 px-3 text-xs gap-1.5", md: "h-10 px-4 text-sm gap-2", lg: "h-12 px-6 text-base gap-2" };
  const variants = {
    primary: "bg-primary text-white shadow-sm shadow-primary/30 hover:bg-primary-hover",
    outline: "border border-border text-foreground hover:bg-surface-alt",
    ghost:   "text-primary hover:bg-primary/10",
  };
  const download = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
  const installed = state === "installed";
  const label = installed ? "App instalada" : state === "ios" ? "Cómo instalar" : "Instalar app";
  return (
    <button disabled={installed}
      className={[
        "inline-flex items-center justify-center rounded-lg font-semibold transition-all active:scale-95 disabled:active:scale-100 disabled:cursor-default",
        sizes[size], installed ? "bg-success/10 text-success" : variants[variant],
      ].join(" ")}>
      {installed ? I.check : download}
      <span>{label}</span>
    </button>
  );
}

Object.assign(window, {
  PwaOfflineBanner, PwaUpdatePrompt, PwaNotificationOptIn, PwaStatusPanel, PwaInstallButton,
});
