"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ImageZoom } from "./ImageZoom";

export interface CarouselImage {
  src: string;
  alt?: string;
  caption?: string;
}

interface CarouselProps {
  images: CarouselImage[];
  /** imágenes visibles a la vez. Default 1 */
  perView?: number;
  /** separación entre slides en px. Default 16 */
  gap?: number;
  aspect?: number;
  /** vuelve al principio al pasar el final. Default true */
  loop?: boolean;
  /** ms entre avances automáticos; se pausa al pasar el mouse o arrastrar */
  autoplay?: number;
  arrows?: boolean;
  dots?: boolean;
  thumbs?: boolean;
  /** click en el slide → abre el visor con pan y zoom */
  zoomable?: boolean;
  /** deja asomar el slide siguiente (efecto peek). Default 0 */
  peek?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
}

/** Carrusel de imágenes: arrastre, flechas, dots, miniaturas, autoplay y zoom. */
export function Carousel({
  images, perView = 1, gap = 16, aspect = 16 / 9, loop = true, autoplay,
  arrows = true, dots = true, thumbs = false, zoomable = false, peek = 0,
  onIndexChange, className = "",
}: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState<number | null>(null);
  const [vw, setVw] = useState(0);
  const shell = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  /** hubo arrastre real: evita que el click de fin de swipe abra el visor */
  const moved = useRef(false);
  const paused = useRef(false);

  useEffect(() => {
    const el = shell.current;
    if (!el) return;
    const read = () => {
      const w = viewport.current ? viewport.current.clientWidth : el.getBoundingClientRect().width;
      setVw((prev) => (Math.abs(w - prev) < 1 ? prev : w));
    };
    const ro = new ResizeObserver(read);
    ro.observe(el);
    read();
    return () => ro.disconnect();
  }, []);

  const last = Math.max(0, images.length - perView);

  const go = useCallback((next: number) => {
    setIndex((prev) => {
      const n = loop
        ? (next < 0 ? last : next > last ? 0 : next)
        : Math.min(last, Math.max(0, next));
      if (n !== prev) onIndexChange?.(n);
      return n;
    });
  }, [last, loop, onIndexChange]);

  useEffect(() => {
    if (!autoplay || images.length <= perView) return;
    const t = setInterval(() => { if (!paused.current) go(index + 1); }, autoplay);
    return () => clearInterval(t);
  }, [autoplay, go, index, images.length, perView]);

  const slideW = vw ? (vw - gap * (perView - 1) - peek) / perView : 0;
  const offset = -(index * (slideW + gap)) + dragX;

  const onDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
    setDragging(true);
    paused.current = true;
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
    paused.current = false;
    if (Math.abs(dx) > Math.max(40, slideW * 0.18)) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div className={`relative ${className}`}
      onMouseEnter={() => { paused.current = true; }}
      onMouseLeave={() => { paused.current = false; }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
      }}
      tabIndex={0}
      role="region"
      aria-roledescription="carrusel"
      aria-label="Galería de imágenes"
    >
      <div ref={shell} className="w-full min-w-0">
      <div ref={viewport} className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-surface-alt"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      >
        <div className="flex will-change-transform"
          style={{
            gap, transform: `translate3d(${offset}px,0,0)`,
            transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}>
          {images.map((img, i) => (
            <figure key={i} className="relative shrink-0 overflow-hidden bg-surface-alt select-none"
              style={{ width: slideW || `calc((100% - ${gap * (perView - 1)}px) / ${perView})`, aspectRatio: String(aspect) }}
              aria-hidden={i < index || i >= index + perView}
            >
              <img src={img.src} alt={img.alt ?? ""} draggable={false}
                onClick={() => { if (zoomable && !moved.current) setZoom(i); }}
                className={`absolute inset-0 w-full h-full object-cover ${zoomable ? "cursor-zoom-in" : ""}`}
                style={{ opacity: i >= index && i < index + perView ? 1 : 0.45, transition: "opacity 0.4s ease" }}
              />
              {img.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs font-medium text-white bg-gradient-to-t from-black/70 to-transparent pt-8">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
      </div>

      {arrows && images.length > perView && (
        <>
          <Arrow side="left" onClick={() => go(index - 1)} disabled={!loop && index === 0} />
          <Arrow side="right" onClick={() => go(index + 1)} disabled={!loop && index === last} />
        </>
      )}

      {dots && images.length > perView && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {Array.from({ length: last + 1 }).map((_, i) => (
            <button key={i} onClick={() => go(i)} aria-label={`Ir a ${i + 1}`}
              className="h-1.5 rounded-full transition-all active:scale-90"
              style={{
                width: i === index ? 22 : 6,
                background: i === index ? "var(--color-primary)" : "var(--color-border)",
              }} />
          ))}
        </div>
      )}

      {thumbs && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => go(Math.min(last, i))}
              className="relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all active:scale-95"
              style={{ borderColor: i >= index && i < index + perView ? "var(--color-primary)" : "var(--color-border)" }}
              aria-label={`Miniatura ${i + 1}`}>
              <img src={img.src} alt="" className="w-full h-full object-cover"
                style={{ opacity: i >= index && i < index + perView ? 1 : 0.55 }} />
            </button>
          ))}
        </div>
      )}

      {zoomable && (
        <ImageZoom
          open={zoom != null}
          src={zoom != null ? images[zoom].src : ""}
          alt={zoom != null ? images[zoom].alt ?? "" : ""}
          caption={zoom != null ? images[zoom].caption : undefined}
          onClose={() => setZoom(null)}
          onPrev={() => setZoom((z) => (z == null ? z : (z - 1 + images.length) % images.length))}
          onNext={() => setZoom((z) => (z == null ? z : (z + 1) % images.length))}
        />
      )}
    </div>
  );
}

function Arrow({ side, onClick, disabled }: { side: "left" | "right"; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      aria-label={side === "left" ? "Anterior" : "Siguiente"}
      className={[
        "absolute top-[calc(50%-14px)] -translate-y-1/2 w-10 h-10 rounded-full grid place-items-center",
        side === "left" ? "left-3" : "right-3",
        "bg-surface/85 backdrop-blur border border-border text-foreground shadow-lg shadow-black/10",
        "hover:bg-surface active:scale-90 disabled:opacity-0 transition-all",
      ].join(" ")}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: side === "left" ? "rotate(180deg)" : "none" }}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}
