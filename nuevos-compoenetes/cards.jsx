// =============================================================
//  Cards — preview versions
//  Card (5 variantes) · StatCard · MediaCard · ProfileCard · PricingCard
// =============================================================

const CARD_VARIANTS = {
  elevated: "bg-surface border border-border shadow-lg shadow-black/[0.06]",
  outline: "bg-surface border border-border",
  flat: "bg-surface-alt border border-transparent",
  gradient: "border border-primary/25 bg-gradient-to-br from-primary/[0.10] via-accent/[0.06] to-transparent",
  glass: "border border-white/15 bg-surface/60 shadow-xl shadow-black/10",
};
const CARD_PADS = { none: "", sm: "p-3.5", md: "p-5", lg: "p-7" };

function PreviewCard({ variant = "outline", padding = "md", interactive = false, onClick, className = "", children }) {
  const clickable = interactive || !!onClick;
  return (
    <div onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}
      className={cx("rounded-2xl overflow-hidden text-foreground transition-all duration-300",
        CARD_VARIANTS[variant], CARD_PADS[padding],
        variant === "glass" && "backdrop-blur-xl",
        clickable && "cursor-pointer hover:-translate-y-[3px] hover:shadow-xl hover:shadow-black/[0.08] active:scale-[0.99]",
        className)}>
      {children}
    </div>
  );
}

function PreviewCardMedia({ src, alt = "", aspect = 16 / 9, label, overlay, className = "" }) {
  return (
    <div className={cx("relative w-full overflow-hidden bg-surface-alt", className)} style={{ aspectRatio: String(aspect) }}>
      {src ? <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover"/> : (
        <div className="absolute inset-0 grid place-items-center"
          style={{ background:"repeating-linear-gradient(135deg,var(--color-border) 0 8px,transparent 8px 16px)" }}>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted bg-surface/80 px-2 py-1 rounded">{label ?? "imagen"}</span>
        </div>
      )}
      {overlay}
    </div>
  );
}

const STAT_TONES = {
  primary: { fg:"text-primary", bg:"bg-primary/10", stroke:"var(--color-primary)" },
  accent:  { fg:"text-accent",  bg:"bg-accent/10",  stroke:"var(--color-accent)" },
  success: { fg:"text-success", bg:"bg-success/10", stroke:"var(--color-success)" },
  danger:  { fg:"text-danger",  bg:"bg-danger/10",  stroke:"var(--color-danger)" },
  neutral: { fg:"text-foreground", bg:"bg-surface-alt", stroke:"var(--color-muted)" },
};

function PreviewSparkline({ data, tone }) {
  const w = 72, h = 24;
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/span)*(h-3)-1.5}`).join(" ");
  return (
    <svg width={w} height={h} className="shrink-0 overflow-visible" aria-hidden>
      <polyline points={pts} fill="none" stroke={STAT_TONES[tone].stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PreviewStatCard({ label, value, unit, delta, icon, tone = "primary", spark, footnote, variant = "outline" }) {
  const t = STAT_TONES[tone];
  const up = (delta ?? 0) >= 0;
  return (
    <PreviewCard variant={variant} padding="md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
        {icon && <span className={cx("w-8 h-8 rounded-lg grid place-items-center shrink-0", t.bg, t.fg)}>{icon}</span>}
      </div>
      <div className="mt-2.5 flex items-end gap-2">
        <span className="text-3xl font-bold tracking-tight tabular-nums text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted mb-1">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        {delta != null && (
          <span className={cx("inline-flex items-center gap-1 text-xs font-semibold", up ? "text-success" : "text-danger")}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: up ? "none" : "rotate(180deg)" }}>
              <polyline points="6 15 12 9 18 15"/>
            </svg>
            {up ? "+" : ""}{delta}%
          </span>
        )}
        {spark && <PreviewSparkline data={spark} tone={tone}/>}
      </div>
      {footnote && <p className="mt-2 text-[11px] text-muted">{footnote}</p>}
    </PreviewCard>
  );
}

function PreviewMediaCard({ src, alt, label, aspect = 16/9, badge, title, description, meta, actions, horizontal = false, variant = "elevated", onClick }) {
  return (
    <PreviewCard variant={variant} padding="none" onClick={onClick} className={horizontal ? "flex" : ""}>
      <div className={horizontal ? "w-2/5 shrink-0" : ""}>
        <PreviewCardMedia src={src} alt={alt} label={label} aspect={horizontal ? 1 : aspect}
          className={horizontal ? "h-full" : ""}
          overlay={badge ? (
            <span className="absolute top-3 left-3 rounded-full bg-surface/90 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">{badge}</span>
          ) : undefined}/>
      </div>
      <div className="p-5 min-w-0 flex-1">
        <p className="text-base font-semibold leading-snug text-foreground">{title}</p>
        {description && <p className="mt-1.5 text-sm text-muted leading-relaxed">{description}</p>}
        {meta && <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">{meta}</div>}
        {actions && <div className="mt-4 flex items-center gap-2">{actions}</div>}
      </div>
    </PreviewCard>
  );
}

function PreviewProfileCard({ name, role, avatar, cover, stats, actions, variant = "outline" }) {
  const initials = name.split(" ").map(w=>w[0]).slice(0,2).join("");
  return (
    <PreviewCard variant={variant} padding="none">
      {cover && <div className="h-20 bg-gradient-to-r from-primary/70 to-accent/70"/>}
      <div className={cx("p-5", cover && "-mt-9")}>
        {avatar
          ? <img src={avatar} alt="" className="w-14 h-14 rounded-full object-cover ring-4 ring-surface"/>
          : <span className="w-14 h-14 rounded-full grid place-items-center bg-gradient-to-br from-primary to-accent text-white text-lg font-bold ring-4 ring-surface">{initials}</span>}
        <p className="mt-3 text-base font-semibold text-foreground">{name}</p>
        {role && <p className="text-xs text-muted mt-0.5">{role}</p>}
        {stats && (
          <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-surface-alt/50">
            {stats.map(s => (
              <div key={s.label} className="px-2 py-2.5 text-center">
                <p className="text-sm font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}
        {actions && <div className="mt-4 flex gap-2">{actions}</div>}
      </div>
    </PreviewCard>
  );
}

function PreviewPricingCard({ plan, price, period = "/mes", description, features, cta, highlight = false, badge }) {
  return (
    <PreviewCard variant={highlight ? "gradient" : "outline"} padding="lg" className={highlight ? "ring-1 ring-primary/30" : ""}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{plan}</p>
        {badge && <span className="rounded-full bg-primary text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">{badge}</span>}
      </div>
      <div className="mt-3 flex items-end gap-1">
        <span className="text-4xl font-bold tracking-tight text-foreground">{price}</span>
        <span className="text-sm text-muted mb-1.5">{period}</span>
      </div>
      {description && <p className="mt-2 text-xs text-muted leading-relaxed">{description}</p>}
      <ul className="mt-5 space-y-2.5">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 text-sm text-foreground">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-primary">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span className="leading-snug">{f}</span>
          </li>
        ))}
      </ul>
      {cta && <div className="mt-6">{cta}</div>}
    </PreviewCard>
  );
}

Object.assign(window, {
  PreviewCard, PreviewCardMedia, PreviewStatCard, PreviewMediaCard,
  PreviewProfileCard, PreviewPricingCard,
});
