"use client";
import { useState } from "react";

export interface CoinFlipProps {
  labels?: [string, string];
  size?: number;
  onFlip?: (result: string) => void;
  className?: string;
}

function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rollTo(prev: number, targetMod: number, spins: number) {
  const desired = ((targetMod % 360) + 360) % 360;
  const prevMod = ((prev % 360) + 360) % 360;
  let delta = desired - prevMod;
  if (delta <= 0) delta += 360;
  return prev + spins * 360 + delta;
}

/** Moneda 3D animada: gira y cae en cara o cruz al azar. */
export function CoinFlip({ labels = ["Cara", "Cruz"], size = 140, onFlip, className = "" }: CoinFlipProps) {
  const [rotation, setRotation] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const flip = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);
    const heads = Math.random() < 0.5;
    const next = rollTo(rotation, heads ? 0 : 180, randInt(4, 6));
    setRotation(next);
    window.setTimeout(() => {
      setFlipping(false);
      const r = heads ? labels[0] : labels[1];
      setResult(r);
      onFlip?.(r);
    }, 1400);
  };

  return (
    <div className={`flex flex-col items-center gap-5 ${className}`}>
      <div style={{ width: size, height: size, perspective: size * 5 }}>
        <div style={{ width: "100%", height: "100%", position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${rotation}deg)`, transition: "transform 1.3s cubic-bezier(.22,.61,.36,1)" }}>
          <div className="absolute inset-0 rounded-full border-4 border-primary-hover bg-primary text-white flex items-center justify-center text-lg font-bold" style={{ backfaceVisibility: "hidden" }}>{labels[0]}</div>
          <div className="absolute inset-0 rounded-full border-4 border-accent bg-accent text-white flex items-center justify-center text-lg font-bold" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>{labels[1]}</div>
        </div>
      </div>
      <button type="button" onClick={flip} disabled={flipping} className="h-11 px-6 rounded-xl bg-primary text-white text-sm font-bold active:scale-[0.98] disabled:opacity-60 transition-all">{flipping ? "Girando…" : "Lanzar moneda"}</button>
      <div className="h-6 text-sm font-semibold text-foreground">{result ? <>Salió: <span className="text-primary">{result}</span></> : null}</div>
    </div>
  );
}
