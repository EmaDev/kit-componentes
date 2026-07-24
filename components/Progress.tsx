"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode } from "react";

type Tone = "primary" | "accent" | "success" | "danger" | "warning";

const TONE_FILL: Record<Tone, string> = {
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  danger: "bg-danger",
  warning: "bg-accent",
};
const TONE_STROKE: Record<Tone, string> = {
  primary: "var(--color-primary)",
  accent: "var(--color-accent)",
  success: "var(--color-success)",
  danger: "var(--color-danger)",
  warning: "var(--color-accent)",
};

interface ProgressBarProps {
  /** 0 → 100. Omitilo para el modo indeterminado */
  value?: number;
  max?: number;
  tone?: Tone;
  size?: "xs" | "sm" | "md" | "lg";
  /** mostrar el porcentaje al costado */
  showValue?: boolean;
  label?: ReactNode;
  /** rayado animado, para "trabajando" */
  striped?: boolean;
  /** segmentos discretos en vez de continuo, ej. 5 pasos */
  segments?: number;
  className?: string;
}

const H = { xs: 3, sm: 5, md: 8, lg: 12 };

/** Barra de progreso: continua, segmentada, rayada o indeterminada. */
export function ProgressBar({
  value, max = 100, tone = "primary", size = "md",
  showValue = false, label, striped = false, segments, className = "",
}: ProgressBarProps) {
  const indeterminate = value == null;
  const pct = indeterminate ? 0 : Math.max(0, Math.min(100, (value / max) * 100));
  const h = H[size];

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-3 mb-1.5">
          {label && <span className="text-xs font-medium text-foreground">{label}</span>}
          {showValue && !indeterminate && (
            <span className="text-xs font-semibold text-muted tabular-nums">{Math.round(pct)}%</span>
          )}
        </div>
      )}

      {segments ? (
        <div className="flex items-center gap-1" role="progressbar" aria-valuenow={value} aria-valuemax={max}>
          {Array.from({ length: segments }, (_, i) => {
            const filled = !indeterminate && pct >= ((i + 1) / segments) * 100 - 0.001;
            return (
              <motion.span
                key={i}
                initial={false}
                animate={{ opacity: filled ? 1 : 0.18 }}
                transition={{ duration: 0.25, delay: filled ? i * 0.04 : 0 }}
                className={`flex-1 rounded-full ${filled ? TONE_FILL[tone] : "bg-muted"}`}
                style={{ height: h }}
              />
            );
          })}
        </div>
      ) : (
        <div
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="relative w-full rounded-full bg-border overflow-hidden"
          style={{ height: h }}
        >
          {indeterminate ? (
            <motion.span
              className={`absolute inset-y-0 w-1/3 rounded-full ${TONE_FILL[tone]}`}
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : (
            <motion.span
              className={`absolute inset-y-0 left-0 rounded-full ${TONE_FILL[tone]}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            >
              {striped && (
                <motion.span
                  className="absolute inset-0 rounded-full opacity-25"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, #fff 0 6px, transparent 6px 12px)",
                    backgroundSize: "17px 17px",
                  }}
                  animate={{ backgroundPositionX: ["0px", "17px"] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.span>
          )}
        </div>
      )}
    </div>
  );
}

interface ProgressRingProps {
  value?: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: Tone;
  /** contenido al centro; por defecto el porcentaje */
  children?: ReactNode;
  showValue?: boolean;
  className?: string;
}

/** Progreso circular, con modo indeterminado. */
export function ProgressRing({
  value, max = 100, size = 72, thickness = 7, tone = "primary",
  children, showValue = true, className = "",
}: ProgressRingProps) {
  const indeterminate = value == null;
  const pct = indeterminate ? 25 : Math.max(0, Math.min(100, (value / max) * 100));
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <div className={`relative inline-grid place-items-center ${className}`} style={{ width: size, height: size }}>
      <motion.svg
        width={size} height={size} className="-rotate-90"
        animate={indeterminate ? { rotate: [0, 360] } : undefined}
        transition={indeterminate ? { duration: 1, repeat: Infinity, ease: "linear" } : undefined}
        style={indeterminate ? { rotate: 0 } : undefined}
      >
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-border)" strokeWidth={thickness} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={TONE_STROKE[tone]} strokeWidth={thickness} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
        />
      </motion.svg>
      <div className="absolute inset-0 grid place-items-center">
        {children ?? (showValue && !indeterminate && (
          <span className="text-sm font-bold text-foreground tabular-nums">{Math.round(pct)}%</span>
        ))}
      </div>
    </div>
  );
}

interface StepsProgressProps {
  steps: string[];
  /** índice del paso actual (0-based) */
  current: number;
  tone?: Tone;
  className?: string;
}

/** Progreso por pasos con conectores y check en los completados. */
export function StepsProgress({ steps, current, tone = "primary", className = "" }: StepsProgressProps) {
  return (
    <div className={`flex items-start ${className}`}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex-1 flex flex-col items-center min-w-0">
            <div className="flex items-center w-full">
              <span className={`h-0.5 flex-1 rounded-full ${i === 0 ? "opacity-0" : done || active ? TONE_FILL[tone] : "bg-border"}`} />
              <motion.span
                initial={false}
                animate={{ scale: active ? 1.12 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className={[
                  "shrink-0 w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold border-2 transition-colors",
                  done ? `${TONE_FILL[tone]} border-transparent text-white` : "",
                  active ? `bg-surface border-current text-foreground` : "",
                  !done && !active ? "bg-surface border-border text-muted" : "",
                ].join(" ")}
                style={active ? { color: TONE_STROKE[tone] } : undefined}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {done ? (
                    <motion.svg key="c" initial={{ scale: 0 }} animate={{ scale: 1 }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  ) : (
                    <motion.span key="n" initial={{ scale: 0 }} animate={{ scale: 1 }}>{i + 1}</motion.span>
                  )}
                </AnimatePresence>
              </motion.span>
              <span className={`h-0.5 flex-1 rounded-full ${i === steps.length - 1 ? "opacity-0" : done ? TONE_FILL[tone] : "bg-border"}`} />
            </div>
            <span className={`mt-2 text-[11px] text-center leading-tight px-1 truncate max-w-full ${active ? "font-semibold text-foreground" : "text-muted"}`}>
              {s}
            </span>
          </div>
        );
      })}
    </div>
  );
}
