"use client";

import { useMemo, useState } from "react";
import { Keypad } from "./Keypad";
import { useHaptics } from "@/hooks/useHaptics";

interface AmountPadProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void | Promise<void>;
  title?: string;
  subtitle?: string;
  currency?: string;
  locale?: string;
  /** saldo disponible: valida el máximo y se muestra arriba */
  balance?: number;
  min?: number;
  max?: number;
  /** montos sugeridos como chips */
  quickAmounts?: number[];
  cta?: string;
  /** decimales editables con la tecla ","  Default true */
  decimals?: boolean;
  className?: string;
}

/** Carga de importes a pantalla completa: número formateado en vivo + teclado propio. */
export function AmountPad({
  open, onClose, onConfirm, title = "¿Cuánto querés cargar?",
  subtitle, currency = "ARS", locale = "es-AR", balance, min = 1, max,
  quickAmounts = [1000, 5000, 10000], cta = "Continuar",
  decimals = true, className = "",
}: AmountPadProps) {
  const { haptic } = useHaptics();
  const [raw, setRaw] = useState("");        // dígitos enteros
  const [cents, setCents] = useState<string | null>(null); // null = sin coma
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);

  const value = useMemo(() => {
    const int = raw === "" ? 0 : parseInt(raw, 10);
    const dec = cents ? parseInt(cents.padEnd(2, "0"), 10) / 100 : 0;
    return int + dec;
  }, [raw, cents]);

  const nf = useMemo(() => new Intl.NumberFormat(locale, { minimumFractionDigits: 0, maximumFractionDigits: 0 }), [locale]);
  const money = (n: number) => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(n);
  const symbol = money(0).replace(/[\d.,\s]/g, "");

  const ceiling = max ?? balance;
  const overflow = ceiling != null && value > ceiling;
  const valid = value >= min && !overflow;

  const reject = () => { haptic("error"); setShake(true); setTimeout(() => setShake(false), 380); };

  const push = (k: string) => {
    if (busy) return;
    if (k === "backspace") {
      if (cents != null) {
        if (cents.length > 0) return setCents(cents.slice(0, -1));
        return setCents(null);
      }
      return setRaw((r) => r.slice(0, -1));
    }
    if (k === "," || k === ".") {
      if (!decimals || cents != null) return;
      return setCents("");
    }
    if (cents != null) {
      if (cents.length >= 2) return reject();
      return setCents(cents + k);
    }
    if (raw.length >= 9) return reject();
    setRaw((r) => (r === "" && k === "0" ? "" : r + k));
  };

  const setQuick = (n: number) => {
    haptic("tap");
    setRaw(String(Math.trunc(n)));
    setCents(null);
  };

  const confirm = async () => {
    if (!valid) return reject();
    setBusy(true);
    haptic("success");
    try { await onConfirm(value); } finally { setBusy(false); }
  };

  if (!open) return null;

  const display = `${nf.format(raw === "" ? 0 : parseInt(raw, 10))}${cents != null ? `,${cents}` : ""}`;
  const digits = display.replace(/\D/g, "").length;
  const fontSize = digits > 9 ? 40 : digits > 7 ? 48 : digits > 5 ? 58 : 68;

  return (
    <div role="dialog" aria-modal="true" aria-label={title}
      className={`fixed inset-0 z-[170] flex flex-col bg-surface select-none ${className}`}
      style={{
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 10px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)",
        animation: "fadeIn 0.22s both",
      }}>
      {/* header */}
      <div className="flex items-center justify-between px-4 h-12 shrink-0">
        <button type="button" onClick={onClose} aria-label="Cerrar"
          className="w-10 h-10 -ml-2 rounded-full grid place-items-center text-foreground hover:bg-surface-alt active:scale-90 transition-all">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {balance != null && (
          <span className="text-[11px] font-semibold text-muted">
            Disponible <span className="text-foreground tabular-nums">{money(balance)}</span>
          </span>
        )}
      </div>

      {/* monto */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 min-h-0">
        <p className="text-sm font-semibold text-muted text-center">{title}</p>
        <div className="flex items-start gap-2 tabular-nums" style={{ animation: shake ? "shake 0.36s" : undefined }}>
          <span className="mt-2 text-2xl font-semibold text-muted">{symbol}</span>
          <span className="font-bold tracking-tight leading-none transition-all duration-150"
            style={{ fontSize, color: overflow ? "var(--color-danger)" : value === 0 ? "var(--color-muted)" : "var(--color-foreground)" }}>
            {display}
          </span>
          <span className="mt-2 w-[2px] h-9 rounded-full bg-primary" style={{ animation: "pwaBlink 1.1s steps(1) infinite" }} aria-hidden="true" />
        </div>
        <p className={`text-xs h-4 font-medium ${overflow ? "text-danger" : "text-muted"}`}>
          {overflow ? `El máximo es ${money(ceiling!)}` : subtitle ?? (value > 0 && value < min ? `Mínimo ${money(min)}` : "")}
        </p>

        {quickAmounts.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {quickAmounts.map((n) => (
              <button key={n} type="button" onClick={() => setQuick(n)}
                className="h-9 px-3.5 rounded-full text-xs font-bold bg-surface-alt/80 border border-border/70 text-foreground hover:bg-surface-alt active:scale-95 transition-all tabular-nums">
                +{nf.format(n)}
              </button>
            ))}
            {balance != null && (
              <button type="button" onClick={() => setQuick(balance)}
                className="h-9 px-3.5 rounded-full text-xs font-bold bg-primary/10 border border-primary/25 text-primary hover:bg-primary/15 active:scale-95 transition-all">
                Todo
              </button>
            )}
          </div>
        )}
      </div>

      {/* teclado + CTA */}
      <div className="px-5 w-full max-w-[380px] mx-auto shrink-0">
        <Keypad onKey={push} extraKey={decimals ? "," : null} size="md" onBackspaceLong={() => { setRaw(""); setCents(null); }} />
        <button type="button" onClick={confirm} disabled={busy}
          className="mt-4 w-full h-13 rounded-2xl text-[15px] font-bold transition-all active:scale-[0.98] disabled:opacity-60 grid place-items-center"
          style={{
            height: 52,
            background: valid ? "var(--color-primary)" : "var(--color-surface-alt)",
            color: valid ? "#fff" : "var(--color-muted)",
            boxShadow: valid ? "0 8px 24px -10px var(--color-primary)" : "none",
          }}>
          {busy ? "Procesando…" : valid ? `${cta} · ${money(value)}` : cta}
        </button>
      </div>
    </div>
  );
}
