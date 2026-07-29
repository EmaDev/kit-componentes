"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface AnimatedCounterProps { value: number; format?: (n: number) => string; duration?: number; className?: string }
const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/** Contador tipo odómetro: el número rueda suavemente hacia el nuevo valor en vez de saltar. */
export function AnimatedCounter({ value, format = n => Math.round(n).toLocaleString(), duration = 0.8, className = "" }: AnimatedCounterProps) {
  const spring = useSpring(value, { duration: duration * 1000, bounce: 0.15 });
  const display = useTransform(spring, v => format(v));
  useEffect(() => { spring.set(value); }, [value, spring]);
  return <motion.span className={cn("tabular-nums", className)}>{display}</motion.span>;
}
