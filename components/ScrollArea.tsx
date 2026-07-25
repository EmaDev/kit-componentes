"use client";

import { motion, type Transition } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

export type ScrollAreaVariant = "thin" | "pill" | "glow" | "debounce";
export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

interface AxisMetrics {
  scrollSize: number;
  clientSize: number;
  scrollPos: number;
}

interface ScrollAreaProps {
  children: ReactNode;
  /** Formato/grosor/animación de la barra. Default: "thin". */
  variant?: ScrollAreaVariant;
  orientation?: ScrollAreaOrientation;
  /** Alto máximo del viewport scrolleable (cualquier valor CSS válido, ej. "20rem", 320). */
  maxHeight?: string | number;
  /** Ms de inactividad tras dejar de scrollear antes de atenuar el thumb ("thin"/"glow"/"debounce"). Default: 900. */
  hideDelay?: number;
  /** Ms de debounce antes de revelar el thumb tras iniciar el hover/scroll. Sólo aplica a `variant="debounce"`; arrastrar el thumb siempre lo revela al instante. Default: 160. */
  showDelay?: number;
  className?: string;
  contentClassName?: string;
}

const THICKNESS: Record<ScrollAreaVariant, number> = { thin: 4, pill: 8, glow: 6, debounce: 5 };
const THICKNESS_ACTIVE: Record<ScrollAreaVariant, number> = { thin: 4, pill: 12, glow: 8, debounce: 11 };
const IDLE_OPACITY: Record<ScrollAreaVariant, number> = { thin: 0, pill: 0.35, glow: 0.45, debounce: 0 };

const THUMB_TRANSITION: Record<ScrollAreaVariant, Transition> = {
  thin: { type: "spring", stiffness: 420, damping: 34 },
  pill: { type: "spring", stiffness: 420, damping: 34 },
  glow: { type: "spring", stiffness: 420, damping: 34 },
  // más blando y con overshoot: el grosor "rebota" al asentarse, en vez de resolver directo.
  debounce: { type: "spring", stiffness: 200, damping: 12, mass: 0.7 },
};

export function ScrollArea({
  children,
  variant = "thin",
  orientation = "vertical",
  maxHeight,
  hideDelay = 900,
  showDelay = 160,
  className = "",
  contentClassName = "",
}: ScrollAreaProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [y, setY] = useState<AxisMetrics | null>(null);
  const [x, setX] = useState<AxisMetrics | null>(null);
  const [hovering, setHovering] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [dragging, setDragging] = useState<"x" | "y" | null>(null);
  const [debouncedReveal, setDebouncedReveal] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showY = orientation === "vertical" || orientation === "both";
  const showX = orientation === "horizontal" || orientation === "both";
  const rawActive = hovering || scrolling;

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    if (showY) setY({ scrollSize: el.scrollHeight, clientSize: el.clientHeight, scrollPos: el.scrollTop });
    if (showX) setX({ scrollSize: el.scrollWidth, clientSize: el.clientWidth, scrollPos: el.scrollLeft });
  }, [showY, showX]);

  useEffect(() => {
    measure();
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
  }, []);

  // "debounce": la revelación del thumb espera `showDelay` de actividad sostenida
  // antes de aparecer (en vez de reaccionar al instante como el resto de variantes).
  useEffect(() => {
    if (variant !== "debounce") return;
    if (!rawActive) {
      setDebouncedReveal(false);
      return;
    }
    const t = setTimeout(() => setDebouncedReveal(true), showDelay);
    return () => clearTimeout(t);
  }, [rawActive, variant, showDelay]);

  const handleScroll = () => {
    measure();
    setScrolling(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setScrolling(false), hideDelay);
  };

  const startDrag = (axis: "x" | "y") => (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const el = viewportRef.current;
    if (!el) return;
    const startClient = axis === "y" ? e.clientY : e.clientX;
    const startScroll = axis === "y" ? el.scrollTop : el.scrollLeft;
    const trackSize = axis === "y" ? el.clientHeight : el.clientWidth;
    const scrollSize = axis === "y" ? el.scrollHeight : el.scrollWidth;
    const clientSize = axis === "y" ? el.clientHeight : el.clientWidth;
    const maxScroll = Math.max(scrollSize - clientSize, 0);
    setDragging(axis);

    const onMove = (ev: PointerEvent) => {
      const current = axis === "y" ? ev.clientY : ev.clientX;
      const delta = current - startClient;
      const next = startScroll + delta * (maxScroll / Math.max(trackSize, 1));
      const clamped = Math.min(Math.max(next, 0), maxScroll);
      if (axis === "y") el.scrollTop = clamped;
      else el.scrollLeft = clamped;
      measure();
    };
    const onUp = () => {
      setDragging(null);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // arrastrar siempre revela al instante, incluso en "debounce" — el delay sólo
  // aplica a la revelación pasiva (hover/scroll), nunca mientras el usuario ya lo tiene agarrado.
  const active = dragging !== null || (variant === "debounce" ? debouncedReveal : rawActive);
  const overflowCls =
    showX && showY ? "overflow-auto" : showX ? "overflow-x-auto overflow-y-hidden" : "overflow-y-auto overflow-x-hidden";

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        ref={viewportRef}
        onScroll={handleScroll}
        style={{ maxHeight }}
        className={[
          overflowCls,
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          contentClassName,
        ].join(" ")}
      >
        {children}
      </div>

      {showY && y && y.clientSize < y.scrollSize && (
        <Thumb axis="y" metrics={y} variant={variant} active={active} dragging={dragging === "y"} onPointerDown={startDrag("y")} />
      )}
      {showX && x && x.clientSize < x.scrollSize && (
        <Thumb axis="x" metrics={x} variant={variant} active={active} dragging={dragging === "x"} onPointerDown={startDrag("x")} />
      )}
    </div>
  );
}

