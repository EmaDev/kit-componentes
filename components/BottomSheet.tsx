"use client";

import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

/** Alturas predefinidas. `auto` se ajusta al contenido. */
export type BottomSheetSize = "auto" | "xs" | "sm" | "md" | "lg" | "xl" | "full";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  /** altura del sheet. Default: "auto" */
  size?: BottomSheetSize;
  title?: string;
  description?: string;
  children?: ReactNode;
  /** acciones fijas al pie (no scrollean) */
  footer?: ReactNode;
  /** mostrar el handle superior. Default: true */
  showHandle?: boolean;
  /** botón X en el header. Default: false */
  showClose?: boolean;
  /** cerrar al tocar el backdrop. Default: true */
  closeOnBackdrop?: boolean;
  /** arrastrar hacia abajo para cerrar. Default: true */
  dragToClose?: boolean;
  /**
   * Puntos de anclaje como fracción de la pantalla, de menor a mayor (ej. [0.4, 0.9]).
   * Si se define, ignora `size` y el usuario puede arrastrar entre alturas.
   */
  snapPoints?: number[];
  /** índice inicial dentro de snapPoints. Default: 0 */
  defaultSnap?: number;
  /** en desktop, centrar como tarjeta flotante en vez de pegado abajo. Default: true */
  desktopFloating?: boolean;
}

/** alturas por tamaño (dvh para respetar barras del navegador en mobile) */
const SIZES: Record<BottomSheetSize, string> = {
  auto: "max-h-[85dvh]",
  xs: "h-[28dvh]",
  sm: "h-[40dvh]",
  md: "h-[58dvh]",
  lg: "h-[76dvh]",
  xl: "h-[90dvh]",
  full: "h-[100dvh] rounded-t-none",
};

export function BottomSheet({
  open,
  onClose,
  size = "auto",
  title,
  description,
  children,
  footer,
  showHandle = true,
  showClose = false,
  closeOnBackdrop = true,
  dragToClose = true,
  snapPoints,
  defaultSnap = 0,
  desktopFloating = true,
}: BottomSheetProps) {
  const [snap, setSnap] = useState(defaultSnap);

  useEffect(() => {
    if (!open) return;
    setSnap(defaultSnap);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, defaultSnap]);

  const usingSnaps = Array.isArray(snapPoints) && snapPoints.length > 0;
  const snapHeight = usingSnaps
    ? `${Math.round((snapPoints as number[])[Math.min(snap, snapPoints!.length - 1)] * 100)}dvh`
    : undefined;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    const flickDown = velocity.y > 500;
    const flickUp = velocity.y < -500;

    if (usingSnaps) {
      const last = snapPoints!.length - 1;
      if ((offset.y > 70 || flickDown)) {
        if (snap === 0) onClose();
        else setSnap((s) => Math.max(0, s - 1));
        return;
      }
      if ((offset.y < -70 || flickUp) && snap < last) setSnap((s) => Math.min(last, s + 1));
      return;
    }
    if (dragToClose && (offset.y > 110 || flickDown)) onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="fixed inset-0 z-[140] bg-black/45 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            drag={dragToClose || usingSnaps ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: usingSnaps ? 0.25 : 0.02, bottom: 0.4 }}
            onDragEnd={handleDragEnd}
            style={snapHeight ? { height: snapHeight } : undefined}
            className={[
              "fixed z-[150] left-0 right-0 bottom-0 flex flex-col",
              "bg-surface border-t border-border rounded-t-3xl",
              "shadow-2xl shadow-black/30 overflow-hidden",
              desktopFloating
                ? "sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:bottom-6 sm:w-[460px] sm:border sm:rounded-3xl"
                : "sm:mx-auto sm:max-w-[520px]",
              snapHeight ? "" : SIZES[size],
            ].join(" ")}
          >
            {showHandle && (
              <div className="pt-3 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing">
                <span className="w-10 h-1 rounded-full bg-border" />
              </div>
            )}

            {(title || description || showClose) && (
              <div className="px-6 pt-3 pb-3 flex items-start gap-3 shrink-0">
                <div className="flex-1 min-w-0">
                  {title && (
                    <h2 className="text-base font-semibold text-foreground leading-tight">{title}</h2>
                  )}
                  {description && (
                    <p className="text-xs text-muted mt-1 leading-relaxed">{description}</p>
                  )}
                </div>
                {showClose && (
                  <button
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="shrink-0 w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 pb-2">
              {children}
            </div>

            {footer ? (
              <div className="shrink-0 px-6 pt-3 border-t border-border bg-surface pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                {footer}
              </div>
            ) : (
              <div className="shrink-0 pb-[max(0.5rem,env(safe-area-inset-bottom))]" />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
