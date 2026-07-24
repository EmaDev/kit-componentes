"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = "Selecciona…",
  label,
  error,
  hint,
  disabled = false,
  className = "",
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(defaultValue ?? "");
  const current = value ?? internal;
  const selected = options.find((o) => o.value === current);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const pick = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-muted mb-1.5 pl-1">
          {label}
        </label>
      )}

      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className={[
          "w-full h-12 px-4 rounded-xl text-left flex items-center justify-between gap-2",
          "bg-surface text-foreground border-2 transition-colors duration-200",
          "outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
          "disabled:opacity-50 disabled:pointer-events-none",
          error
            ? "border-danger"
            : open
            ? "border-primary"
            : "border-border hover:border-muted/40",
        ].join(" ")}
      >
        <span className="flex items-center gap-2 truncate text-sm">
          {selected?.icon}
          {selected ? (
            <span>{selected.label}</span>
          ) : (
            <span className="text-muted">{placeholder}</span>
          )}
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted shrink-0"
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={[
              "absolute z-50 mt-2 w-full max-h-64 overflow-auto",
              "rounded-xl border border-border bg-surface shadow-xl shadow-black/5",
              "p-1.5",
            ].join(" ")}
            style={{ originY: 0 }}
          >
            {options.map((opt, i) => {
              const active = opt.value === current;
              return (
                <motion.li
                  key={opt.value}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <button
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => pick(opt.value)}
                    className={[
                      "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left",
                      "transition-colors duration-150",
                      "disabled:opacity-40 disabled:pointer-events-none",
                      active
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-surface-alt",
                    ].join(" ")}
                  >
                    {opt.icon}
                    <span className="flex-1 truncate">{opt.label}</span>
                    {active && (
                      <motion.svg
                        layoutId="select-check"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </motion.svg>
                    )}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {(error || hint) && (
        <p
          className={[
            "mt-1.5 text-xs pl-1",
            error ? "text-danger" : "text-muted",
          ].join(" ")}
        >
          {error || hint}
        </p>
      )}
    </div>
  );
}
