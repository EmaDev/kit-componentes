"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";

interface StepperProps {
  value: number;
  /** puede devolver una promesa: el botón muestra loading hasta que resuelva */
  onChange: (value: number) => void | Promise<unknown>;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md" | "lg";
  /** variante visual */
  variant?: "solid" | "outline" | "pill";
  /** arranca colapsado en un "+" y se expande al primer toque (estilo carrito) */
  collapsible?: boolean;
  /** unidad mostrada junto al número, ej. "kg" */
  unit?: string;
  disabled?: boolean;
  className?: string;
}

const S = {
  sm: { btn: 28, font: "text-[13px]", num: 32 },
  md: { btn: 36, font: "text-sm", num: 40 },
  lg: { btn: 44, font: "text-base", num: 52 },
};

/**
 * Stepper de cantidad con loading independiente en «+» y «−»: si onChange
 * devuelve una promesa, sólo ese botón queda en spinner y el otro se bloquea.
 */
export function Stepper({
  value, onChange, min = 0, max = 99, step = 1,
  size = "md", variant = "solid", collapsible = false,
  unit, disabled = false, className = "",
}: StepperProps) {
  const [busy, setBusy] = useState<"inc" | "dec" | null>(null);
  const [expanded, setExpanded] = useState(!collapsible || value > min);
  const prev = useRef(value);
  const dir = value > prev.current ? 1 : -1;
  prev.current = value;

  const s = S[size];
  const atMin = value <= min;
  const atMax = value >= max;

  const run = async (kind: "inc" | "dec") => {
    if (disabled || busy) return;
    const next = kind === "inc" ? Math.min(max, value + step) : Math.max(min, value - step);
    if (next === value) return;
    setBusy(kind);
    try { await onChange(next); } finally { setBusy(null); }
    if (collapsible && next <= min) setExpanded(false);
  };

  const shell = {
    solid: "bg-surface-alt border border-border",
    outline: "border border-border bg-surface",
    pill: "bg-surface-alt border border-border rounded-full",
  }[variant];

  const btnBase = "relative grid place-items-center shrink-0 transition-colors disabled:opacity-30 disabled:cursor-not-allowed";
  const round = variant === "pill" ? "rounded-full" : "rounded-lg";

  if (collapsible && !expanded) {
    return (
      <motion.button
        layout
        onClick={() => { setExpanded(true); run("inc"); }}
        whileTap={{ scale: 0.92 }}
        disabled={disabled}
        aria-label="Agregar"
        className={`${btnBase} ${round} bg-primary text-white shadow-sm shadow-primary/30 ${className}`}
        style={{ width: s.btn, height: s.btn }}
      >
        <PlusIcon size={size} />
      </motion.button>
    );
  }

  return (
    <motion.div
      layout
      className={`inline-flex items-center gap-1 p-1 ${shell} ${className}`}
      role="group"
      aria-label="Cantidad"
    >
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => run("dec")}
        disabled={disabled || atMin || busy !== null}
        aria-label="Restar"
        className={`${btnBase} ${round} text-foreground hover:bg-surface hover:shadow-sm`}
        style={{ width: s.btn, height: s.btn }}
      >
        {busy === "dec" ? <Spin /> : <MinusIcon size={size} />}
      </motion.button>

      <div className="relative overflow-hidden text-center tabular-nums" style={{ width: unit ? s.num + 18 : s.num, height: s.btn }}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: dir * 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: dir * -18, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`absolute inset-0 grid place-items-center font-semibold text-foreground ${s.font}`}
          >
            {value}{unit && <span className="text-muted ml-0.5 text-[0.85em]">{unit}</span>}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => run("inc")}
        disabled={disabled || atMax || busy !== null}
        aria-label="Sumar"
        className={`${btnBase} ${round} text-foreground hover:bg-surface hover:shadow-sm`}
        style={{ width: s.btn, height: s.btn }}
      >
        {busy === "inc" ? <Spin /> : <PlusIcon size={size} />}
      </motion.button>
    </motion.div>
  );
}

/** Botón "agregar" con estados idle → loading → hecho. */
export function AddButton({
  onAdd, label = "Agregar", addedLabel = "Agregado", size = "md", className = "",
}: {
  onAdd: () => void | Promise<unknown>;
  label?: string;
  addedLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const h = { sm: "h-8 px-3 text-xs", md: "h-10 px-4 text-sm", lg: "h-12 px-5 text-base" }[size];

  const click = async () => {
    if (state !== "idle") return;
    setState("busy");
    try {
      await onAdd();
      setState("done");
      setTimeout(() => setState("idle"), 1600);
    } catch {
      setState("idle");
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={click}
      disabled={state !== "idle"}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors",
        h,
        state === "done" ? "bg-success text-white" : "bg-primary text-white shadow-sm shadow-primary/30 hover:bg-primary-hover",
        className,
      ].join(" ")}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={state}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.16 }}
          className="inline-flex items-center gap-2"
        >
          {state === "busy" ? <Spin /> : state === "done" ? <CheckIcon /> : <PlusIcon size="sm" />}
          {state === "done" ? addedLabel : label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/* ---------- iconos ---------- */
const dims = { sm: 14, md: 16, lg: 20 };
function PlusIcon({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const d = dims[size];
  return (
    <svg width={d} height={d} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function MinusIcon({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const d = dims[size];
  return (
    <svg width={d} height={d} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function Spin() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
      className="inline-block w-[15px] h-[15px] rounded-full border-2 border-current border-t-transparent"
    />
  );
}
