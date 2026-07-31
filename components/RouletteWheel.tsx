"use client";
import { useState, useId } from "react";

export interface RouletteWheelProps {
  /** Opciones iniciales. Editable por el usuario si allowEdit !== false. */
  defaultOptions?: string[];
  /** Permite agregar/quitar/editar opciones. Default true. */
  allowEdit?: boolean;
  /** Tamaño de la rueda en px. Default 280. */
  size?: number;
  /** Se llama al terminar el giro con la opción elegida. */
  onResult?: (option: string, index: number) => void;
  className?: string;
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Igual que en DiceRoller: avanza en sentido positivo hasta el próximo
// ángulo cuyo módulo 360 coincide con targetMod, sumando `spins` vueltas.
function rollTo(prev: number, targetMod: number, spins: number) {
  const desired = ((targetMod % 360) + 360) % 360;
  const prevMod = ((prev % 360) + 360) % 360;
  let delta = desired - prevMod;
  if (delta <= 0) delta += 360;
  return prev + spins * 360 + delta;
}

function segmentColor(i: number, n: number) {
  const hue = 259 + (i * 360) / n; // arranca en el hue del primary de marca
  const lightness = i % 2 === 0 ? 78 : 70;
  return `oklch(${lightness}% 0.1 ${hue})`;
}

export function RouletteWheel({ defaultOptions = ["Opción 1", "Opción 2", "Opción 3", "Opción 4"], allowEdit = true, size = 280, onResult, className = "" }: RouletteWheelProps) {
  const [options, setOptions] = useState<string[]>(defaultOptions);
  const [draft, setDraft] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<{ option: string; index: number } | null>(null);
  const uid = useId();
  const n = options.length;
  const seg = n > 0 ? 360 / n : 0;

  const addOption = () => {
    const v = draft.trim();
    if (!v) return;
    setOptions((o) => [...o, v]);
    setDraft("");
    setWinner(null);
  };
  const removeOption = (i: number) => {
    setOptions((o) => o.filter((_, idx) => idx !== i));
    setWinner(null);
  };
  const editOption = (i: number, v: string) => {
    setOptions((o) => o.map((op, idx) => (idx === i ? v : op)));
  };

  const spin = () => {
    if (spinning || n < 2) return;
    setSpinning(true);
    setWinner(null);
    const index = randInt(0, n - 1);
    const center = index * seg + seg / 2;
    const target = ((-center % 360) + 360) % 360;
    const next = rollTo(rotation, target, randInt(4, 6));
    setRotation(next);
    window.setTimeout(() => {
      setSpinning(false);
      const result = { option: options[index], index };
      setWinner(result);
      onResult?.(result.option, result.index);
    }, 3200);
  };

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
            style={{ width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "16px solid var(--color-foreground)" }}
          />
          <div
            className="absolute inset-0 rounded-full border-4 border-surface shadow-lg overflow-hidden"
            style={{
              background: n > 0 ? `conic-gradient(${options.map((_, i) => `${segmentColor(i, n)} ${i * seg}deg ${(i + 1) * seg}deg`).join(",")})` : "var(--color-surface-alt)",
              transform: `rotate(${rotation}deg)`,
              transition: "transform 3.1s cubic-bezier(.17,.67,.2,1)",
            }}
          >
            {options.map((opt, i) => {
              const center = i * seg + seg / 2;
              const flip = center > 90 && center < 270;
              return (
                <div key={`${uid}-${i}`} className="absolute inset-0" style={{ transform: `rotate(${center}deg)` }}>
                  <span
                    className="absolute left-1/2 top-[12%] -translate-x-1/2 text-[11px] font-bold text-foreground/85 whitespace-nowrap max-w-[38%] truncate"
                    style={{ transform: flip ? "rotate(180deg)" : undefined, transformOrigin: "center" }}
                  >
                    {opt}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-surface border-2 border-border shadow" />
          </div>
        </div>

        <button type="button" onClick={spin} disabled={spinning || n < 2} className="h-11 px-6 rounded-xl bg-primary text-white text-sm font-bold active:scale-[0.98] disabled:opacity-60 transition-all">
          {spinning ? "Girando…" : "Girar ruleta"}
        </button>

        <div className="h-6 text-sm font-semibold text-foreground">
          {winner ? <>Salió: <span className="text-primary">{winner.option}</span></> : n < 2 ? <span className="text-muted">Agregá al menos 2 opciones</span> : null}
        </div>
      </div>

      {allowEdit && (
        <div className="rounded-2xl border border-border bg-surface-alt/40 p-4 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Opciones</p>
          {options.map((opt, i) => (
            <div key={`${uid}-edit-${i}`} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ background: segmentColor(i, n) }} />
              <input
                value={opt}
                onChange={(e) => editOption(i, e.target.value)}
                className="flex-1 h-9 rounded-lg border border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button type="button" onClick={() => removeOption(i)} disabled={n <= 2} aria-label="Quitar opción" className="w-9 h-9 rounded-lg text-muted hover:bg-surface hover:text-danger disabled:opacity-30 transition-colors">✕</button>
            </div>
          ))}
          <div className="flex items-center gap-2 pt-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addOption()}
              placeholder="Nueva opción…"
              className="flex-1 h-9 rounded-lg border border-dashed border-border bg-surface px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button type="button" onClick={addOption} className="h-9 px-3.5 rounded-lg border border-border text-sm font-bold text-foreground hover:bg-surface-alt transition-colors shrink-0">Agregar</button>
          </div>
        </div>
      )}
    </div>
  );
}
