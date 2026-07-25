"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type PopoverSide = "top" | "bottom" | "left" | "right";
export type PopoverAlign = "start" | "center" | "end";

interface PopoverProps {
  /** Elemento que abre/cierra el panel al hacer click. */
  trigger: ReactNode;
  /** Contenido arbitrario del panel (formularios, texto, botones, etc.). */
  children: ReactNode;
  /** Estado controlado. Si se omite, el componente maneja su propio estado interno. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: PopoverSide;
  align?: PopoverAlign;
  /** Cerrar al hacer click fuera del panel. Default: true. */
  closeOnOutsideClick?: boolean;
  /** Cerrar al presionar Escape. Default: true. */
  closeOnEscape?: boolean;
  showArrow?: boolean;
  className?: string;
  contentClassName?: string;
}

export function Popover({
  trigger,
  children,
  open: openProp,
  onOpenChange,
  side = "bottom",
  align = "center",
  closeOnOutsideClick = true,
  closeOnEscape = true,
  showArrow = true,
  className = "",
  contentClassName = "",
}: PopoverProps) {
  const [openState, setOpenState] = useState(false);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : openState;
  const ref = useRef<HTMLDivElement>(null);

  const setOpen = (next: boolean) => {
    if (!controlled) setOpenState(next);
    onOpenChange?.(next);
  };

  useEffect(() => {
    if (!closeOnOutsideClick) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeOnOutsideClick]);

  useEffect(() => {
    if (!closeOnEscape) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeOnEscape]);

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <div onClick={() => setOpen(!open)} className="inline-flex">
        {trigger}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            initial={{ opacity: 0, scale: 0.95, ...offsetFor(side, true) }}
            animate={{ opacity: 1, scale: 1, ...offsetFor(side, false) }}
            exit={{ opacity: 0, scale: 0.95, ...offsetFor(side, true), transition: { duration: 0.1 } }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={[
              "absolute z-[95] min-w-[220px]",
              sideCls(side),
              alignCls(side, align),
              "rounded-xl border border-border bg-surface shadow-xl shadow-black/10",
              "p-4",
              contentClassName,
            ].join(" ")}
          >
            {children}
            {showArrow && <span className={arrowCls(side, align)} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function offsetFor(side: PopoverSide, collapsed: boolean) {
  const d = collapsed ? 6 : 0;
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

function sideCls(side: PopoverSide) {
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

function alignCls(side: PopoverSide, align: PopoverAlign) {
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

function arrowCls(side: PopoverSide, align: PopoverAlign) {
  const base = "absolute w-3 h-3 bg-surface border-border rotate-45";
  const vertical = side === "top" || side === "bottom";

  const edge =
    side === "top"
      ? "top-full -mt-1.5 border-b border-r"
      : side === "bottom"
      ? "bottom-full -mb-1.5 border-t border-l"
      : side === "left"
      ? "left-full -ml-1.5 border-t border-r"
      : "right-full -mr-1.5 border-b border-l";

  const cross = vertical
    ? align === "start"
      ? "left-4"
      : align === "end"
        ? "right-4"
        : "left-1/2 -translate-x-1/2"
    : align === "start"
      ? "top-4"
      : align === "end"
        ? "bottom-4"
        : "top-1/2 -translate-y-1/2";

  return [base, edge, cross].join(" ");
}
