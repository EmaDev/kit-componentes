"use client";

import { useCallback, useEffect, useState } from "react";
import { Keypad } from "./Keypad";
import { useHaptics } from "../hooks/useHaptics";

interface PinLockProps {
  open: boolean;
  /** "pin" = teclado numérico · "password" = campo de texto */
  mode?: "pin" | "password";
  length?: number;
  /** devolvé true si el código es correcto (puede ser async) */
  onUnlock: (code: string) => boolean | Promise<boolean>;
  onSuccess?: () => void;
  /** tras N intentos fallidos */
  maxAttempts?: number;
  onLockout?: () => void;
  appName?: string;
  title?: string;
  hint?: string;
  icon?: React.ReactNode;
  /** botón de biometría (Face ID / huella) */
  onBiometric?: () => void | Promise<void>;
  onForgot?: () => void;
  /** cubre toda la pantalla con blur. Default true */
  fullscreen?: boolean;
  className?: string;
}

/** Pantalla de bloqueo por PIN o contraseña, para el arranque de la app. */
export function PinLock({
  open, mode = "pin", length = 4, onUnlock, onSuccess,
  maxAttempts = 5, onLockout, appName = "Tu app", title, hint,
  icon, onBiometric, onForgot, fullscreen = true, className = "",
}: PinLockProps) {
  const { haptic } = useHaptics();
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "error" | "ok">("idle");
  const [attempts, setAttempts] = useState(0);
  const [reveal, setReveal] = useState(false);
  const locked = attempts >= maxAttempts;

  const submit = useCallback(async (value: string) => {
    setState("checking");
    const ok = await onUnlock(value);
    if (ok) {
      haptic("success");
      setState("ok");
      setTimeout(() => { onSuccess?.(); setCode(""); setState("idle"); }, 420);
    } else {
      haptic("error");
      setState("error");
      setAttempts((a) => {
        const n = a + 1;
        if (n >= maxAttempts) onLockout?.();
        return n;
      });
      setTimeout(() => { setCode(""); setState("idle"); }, 620);
    }
  }, [haptic, maxAttempts, onLockout, onSuccess, onUnlock]);

  const push = (k: string) => {
    if (locked || state === "checking" || state === "ok") return;
    if (k === "backspace") return setCode((c) => c.slice(0, -1));
    setCode((c) => {
      if (c.length >= length) return c;
      const next = c + k;
      if (next.length === length) submit(next);
      return next;
    });
  };

  // teclado físico
  useEffect(() => {
    if (!open || mode !== "pin") return;
    const onKey = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) push(e.key);
      else if (e.key === "Backspace") push("backspace");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, mode, code, state, locked]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) { setCode(""); setState("idle"); }
  }, [open]);

  if (!open) return null;

  const heading = title ?? (mode === "pin" ? "Ingresá tu PIN" : "Ingresá tu contraseña");
  const message = locked
    ? "Demasiados intentos. Probá más tarde."
    : state === "error"
      ? `Código incorrecto · ${maxAttempts - attempts} ${maxAttempts - attempts === 1 ? "intento" : "intentos"} restantes`
      : hint ?? "Necesario para desbloquear la app";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={heading}
      className={[
        fullscreen ? "fixed inset-0 z-[180]" : "absolute inset-0 z-30",
        "flex flex-col bg-surface/95 backdrop-blur-xl select-none",
        className,
      ].join(" ")}
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 28px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
        animation: "fadeIn 0.25s both",
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-7 min-h-0">
        <div className="w-14 h-14 rounded-2xl grid place-items-center bg-primary/10 text-primary [&_svg]:w-6 [&_svg]:h-6">
          {icon ?? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2.5" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
        </div>

        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{appName}</p>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight text-foreground">{heading}</h2>
          <p className={`mt-1.5 text-xs leading-relaxed ${state === "error" || locked ? "text-danger font-semibold" : "text-muted"}`}>
            {message}
          </p>
        </div>

        {mode === "pin" ? (
          <div className="flex items-center gap-3" style={{ animation: state === "error" ? "shake 0.4s" : undefined }} aria-live="polite">
            {Array.from({ length }).map((_, i) => {
              const filled = i < code.length;
              return (
                <span key={i}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: filled ? 15 : 12, height: filled ? 15 : 12,
                    background: state === "error" ? "var(--color-danger)"
                      : state === "ok" ? "var(--color-success)"
                      : filled ? "var(--color-primary)" : "var(--color-border)",
                    transform: filled ? "scale(1)" : "scale(0.92)",
                  }} />
              );
            })}
          </div>
        ) : (
          <form className="w-full max-w-xs" onSubmit={(e) => { e.preventDefault(); if (code) submit(code); }}
            style={{ animation: state === "error" ? "shake 0.4s" : undefined }}>
            <div className={`flex items-center h-12 rounded-xl border bg-surface px-3 gap-2 transition-colors ${state === "error" ? "border-danger" : "border-border focus-within:border-primary"}`}>
              <input autoFocus type={reveal ? "text" : "password"} value={code} disabled={locked}
                onChange={(e) => setCode(e.target.value)} placeholder="••••••••"
                className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted" />
              <button type="button" onClick={() => setReveal((r) => !r)} aria-label="Ver contraseña"
                className="text-muted hover:text-foreground transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
            <button type="submit" disabled={!code || locked || state === "checking"}
              className="mt-3 w-full h-12 rounded-xl bg-primary text-white text-sm font-semibold shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-[0.98] disabled:opacity-40 transition-all">
              {state === "checking" ? "Verificando…" : "Desbloquear"}
            </button>
          </form>
        )}
      </div>

      {mode === "pin" && (
        <div className="px-7 pb-1 w-full max-w-[320px] mx-auto">
          <Keypad
            onKey={push}
            disabled={locked || state === "checking" || state === "ok"}
            extraKey={null}
            onBackspaceLong={() => setCode("")}
          />
        </div>
      )}

      <div className="mt-4 flex items-center justify-center gap-5 px-7">
        {onBiometric && !locked && (
          <button type="button" onClick={() => onBiometric()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:opacity-80 active:scale-95 transition-all">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
              <path d="M12 3a9 9 0 0 0-9 9v3" /><path d="M21 15v-3a9 9 0 0 0-4.5-7.8" />
              <path d="M8 21a13 13 0 0 1-1-5.5V12a5 5 0 0 1 10 0v3.5" /><path d="M12 12v4" />
            </svg>
            Usar biometría
          </button>
        )}
        {onForgot && (
          <button type="button" onClick={onForgot} className="text-xs font-medium text-muted hover:text-foreground transition-colors">
            ¿Olvidaste tu {mode === "pin" ? "PIN" : "contraseña"}?
          </button>
        )}
      </div>
    </div>
  );
}
