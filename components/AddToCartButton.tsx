"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface AddToCartButtonProps {
  onAdd: () => void | Promise<unknown>;
  label?: string;
  addedLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/** Botón "agregar" con estados idle → loading → hecho. */
export function AddToCartButton({
  onAdd, label = "Agregar", addedLabel = "Agregado", size = "md", className = "",
}: AddToCartButtonProps) {
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
          {state === "busy" ? <Spin /> : state === "done" ? <CheckIcon /> : <PlusIcon />}
          {state === "done" ? addedLabel : label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/* ---------- iconos ---------- */
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
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
