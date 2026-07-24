"use client";

import { motion } from "framer-motion";

type Variant = "ring" | "dots" | "pulse" | "bars";
type Size = "sm" | "md" | "lg";

interface SpinnerProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  color?: string;
  label?: string;
}

const SIZE_PX: Record<Size, number> = { sm: 18, md: 28, lg: 44 };

export function Spinner({
  variant = "ring",
  size = "md",
  className = "",
  color,
  label,
}: SpinnerProps) {
  const px = SIZE_PX[size];
  const style = color ? { color } : { color: "var(--color-primary)" };

  return (
    <div
      role="status"
      aria-label={label ?? "loading"}
      className={`inline-flex items-center gap-2 ${className}`}
      style={style}
    >
      {variant === "ring" && (
        <svg
          width={px}
          height={px}
          viewBox="0 0 50 50"
          className="animate-spin"
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="5"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="80 200"
          />
        </svg>
      )}

      {variant === "dots" && (
        <div className="flex items-center gap-1.5" style={{ height: px }}>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block rounded-full bg-current"
              style={{ width: px / 3.5, height: px / 3.5 }}
              animate={{ y: [0, -px / 3, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {variant === "pulse" && (
        <div className="relative" style={{ width: px, height: px }}>
          <motion.span
            className="absolute inset-0 rounded-full bg-current"
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full bg-current"
            animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.6,
            }}
          />
          <span
            className="absolute inset-[28%] rounded-full bg-current"
          />
        </div>
      )}

      {variant === "bars" && (
        <div className="flex items-end gap-1" style={{ height: px }}>
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className="block w-[3px] rounded-full bg-current"
              animate={{ scaleY: [0.4, 1, 0.4] }}
              style={{ height: px, transformOrigin: "bottom" }}
              transition={{
                duration: 0.9,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      )}

      {label && <span className="text-sm text-muted">{label}</span>}
    </div>
  );
}
