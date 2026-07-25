"use client";

import { useEffect, useRef, useState } from "react";

/* =============================================================
   Hero · 4 variantes
   HeroSearch · HeroImage · HeroTabs · HeroWelcome
   Todos usan los tokens de globals.css y funcionan en claro/oscuro.
   ============================================================= */

type Align = "left" | "center";

const PAD: Record<"sm" | "md" | "lg", string> = {
  sm: "px-5 py-8 sm:px-7 sm:py-10",
  md: "px-5 py-12 sm:px-8 sm:py-16",
  lg: "px-5 py-16 sm:px-10 sm:py-24",
};

/* ---------------------------------------------------------------
   1 · HeroSearch — título + buscador con sugerencias
   --------------------------------------------------------------- */
export interface HeroSearchProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  onSubmit?: (v: string) => void;
  /** chips debajo del input: búsquedas frecuentes */
  suggestions?: string[];
  onSuggestion?: (s: string) => void;
  /** sugerencias en vivo mientras se escribe */
  results?: { id: string; label: string; sub?: string }[];
  onResult?: (id: string) => void;
  align?: Align;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  cta?: string;
  className?: string;
}

export function HeroSearch({
  eyebrow, title, description, placeholder = "Buscar…", value, onChange, onSubmit,
  suggestions = [], onSuggestion, results, onResult, align = "center", size = "md",
  icon, cta, className = "",
}: HeroSearchProps) {
  const [inner, setInner] = useState("");
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const q = value ?? inner;
  const set = (v: string) => { setInner(v); onChange?.(v); };
  const centered = align === "center";

  useEffect(() => {
    const away = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", away);
    return () => document.removeEventListener("mousedown", away);
  }, []);

  const showResults = open && !!q && !!results?.length;

  return (
    <section className={`relative overflow-hidden bg-surface ${PAD[size]} ${className}`}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(70% 120% at 50% -10%, rgb(var(--color-primary-rgb) / 0.10), transparent 70%)" }} />
      <div className={`relative mx-auto w-full max-w-2xl ${centered ? "text-center" : "text-left"}`}>
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />{eyebrow}
          </span>
        )}
        <h1 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl" style={{ textWrap: "pretty" } as React.CSSProperties}>
          {title}
        </h1>
        {description && <p className={`mt-3 text-sm leading-relaxed text-muted sm:text-base ${centered ? "mx-auto max-w-lg" : "max-w-lg"}`}>{description}</p>}

        <div ref={box} className="relative mt-6">
          <form
            onSubmit={(e) => { e.preventDefault(); onSubmit?.(q); setOpen(false); }}
            className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-1.5 shadow-lg shadow-black/5 transition-colors focus-within:border-primary"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center text-muted [&_svg]:h-[18px] [&_svg]:w-[18px]">
              {icon ?? <SearchGlyph />}
            </span>
            <input
              value={q} onChange={(e) => { set(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)}
              placeholder={placeholder} aria-label={placeholder}
              className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted/70"
            />
            {q && (
              <button type="button" onClick={() => { set(""); setOpen(false); }} aria-label="Limpiar"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-alt hover:text-foreground">
                <XGlyph />
              </button>
            )}
            <button type="submit"
              className="h-11 shrink-0 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-all hover:bg-primary-hover active:scale-[0.97]">
              {cta ?? <span className="grid h-5 w-5 place-items-center"><SearchGlyph /></span>}
            </button>
          </form>

          {showResults && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-border bg-surface text-left shadow-xl shadow-black/10">
              {results!.map((r) => (
                <button key={r.id} type="button" onClick={() => { onResult?.(r.id); set(r.label); setOpen(false); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-alt">
                  <span className="text-muted [&_svg]:h-4 [&_svg]:w-4"><SearchGlyph /></span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-foreground">{r.label}</span>
                    {r.sub && <span className="block truncate text-xs text-muted">{r.sub}</span>}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {!!suggestions.length && (
          <div className={`mt-4 flex flex-wrap gap-2 ${centered ? "justify-center" : ""}`}>
            {suggestions.map((s) => (
              <button key={s} type="button" onClick={() => { set(s); onSuggestion?.(s); onSubmit?.(s); }}
                className="h-8 rounded-full border border-border bg-surface-alt/70 px-3 text-xs font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary active:scale-95">
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   2 · HeroImage — imagen a sangre con overlay
   --------------------------------------------------------------- */
export interface HeroImageProps {
  src: string;
  alt?: string;
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  /** alto fijo en px o clase de aspecto */
  height?: number;
  ratio?: number;
  align?: Align;
  /** posición vertical del bloque de texto */
  vAlign?: "top" | "center" | "bottom";
  overlay?: "gradient" | "scrim" | "none";
  rounded?: boolean;
  /** desplaza la imagen al scrollear */
  parallax?: boolean;
  actions?: React.ReactNode;
  meta?: { label: string; value: string }[];
  className?: string;
}

export function HeroImage({
  src, alt = "", eyebrow, title, description, height, ratio = 16 / 9,
  align = "left", vAlign = "bottom", overlay = "gradient", rounded = false,
  parallax = false, actions, meta = [], className = "",
}: HeroImageProps) {
  const wrap = useRef<HTMLElement>(null);
  const [shift, setShift] = useState(0);

  useEffect(() => {
    if (!parallax) return;
    let raf = 0;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const el = wrap.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
        setShift(Math.max(-1, Math.min(1, p)) * -24);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [parallax]);

  const vClass = vAlign === "top" ? "items-start" : vAlign === "center" ? "items-center" : "items-end";

  return (
    <section ref={wrap as React.RefObject<HTMLElement>}
      className={`relative isolate overflow-hidden bg-surface-alt ${rounded ? "rounded-3xl" : ""} ${className}`}
      style={height ? { height } : { aspectRatio: String(ratio) }}
    >
      <img src={src} alt={alt} draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ transform: `translate3d(0,${shift}px,0) scale(${parallax ? 1.08 : 1})` }} />
      {overlay !== "none" && (
        <span aria-hidden="true" className="absolute inset-0"
          style={{
            background: overlay === "scrim"
              ? "rgb(0 0 0 / 0.45)"
              : "linear-gradient(to top, rgb(0 0 0 / 0.82) 0%, rgb(0 0 0 / 0.35) 45%, rgb(0 0 0 / 0.05) 100%)",
          }} />
      )}
      <div className={`relative flex h-full ${vClass}`}>
        <div className={`w-full ${PAD.md} ${align === "center" ? "text-center" : "text-left"}`}>
          <div className={`${align === "center" ? "mx-auto" : ""} max-w-xl`}>
            {eyebrow && (
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur">
                {eyebrow}
              </span>
            )}
            <h1 className="mt-3 text-3xl font-bold leading-[1.08] tracking-tight text-white drop-shadow-sm sm:text-5xl" style={{ textWrap: "balance" } as React.CSSProperties}>
              {title}
            </h1>
            {description && <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">{description}</p>}
            {!!meta.length && (
              <div className={`mt-5 flex flex-wrap gap-x-8 gap-y-3 ${align === "center" ? "justify-center" : ""}`}>
                {meta.map((m) => (
                  <div key={m.label}>
                    <p className="text-lg font-bold tabular-nums text-white">{m.value}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">{m.label}</p>
                  </div>
                ))}
              </div>
            )}
            {actions && <div className={`mt-6 flex flex-wrap gap-2 ${align === "center" ? "justify-center" : ""}`}>{actions}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   3 · HeroTabs — cabecera con tabs scrolables horizontalmente
   --------------------------------------------------------------- */
export interface HeroTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface HeroTabsProps {
  title?: React.ReactNode;
  description?: string;
  tabs: HeroTab[];
  value?: string;
  onChange?: (id: string) => void;
  variant?: "underline" | "pill";
  /** contenido por tab, renderizado debajo */
  panels?: Record<string, React.ReactNode>;
  left?: React.ReactNode;
  actions?: React.ReactNode;
  sticky?: boolean;
  className?: string;
}

export function HeroTabs({
  title, description, tabs, value, onChange, variant = "underline",
  panels, left, actions, sticky = false, className = "",
}: HeroTabsProps) {
  const [inner, setInner] = useState(tabs[0]?.id);
  const active = value ?? inner;
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

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
  }, [tabs.length]);

  // el activo siempre visible
  useEffect(() => {
    const el = track.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    const box = track.current;
    if (!el || !box) return;
    const l = el.offsetLeft, r = l + el.offsetWidth;
    if (l < box.scrollLeft + 12) box.scrollTo({ left: Math.max(0, l - 16), behavior: "smooth" });
    else if (r > box.scrollLeft + box.clientWidth - 12) box.scrollTo({ left: r - box.clientWidth + 16, behavior: "smooth" });
  }, [active]);

  const select = (id: string) => { setInner(id); onChange?.(id); };

  return (
    <section className={`bg-surface ${className}`}>
      <div className="px-5 pt-8 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            {left}
            {title && <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>}
            {description && <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      </div>

      <div className={`relative mt-5 border-b border-border bg-surface ${sticky ? "sticky top-0 z-30" : ""}`}>
        <div ref={track} onScroll={readEdges}
          className="flex overflow-x-auto px-5 sm:px-8"
          style={{ scrollbarWidth: "none", gap: variant === "pill" ? 8 : 24, scrollSnapType: "x proximity" }}
          role="tablist" aria-orientation="horizontal"
        >
          {tabs.map((t) => {
            const on = t.id === active;
            if (variant === "pill") {
              return (
                <button key={t.id} data-tab={t.id} role="tab" aria-selected={on} onClick={() => select(t.id)}
                  className={[
                    "my-2.5 inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-all active:scale-[0.96]",
                    on ? "border-primary bg-primary text-white shadow-sm shadow-primary/30" : "border-border bg-surface-alt/60 text-muted hover:text-foreground",
                  ].join(" ")}
                  style={{ scrollSnapAlign: "start" }}
                >
                  {t.icon && <span className="[&_svg]:h-4 [&_svg]:w-4">{t.icon}</span>}
                  {t.label}
                  {t.count != null && <span className={`rounded-full px-1.5 text-[10px] font-bold tabular-nums ${on ? "bg-white/20" : "bg-foreground/10"}`}>{t.count}</span>}
                </button>
              );
            }
            return (
              <button key={t.id} data-tab={t.id} role="tab" aria-selected={on} onClick={() => select(t.id)}
                className={[
                  "relative inline-flex h-12 shrink-0 items-center gap-2 text-sm font-semibold transition-colors",
                  on ? "text-primary" : "text-muted hover:text-foreground",
                ].join(" ")}
                style={{ scrollSnapAlign: "start" }}
              >
                {t.icon && <span className="[&_svg]:h-4 [&_svg]:w-4">{t.icon}</span>}
                {t.label}
                {t.count != null && <span className="rounded-full bg-foreground/10 px-1.5 text-[10px] font-bold tabular-nums text-muted">{t.count}</span>}
                <span aria-hidden="true"
                  className="absolute inset-x-0 -bottom-px h-[2.5px] rounded-full bg-primary transition-transform duration-200"
                  style={{ transform: on ? "scaleX(1)" : "scaleX(0)" }} />
              </button>
            );
          })}
        </div>
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-10 transition-opacity"
          style={{ opacity: edges.left ? 1 : 0, background: "linear-gradient(90deg, var(--color-surface), transparent)" }} />
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 w-10 transition-opacity"
          style={{ opacity: edges.right ? 1 : 0, background: "linear-gradient(270deg, var(--color-surface), transparent)" }} />
      </div>

      {panels && <div key={active} className="px-5 py-6 sm:px-8" style={{ animation: "heroPanelIn .24s ease both" }}>{panels[active!]}</div>}
    </section>
  );
}

/* ---------------------------------------------------------------
   4 · HeroWelcome — saludo al usuario
   --------------------------------------------------------------- */
export interface HeroWelcomeProps {
  name: string;
  avatar?: string;
  /** por defecto se calcula por la hora del dispositivo */
  greeting?: string;
  subtitle?: string;
  /** dato destacado: saldo, puntos, progreso… */
  highlight?: { label: string; value: string; delta?: string };
  quickActions?: { id: string; label: string; icon?: React.ReactNode }[];
  onQuickAction?: (id: string) => void;
  actions?: React.ReactNode;
  /** fondo teñido con el color primario */
  tone?: "surface" | "brand";
  className?: string;
}

export function greetingFor(d = new Date()) {
  const h = d.getHours();
  if (h < 6) return "Buenas noches";
  if (h < 13) return "Buen día";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}

export function HeroWelcome({
  name, avatar, greeting, subtitle, highlight, quickActions = [], onQuickAction,
  actions, tone = "surface", className = "",
}: HeroWelcomeProps) {
  const brand = tone === "brand";
  const hello = greeting ?? greetingFor();
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <section className={`relative overflow-hidden ${brand ? "bg-primary text-white" : "bg-surface"} px-5 pb-6 pt-8 sm:px-8 ${className}`}>
      {brand && (
        <span aria-hidden="true" className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(80% 100% at 100% 0%, rgb(255 255 255 / 0.18), transparent 60%)" }} />
      )}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {avatar ? (
            <img src={avatar} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white/60" />
          ) : (
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-bold ${brand ? "bg-white/20 text-white" : "bg-primary/12 text-primary"}`}>
              {initials}
            </span>
          )}
          <div className="min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-wider ${brand ? "text-white/70" : "text-muted"}`}>{hello}</p>
            <p className="truncate text-xl font-bold tracking-tight sm:text-2xl">{name}</p>
            {subtitle && <p className={`truncate text-xs ${brand ? "text-white/70" : "text-muted"}`}>{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>

      {highlight && (
        <div className={`relative mt-5 rounded-2xl p-4 ${brand ? "bg-white/12 backdrop-blur" : "border border-border bg-surface-alt/60"}`}>
          <p className={`text-[11px] font-semibold uppercase tracking-wider ${brand ? "text-white/70" : "text-muted"}`}>{highlight.label}</p>
          <div className="mt-1 flex items-end gap-2">
            <p className="text-3xl font-bold tabular-nums tracking-tight">{highlight.value}</p>
            {highlight.delta && (
              <span className={`mb-1 rounded-full px-2 py-0.5 text-xs font-bold ${brand ? "bg-white/20 text-white" : "bg-success/12 text-success"}`}>
                {highlight.delta}
              </span>
            )}
          </div>
        </div>
      )}

      {!!quickActions.length && (
        <div className="relative mt-4 flex overflow-x-auto gap-2" style={{ scrollbarWidth: "none" }}>
          {quickActions.map((a) => (
            <button key={a.id} type="button" onClick={() => onQuickAction?.(a.id)}
              className={[
                "flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl text-[11px] font-semibold transition-all active:scale-95",
                brand ? "bg-white/12 text-white hover:bg-white/20" : "border border-border bg-surface text-foreground hover:border-primary/40 hover:text-primary",
              ].join(" ")}
            >
              <span className={`[&_svg]:h-[18px] [&_svg]:w-[18px] ${brand ? "" : "text-primary"}`}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---- glifos internos (sin dependencias de iconos) ------------- */
function SearchGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function XGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
