// =============================================================
//  Media — preview versions
//  Placeholders SVG · Carousel · ImageZoom (pan + zoom bloqueante)
// =============================================================

// ---- Placeholder de imagen ---------------------------------------
// SVG data-URI con grilla fina y numeración: al hacer zoom se ve detalle real.
function phImage({ w = 1600, h = 900, label = "imagen", from = "#2563eb", to = "#8b5cf6", n = 1 } = {}) {
  const cell = 50;
  let grid = "";
  for (let x = 0; x <= w; x += cell) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${h}"/>`;
  for (let y = 0; y <= h; y += cell) grid += `<line x1="0" y1="${y}" x2="${w}" y2="${y}"/>`;
  let ticks = "";
  for (let x = 0; x <= w; x += cell * 4) for (let y = 0; y <= h; y += cell * 4)
    ticks += `<text x="${x + 6}" y="${y + 16}" font-family="monospace" font-size="11" fill="rgba(255,255,255,0.45)">${x},${y}</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>
<g stroke="rgba(255,255,255,0.16)" stroke-width="1">${grid}</g>
${ticks}
<circle cx="${w / 2}" cy="${h / 2}" r="${h * 0.28}" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
<text x="${w / 2}" y="${h / 2 - 10}" text-anchor="middle" font-family="monospace" font-size="${h * 0.13}" font-weight="700" fill="rgba(255,255,255,0.9)">${n}</text>
<text x="${w / 2}" y="${h / 2 + h * 0.09}" text-anchor="middle" font-family="monospace" font-size="${h * 0.045}" fill="rgba(255,255,255,0.75)" letter-spacing="4">${label.toUpperCase()}</text>
<text x="${w / 2}" y="${h - 24}" text-anchor="middle" font-family="monospace" font-size="20" fill="rgba(255,255,255,0.55)">${w} × ${h}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const PH_PALETTE = [
  ["#2563eb", "#8b5cf6"], ["#0ea5a4", "#22c55e"], ["#f59e0b", "#ef4444"],
  ["#8b5cf6", "#ec4899"], ["#334155", "#0f172a"], ["#0284c7", "#06b6d4"],
];

function phSet(labels, size = { w: 1600, h: 900 }) {
  return labels.map((label, i) => {
    const [from, to] = PH_PALETTE[i % PH_PALETTE.length];
    return { src: phImage({ ...size, label, from, to, n: i + 1 }), alt: label, caption: label };
  });
}

// ---- ImageZoom ---------------------------------------------------
function PreviewImageZoom({ src, alt = "", open, onClose, maxScale = 6, doubleTapScale = 2.5, caption, onPrev, onNext }) {
  const [scale, setScale] = useState(1);
  const [t, setT] = useState({ x: 0, y: 0 });
  const boxRef = useRef(null), imgRef = useRef(null);
  const pointers = useRef(new Map());
  const pinch = useRef(null), drag = useRef(null), lastTap = useRef(0);
  const st = useRef({ scale: 1, x: 0, y: 0 });
  st.current = { scale, x: t.x, y: t.y };

  const reset = useCallback(() => { setScale(1); setT({ x: 0, y: 0 }); }, []);

  const clamp = useCallback((x, y, s) => {
    const box = boxRef.current, img = imgRef.current;
    if (!box || !img) return { x, y };
    const mx = Math.max(0, (img.clientWidth * s - box.clientWidth) / 2);
    const my = Math.max(0, (img.clientHeight * s - box.clientHeight) / 2);
    return { x: Math.min(mx, Math.max(-mx, x)), y: Math.min(my, Math.max(-my, y)) };
  }, []);

  const zoomAt = useCallback((next, cx, cy) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const px = cx - r.left - r.width / 2, py = cy - r.top - r.height / 2;
    const prev = st.current.scale;
    const s = Math.min(maxScale, Math.max(1, next));
    const k = s / prev;
    const nx = s === 1 ? 0 : px - (px - st.current.x) * k;
    const ny = s === 1 ? 0 : py - (py - st.current.y) * k;
    setScale(s);
    setT(clamp(nx, ny, s));
  }, [clamp, maxScale]);

  // bloqueo total del resto de la página
  useEffect(() => {
    if (!open) return;
    reset();
    const prev = {
      overflow: document.body.style.overflow,
      touchAction: document.body.style.touchAction,
      overscroll: document.body.style.overscrollBehavior,
    };
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.overscrollBehavior = "none";
    const stop = e => e.preventDefault();
    const onKey = e => {
      if (e.key === "Escape") return onClose();
      if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomAt(st.current.scale * 1.4, innerWidth / 2, innerHeight / 2); }
      if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomAt(st.current.scale / 1.4, innerWidth / 2, innerHeight / 2); }
      if (e.key === "0") { e.preventDefault(); reset(); }
      if (e.key === "ArrowLeft" && onPrev) { e.preventDefault(); onPrev(); }
      if (e.key === "ArrowRight" && onNext) { e.preventDefault(); onNext(); }
    };
    window.addEventListener("wheel", stop, { passive: false });
    window.addEventListener("gesturestart", stop);
    window.addEventListener("contextmenu", stop);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev.overflow;
      document.body.style.touchAction = prev.touchAction;
      document.body.style.overscrollBehavior = prev.overscroll;
      window.removeEventListener("wheel", stop);
      window.removeEventListener("gesturestart", stop);
      window.removeEventListener("contextmenu", stop);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, reset, zoomAt, onPrev, onNext]);

  useEffect(() => { reset(); }, [src, reset]);

  if (!open) return null;

  const onDown = e => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: st.current.scale };
      drag.current = null;
      return;
    }
    drag.current = { x: e.clientX, y: e.clientY, tx: st.current.x, ty: st.current.y };
    const now = Date.now();
    if (now - lastTap.current < 300) {
      st.current.scale > 1 ? reset() : zoomAt(doubleTapScale, e.clientX, e.clientY);
      lastTap.current = 0;
    } else lastTap.current = now;
  };
  const onMove = e => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      zoomAt(pinch.current.scale * (Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.dist), (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    if (drag.current && st.current.scale > 1) {
      setT(clamp(drag.current.tx + (e.clientX - drag.current.x), drag.current.ty + (e.clientY - drag.current.y), st.current.scale));
    }
  };
  const onUp = e => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) drag.current = null;
  };

  const zoomed = scale > 1.01;
  const btn = "w-9 h-9 rounded-lg grid place-items-center bg-white/10 text-white text-lg font-semibold hover:bg-white/20 disabled:opacity-30 active:scale-90 transition-all";

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 select-none" role="dialog" aria-modal="true"
      style={{ touchAction: "none", animation: "fadeIn 0.2s both" }}>
      <div ref={boxRef} className="absolute inset-0 overflow-hidden flex items-center justify-center"
        style={{ cursor: zoomed ? "grab" : "zoom-in" }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onWheel={e => { e.preventDefault(); zoomAt(scale * (e.deltaY < 0 ? 1.12 : 1 / 1.12), e.clientX, e.clientY); }}
        onDoubleClick={e => (zoomed ? reset() : zoomAt(doubleTapScale, e.clientX, e.clientY))}>
        <img ref={imgRef} src={src} alt={alt} draggable={false}
          className="max-w-full max-h-full object-contain will-change-transform"
          style={{
            transform: `translate3d(${t.x}px,${t.y}px,0) scale(${scale})`,
            transition: drag.current || pinch.current ? "none" : "transform 0.22s cubic-bezier(0.16,1,0.3,1)",
          }}/>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <button className={btn} disabled={scale <= 1} aria-label="Alejar"
          onClick={()=>zoomAt(scale / 1.4, innerWidth / 2, innerHeight / 2)}>−</button>
        <span className="h-9 px-2.5 rounded-lg bg-white/10 text-white/80 text-xs font-semibold grid place-items-center tabular-nums min-w-[52px]">
          {Math.round(scale * 100)}%
        </span>
        <button className={btn} disabled={scale >= maxScale} aria-label="Acercar"
          onClick={()=>zoomAt(scale * 1.4, innerWidth / 2, innerHeight / 2)}>+</button>
        <button className={btn} disabled={!zoomed} onClick={reset} aria-label="Restablecer">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M3 12a9 9 0 1 0 3-6.7"/><polyline points="3 4 3 9 8 9"/>
          </svg>
        </button>
        <button className={btn} onClick={onClose} aria-label="Cerrar">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {[["left", onPrev], ["right", onNext]].map(([side, fn]) => fn ? (
        <button key={side} onClick={fn} aria-label={side === "left" ? "Anterior" : "Siguiente"}
          className={cx("absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full grid place-items-center bg-white/10 text-white hover:bg-white/20 active:scale-90 transition-all",
            side === "left" ? "left-4" : "right-4")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: side === "left" ? "rotate(180deg)" : "none" }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      ) : null)}

      <div className="absolute inset-x-0 bottom-0 p-5 pointer-events-none flex flex-col items-center gap-1.5">
        {caption && <p className="text-sm text-white/90 font-medium text-center">{caption}</p>}
        <p className="text-[11px] text-white/45 font-mono">arrastrar · rueda o pinch · doble click · esc</p>
      </div>
    </div>
  );
}

function PreviewZoomableImage({ src, alt = "", caption, aspect = 16 / 9, className = "" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={()=>setOpen(true)}
        className={cx("group relative w-full overflow-hidden rounded-2xl border border-border bg-surface-alt", className)}
        style={{ aspectRatio: String(aspect) }}>
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"/>
        <span className="absolute bottom-3 right-3 h-8 px-2.5 rounded-lg bg-black/55 backdrop-blur text-white text-[11px] font-semibold inline-flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="21" y2="21"/>
            <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          Ampliar
        </span>
      </button>
      <PreviewImageZoom src={src} alt={alt} caption={caption} open={open} onClose={()=>setOpen(false)}/>
    </>
  );
}

// ---- Carousel ----------------------------------------------------
function PreviewCarousel({
  images, perView = 1, gap = 16, aspect = 16 / 9, loop = true, autoplay,
  arrows = true, dots = true, thumbs = false, zoomable = false, peek = 0, className = "",
}) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState(null);
  const [vw, setVw] = useState(0);
  const shell = useRef(null), viewport = useRef(null), start = useRef(null), paused = useRef(false);
  const last = Math.max(0, images.length - perView);

  useEffect(() => {
    const el = shell.current;
    if (!el) return;
    const read = () => {
      const w = viewport.current ? viewport.current.clientWidth : el.getBoundingClientRect().width;
      setVw(prev => Math.abs(w - prev) < 1 ? prev : w);
    };
    const ro = new ResizeObserver(read);
    ro.observe(el); read();
    return () => ro.disconnect();
  }, []);

  const go = useCallback(next => {
    setIndex(() => loop ? (next < 0 ? last : next > last ? 0 : next) : Math.min(last, Math.max(0, next)));
  }, [last, loop]);

  useEffect(() => {
    if (!autoplay || images.length <= perView) return;
    const id = setInterval(()=>{ if (!paused.current) go(index + 1); }, autoplay);
    return () => clearInterval(id);
  }, [autoplay, go, index, images.length, perView]);

  const slideW = vw ? (vw - gap * (perView - 1) - peek) / perView : 0;
  const offset = -(index * (slideW + gap)) + dragX;

  const onDown = e => { start.current = { x: e.clientX }; setDragging(true); paused.current = true; };
  const onMove = e => { if (start.current) setDragX(e.clientX - start.current.x); };
  const onUp = () => {
    if (!start.current) return;
    const dx = dragX;
    start.current = null; setDragging(false); setDragX(0); paused.current = false;
    if (Math.abs(dx) > Math.max(40, slideW * 0.18)) go(index + (dx < 0 ? 1 : -1));
  };

  const arrow = (side, onClick, disabled) => (
    <button onClick={onClick} disabled={disabled} aria-label={side === "left" ? "Anterior" : "Siguiente"}
      className={cx("absolute top-[calc(50%-14px)] w-10 h-10 rounded-full grid place-items-center bg-surface/85 backdrop-blur border border-border text-foreground shadow-lg shadow-black/10 hover:bg-surface active:scale-90 transition-all",
        side === "left" ? "left-3" : "right-3", disabled && "opacity-0 pointer-events-none")}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: side === "left" ? "rotate(180deg)" : "none" }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  );

  return (
    <div className={cx("relative", className)} tabIndex={0} role="region" aria-label="Galería"
      onMouseEnter={()=>{ paused.current = true; }} onMouseLeave={()=>{ paused.current = false; }}
      onKeyDown={e=>{ if (e.key === "ArrowRight") { e.preventDefault(); go(index+1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(index-1); } }}>
      <div ref={shell} className="w-full min-w-0">
      <div ref={viewport} className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-surface-alt"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
        <div className="flex will-change-transform"
          style={{ gap, transform:`translate3d(${offset}px,0,0)`,
                   transition: dragging ? "none" : "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
          {images.map((img, i) => {
            const visible = i >= index && i < index + perView;
            return (
              <figure key={i} className="relative shrink-0 overflow-hidden bg-surface-alt select-none"
                style={{ width: slideW || `calc((100% - ${gap*(perView-1)}px) / ${perView})`, aspectRatio: String(aspect) }}>
                <img src={img.src} alt={img.alt ?? ""} draggable={false}
                  onClick={()=>{ if (zoomable && !dragX) setZoom(i); }}
                  className={cx("absolute inset-0 w-full h-full object-cover", zoomable && "cursor-zoom-in")}
                  style={{ opacity: visible ? 1 : 0.45, transition:"opacity 0.4s ease" }}/>
                {img.caption && (
                  <figcaption className="absolute inset-x-0 bottom-0 p-3 pt-8 text-xs font-medium text-white bg-gradient-to-t from-black/70 to-transparent">
                    {img.caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>
      </div>

      {arrows && images.length > perView && (
        <>
          {arrow("left", ()=>go(index-1), !loop && index === 0)}
          {arrow("right", ()=>go(index+1), !loop && index === last)}
        </>
      )}

      {dots && images.length > perView && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {Array.from({ length: last + 1 }).map((_, i) => (
            <button key={i} onClick={()=>go(i)} aria-label={`Ir a ${i+1}`}
              className="h-1.5 rounded-full transition-all active:scale-90"
              style={{ width: i === index ? 22 : 6, background: i === index ? "var(--color-primary)" : "var(--color-border)" }}/>
          ))}
        </div>
      )}

      {thumbs && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => {
            const on = i >= index && i < index + perView;
            return (
              <button key={i} onClick={()=>go(Math.min(last, i))} aria-label={`Miniatura ${i+1}`}
                className="relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all active:scale-95"
                style={{ borderColor: on ? "var(--color-primary)" : "var(--color-border)" }}>
                <img src={img.src} alt="" className="w-full h-full object-cover" style={{ opacity: on ? 1 : 0.55 }}/>
              </button>
            );
          })}
        </div>
      )}

      {zoomable && (
        <PreviewImageZoom open={zoom != null}
          src={zoom != null ? images[zoom].src : ""}
          alt={zoom != null ? images[zoom].alt : ""}
          caption={zoom != null ? images[zoom].caption : undefined}
          onClose={()=>setZoom(null)}
          onPrev={()=>setZoom(z => z == null ? z : (z - 1 + images.length) % images.length)}
          onNext={()=>setZoom(z => z == null ? z : (z + 1) % images.length)}/>
      )}
    </div>
  );
}

Object.assign(window, { phImage, phSet, PreviewCarousel, PreviewImageZoom, PreviewZoomableImage });
