"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageZoom } from "./ImageZoom";

export interface CounterImage {
  src: string;
  alt?: string;
  caption?: string;
}

export type CounterStyle = "pill" | "bar" | "dots";
export type CounterPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "bottom-center";

interface ImageCounterProps {
  images: CounterImage[];
  /** estilo del contador. Default "pill" */
  counter?: CounterStyle;
  /** dónde se ancla el contador. Default "top-right" */
  position?: CounterPosition;
  aspect?: number;
  /** rellena con ceros: 03 / 12. Default true */
  pad?: boolean;
  /** flechas en desktop (en mobile siempre se arrastra). Default true */
  arrows?: boolean;
  /** click en la imagen abre el visor con pan y zoom */
  zoomable?: boolean;
  /** etiqueta arriba a la izquierda (ej. "Destacada") */
  badge?: string;
  /** miniaturas debajo */
  thumbs?: boolean;
  index?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
}

const POS: Record<CounterPosition, string> = {
  "top-right": "top-3 right-3",
  "top-left": "top-3 left-3",
  "bottom-right": "bottom-3 right-3",
  "bottom-left": "bottom-3 left-3",
  "bottom-center": "bottom-3 left-1/2 -translate-x-1/2",
};

/**
 * Imagen con contador: galería de una sola imagen a la vez con el clásico
 * «3 / 12» superpuesto. Arrastre horizontal, flechas, teclado y zoom opcional.
 */
export function ImageCounter({
  images, counter = "pill", position = "top-right", aspect = 4 / 3, pad = true,
  arrows = true, zoomable = false, badge, thumbs = false,
  index: controlled, onIndexChange, className = "",
}: ImageCounterProps) {
  const [uncontrolled, setUncontrolled] = useState(0);
  const index = controlled ?? uncontrolled;
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  /** hubo arrastre real: evita que el click de fin de swipe abra el visor */
  const moved = useRef(false);
  const total = images.length;

  const go = useCallback((next: number) => {
    const n = (next + total) % total;
    if (controlled == null) setUncontrolled(n);
    onIndexChange?.(n);
  }, [controlled, onIndexChange, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // con el visor abierto manda ImageZoom: si no, cada flecha avanzaría dos
      if (zoom) return;
      if (e.key === "ArrowLeft") go(index - 1);
      if (e.key === "ArrowRight") go(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, zoom]);

  const fmt = (n: number) => (pad && total > 9 ? String(n).padStart(2, "0") : String(n));

  const onDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
    setDragging(true);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    if (Math.abs(dx) > 6) moved.current = true;
    setDragX(dx);
  };
  const onUp = () => {
    if (!start.current) return;
    const dx = dragX;
    start.current = null;
    setDragging(false);
    setDragX(0);
    if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div className={className}>
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-surface-alt select-none"
        style={{ aspectRatio: String(aspect), touchAction: "pan-y" }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      >
        <div className="absolute inset-0 flex will-change-transform"
          style={{
            transform: `translate3d(calc(${-index * 100}% + ${dragX}px),0,0)`,
            transition: dragging ? "none" : "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
          }}>
          {images.map((img, i) => (
            <div key={i} className="relative w-full h-full shrink-0">
              <img src={img.src} alt={img.alt ?? ""} draggable={false}
                onClick={() => { if (zoomable && !moved.current) setZoom(true); }}
                className={`absolute inset-0 w-full h-full object-cover ${zoomable ? "cursor-zoom-in" : ""}`}/>
            </div>
          ))}
        </div>

        {badge && (
          <span className="absolute top-3 left-3 h-7 px-2.5 rounded-lg bg-black/55 backdrop-blur text-white text-[11px] font-semibold inline-flex items-center">
            {badge}
          </span>
        )}

        {counter === "pill" && (
          <span className={`absolute ${POS[position]} h-7 px-2.5 rounded-full bg-black/55 backdrop-blur text-white text-[11px] font-semibold inline-flex items-center gap-1 tabular-nums`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
            </svg>
            {fmt(index + 1)} / {fmt(total)}
          </span>
        )}

        {counter === "bar" && (
          <div className="absolute inset-x-0 bottom-0 p-3 pt-10 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-between gap-3">
            <span className="text-xs font-medium text-white/90 truncate">{images[index]?.caption}</span>
            <span className="text-[11px] font-semibold text-white tabular-nums shrink-0">{fmt(index + 1)} / {fmt(total)}</span>
          </div>
        )}

        {counter === "dots" && (
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
            {images.map((_, i) => (
              <button key={i} onClick={() => go(i)} aria-label={`Imagen ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{ width: i === index ? 20 : 6, background: i === index ? "#fff" : "rgba(255,255,255,0.5)" }}/>
            ))}
          </div>
        )}

        {arrows && total > 1 && (
          <>
            {(["left", "right"] as const).map((side) => (
              <button key={side} onClick={() => go(index + (side === "left" ? -1 : 1))}
                aria-label={side === "left" ? "Anterior" : "Siguiente"}
                className={`absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full grid place-items-center bg-black/40 backdrop-blur text-white hover:bg-black/60 active:scale-90 transition-all ${side === "left" ? "left-2" : "right-2"}`}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: side === "left" ? "rotate(180deg)" : undefined }}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            ))}
          </>
        )}
      </div>

      {thumbs && (
        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Miniatura ${i + 1}`}
              className="relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all active:scale-95"
              style={{ borderColor: i === index ? "var(--color-primary)" : "var(--color-border)" }}>
              <img src={img.src} alt="" className="w-full h-full object-cover" style={{ opacity: i === index ? 1 : 0.55 }}/>
            </button>
          ))}
        </div>
      )}

      {zoomable && (
        <ImageZoom open={zoom} onClose={() => setZoom(false)}
          src={images[index]?.src ?? ""} alt={images[index]?.alt}
          caption={images[index]?.caption}
          onPrev={() => go(index - 1)} onNext={() => go(index + 1)}/>
      )}
    </div>
  );
}
