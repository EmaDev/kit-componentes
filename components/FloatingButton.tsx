"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface FabAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  tone?: "primary" | "accent" | "success" | "danger";
}

interface FloatingButtonProps {
  icon?: ReactNode;
  label?: string;
  onClick?: () => void;
  /** acciones secundarias: convierte el FAB en speed dial */
  actions?: FabAction[];
  /** esconderse al scrollear hacia abajo. Default: true */
  hideOnScroll?: boolean;
  /** contenedor scrolleable a observar; por defecto la ventana */
  scrollTarget?: React.RefObject<HTMLElement>;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  /** extendido con label visible. Default: false */
  extended?: boolean;
  size?: "md" | "lg";
  tone?: "primary" | "accent" | "success" | "danger";
  /** absolute en vez de fixed (para mocks dentro de un contenedor). Default: false */
  absolute?: boolean;
  className?: string;
}

const TONE_BG = {
  primary: "bg-primary text-white shadow-primary/30",
  accent: "bg-accent text-white shadow-accent/30",
  success: "bg-success text-white shadow-success/30",
  danger: "bg-danger text-white shadow-danger/30",
};

const POS = {
  "bottom-right": "right-4 items-end",
  "bottom-left": "left-4 items-start",
  "bottom-center": "left-1/2 -translate-x-1/2 items-center",
};

/**
 * Botón de acción flotante que se esconde al scrollear hacia abajo y puede
 * desplegar acciones secundarias (speed dial) con stagger.
 */
export function FloatingButton({
  icon, label, onClick, actions, hideOnScroll = true, scrollTarget,
  position = "bottom-right", extended = false, size = "lg",
  tone = "primary", absolute = false, className = "",
}: FloatingButtonProps) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (!hideOnScroll) return;
    const el = scrollTarget?.current;
    const getY = () => (el ? el.scrollTop : window.scrollY);
    lastY.current = getY();

    const onScroll = () => {
      const y = getY();
      const delta = y - lastY.current;
      if (Math.abs(delta) < 8) return;
      // cerca del tope siempre visible
      setHidden(delta > 0 && y > 90);
      if (delta > 0) setOpen(false);
      lastY.current = y;
    };

    const target: HTMLElement | Window = el ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [hideOnScroll, scrollTarget]);

  const dim = size === "lg" ? 56 : 48;
  const hasActions = Boolean(actions?.length);
  const isLeft = position === "bottom-left";

  const handleMain = () => {
    if (hasActions) setOpen((v) => !v);
    else onClick?.();
  };

  return (
    <div
      className={[
        absolute ? "absolute" : "fixed",
        "z-[90] flex flex-col gap-3 pointer-events-none",
        POS[position],
        absolute ? "bottom-4" : "bottom-[max(1rem,calc(env(safe-area-inset-bottom)+1rem))]",
        className,
      ].join(" ")}
    >
      {/* acciones secundarias */}
      <AnimatePresence>
        {open && hasActions && (
          <>
            {actions!.map((a, i) => (
              <motion.button
                key={a.label}
                initial={{ opacity: 0, y: 16, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.8, transition: { delay: (actions!.length - 1 - i) * 0.03 } }}
                transition={{ type: "spring", stiffness: 380, damping: 26, delay: i * 0.045 }}
                onClick={() => { a.onClick(); setOpen(false); }}
                className={`pointer-events-auto flex items-center gap-3 ${isLeft ? "flex-row-reverse" : ""}`}
              >
                <span className="rounded-lg bg-foreground text-surface text-xs font-semibold px-2.5 py-1.5 shadow-lg whitespace-nowrap">
                  {a.label}
                </span>
                <span className={`w-11 h-11 rounded-full grid place-items-center shadow-lg ${TONE_BG[a.tone ?? "primary"]}`}>
                  {a.icon}
                </span>
              </motion.button>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* botón principal */}
      <motion.button
        onClick={handleMain}
        aria-label={label}
        aria-expanded={hasActions ? open : undefined}
        initial={false}
        animate={{
          y: hidden ? 120 : 0,
          opacity: hidden ? 0 : 1,
          scale: hidden ? 0.85 : 1,
        }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className={[
          "pointer-events-auto rounded-full grid place-items-center shadow-xl",
          TONE_BG[tone],
          extended ? "px-5 gap-2 flex w-auto" : "",
        ].join(" ")}
        style={{ height: dim, width: extended ? undefined : dim }}
      >
        <motion.span animate={{ rotate: open ? 135 : 0 }} transition={{ type: "spring", stiffness: 400, damping: 24 }} className="grid place-items-center">
          {icon ?? <PlusIcon />}
        </motion.span>
        {extended && label && <span className="text-sm font-semibold whitespace-nowrap">{label}</span>}
      </motion.button>

      {/* backdrop del speed dial */}
      <AnimatePresence>
        {open && hasActions && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className={`${absolute ? "absolute" : "fixed"} inset-0 -z-10 bg-black/20 pointer-events-auto`}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
