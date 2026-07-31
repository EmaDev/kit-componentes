"use client";
import { useState, useId } from "react";

export interface DiceRollerProps {
  /** Cantidad mínima de dados que se puede elegir. Default 1. */
  min?: number;
  /** Cantidad máxima de dados que se puede elegir. Default 6. */
  max?: number;
  /** Cantidad inicial de dados. Default 2. */
  defaultCount?: number;
  /** Tamaño de cada dado en px. Default 64. */
  size?: number;
  /** Se llama al terminar la animación con los valores de cada dado. */
  onRoll?: (values: number[]) => void;
  className?: string;
}

type Rot = { x: number; y: number };

// Rotación (en grados, respecto al reposo) que trae cada valor 1-6 al frente.
const FACE_ROTATION: Record<number, Rot> = {
  1: { x: 0, y: 0 },
  6: { x: 0, y: 180 },
  2: { x: 0, y: -90 },
  5: { x: 0, y: 90 },
  3: { x: -90, y: 0 },
  4: { x: 90, y: 0 },
};

// Patrón de puntos estándar por valor, en grilla 3x3 (fila, columna).
const PIPS: Record<number, [number, number][]> = {
  1: [[2, 2]],
  2: [[1, 1], [3, 3]],
  3: [[1, 1], [2, 2], [3, 3]],
  4: [[1, 1], [1, 3], [3, 1], [3, 3]],
  5: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]],
  6: [[1, 1], [1, 3], [2, 1], [2, 3], [3, 1], [3, 3]],
};

const AXIS_POS: Record<1 | 2 | 3, string> = { 1: "18%", 2: "50%", 3: "82%" };

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Avanza `prev` en sentido positivo hasta el próximo ángulo cuyo módulo 360
// coincide con `targetMod`, sumando además `spins` vueltas completas.
function rollTo(prev: number, targetMod: number, spins: number) {
  const desired = ((targetMod % 360) + 360) % 360;
  const prevMod = ((prev % 360) + 360) % 360;
  let delta = desired - prevMod;
  if (delta <= 0) delta += 360;
  return prev + spins * 360 + delta;
}

function DieFace({ value, transform, size }: { value: number; transform: string; size: number }) {
  return (
    <div className="absolute inset-0 rounded-[14%] border border-border bg-surface" style={{ transform, backfaceVisibility: "hidden" }}>
      {PIPS[value].map(([r, c], i) => (
        <span
          key={i}
          className="absolute rounded-full bg-foreground"
          style={{
            width: size * 0.15,
            height: size * 0.15,
            top: AXIS_POS[r as 1 | 2 | 3],
            left: AXIS_POS[c as 1 | 2 | 3],
            transform: "translate(-50%,-50%)",
          }}
        />
      ))}
    </div>
  );
}

function Die({ size, rolling, delay, rotation }: { size: number; rolling: boolean; delay: number; rotation: Rot }) {
  return (
    <div className="shrink-0" style={{ width: size, height: size, perspective: size * 6, animation: rolling ? `diceBounceKf 0.9s ease ${delay}ms` : undefined }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: `transform ${1 + delay / 2000}s cubic-bezier(.22,.61,.36,1)`,
        }}
      >
        <DieFace value={1} size={size} transform={`translateZ(${size / 2}px)`} />
        <DieFace value={6} size={size} transform={`rotateY(180deg) translateZ(${size / 2}px)`} />
        <DieFace value={2} size={size} transform={`rotateY(90deg) translateZ(${size / 2}px)`} />
        <DieFace value={5} size={size} transform={`rotateY(-90deg) translateZ(${size / 2}px)`} />
        <DieFace value={3} size={size} transform={`rotateX(90deg) translateZ(${size / 2}px)`} />
        <DieFace value={4} size={size} transform={`rotateX(-90deg) translateZ(${size / 2}px)`} />
      </div>
    </div>
  );
}

/**
 * Lanzador de dados 3D animado. El usuario elige la cantidad de dados
 * (stepper) y lanza — cada dado gira en CSS 3D real hasta caer en un
 * valor aleatorio; muestra el total y el detalle por dado.
 */
export function DiceRoller({ min = 1, max = 6, defaultCount = 2, size = 64, onRoll, className = "" }: DiceRollerProps) {
  const [count, setCount] = useState(() => Math.min(Math.max(defaultCount, min), max));
  const [values, setValues] = useState<number[]>(() => Array.from({ length: count }, () => 1));
  const [rotations, setRotations] = useState<Rot[]>(() => Array.from({ length: count }, () => ({ x: 0, y: 0 })));
  const [rolling, setRolling] = useState(false);
  const uid = useId();

  const changeCount = (n: number) => {
    const next = Math.min(Math.max(n, min), max);
    setCount(next);
    setValues((v) => {
      const arr = v.slice(0, next);
      while (arr.length < next) arr.push(1);
      return arr;
    });
    setRotations((r) => {
      const arr = r.slice(0, next);
      while (arr.length < next) arr.push({ x: 0, y: 0 });
      return arr;
    });
  };

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    const results = Array.from({ length: count }, () => randInt(1, 6));
    setRotations((prev) =>
      results.map((v, i) => {
        const t = FACE_ROTATION[v];
        const base = prev[i] ?? { x: 0, y: 0 };
        return { x: rollTo(base.x, t.x, randInt(2, 3)), y: rollTo(base.y, t.y, randInt(2, 4)) };
      })
    );
    setValues(results);
    window.setTimeout(() => {
      setRolling(false);
      onRoll?.(results);
    }, 1000 + (count - 1) * 60 + 80);
  };

  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div className={`space-y-5 ${className}`}>
      <style>{`@keyframes diceBounceKf{0%{transform:translateY(0) scale(1)}30%{transform:translateY(-22%) scale(1.04)}60%{transform:translateY(2%) scale(0.98)}100%{transform:translateY(0) scale(1)}}`}</style>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Cantidad de dados</p>
          <div className="mt-1.5 inline-flex items-center gap-3 rounded-xl border border-border bg-surface p-1">
            <button type="button" aria-label="Menos dados" onClick={() => changeCount(count - 1)} disabled={count <= min || rolling} className="w-9 h-9 rounded-lg text-lg font-bold text-foreground hover:bg-surface-alt disabled:opacity-30 transition-colors">−</button>
            <span className="w-6 text-center text-sm font-bold text-foreground tabular-nums">{count}</span>
            <button type="button" aria-label="Más dados" onClick={() => changeCount(count + 1)} disabled={count >= max || rolling} className="w-9 h-9 rounded-lg text-lg font-bold text-foreground hover:bg-surface-alt disabled:opacity-30 transition-colors">+</button>
          </div>
        </div>

        <button type="button" onClick={roll} disabled={rolling} className="h-11 px-6 rounded-xl bg-primary text-white text-sm font-bold active:scale-[0.98] disabled:opacity-60 transition-all">
          {rolling ? "Lanzando…" : "Lanzar dados"}
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-surface-alt/40 px-6 py-8 flex flex-wrap items-center justify-center gap-6 min-h-[140px]">
        {values.map((v, i) => (
          <Die key={`${uid}-${i}`} size={size} rolling={rolling} delay={i * 60} rotation={rotations[i] ?? { x: 0, y: 0 }} />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted">{values.length > 1 ? values.join(" + ") + " =" : "Resultado:"}</span>
        <span className="text-2xl font-bold text-foreground tabular-nums">{total}</span>
      </div>
    </div>
  );
}
