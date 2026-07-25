"use client";

import { useRef, useState, type ReactNode } from "react";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  /** px que hay que arrastrar para que dispare. Default 72 */
  threshold?: number;
  /** cuánto se puede estirar más allá del umbral. Default 1.6× */
  maxStretch?: number;
  /** desactiva el gesto (ej. mientras hay un modal abierto) */
  disabled?: boolean;
  /** texto del flash de confirmación. Default "Actualizado" */
  doneLabel?: string;
  /** alto del contenedor scrolleable; si se omite, ocupa lo que le den */
  height?: number | string;
  className?: string;
}

type Phase = "idle" | "pull" | "ready" | "refresh" | "done";

/**
 * Pull to refresh nativo: sólo arranca con el scroll arriba del todo, aplica
 * resistencia al arrastre, dispara al soltar pasado el umbral y confirma con
 * un flash. Bloquea el overscroll del navegador mientras se arrastra.
 */
export function PullToRefresh({
  children, onRefresh, threshold = 72, maxStretch = 1.6, disabled = false,
  doneLabel = "Actualizado", height, className = "",
}: PullToRefreshProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [y, setY] = useState(0);
  const scroller = useRef<HTMLDivElement>(null);
  const start = useRef<number | null>(null);

  const max = threshold * maxStretch;
  const pulling = phase === "pull" || phase === "ready";

  const onDown = (e: React.PointerEvent) => {
    if (disabled || phase === "refresh") return;
    if ((scroller.current?.scrollTop ?? 0) > 0) return;
    start.current = e.clientY;
  };

  const onMove = (e: React.PointerEvent) => {
    if (start.current == null) return;
    const raw = e.clientY - start.current;
    if (raw <= 0) { setY(0); setPhase("idle"); return; }
    // resistencia progresiva: cuesta más cuanto más se estira
    const next = Math.min(max, raw * (raw > threshold ? 0.42 : 0.68));
    setY(next);
    setPhase(next >= threshold ? "ready" : "pull");
  };

  const onUp = async () => {
    if (start.current == null) return;
    const fire = phase === "ready";
    start.current = null;
    if (!fire) { setY(0); setPhase("idle"); return; }
    setPhase("refresh");
    setY(threshold * 0.7);
    try {
      await onRefresh();
    } finally {
      setPhase("done");
      setY(0);
      setTimeout(() => setPhase("idle"), 1100);
    }
  };

  const progress = Math.min(1, y / threshold);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height }}>
      {/* indicador */}
      <div className="absolute inset-x-0 top-0 z-10 flex justify-center pointer-events-none"
        style={{ height: threshold, transform: `translateY(${(phase === "refresh" ? threshold * 0.7 : y) - threshold}px)`,
                 transition: start.current == null ? "transform 0.32s cubic-bezier(0.16,1,0.3,1)" : "none" }}>
        <div className="self-center w-9 h-9 rounded-full bg-surface border border-border shadow-lg shadow-black/10 grid place-items-center"
          style={{ opacity: phase === "refresh" ? 1 : progress }}>
          {phase === "refresh" ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"
              className="text-primary animate-spin">
              <path d="M21 12a9 9 0 1 1-6.2-8.55"/>
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
              className={phase === "ready" ? "text-primary" : "text-muted"}
              style={{ transform: `rotate(${progress * 180}deg)`, transition: "transform 0.12s linear" }}>
              <line x1="12" y1="19" x2="12" y2="5"/><polyline points="6 11 12 5 18 11"/>
            </svg>
          )}
        </div>
      </div>

      {/* flash de confirmación */}
      {phase === "done" && (
        <div className="absolute inset-x-0 top-0 z-10 flex justify-center pointer-events-none"
          style={{ animation: "ptrFlash 1.1s both" }}>
          <span className="mt-2 h-7 px-3 rounded-full bg-success/12 text-success text-[11px] font-bold inline-flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {doneLabel}
          </span>
        </div>
      )}

      <div ref={scroller}
        className="h-full overflow-y-auto"
        style={{
          transform: `translateY(${phase === "refresh" ? threshold * 0.7 : y}px)`,
          transition: start.current == null ? "transform 0.32s cubic-bezier(0.16,1,0.3,1)" : "none",
          touchAction: pulling ? "none" : "pan-y",
          overscrollBehaviorY: "contain",
        }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        {children}
      </div>
    </div>
  );
}

/* Agregá el keyframe a globals.css:
@keyframes ptrFlash {
  0%   { opacity: 0; transform: translateY(-8px); }
  15%  { opacity: 1; transform: translateY(0); }
  80%  { opacity: 1; }
  100% { opacity: 0; }
}
*/
