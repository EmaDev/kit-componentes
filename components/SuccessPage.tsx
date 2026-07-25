"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Confetti } from "./Confetti";

export interface SuccessDetail {
  label: string;
  value: string;
}

interface SuccessPageProps {
  title?: string;
  description?: string;
  /** número de operación, monto, código de reserva… */
  headline?: string;
  details?: SuccessDetail[];
  primary?: { label: string; onClick?: () => void; href?: string };
  secondary?: { label: string; onClick?: () => void; href?: string };
  /** burst | rain | center | false */
  confetti?: "burst" | "rain" | "center" | false;
  /** redirección automática: segundos */
  redirectIn?: number;
  onRedirect?: () => void;
  tone?: "success" | "primary" | "accent";
  /** full = pantalla completa · card = tarjeta embebida */
  variant?: "full" | "card";
  footnote?: string;
  children?: React.ReactNode;
  className?: string;
}

const TONES = {
  success: { ring: "bg-success", soft: "bg-success/12", text: "text-success" },
  primary: { ring: "bg-primary", soft: "bg-primary/12", text: "text-primary" },
  accent:  { ring: "bg-accent",  soft: "bg-accent/12",  text: "text-accent" },
};

/** Pantalla de éxito: check animado, confeti, detalles de la operación y CTA. */
export function SuccessPage({
  title = "¡Listo!", description, headline, details = [], primary, secondary,
  confetti = "burst", redirectIn, onRedirect, tone = "success",
  variant = "full", footnote, children, className = "",
}: SuccessPageProps) {
  const t = TONES[tone];
  const [left, setLeft] = useState(redirectIn ?? 0);
  const [shot, setShot] = useState(1);

  useEffect(() => {
    if (!redirectIn) return;
    setLeft(redirectIn);
    const id = setInterval(() => {
      setLeft(v => {
        if (v <= 1) { clearInterval(id); onRedirect?.(); return 0; }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [redirectIn, onRedirect]);

  const Action = ({ a, kind }: { a: NonNullable<SuccessPageProps["primary"]>; kind: "primary" | "secondary" }) => {
    const cls = kind === "primary"
      ? `h-12 px-6 rounded-xl text-sm font-bold text-white shadow-lg shadow-black/10 hover:brightness-110 active:scale-95 transition-all inline-flex items-center justify-center ${t.ring}`
      : "h-12 px-6 rounded-xl text-sm font-bold text-foreground border border-border bg-surface hover:bg-surface-alt active:scale-95 transition-all inline-flex items-center justify-center";
    return a.href
      ? <a href={a.href} onClick={a.onClick} className={cls}>{a.label}</a>
      : <button type="button" onClick={a.onClick} className={cls}>{a.label}</button>;
  };

  return (
    <div className={[
      "relative overflow-hidden",
      variant === "full"
        ? "min-h-[100dvh] bg-surface flex items-center justify-center px-5 py-12"
        : "rounded-3xl border border-border bg-surface px-6 py-10",
      className,
    ].join(" ")}>
      {confetti && <Confetti fire={shot} mode={confetti}/>}

      {/* halo */}
      <div className={`pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full blur-3xl opacity-25 ${t.ring}`}/>

      <div className="relative w-full max-w-md mx-auto text-center">
        {/* check */}
        <motion.div initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 16 }}
          className="mx-auto relative w-24 h-24">
          <motion.span animate={{ scale: [1, 1.5], opacity: [0.45, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            className={`absolute inset-0 rounded-full ${t.ring}`}/>
          <span className={`absolute inset-0 rounded-full ${t.soft}`}/>
          <span className={`absolute inset-2 rounded-full ${t.ring} inline-flex items-center justify-center text-white shadow-xl shadow-black/15`}>
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <motion.polyline points="20 6 9 17 4 12"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.22, duration: 0.42, ease: "easeOut" }}/>
            </svg>
          </span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="mt-7 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          {title}
        </motion.h1>

        {headline && (
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
            className="mt-2 text-2xl font-extrabold tabular-nums text-foreground">
            {headline}
          </motion.p>
        )}

        {description && (
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
            className="mt-3 text-sm text-muted leading-relaxed" style={{ textWrap: "pretty" }}>
            {description}
          </motion.p>
        )}

        {details.length > 0 && (
          <motion.dl initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-7 rounded-2xl border border-border bg-surface-alt/50 divide-y divide-border text-left overflow-hidden">
            {details.map(d => (
              <div key={d.label} className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-xs text-muted">{d.label}</dt>
                <dd className="text-xs font-bold text-foreground text-right tabular-nums">{d.value}</dd>
              </div>
            ))}
          </motion.dl>
        )}

        {children && <div className="mt-6 text-left">{children}</div>}

        {(primary || secondary) && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
            className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
            {primary && <Action a={primary} kind="primary"/>}
            {secondary && <Action a={secondary} kind="secondary"/>}
          </motion.div>
        )}

        {redirectIn ? (
          <p className="mt-5 text-[11px] text-muted">
            Te llevamos de vuelta en <b className="text-foreground tabular-nums">{left}s</b>
          </p>
        ) : null}

        {footnote && <p className="mt-5 text-[11px] text-muted leading-relaxed">{footnote}</p>}

        {confetti && (
          <button type="button" onClick={() => setShot(s => s + 1)}
            className="mt-6 text-[11px] font-semibold text-muted hover:text-foreground transition-colors">
            Repetir la animación
          </button>
        )}
      </div>
    </div>
  );
}
