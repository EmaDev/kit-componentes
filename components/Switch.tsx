"use client";

import { motion } from "framer-motion";
import { useId, type ReactNode } from "react";

export type SwitchSize = "sm" | "md" | "lg";
export type SwitchTone = "primary" | "success" | "danger";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  size?: SwitchSize;
  /** color cuando está activado. Default: "primary" */
  tone?: SwitchTone;
  className?: string;
}

const SIZES: Record<SwitchSize, { w: number; h: number; thumb: number; pad: number }> = {
  sm: { w: 34, h: 20, thumb: 14, pad: 3 },
  md: { w: 42, h: 24, thumb: 18, pad: 3 },
  lg: { w: 50, h: 28, thumb: 22, pad: 3 },
};

const TONES: Record<SwitchTone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  danger: "bg-danger",
};

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = "md",
  tone = "primary",
  className = "",
}: SwitchProps) {
  const id = useId();
  const s = SIZES[size];
  const travel = s.w - s.thumb - s.pad * 2;

  return (
    <div className={className}>
      <div className="flex items-start gap-2.5">
        <motion.button
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          aria-describedby={description ? `${id}-desc` : undefined}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          whileTap={disabled ? undefined : { scale: 0.94 }}
          className={[
            "relative shrink-0 rounded-full transition-colors duration-200",
            checked ? TONES[tone] : "bg-border",
            disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
          style={{ width: s.w, height: s.h, padding: s.pad }}
        >
          <motion.span
            animate={{ x: checked ? travel : 0 }}
            transition={{ type: "spring", stiffness: 550, damping: 32 }}
            className="block rounded-full bg-white shadow-md"
            style={{ width: s.thumb, height: s.thumb }}
          />
        </motion.button>

        {(label || description) && (
          <label
            htmlFor={id}
            className={`min-w-0 select-none ${disabled ? "opacity-40" : "cursor-pointer"}`}
            onClick={(e) => {
              e.preventDefault();
              if (!disabled) onChange(!checked);
            }}
          >
            {label && <span className="block font-medium text-foreground text-sm">{label}</span>}
            {description && (
              <span id={`${id}-desc`} className="block text-xs text-muted mt-0.5 leading-relaxed">
                {description}
              </span>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
