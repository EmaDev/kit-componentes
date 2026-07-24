"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

type NativeInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
>;

interface InputProps extends NativeInputProps {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      className = "",
      onFocus,
      onBlur,
      value,
      defaultValue,
      placeholder,
      ...rest
    },
    ref
  ) => {
    const id = useId();
    const [focused, setFocused] = useState(false);
    const [hasValue, setHasValue] = useState(
      Boolean(value ?? defaultValue ?? "")
    );

    const floated = focused || hasValue || Boolean(placeholder);

    return (
      <div className={`w-full ${className}`}>
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              {leftIcon}
            </span>
          )}

          <motion.input
            ref={ref}
            id={id}
            value={value}
            defaultValue={defaultValue}
            placeholder={focused ? placeholder : ""}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              setHasValue(Boolean(e.target.value));
              onBlur?.(e);
            }}
            onChange={(e) => {
              setHasValue(Boolean(e.target.value));
              rest.onChange?.(e);
            }}
            animate={
              error
                ? { x: [0, -6, 6, -4, 4, 0] }
                : { x: 0 }
            }
            transition={{ duration: 0.4 }}
            className={[
              "peer w-full h-12 rounded-xl bg-surface text-foreground",
              "border-2 transition-colors duration-200",
              "px-4 pt-3 pb-1 text-sm outline-none",
              leftIcon ? "pl-11" : "",
              rightIcon ? "pr-11" : "",
              error
                ? "border-danger focus:border-danger"
                : focused
                ? "border-primary"
                : "border-border hover:border-muted/40",
            ].join(" ")}
            {...rest}
          />

          {label && (
            <motion.label
              htmlFor={id}
              animate={{
                y: floated ? -10 : 0,
                scale: floated ? 0.82 : 1,
                color: error
                  ? "var(--color-danger)"
                  : focused
                  ? "var(--color-primary)"
                  : "var(--color-muted)",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{ originX: 0, originY: 0.5 }}
              className={[
                "absolute top-1/2 -translate-y-1/2 pointer-events-none",
                "text-sm font-medium bg-surface px-1",
                leftIcon ? "left-10" : "left-3",
              ].join(" ")}
            >
              {label}
            </motion.label>
          )}

          {rightIcon && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">
              {rightIcon}
            </span>
          )}

          {/* Underline glow */}
          <motion.span
            initial={false}
            animate={{
              scaleX: focused ? 1 : 0,
              opacity: focused ? 1 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{ originX: 0.5 }}
            className={[
              "absolute left-2 right-2 -bottom-px h-[2px] rounded-full",
              error ? "bg-danger" : "bg-primary",
            ].join(" ")}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {(error || hint) && (
            <motion.p
              key={error ?? hint}
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.2 }}
              className={[
                "mt-1.5 text-xs pl-1",
                error ? "text-danger" : "text-muted",
              ].join(" ")}
            >
              {error || hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = "Input";
