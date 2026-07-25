"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

export type CoachMarkSide = "top" | "bottom" | "left" | "right";
export type CoachMarkAlign = "start" | "center" | "end";

export interface CoachMarkStep {
  /** Selector CSS (`document.querySelector`) o ref del elemento a resaltar. */
  target: string | RefObject<HTMLElement>;
  title: string;
  description?: string;
  /** Lado preferido de la tarjeta respecto al target. Default: "bottom". */
  side?: CoachMarkSide;
  /** Alineación sobre el eje perpendicular al lado. Default: "center". */
  align?: CoachMarkAlign;
}

interface CoachMarkProps {
  steps: CoachMarkStep[];
  open: boolean;
  /** Cerrar el tour (botón "Saltar", Escape, o al terminar el último paso). */
  onClose: () => void;
  /** Se dispara al confirmar el último paso, antes de `onClose`. */
  onFinish?: () => void;
  /** Paso controlado (0-indexed). Si se omite, el componente maneja su propio estado. */
  step?: number;
  onStepChange?: (index: number) => void;
  nextLabel?: string;
  prevLabel?: string;
  finishLabel?: string;
  skipLabel?: string;
  showSkip?: boolean;
  /** Espacio entre el borde del elemento resaltado y el recorte del spotlight. Default: 8. */
  spotlightPadding?: number;
  className?: string;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function resolveTarget(target: CoachMarkStep["target"]): HTMLElement | null {
  if (typeof target === "string") return document.querySelector<HTMLElement>(target);
  return target.current;
}

export function CoachMark({
  steps,
  open,
  onClose,
  onFinish,
  step: stepProp,
  onStepChange,
  nextLabel = "Siguiente",
  prevLabel = "Atrás",
  finishLabel = "Entendido",
  skipLabel = "Saltar",
  showSkip = true,
  spotlightPadding = 8,
  className = "",
}: CoachMarkProps) {
  const [stepState, setStepState] = useState(0);
  const controlled = stepProp !== undefined;
  const index = controlled ? stepProp : stepState;
  const current = steps[index];

  const [rect, setRect] = useState<Rect | null>(null);
  const [resolvedSide, setResolvedSide] = useState<CoachMarkSide>("bottom");
  const cardRef = useRef<HTMLDivElement>(null);

  const setIndex = (next: number) => {
    if (!controlled) setStepState(next);
    onStepChange?.(next);
  };

  const measure = useCallback(() => {
    const el = current ? resolveTarget(current.target) : null;
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [current]);

  useEffect(() => {
    if (!open) return;
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, measure]);

  useEffect(() => {
    if (!open && !controlled) setStepState(0);
  }, [open, controlled]);

  useEffect(() => {
    if (!open || !current) return;
    resolveTarget(current.target)?.scrollIntoView({ block: "center", behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    const preferred = current?.side ?? "bottom";
    if (!rect || !cardRef.current) {
      setResolvedSide(preferred);
      return;
    }
    const cr = cardRef.current.getBoundingClientRect();
    const margin = 16 + spotlightPadding;
    let next = preferred;
    if (preferred === "bottom" && rect.top + rect.height + margin + cr.height > window.innerHeight) next = "top";
    else if (preferred === "top" && rect.top - margin - cr.height < 0) next = "bottom";
    else if (preferred === "right" && rect.left + rect.width + margin + cr.width > window.innerWidth) next = "left";
    else if (preferred === "left" && rect.left - margin - cr.width < 0) next = "right";
    setResolvedSide(next);
  }, [rect, current, spotlightPadding]);

  if (!steps.length) return null;

  const isLast = index === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      onFinish?.();
      onClose();
    } else {
      setIndex(index + 1);
    }
  };

  const handlePrev = () => setIndex(Math.max(0, index - 1));

  return (
    <AnimatePresence>
      {open && current && (
        <div className={`fixed inset-0 z-[210] ${className}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {rect ? (
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute rounded-xl pointer-events-none"
                style={{
                  top: rect.top - spotlightPadding,
                  left: rect.left - spotlightPadding,
                  width: rect.width + spotlightPadding * 2,
                  height: rect.height + spotlightPadding * 2,
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)",
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-black/65" />
            )}
          </motion.div>

          {showSkip && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-xs font-medium text-white/80 hover:text-white bg-black/30 hover:bg-black/40 rounded-lg px-3 py-1.5 transition-colors"
            >
              {skipLabel}
            </button>
          )}

          <motion.div
            key={index}
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            role="dialog"
            aria-modal="true"
            className="absolute w-[300px] max-w-[calc(100vw-2rem)] rounded-2xl bg-surface border border-border shadow-2xl shadow-black/30 p-5"
            style={rect ? cardStyle(rect, resolvedSide, current.align ?? "center", spotlightPadding) : centerStyle}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {index + 1} / {steps.length}
            </p>
            <h3 className="mt-1 text-base font-semibold text-foreground leading-snug">{current.title}</h3>
            {current.description && (
              <p className="mt-1.5 text-sm text-muted leading-relaxed">{current.description}</p>
            )}

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-primary" : "w-1.5 bg-border"}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="text-sm font-medium text-muted hover:text-foreground px-2 py-1.5 rounded-lg transition-colors"
                  >
                    {prevLabel}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNext}
                  className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg px-3.5 py-1.5 transition-colors"
                >
                  {isLast ? finishLabel : nextLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const centerStyle: CSSProperties = { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

function cardStyle(rect: Rect, side: CoachMarkSide, align: CoachMarkAlign, padding: number): CSSProperties {
  const gap = 16 + padding;
  const style: CSSProperties = {};
  let translateX = "0";
  let translateY = "0";

  if (side === "top") {
    style.top = rect.top - gap;
    translateY = "-100%";
  } else if (side === "bottom") {
    style.top = rect.top + rect.height + gap;
  } else if (side === "left") {
    style.left = rect.left - gap;
    translateX = "-100%";
  } else {
    style.left = rect.left + rect.width + gap;
  }

  const vertical = side === "top" || side === "bottom";
  if (vertical) {
    if (align === "start") {
      style.left = rect.left;
    } else if (align === "end") {
      style.left = rect.left + rect.width;
      translateX = "-100%";
    } else {
      style.left = rect.left + rect.width / 2;
      translateX = "-50%";
    }
  } else {
    if (align === "start") {
      style.top = rect.top;
    } else if (align === "end") {
      style.top = rect.top + rect.height;
      translateY = "-100%";
    } else {
      style.top = rect.top + rect.height / 2;
      translateY = "-50%";
    }
  }

  style.transform = `translate(${translateX}, ${translateY})`;
  return style;
}
