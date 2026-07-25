"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

interface CouponCodeProps {
  code: string;
  /** texto del beneficio: «30% OFF en toda la tienda» */
  label?: string;
  /** vence en esta fecha/timestamp; el timer cuenta solo */
  expiresAt?: Date | number;
  /** o dura N segundos desde que se monta */
  durationMs?: number;
  /** consumos: cupos limitados */
  uses?: { used: number; total: number };
  /** se dispara al copiar */
  onCopy?: (code: string) => void;
  /** se dispara una vez cuando llega a cero */
  onExpire?: () => void;
  tone?: "primary" | "danger" | "success" | "accent";
  size?: "sm" | "md";
  className?: string;
}

const TONES = {
  primary: { text: "text-primary", bg: "bg-primary/8", border: "border-primary/30", bar: "bg-primary", solid: "bg-primary" },
  danger: { text: "text-danger", bg: "bg-danger/8", border: "border-danger/30", bar: "bg-danger", solid: "bg-danger" },
  success: { text: "text-success", bg: "bg-success/8", border: "border-success/30", bar: "bg-success", solid: "bg-success" },
  accent: { text: "text-accent", bg: "bg-accent/8", border: "border-accent/30", bar: "bg-accent", solid: "bg-accent" },
};

const two = (n: number) => String(Math.max(0, n)).padStart(2, "0");

/** Cupón temporal: código copiable, timer de vencimiento y/o cupos consumidos. */
export function CouponCode({
  code, label, expiresAt, durationMs, uses, onCopy, onExpire,
  tone = "primary", size = "md", className = "",
}: CouponCodeProps) {
  const deadline = useMemo(() => {
    if (expiresAt) return typeof expiresAt === "number" ? expiresAt : expiresAt.getTime();
    if (durationMs) return Date.now() + durationMs;
    return null;
  }, [expiresAt, durationMs]);

  const [left, setLeft] = useState(() => (deadline ? Math.max(0, deadline - Date.now()) : null));
  const [copied, setCopied] = useState(false);
  const fired = useRef(false);
  const t = TONES[tone];

  useEffect(() => {
    if (!deadline) return;
    const tick = () => {
      const ms = Math.max(0, deadline - Date.now());
      setLeft(ms);
      if (ms === 0 && !fired.current) { fired.current = true; onExpire?.(); }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline, onExpire]);

  const soldOut = !!uses && uses.used >= uses.total;
  const expired = left === 0;
  const dead = soldOut || expired;

  const copy = async () => {
    if (dead) return;
    try { await navigator.clipboard.writeText(code); } catch { /* sin permiso */ }
    setCopied(true);
    onCopy?.(code);
    setTimeout(() => setCopied(false), 1800);
  };

  const totalSec = left != null ? Math.floor(left / 1000) : 0;
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const urgent = left != null && left > 0 && left < 60_000;

  const pct = uses ? Math.min(100, (uses.used / uses.total) * 100) : 0;
  const pad = size === "sm" ? "p-3" : "p-4";

  return (
    <div className={`rounded-2xl border border-dashed ${dead ? "border-border" : t.border} ${dead ? "bg-surface-alt/50" : t.bg} ${pad} ${className}`}>
      <div className="flex items-center gap-3">
        {/* código */}
        <div className="flex-1 min-w-0">
          {label && (
            <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${dead ? "text-muted" : t.text}`}>{label}</p>
          )}
          <p className={[
            "mt-1 font-mono font-extrabold tracking-[0.12em] tabular-nums",
            size === "sm" ? "text-base" : "text-xl",
            dead ? "text-muted line-through" : "text-foreground",
          ].join(" ")}>
            {code}
          </p>
        </div>

        <button type="button" onClick={copy} disabled={dead}
          className={[
            "shrink-0 h-10 px-3.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all active:scale-95",
            dead ? "bg-surface-alt border border-border text-muted cursor-not-allowed"
                 : `${t.solid} text-white shadow-md shadow-black/10 hover:brightness-110`,
          ].join(" ")}>
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Copiado
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              {dead ? "No disponible" : "Copiar"}
            </>
          )}
        </button>
      </div>

      {/* timer */}
      {left != null && (
        <div className="mt-3 flex items-center gap-2">
          <span className={`shrink-0 ${expired ? "text-muted" : urgent ? "text-danger" : t.text}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>
            </svg>
          </span>
          {expired ? (
            <p className="text-[11px] font-semibold text-muted">El cupón venció</p>
          ) : (
            <motion.p animate={urgent ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: urgent ? Infinity : 0 }}
              className={`text-[11px] font-semibold tabular-nums ${urgent ? "text-danger" : "text-foreground"}`}>
              Vence en {h > 0 && `${two(h)}:`}{two(m)}:{two(s)}
            </motion.p>
          )}
        </div>
      )}

      {/* consumos */}
      {uses && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-muted">
              {soldOut ? "Se agotaron los cupones" : <>Quedan <b className="text-foreground tabular-nums">{uses.total - uses.used}</b> de {uses.total}</>}
            </span>
            <span className="text-muted tabular-nums">{Math.round(pct)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-border/70 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
              className={`h-full rounded-full ${soldOut ? "bg-muted" : t.bar}`}/>
          </div>
        </div>
      )}
    </div>
  );
}
