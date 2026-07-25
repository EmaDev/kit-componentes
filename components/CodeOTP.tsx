"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

export type CodeOTPType = "numeric" | "alphanumeric";
export type CodeOTPSize = "sm" | "md" | "lg";

interface CodeOTPProps {
  /** Cantidad de dígitos/casillas. Default: 6. */
  length?: number;
  /** Valor controlado (string de hasta `length` caracteres). Si se omite, el componente maneja su propio estado. */
  value?: string;
  onChange?: (value: string) => void;
  /** Se llama una única vez cuando se completan todas las casillas. */
  onComplete?: (value: string) => void;
  /** Caracteres aceptados por casilla. Default: "numeric". */
  type?: CodeOTPType;
  /** Oculta los caracteres como un campo de contraseña. */
  masked?: boolean;
  disabled?: boolean;
  label?: string;
  hint?: string;
  error?: string;
  autoFocus?: boolean;
  size?: CodeOTPSize;
  className?: string;
}

const SIZES: Record<CodeOTPSize, string> = {
  sm: "w-9 h-10 text-base",
  md: "w-12 h-14 text-lg",
  lg: "w-14 h-16 text-2xl",
};

export function CodeOTP({
  length = 6,
  value,
  onChange,
  onComplete,
  type = "numeric",
  masked = false,
  disabled = false,
  label,
  hint,
  error,
  autoFocus = false,
  size = "md",
  className = "",
}: CodeOTPProps) {
  const controlled = value !== undefined;
  const [internal, setInternal] = useState<string[]>(() =>
    Array.from({ length }, (_, i) => value?.[i] ?? "")
  );
  const digits = controlled ? Array.from({ length }, (_, i) => value![i] ?? "") : internal;

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const pattern = type === "numeric" ? /^[0-9]$/ : /^[a-zA-Z0-9]$/;

  useEffect(() => {
    if (autoFocus) inputsRef.current[0]?.focus();
  }, [autoFocus]);

  const update = (next: string[]) => {
    if (!controlled) setInternal(next);
    const joined = next.join("");
    onChange?.(joined);
    if (joined.length === length) onComplete?.(joined);
  };

  const handleChange = (i: number, raw: string) => {
    const char = raw.slice(-1);
    if (char && !pattern.test(char)) return;
    const next = [...digits];
    next[i] = char;
    update(next);
    if (char && i < length - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...digits];
      if (digits[i]) {
        next[i] = "";
        update(next);
      } else if (i > 0) {
        next[i - 1] = "";
        update(next);
        inputsRef.current[i - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputsRef.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handlePaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").split("").filter((c) => pattern.test(c));
    if (!pasted.length) return;
    const next = [...digits];
    let idx = i;
    for (const c of pasted) {
      if (idx >= length) break;
      next[idx] = c;
      idx++;
    }
    update(next);
    inputsRef.current[Math.min(idx, length - 1)]?.focus();
  };

  return (
    <div className={className}>
      {label && <p className="text-sm font-medium text-foreground mb-2">{label}</p>}

      <div role="group" aria-label={label ?? "Código de verificación"} className="flex gap-2">
        {digits.map((d, i) => (
          <motion.input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type={masked ? "password" : "text"}
            inputMode={type === "numeric" ? "numeric" : "text"}
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={d}
            disabled={disabled}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            whileFocus={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={[
              SIZES[size],
              "text-center font-semibold rounded-xl border-2 bg-surface text-foreground",
              "transition-colors duration-200 outline-none",
              error
                ? "border-danger"
                : "border-border focus:border-primary hover:border-muted/40",
              disabled ? "opacity-40 cursor-not-allowed" : "",
            ].join(" ")}
          />
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {(error || hint) && (
          <motion.p
            key={error ?? hint}
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className={["mt-1.5 text-xs", error ? "text-danger" : "text-muted"].join(" ")}
          >
            {error || hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
