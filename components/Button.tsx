"use client";

import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";
import { forwardRef, useState, type MouseEvent, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success" | "outline";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  ripple?: boolean;
  children?: ReactNode;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30",
  secondary:
    "bg-surface-alt text-foreground border border-border hover:bg-border/50",
  ghost: "text-foreground hover:bg-surface-alt",
  outline:
    "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  danger:
    "bg-danger text-white shadow-md shadow-danger/25 hover:brightness-110",
  success:
    "bg-success text-white shadow-md shadow-success/25 hover:brightness-110",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-13 px-7 text-base rounded-xl gap-2.5",
  icon: "h-11 w-11 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      ripple = true,
      disabled,
      className = "",
      children,
      onClick,
      ...rest
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !loading) {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2.2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const id = Date.now() + Math.random();
        setRipples((prev) => [...prev, { id, x, y, size }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 700);
      }
      onClick?.(e);
    };

    // light variants get a darker ripple, dark variants get a lighter ripple
    const rippleColor =
      variant === "secondary" || variant === "ghost" || variant === "outline"
        ? "rgba(0,0,0,0.18)"
        : "rgba(255,255,255,0.45)";

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        disabled={disabled || loading}
        onClick={handleClick}
        className={[
          "relative inline-flex items-center justify-center font-medium",
          "transition-colors duration-200 select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          "disabled:opacity-50 disabled:pointer-events-none",
          "overflow-hidden",
          VARIANTS[variant],
          SIZES[size],
          fullWidth ? "w-full" : "",
          className,
        ].join(" ")}
        {...rest}
      >
        {/* Ripple layer */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ borderRadius: "inherit" }}
        >
          <AnimatePresence>
            {ripples.map((r) => (
              <motion.span
                key={r.id}
                initial={{ scale: 0, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  left: r.x,
                  top: r.y,
                  width: r.size,
                  height: r.size,
                  borderRadius: "9999px",
                  background: rippleColor,
                }}
              />
            ))}
          </AnimatePresence>
        </span>

        {loading && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-inherit"
          >
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
              />
            </svg>
          </motion.span>
        )}
        <span
          className={[
            "inline-flex items-center justify-center gap-[inherit]",
            loading ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          {leftIcon}
          {children}
          {rightIcon}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
