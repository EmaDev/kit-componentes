"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, type ReactNode } from "react";

type Size = "sm" | "md" | "lg" | "xl" | "full";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: Size;
  children?: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
  showClose?: boolean;
}

const SIZES: Record<Size, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  closeOnBackdrop = true,
  showClose = true,
}: ModalProps) {
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

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 bg-black/50"
          />

          {/* Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={[
              "relative w-full",
              SIZES[size],
              "bg-surface text-foreground rounded-2xl shadow-2xl shadow-black/30",
              "border border-border overflow-hidden",
              "flex flex-col max-h-[calc(100vh-2rem)]",
            ].join(" ")}
          >
            {(title || showClose) && (
              <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-2">
                <div className="flex-1 min-w-0">
                  {title && (
                    <h2 className="text-lg font-semibold text-foreground leading-snug">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-muted leading-relaxed">
                      {description}
                    </p>
                  )}
                </div>
                {showClose && (
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className="shrink-0 w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt"
                    aria-label="Cerrar"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.button>
                )}
              </div>
            )}

            <div className="px-6 py-4 flex-1 overflow-auto">{children}</div>

            {footer && (
              <div className="px-6 py-4 border-t border-border bg-surface-alt/50 flex items-center justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
