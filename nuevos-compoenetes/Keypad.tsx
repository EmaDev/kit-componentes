"use client";

import { useHaptics } from "@/hooks/useHaptics";

export type KeypadKey = string;

interface KeypadProps {
  onKey: (key: KeypadKey) => void;
  /** tecla extra a la izquierda del 0: "," | "." | "00" | null */
  extraKey?: KeypadKey | null;
  /** icono de la tecla de borrado. Default: flecha */
  backspaceIcon?: React.ReactNode;
  onBackspaceLong?: () => void;
  size?: "sm" | "md" | "lg";
  /** letras bajo los números, estilo teléfono */
  letters?: boolean;
  disabled?: boolean;
  className?: string;
}

const LETTERS: Record<string, string> = {
  "2": "ABC", "3": "DEF", "4": "GHI", "5": "JKL",
  "6": "MNO", "7": "PQRS", "8": "TUV", "9": "WXYZ",
};

const SIZES = {
  sm: { h: 48, num: "text-xl", gap: 8 },
  md: { h: 60, num: "text-2xl", gap: 10 },
  lg: { h: 72, num: "text-3xl", gap: 12 },
};

/** Teclado numérico táctil: 3×4, tecla extra opcional, borrado con long-press. */
export function Keypad({
  onKey, extraKey = null, backspaceIcon, onBackspaceLong,
  size = "md", letters = false, disabled = false, className = "",
}: KeypadProps) {
  const { haptic } = useHaptics();
  const s = SIZES[size];
  let timer: ReturnType<typeof setTimeout> | null = null;

  const press = (k: KeypadKey) => {
    if (disabled) return;
    haptic("tap");
    onKey(k);
  };

  const keys: (KeypadKey | null)[] = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9",
    extraKey, "0", "backspace",
  ];

  return (
    <div className={`grid grid-cols-3 ${className}`} style={{ gap: s.gap }} role="group" aria-label="Teclado numérico">
      {keys.map((k, i) => {
        if (k == null) return <span key={`empty-${i}`} aria-hidden="true" />;
        const isBack = k === "backspace";
        return (
          <button
            key={k}
            type="button"
            disabled={disabled}
            onClick={() => press(k)}
            onPointerDown={isBack && onBackspaceLong ? () => { timer = setTimeout(() => { haptic("warning"); onBackspaceLong(); }, 550); } : undefined}
            onPointerUp={isBack ? () => { if (timer) clearTimeout(timer); } : undefined}
            onPointerLeave={isBack ? () => { if (timer) clearTimeout(timer); } : undefined}
            aria-label={isBack ? "Borrar" : k}
            className={[
              "rounded-2xl font-semibold tabular-nums select-none",
              "text-foreground bg-surface-alt/70 border border-border/70",
              "hover:bg-surface-alt active:scale-[0.94] active:bg-border/60",
              "transition-transform duration-100 disabled:opacity-40",
              "grid place-items-center leading-none",
              isBack ? "bg-transparent border-transparent hover:bg-surface-alt" : "",
            ].join(" ")}
            style={{ height: s.h, touchAction: "manipulation" }}
          >
            {isBack ? (
              backspaceIcon ?? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 5H9l-6 7 6 7h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z" />
                  <line x1="18" y1="9" x2="12" y2="15" /><line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              )
            ) : (
              <span className="flex flex-col items-center gap-0.5">
                <span className={s.num}>{k}</span>
                {letters && LETTERS[k] && (
                  <span className="text-[9px] font-bold tracking-[0.16em] text-muted">{LETTERS[k]}</span>
                )}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
