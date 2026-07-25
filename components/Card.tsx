"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

export type CardVariant = "elevated" | "outline" | "flat" | "gradient" | "glass";
export type CardPadding = "none" | "sm" | "md" | "lg";

const VARIANTS: Record<CardVariant, string> = {
  elevated: "bg-surface border border-border shadow-lg shadow-black/[0.06]",
  outline: "bg-surface border border-border",
  flat: "bg-surface-alt border border-transparent",
  gradient: "border border-primary/25 bg-gradient-to-br from-primary/[0.10] via-accent/[0.06] to-transparent",
  glass: "border border-white/15 bg-surface/60 backdrop-blur-xl shadow-xl shadow-black/10",
};

const PADS: Record<CardPadding, string> = { none: "", sm: "p-3.5", md: "p-5", lg: "p-7" };

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  /** hover lift + tap scale; además marca el rol de botón si hay onClick */
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

/** Superficie base. Todo lo demás en este archivo se construye sobre ella. */
export function Card({
  variant = "outline", padding = "md", interactive = false, onClick, className = "", children,
}: CardProps) {
  const clickable = interactive || !!onClick;
  return (
    <motion.div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      whileHover={clickable ? { y: -3 } : undefined}
      whileTap={clickable ? { scale: 0.99 } : undefined}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={[
        "rounded-2xl overflow-hidden text-foreground",
        VARIANTS[variant], PADS[padding],
        clickable ? "cursor-pointer hover:shadow-xl hover:shadow-black/[0.08]" : "",
        className,
      ].join(" ")}
    >
      {children}
    </motion.div>
  );
}

/** Zona de imagen de una card. Sin `src` dibuja un placeholder rayado. */
export function CardMedia({
  src, alt = "", aspect = 16 / 9, label, overlay, className = "",
}: { src?: string; alt?: string; aspect?: number; label?: string; overlay?: ReactNode; className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden bg-surface-alt ${className}`} style={{ aspectRatio: String(aspect) }}>
      {src ? (
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 grid place-items-center"
          style={{ background: "repeating-linear-gradient(135deg,var(--color-border) 0 8px,transparent 8px 16px)" }}>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted bg-surface/80 px-2 py-1 rounded">
            {label ?? "imagen"}
          </span>
        </div>
      )}
      {overlay}
    </div>
  );
}

export function CardHeader({ title, subtitle, aside, className = "" }: {
  title: ReactNode; subtitle?: ReactNode; aside?: ReactNode; className?: string;
}) {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      <div className="min-w-0">
        <p className="text-[15px] font-semibold leading-snug text-foreground truncate">{title}</p>
        {subtitle && <p className="mt-0.5 text-xs text-muted leading-relaxed">{subtitle}</p>}
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-2 border-t border-border pt-3 mt-4 ${className}`}>{children}</div>
  );
}

export type StatTone = "primary" | "accent" | "success" | "danger" | "neutral";

const STAT_TONES: Record<StatTone, { fg: string; bg: string }> = {
  primary: { fg: "text-primary", bg: "bg-primary/10" },
  accent: { fg: "text-accent", bg: "bg-accent/10" },
  success: { fg: "text-success", bg: "bg-success/10" },
  danger: { fg: "text-danger", bg: "bg-danger/10" },
  neutral: { fg: "text-foreground", bg: "bg-surface-alt" },
};

