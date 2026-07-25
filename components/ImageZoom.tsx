"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

interface ImageZoomProps {
  src: string;
  alt?: string;
  open: boolean;
  onClose: () => void;
  /** zoom máximo. Default 6 */
  maxScale?: number;
  /** escala del doble click / doble tap. Default 2.5 */
  doubleTapScale?: number;
  /** pie de foto sobre el visor */
  caption?: string;
  /** flechas para recorrer una galería sin salir del visor */
  onPrev?: () => void;
  onNext?: () => void;
}

/**
 * Visor de imagen a pantalla completa con pan y zoom. Mientras está abierto
 * BLOQUEA todo lo demás: scroll del documento, gestos del navegador
 * (pinch-zoom, ctrl+scroll, pull-to-refresh), long-press y cualquier click
 * fuera del visor — sólo la imagen recibe eventos.
 *
 * Gestos: arrastrar = pan · rueda / pinch = zoom al puntero · doble click = zoom
 * toggle · Escape = cerrar · +/− = zoom · 0 = reset.
 */
export function ImageZoom({
  src, alt = "", open, onClose, maxScale = 6, doubleTapScale = 2.5, caption, onPrev, onNext,
}: ImageZoomProps) {
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const lastTap = useRef(0);

  const reset = useCallback(() => { setScale(1); setTx(0); setTy(0); }, []);

  /** limita el pan para que la imagen no se escape de la pantalla */
  const clamp = useCallback((x: number, y: number, s: number) => {
    const box = boxRef.current, img = imgRef.current;
    if (!box || !img) return { x, y };
    const bw = box.clientWidth, bh = box.clientHeight;
    const iw = img.clientWidth * s, ih = img.clientHeight * s;
    const mx = Math.max(0, (iw - bw) / 2), my = Math.max(0, (ih - bh) / 2);
    return { x: Math.min(mx, Math.max(-mx, x)), y: Math.min(my, Math.max(-my, y)) };
  }, []);

  const zoomAt = useCallback((next: number, cx: number, cy: number) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const px = cx - r.left - r.width / 2;
    const py = cy - r.top - r.height / 2;
    setScale((prev) => {
      const s = Math.min(maxScale, Math.max(1, next));
      const k = s / prev;
      const nx = px - (px - tx) * k;
      const ny = py - (py - ty) * k;
      const c = clamp(s === 1 ? 0 : nx, s === 1 ? 0 : ny, s);
      setTx(c.x); setTy(c.y);
      return s;
    });
  }, [clamp, maxScale, tx, ty]);

  // --- bloqueo global mientras está abierto -------------------------
  useEffect(() => {
    if (!open) return;
    reset();
    const { overflow, touchAction, overscrollBehavior } = document.body.style;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.overscrollBehavior = "none";

    const stop = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomAt(scale * 1.4, innerWidth / 2, innerHeight / 2); }
      if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomAt(scale / 1.4, innerWidth / 2, innerHeight / 2); }
      if (e.key === "0") { e.preventDefault(); reset(); }
      if (e.key === "ArrowLeft" && onPrev) { e.preventDefault(); onPrev(); }
      if (e.key === "ArrowRight" && onNext) { e.preventDefault(); onNext(); }
    };
    // el navegador no debe hacer su propio zoom ni scroll
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("gesturestart", stop as EventListener);
    window.addEventListener("contextmenu", stop);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.touchAction = touchAction;
      document.body.style.overscrollBehavior = overscrollBehavior;
      window.removeEventListener("wheel", stop);
      window.removeEventListener("gesturestart", stop as EventListener);
      window.removeEventListener("contextmenu", stop);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, reset, zoomAt, scale, onPrev, onNext]);

  useEffect(() => { reset(); }, [src, reset]);

  // --- gestos --------------------------------------------------------
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale };
      drag.current = null;
      return;
    }
    drag.current = { x: e.clientX, y: e.clientY, tx, ty };
    const now = Date.now();
    if (now - lastTap.current < 300) {
      scale > 1 ? reset() : zoomAt(doubleTapScale, e.clientX, e.clientY);
      lastTap.current = 0;
    } else lastTap.current = now;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt(pinch.current.scale * (dist / pinch.current.dist), (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    if (drag.current && scale > 1) {
      const c = clamp(drag.current.tx + (e.clientX - drag.current.x), drag.current.ty + (e.clientY - drag.current.y), scale);
      setTx(c.x); setTy(c.y);
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) drag.current = null;
  };

  const zoomed = scale > 1.01;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/95 select-none"
          style={{ touchAction: "none" }}
          role="dialog" aria-modal="true" aria-label={alt || "Visor de imagen"}
        >
          <div
            ref={boxRef}
            className="absolute inset-0 overflow-hidden grid place-items-center"
            style={{ cursor: zoomed ? "grab" : "zoom-in" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={(e) => {
              e.preventDefault();
              zoomAt(scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12), e.clientX, e.clientY);
            }}
            onDoubleClick={(e) => (zoomed ? reset() : zoomAt(doubleTapScale, e.clientX, e.clientY))}
          >
            <motion.img
              ref={imgRef}
              src={src}
              alt={alt}
              draggable={false}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="max-w-full max-h-full object-contain will-change-transform"
              style={{
                transform: `translate3d(${tx}px,${ty}px,0) scale(${scale})`,
                transition: drag.current || pinch.current ? "none" : "transform 0.22s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          </div>

          {/* Controles */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <ZoomBtn label="Alejar" onClick={() => zoomAt(scale / 1.4, innerWidth / 2, innerHeight / 2)} disabled={scale <= 1}>−</ZoomBtn>
            <span className="h-9 px-2.5 rounded-lg bg-white/10 text-white/80 text-xs font-semibold grid place-items-center tabular-nums min-w-[52px]">
              {Math.round(scale * 100)}%
            </span>
            <ZoomBtn label="Acercar" onClick={() => zoomAt(scale * 1.4, innerWidth / 2, innerHeight / 2)} disabled={scale >= maxScale}>+</ZoomBtn>
            <ZoomBtn label="Restablecer" onClick={reset} disabled={!zoomed}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M3 12a9 9 0 1 0 3-6.7" /><polyline points="3 4 3 9 8 9" />
              </svg>
            </ZoomBtn>
            <ZoomBtn label="Cerrar" onClick={onClose}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </ZoomBtn>
          </div>

          {onPrev && <NavArrow side="left" onClick={onPrev} />}
          {onNext && <NavArrow side="right" onClick={onNext} />}

          <div className="absolute inset-x-0 bottom-0 p-5 pointer-events-none flex flex-col items-center gap-1.5">
            {caption && <p className="text-sm text-white/90 font-medium text-center">{caption}</p>}
            <p className="text-[11px] text-white/45 font-mono">
              arrastrar · rueda o pinch · doble click · esc
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ZoomBtn({ children, onClick, label, disabled }: {
  children: React.ReactNode; onClick: () => void; label: string; disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label}
      className="w-9 h-9 rounded-lg grid place-items-center bg-white/10 text-white text-lg font-semibold hover:bg-white/20 disabled:opacity-30 active:scale-90 transition-all">
      {children}
    </button>
  );
}

function NavArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label={side === "left" ? "Anterior" : "Siguiente"}
      className={`absolute top-1/2 -translate-y-1/2 ${side === "left" ? "left-4" : "right-4"} w-11 h-11 rounded-full grid place-items-center bg-white/10 text-white hover:bg-white/20 active:scale-90 transition-all`}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: side === "left" ? "rotate(180deg)" : "none" }}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  );
}

/** Miniatura que abre el visor. Úsala cuando sólo tenés una imagen. */
export function ZoomableImage({
  src, alt = "", caption, aspect = 16 / 9, className = "",
}: { src: string; alt?: string; caption?: string; aspect?: number; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className={`group relative w-full overflow-hidden rounded-2xl border border-border bg-surface-alt ${className}`}
        style={{ aspectRatio: String(aspect) }}>
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        <span className="absolute bottom-3 right-3 h-8 px-2.5 rounded-lg bg-black/55 backdrop-blur text-white text-[11px] font-semibold inline-flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />
            <line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          Ampliar
        </span>
      </button>
      <ImageZoom src={src} alt={alt} caption={caption} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
