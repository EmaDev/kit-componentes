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

/** estado del transform: escala + traslación en px de pantalla */
type View = { s: number; x: number; y: number };

const IDLE: View = { s: 1, x: 0, y: 0 };
const EASE = "transform 0.22s cubic-bezier(0.16,1,0.3,1)";

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
  const [view, setViewState] = useState<View>(IDLE);
  const [interacting, setInteracting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  /** espejo síncrono de `view`: los gestos necesitan el valor actual, no el del render */
  const viewRef = useRef<View>(IDLE);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; scale: number } | null>(null);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const lastTap = useRef(0);

  const apply = useCallback((v: View) => {
    viewRef.current = v;
    setViewState(v);
  }, []);

  const reset = useCallback(() => { apply(IDLE); }, [apply]);

  /**
   * Tamaño real del contenido dentro del `<img>`: con `object-contain` la caja
   * del elemento casi nunca coincide con el pixel visible, así que el pan se
   * calcula sobre el rectángulo dibujado, no sobre la caja.
   */
  const contentSize = useCallback(() => {
    const img = imgRef.current;
    if (!img) return null;
    const bw = img.clientWidth, bh = img.clientHeight;
    const nw = img.naturalWidth, nh = img.naturalHeight;
    if (!nw || !nh) return { w: bw, h: bh };
    const k = Math.min(bw / nw, bh / nh);
    return { w: nw * k, h: nh * k };
  }, []);

  /** limita el pan para que la imagen no se escape de la pantalla */
  const clampPan = useCallback((x: number, y: number, s: number) => {
    const box = boxRef.current, content = contentSize();
    if (!box || !content) return { x, y };
    const mx = Math.max(0, (content.w * s - box.clientWidth) / 2);
    const my = Math.max(0, (content.h * s - box.clientHeight) / 2);
    return { x: Math.min(mx, Math.max(-mx, x)), y: Math.min(my, Math.max(-my, y)) };
  }, [contentSize]);

  /** zoom manteniendo fijo el punto (cx, cy) de la pantalla */
  const zoomAt = useCallback((next: number, cx: number, cy: number) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const px = cx - r.left - r.width / 2;
    const py = cy - r.top - r.height / 2;
    const prev = viewRef.current;
    const s = Math.min(maxScale, Math.max(1, next));
    if (Math.abs(s - prev.s) < 0.0005) return;
    const k = s / prev.s;
    const nx = s <= 1 ? 0 : px - (px - prev.x) * k;
    const ny = s <= 1 ? 0 : py - (py - prev.y) * k;
    const c = clampPan(nx, ny, s);
    apply({ s, x: c.x, y: c.y });
  }, [apply, clampPan, maxScale]);

  const zoomCenter = useCallback((factor: number) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    zoomAt(viewRef.current.s * factor, r.left + r.width / 2, r.top + r.height / 2);
  }, [zoomAt]);

  // --- reset al abrir y al cambiar de imagen --------------------------
  useEffect(() => {
    if (!open) return;
    reset();
    setLoaded(imgRef.current?.complete ?? false);
  }, [open, src, reset]);

  // --- bloqueo global mientras está abierto ---------------------------
  // Sólo depende de `open`: si dependiera del zoom se desmontaría y volvería a
  // montar en cada gesto, restaurando el scroll del body a mitad de camino.
  useEffect(() => {
    if (!open) return;
    const body = document.body;
    const prev = {
      overflow: body.style.overflow,
      touchAction: body.style.touchAction,
      overscrollBehavior: body.style.overscrollBehavior,
    };
    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    body.style.overscrollBehavior = "none";

    const stop = (e: Event) => e.preventDefault();
    window.addEventListener("gesturestart", stop as EventListener);
    window.addEventListener("gesturechange", stop as EventListener);
    window.addEventListener("contextmenu", stop);
    return () => {
      body.style.overflow = prev.overflow;
      body.style.touchAction = prev.touchAction;
      body.style.overscrollBehavior = prev.overscrollBehavior;
      window.removeEventListener("gesturestart", stop as EventListener);
      window.removeEventListener("gesturechange", stop as EventListener);
      window.removeEventListener("contextmenu", stop);
    };
  }, [open]);

  // --- teclado ---------------------------------------------------------
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomCenter(1.4); }
      if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomCenter(1 / 1.4); }
      if (e.key === "0") { e.preventDefault(); reset(); }
      if (e.key === "ArrowLeft" && onPrev) { e.preventDefault(); e.stopPropagation(); onPrev(); }
      if (e.key === "ArrowRight" && onNext) { e.preventDefault(); e.stopPropagation(); onNext(); }
    };
    // captura: gana antes que los listeners de la galería que abrió el visor
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open, onClose, onPrev, onNext, reset, zoomCenter]);

  // --- rueda / pinch de trackpad ---------------------------------------
  // Nativo y no pasivo: el `onWheel` de React es pasivo y su preventDefault()
  // se ignora, así que el navegador seguía haciendo su propio zoom de página.
  useEffect(() => {
    const box = boxRef.current;
    if (!open || !box) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // ctrl+wheel = pinch de trackpad: más fino y proporcional al delta
      const factor = e.ctrlKey
        ? Math.exp(-e.deltaY / 120)
        : e.deltaY < 0 ? 1.12 : 1 / 1.12;
      zoomAt(viewRef.current.s * factor, e.clientX, e.clientY);
    };
    box.addEventListener("wheel", onWheel, { passive: false });
    return () => box.removeEventListener("wheel", onWheel);
  }, [open, zoomAt]);

  // --- gestos de puntero ------------------------------------------------
  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setInteracting(true);

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, scale: viewRef.current.s };
      drag.current = null;
      return;
    }
    drag.current = { x: e.clientX, y: e.clientY, tx: viewRef.current.x, ty: viewRef.current.y };

    // el doble tap es sólo táctil; con mouse lo resuelve onDoubleClick
    if (e.pointerType === "touch") {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        if (viewRef.current.s > 1.01) reset();
        else zoomAt(doubleTapScale, e.clientX, e.clientY);
        lastTap.current = 0;
      } else lastTap.current = now;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size >= 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt(pinch.current.scale * (dist / pinch.current.dist), (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    if (drag.current && viewRef.current.s > 1) {
      const c = clampPan(
        drag.current.tx + (e.clientX - drag.current.x),
        drag.current.ty + (e.clientY - drag.current.y),
        viewRef.current.s,
      );
      apply({ ...viewRef.current, x: c.x, y: c.y });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) {
      drag.current = null;
      setInteracting(false);
    } else {
      // quedó un dedo tras el pinch: re-anclar el pan para que no salte
      const [p] = [...pointers.current.values()];
      drag.current = { x: p.x, y: p.y, tx: viewRef.current.x, ty: viewRef.current.y };
    }
  };

  const zoomed = view.s > 1.01;

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
            style={{ touchAction: "none", cursor: zoomed ? (interacting ? "grabbing" : "grab") : "zoom-in" }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onDoubleClick={(e) => {
              e.preventDefault();
              if (zoomed) reset();
              else zoomAt(doubleTapScale, e.clientX, e.clientY);
            }}
          >
            {/* `<img>` plano a propósito: framer-motion gestiona su propio
                transform y pisaría el del zoom. */}
            <img
              ref={imgRef}
              key={src}
              src={src}
              alt={alt}
              draggable={false}
              onLoad={() => setLoaded(true)}
              className="max-w-full max-h-full object-contain will-change-transform pointer-events-none"
              style={{
                transform: `translate3d(${view.x}px,${view.y}px,0) scale(${view.s})`,
                transition: interacting ? "opacity 0.2s ease" : `${EASE}, opacity 0.2s ease`,
                opacity: loaded ? 1 : 0,
              }}
            />
          </div>

          {/* Controles */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <ZoomBtn label="Alejar" onClick={() => zoomCenter(1 / 1.4)} disabled={view.s <= 1}>−</ZoomBtn>
            <span className="h-9 px-2.5 rounded-lg bg-white/10 text-white/80 text-xs font-semibold grid place-items-center tabular-nums min-w-[52px]">
              {Math.round(view.s * 100)}%
            </span>
            <ZoomBtn label="Acercar" onClick={() => zoomCenter(1.4)} disabled={view.s >= maxScale}>+</ZoomBtn>
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