/** KPI: label, valor grande, delta y sparkline opcional. */
export function StatCard({
  label, value, unit, delta, icon, tone = "primary", spark, footnote, variant = "outline",
}: {
  label: string; value: string | number; unit?: string;
  delta?: number; icon?: ReactNode; tone?: StatTone; spark?: number[];
  footnote?: string; variant?: CardVariant;
}) {
  const t = STAT_TONES[tone];
  const up = (delta ?? 0) >= 0;
  return (
    <Card variant={variant} padding="md">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{label}</p>
        {icon && <span className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${t.bg} ${t.fg}`}>{icon}</span>}
      </div>
      <div className="mt-2.5 flex items-end gap-2">
        <span className="text-3xl font-bold tracking-tight tabular-nums text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted mb-1">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center justify-between gap-3">
        {delta != null && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-success" : "text-danger"}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: up ? "none" : "rotate(180deg)" }}>
              <polyline points="6 15 12 9 18 15" />
            </svg>
            {up ? "+" : ""}{delta}%
          </span>
        )}
        {spark && <Sparkline data={spark} tone={tone} />}
      </div>
      {footnote && <p className="mt-2 text-[11px] text-muted">{footnote}</p>}
    </Card>
  );
}

function Sparkline({ data, tone }: { data: number[]; tone: StatTone }) {
  const w = 72, h = 24;
  const min = Math.min(...data), max = Math.max(...data), span = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / span) * (h - 3) - 1.5}`).join(" ");
  const stroke = tone === "neutral" ? "var(--color-muted)" : `var(--color-${tone})`;
  return (
    <svg width={w} height={h} className="shrink-0 overflow-visible" aria-hidden>
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Card con imagen arriba (o al costado), badge, título, texto y acciones. */
export function MediaCard({
  src, alt, label, aspect = 16 / 9, badge, title, description, meta, actions,
  horizontal = false, variant = "elevated", onClick,
}: {
  src?: string; alt?: string; label?: string; aspect?: number;
  badge?: ReactNode; title: string; description?: string;
  meta?: ReactNode; actions?: ReactNode; horizontal?: boolean;
  variant?: CardVariant; onClick?: () => void;
}) {
  return (
    <Card variant={variant} padding="none" onClick={onClick} className={horizontal ? "flex" : ""}>
      <div className={horizontal ? "w-2/5 shrink-0" : ""}>
        <CardMedia src={src} alt={alt} label={label} aspect={horizontal ? 1 : aspect}
          overlay={badge ? (
            <span className="absolute top-3 left-3 rounded-full bg-surface/90 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">
              {badge}
            </span>
          ) : undefined}
          className={horizontal ? "h-full" : ""} />
      </div>
      <div className="p-5 min-w-0 flex-1">
        <p className="text-base font-semibold leading-snug text-foreground">{title}</p>
        {description && <p className="mt-1.5 text-sm text-muted leading-relaxed">{description}</p>}
        {meta && <div className="mt-3 flex items-center gap-2 text-[11px] text-muted">{meta}</div>}
        {actions && <div className="mt-4 flex items-center gap-2">{actions}</div>}
      </div>
    </Card>
  );
}

/** Perfil: avatar (o iniciales), nombre, rol, stats y acciones. */
export function ProfileCard({
  name, role, avatar, cover, stats, actions, variant = "outline",
}: {
  name: string; role?: string; avatar?: string; cover?: boolean;
  stats?: { label: string; value: string | number }[]; actions?: ReactNode; variant?: CardVariant;
}) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <Card variant={variant} padding="none">
      {cover && <div className="h-20 bg-gradient-to-r from-primary/70 to-accent/70" />}
      <div className={`p-5 ${cover ? "-mt-9" : ""}`}>
        {avatar ? (
          <img src={avatar} alt="" className="w-14 h-14 rounded-full object-cover ring-4 ring-surface" />
        ) : (
          <span className="w-14 h-14 rounded-full grid place-items-center bg-gradient-to-br from-primary to-accent text-white text-lg font-bold ring-4 ring-surface">
            {initials}
          </span>
        )}
        <p className="mt-3 text-base font-semibold text-foreground">{name}</p>
        {role && <p className="text-xs text-muted mt-0.5">{role}</p>}
        {stats && (
          <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-xl border border-border bg-surface-alt/50">
            {stats.map((s) => (
              <div key={s.label} className="px-2 py-2.5 text-center">
                <p className="text-sm font-bold text-foreground tabular-nums">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}
        {actions && <div className="mt-4 flex gap-2">{actions}</div>}
      </div>
    </Card>
  );
}

/** Plan con precio, lista de features y CTA. `highlight` la destaca. */
export function PricingCard({
  plan, price, period = "/mes", description, features, cta, highlight = false, badge,
}: {
  plan: string; price: string; period?: string; description?: string;
  features: string[]; cta?: ReactNode; highlight?: boolean; badge?: string;
}) {
  return (
    <Card variant={highlight ? "gradient" : "outline"} padding="lg"
      className={highlight ? "ring-1 ring-primary/30" : ""}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-foreground">{plan}</p>
        {badge && (
          <span className="rounded-full bg-primary text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end gap-1">
        <span className="text-4xl font-bold tracking-tight text-foreground">{price}</span>
        <span className="text-sm text-muted mb-1.5">{period}</span>
      </div>
      {description && <p className="mt-2 text-xs text-muted leading-relaxed">{description}</p>}
      <ul className="mt-5 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-foreground">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-primary">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="leading-snug">{f}</span>
          </li>
        ))}
      </ul>
      {cta && <div className="mt-6">{cta}</div>}
    </Card>
  );
}
