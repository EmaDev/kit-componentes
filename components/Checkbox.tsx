"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useId, type ReactNode } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** estado mixto (algunos hijos marcados) */
  indeterminate?: boolean;
  label?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  /** color del check. Default: "primary" */
  tone?: "primary" | "success" | "danger";
  error?: string;
  className?: string;
}

const SIZES = {
  sm: { box: 16, text: "text-[13px]", radius: "rounded-[4px]" },
  md: { box: 20, text: "text-sm", radius: "rounded-[6px]" },
  lg: { box: 24, text: "text-base", radius: "rounded-[7px]" },
};

const TONES = {
  primary: "bg-primary border-primary",
  success: "bg-success border-success",
  danger: "bg-danger border-danger",
};

export function Checkbox({
  checked, onChange, indeterminate = false, label, description,
  disabled = false, size = "md", tone = "primary", error, className = "",
}: CheckboxProps) {
  const id = useId();
  const s = SIZES[size];
  const on = checked || indeterminate;

  return (
    <div className={className}>
      <div className="flex items-start gap-2.5">
        <motion.button
          id={id}
          type="button"
          role="checkbox"
          aria-checked={indeterminate ? "mixed" : checked}
          aria-describedby={description ? `${id}-desc` : undefined}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          whileTap={disabled ? undefined : { scale: 0.88 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={[
            "relative shrink-0 border-2 flex items-center justify-center transition-colors mt-0.5",
            s.radius,
            on ? `${TONES[tone]} text-white` : "border-border bg-surface hover:border-muted",
            error && !on ? "border-danger" : "",
            disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
          style={{ width: s.box, height: s.box }}
        >
          <AnimatePresence mode="wait">
            {indeterminate ? (
              <motion.span
                key="mixed"
                initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: 1, opacity: 1 }} exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="block bg-current rounded-full"
                style={{ width: s.box * 0.5, height: 2 }}
              />
            ) : checked ? (
              <motion.svg
                key="check"
                width={s.box * 0.68} height={s.box * 0.68} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <motion.polyline points="20 6 9 17 4 12" />
              </motion.svg>
            ) : null}
          </AnimatePresence>
        </motion.button>

        {(label || description) && (
          <label
            htmlFor={id}
            className={`min-w-0 select-none ${disabled ? "opacity-40" : "cursor-pointer"}`}
            onClick={(e) => { e.preventDefault(); if (!disabled) onChange(!checked); }}
          >
            {label && <span className={`block font-medium text-foreground ${s.text}`}>{label}</span>}
            {description && (
              <span id={`${id}-desc`} className="block text-xs text-muted mt-0.5 leading-relaxed">
                {description}
              </span>
            )}
          </label>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="text-xs text-danger mt-1.5 pl-[30px]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CheckboxGroupProps<T extends string> {
  options: { value: T; label: ReactNode; description?: ReactNode; disabled?: boolean }[];
  value: T[];
  onChange: (value: T[]) => void;
  label?: string;
  /** casilla "seleccionar todo" con estado mixto */
  selectAllLabel?: string;
  size?: CheckboxProps["size"];
  tone?: CheckboxProps["tone"];
  className?: string;
}

/** Grupo con "seleccionar todo" e indeterminado automático. */
export function CheckboxGroup<T extends string>({
  options, value, onChange, label, selectAllLabel, size = "md", tone = "primary", className = "",
}: CheckboxGroupProps<T>) {
  const selectable = options.filter((o) => !o.disabled).map((o) => o.value);
  const allOn = selectable.length > 0 && selectable.every((v) => value.includes(v));
  const someOn = selectable.some((v) => value.includes(v)) && !allOn;

  const toggle = (v: T) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div role="group" aria-label={label} className={className}>
      {label && (
        <p className="text-[11px] font-bold uppercase tracking-wider text-muted mb-2.5">{label}</p>
      )}
      <div className="flex flex-col gap-2.5">
        {selectAllLabel && (
          <>
            <Checkbox
              checked={allOn} indeterminate={someOn} size={size} tone={tone}
              label={<span className="font-semibold">{selectAllLabel}</span>}
              onChange={() => onChange(allOn ? [] : selectable)}
            />
            <div className="h-px bg-border" />
          </>
        )}
        {options.map((o) => (
          <Checkbox
            key={o.value}
            checked={value.includes(o.value)}
            onChange={() => toggle(o.value)}
            label={o.label} description={o.description}
            disabled={o.disabled} size={size} tone={tone}
          />
        ))}
      </div>
    </div>
  );
}
