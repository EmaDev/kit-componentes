"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type TextareaHTMLAttributes,
} from "react";

type NativeTextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd"
>;

interface TextareaProps extends NativeTextareaProps {
  label?: string;
  hint?: string;
  error?: string;
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      autoResize = true,
      maxLength,
      showCount = false,
      className = "",
      onFocus,
      onBlur,
      onChange,
      value,
      defaultValue,
      ...rest
    },
    ref
  ) => {
    const id = useId();
    const [focused, setFocused] = useState(false);
    const [val, setVal] = useState(String(value ?? defaultValue ?? ""));
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      if (value !== undefined) setVal(String(value));
    }, [value]);

    useEffect(() => {
      if (!autoResize) return;
      const el = innerRef.current;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 280)}px`;
    }, [val, autoResize]);

    const floated = focused || val.length > 0;
    const count = val.length;

    return (
      <div className={`w-full ${className}`}>
        <div className="relative">
          <motion.textarea
            ref={(node) => {
              innerRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
            }}
            id={id}
            value={value}
            defaultValue={defaultValue}
            maxLength={maxLength}
            rows={3}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            onChange={(e) => {
              setVal(e.target.value);
              onChange?.(e);
            }}
            animate={error ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className={[
              "w-full min-h-[88px] rounded-xl bg-surface text-foreground",
              "border-2 transition-colors duration-200 resize-none",
              "px-4 pt-5 pb-3 text-sm outline-none",
              error
                ? "border-danger"
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
                y: floated ? -8 : 12,
                scale: floated ? 0.82 : 1,
                color: error
                  ? "var(--color-danger)"
                  : focused
                  ? "var(--color-primary)"
                  : "var(--color-muted)",
              }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{ originX: 0, originY: 0.5 }}
              className="absolute top-3 left-3 pointer-events-none text-sm font-medium bg-surface px-1"
            >
              {label}
            </motion.label>
          )}
        </div>

        <div className="mt-1.5 flex items-start justify-between gap-3 pl-1">
          <AnimatePresence mode="wait" initial={false}>
            {(error || hint) && (
              <motion.p
                key={error ?? hint}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                className={[
                  "text-xs flex-1",
                  error ? "text-danger" : "text-muted",
                ].join(" ")}
              >
                {error || hint}
              </motion.p>
            )}
          </AnimatePresence>
          {showCount && maxLength != null && (
            <motion.span
              animate={{
                color:
                  count >= maxLength
                    ? "var(--color-danger)"
                    : count > maxLength * 0.85
                    ? "var(--color-accent)"
                    : "var(--color-muted)",
              }}
              className="text-xs tabular-nums shrink-0"
            >
              {count}/{maxLength}
            </motion.span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
