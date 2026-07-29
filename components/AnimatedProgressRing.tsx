"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedProgressRingProps { value: number; size?: number; strokeWidth?: number; label?: string; color?: string; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Anillo de progreso con animación spring — para logros, metas cumplidas o avance de un objetivo. */
export function AnimatedProgressRing({ value, size = 96, strokeWidth = 8, label, color, className = "" }: AnimatedProgressRingProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-border"/>
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color ?? "currentColor"} strokeWidth={strokeWidth} strokeLinecap="round"
          className={color ? "" : "text-primary"} strokeDasharray={c}
          initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: mounted ? c - (c * pct) / 100 : c }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}/>
      </svg>
      <span className="absolute text-lg font-black text-foreground tracking-tight">{label ?? `${Math.round(pct)}%`}</span>
    </div>
  );
}
