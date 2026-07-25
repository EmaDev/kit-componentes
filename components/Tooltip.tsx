"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export type TooltipSide = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";

interface TooltipProps {
  /** Contenido del globo. Si es falsy, el tooltip no se activa. */
  content: ReactNode;
  children: ReactNode;
  /** Lado preferido respecto al trigger. Se invierte automáticamente si no entra en el viewport. Default: "top". */
  side?: TooltipSide;
  /** Alineación sobre el eje perpendicular al lado. Default: "center". */
  align?: TooltipAlign;
  /** Delay en ms antes de mostrarse al hacer hover/focus. Default: 300. */
  delay?: number;
  disabled?: boolean;
  className?: string;
  contentClassName?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  delay = 300,
  disabled = false,
  className = "",
  contentClassName = "",
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [resolvedSide, setResolvedSide] = useState<TooltipSide>(side);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();

  const show = () => {
    if (disabled || !content) return;
    timerRef.current = setTimeout(() => setOpen(true), delay);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      setResolvedSide(side);
      return;
    }
    const wrapper = wrapperRef.current;
    const bubble = bubbleRef.current;
    if (!wrapper || !bubble) return;

    const wr = wrapper.getBoundingClientRect();
    const br = bubble.getBoundingClientRect();
    const margin = 8;
    let next = side;
    if (side === "top" && wr.top - br.height - margin < 0) next = "bottom";
    else if (side === "bottom" && wr.bottom + br.height + margin > window.innerHeight) next = "top";
    else if (side === "left" && wr.left - br.width - margin < 0) next = "right";
    else if (side === "right" && wr.right + br.width + margin > window.innerWidth) next = "left";
    setResolvedSide(next);
  }, [open, side]);

  return (
    <span
      ref={wrapperRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      aria-describedby={open ? id : undefined}
    >
      {children}

      <AnimatePresence>
        {open && content && (
          <motion.div
            ref={bubbleRef}
            role="tooltip"
            id={id}
            initial={{ opacity: 0, scale: 0.92, ...offsetFor(resolvedSide, true) }}
            animate={{ opacity: 1, scale: 1, ...offsetFor(resolvedSide, false) }}
            exit={{ opacity: 0, scale: 0.92, ...offsetFor(resolvedSide, true) }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={[
              "absolute z-[95] pointer-events-none",
              sideCls(resolvedSide),
              alignCls(resolvedSide, align),
              "rounded-lg bg-foreground text-surface text-xs font-medium leading-snug",
              "px-2.5 py-1.5 shadow-lg whitespace-nowrap max-w-xs",
              contentClassName,
            ].join(" ")}
          >
            {content}
            <span className={arrowCls(resolvedSide, align)} />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

function offsetFor(side: TooltipSide, collapsed: boolean) {
  const d = collapsed ? 4 : 0;
  switch (side) {
    case "top":
      return { y: d };
    case "bottom":
      return { y: -d };
    case "left":
      return { x: d };
    case "right":
      return { x: -d };
  }
}

function sideCls(side: TooltipSide) {
  switch (side) {
    case "top":
      return "bottom-full mb-2";
    case "bottom":
      return "top-full mt-2";
    case "left":
      return "right-full mr-2";
    case "right":
      return "left-full ml-2";
  }
}

function alignCls(side: TooltipSide, align: TooltipAlign) {
  const vertical = side === "top" || side === "bottom";
  if (vertical) {
    if (align === "start") return "left-0";
    if (align === "end") return "right-0";
    return "left-1/2 -translate-x-1/2";
  }
  if (align === "start") return "top-0";
  if (align === "end") return "bottom-0";
  return "top-1/2 -translate-y-1/2";
}

function arrowCls(side: TooltipSide, align: TooltipAlign) {
  const base = "absolute w-2 h-2 bg-foreground rotate-45";
  const vertical = side === "top" || side === "bottom";

  const edge =
    side === "top"
      ? "top-full -mt-1"
      : side === "bottom"
      ? "bottom-full -mb-1"
      : side === "left"
      ? "left-full -ml-1"
      : "right-full -mr-1";

  const cross = vertical
    ? align === "start"
      ? "left-3"
      : align === "end"
        ? "right-3"
        : "left-1/2 -translate-x-1/2"
    : align === "start"
      ? "top-3"
      : align === "end"
        ? "bottom-3"
        : "top-1/2 -translate-y-1/2";

  return [base, edge, cross].join(" ");
}