function Thumb({
  axis,
  metrics,
  variant,
  active,
  dragging,
  onPointerDown,
}: {
  axis: "x" | "y";
  metrics: AxisMetrics;
  variant: ScrollAreaVariant;
  active: boolean;
  dragging: boolean;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const ratio = metrics.clientSize / metrics.scrollSize;
  const sizePct = Math.max(ratio * 100, 8);
  const maxScroll = metrics.scrollSize - metrics.clientSize;
  const posPct = maxScroll > 0 ? (metrics.scrollPos / maxScroll) * (100 - sizePct) : 0;

  const on = active || dragging;
  const thickness = on ? THICKNESS_ACTIVE[variant] : THICKNESS[variant];
  const opacity = on ? 1 : IDLE_OPACITY[variant];

  const style: CSSProperties =
    axis === "y"
      ? { top: `${posPct}%`, height: `${sizePct}%`, right: 2 }
      : { left: `${posPct}%`, width: `${sizePct}%`, bottom: 2 };

  return (
    <motion.div
      onPointerDown={onPointerDown}
      animate={
        axis === "y"
          ? { opacity, width: thickness }
          : { opacity, height: thickness }
      }
      transition={{
        ...THUMB_TRANSITION[variant],
        // la opacidad nunca overshootea (evita flicker fuera de 0-1); sólo el grosor rebota.
        opacity: { duration: variant === "debounce" ? 0.4 : 0.2, ease: "easeOut" },
      }}
      className={[
        "absolute rounded-full touch-none",
        dragging ? "cursor-grabbing" : "cursor-grab",
        variantCls(variant, dragging),
      ].join(" ")}
      style={style}
    />
  );
}

function variantCls(variant: ScrollAreaVariant, dragging: boolean) {
  switch (variant) {
    case "thin":
      return dragging ? "bg-muted" : "bg-muted/70 hover:bg-muted";
    case "pill":
      return dragging ? "bg-primary" : "bg-muted hover:bg-primary/70";
    case "glow":
      return "bg-gradient-to-b from-primary to-accent shadow-[0_0_8px] shadow-primary/50";
    case "debounce":
      return dragging ? "bg-accent" : "bg-accent/70 shadow-[0_0_10px] shadow-accent/50 hover:bg-accent";
  }
}
