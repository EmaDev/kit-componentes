// =============================================================
//  BottomSheet — preview version
//  Drag real con pointer events (el componente usa framer-motion drag).
// =============================================================

const SHEET_SIZES = {
  auto: { cls: "max-h-[85%]", label: "auto" },
  xs:   { cls: "h-[28%]",     label: "28%" },
  sm:   { cls: "h-[40%]",     label: "40%" },
  md:   { cls: "h-[58%]",     label: "58%" },
  lg:   { cls: "h-[76%]",     label: "76%" },
  xl:   { cls: "h-[90%]",     label: "90%" },
  full: { cls: "h-full",      label: "100%" },
};

function PreviewBottomSheet({
  open, onClose, size = "auto", title, description, children, footer,
  showHandle = true, showClose = false, closeOnBackdrop = true,
  dragToClose = true, snapPoints, defaultSnap = 0,
  /** contenedor: "screen" (fixed) o "device" (absolute dentro del mock) */
  mode = "device",
}) {
  const [snap, setSnap] = useState(defaultSnap);
  const [dragY, setDragY] = useState(0);
  const [closing, setClosing] = useState(false);
  const dragRef = useRef(null);

  useEffect(() => { if (open) { setSnap(defaultSnap); setDragY(0); setClosing(false); } }, [open, defaultSnap]);
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  if (!open) return null;

  const usingSnaps = Array.isArray(snapPoints) && snapPoints.length > 0;
  const heightStyle = usingSnaps
    ? { height: `${Math.round(snapPoints[Math.min(snap, snapPoints.length-1)] * 100)}%` }
    : undefined;

  const onDown = (e) => {
    if (!dragToClose && !usingSnaps) return;
    dragRef.current = { startY: e.clientY, t: Date.now(), dy: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = (e) => {
    if (!dragRef.current) return;
    const dy = e.clientY - dragRef.current.startY;
    dragRef.current.dy = dy;                      // raw offset para los umbrales
    setDragY(usingSnaps ? dy * (dy < 0 ? 0.35 : 1) : Math.max(dy, -8));  // damping solo visual
  };
  const onUp = () => {
    if (!dragRef.current) return;
    const dy = dragRef.current.dy;
    const dt = Math.max(1, Date.now() - dragRef.current.t);
    const v = (dy / dt) * 1000;
    dragRef.current = null;
    setDragY(0);
    if (usingSnaps) {
      const last = snapPoints.length - 1;
      if (dy > 70 || v > 500) { if (snap === 0) doClose(); else setSnap(s => Math.max(0, s-1)); return; }
      if ((dy < -70 || v < -500) && snap < last) setSnap(s => Math.min(last, s+1));
      return;
    }
    if (dragToClose && (dy > 110 || v > 500)) doClose();
  };
  const doClose = () => { setClosing(true); setTimeout(() => onClose?.(), 240); };

  const pos = mode === "device" ? "absolute" : "fixed";

  return (
    <>
      <div
        onClick={closeOnBackdrop ? doClose : undefined}
        className={`${pos} inset-0 z-[140] bg-black/45 backdrop-blur-sm`}
        style={{ animation: closing ? "fadeOut 0.24s ease-in forwards" : "fadeIn 0.25s ease-out" }}
      />
      <div
        role="dialog"
        aria-label={title}
        className={[
          pos, "z-[150] left-0 right-0 bottom-0 flex flex-col",
          "bg-surface border-t border-border rounded-t-3xl shadow-2xl shadow-black/30 overflow-hidden",
          heightStyle ? "" : SHEET_SIZES[size].cls,
          size === "full" && !heightStyle ? "rounded-t-none" : "",
        ].join(" ")}
        style={{
          ...heightStyle,
          transform: `translateY(${dragY}px)`,
          transition: dragRef.current ? "none" : "transform 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1)",
          animation: closing ? "sheetOut 0.24s ease-in forwards" : "pwaSlideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {showHandle && (
          <div
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
            className="pt-3 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing touch-none"
          >
            <span className="w-10 h-1 rounded-full bg-border"/>
          </div>
        )}

        {(title || description || showClose) && (
          <div className="px-6 pt-3 pb-3 flex items-start gap-3 shrink-0">
            <div className="flex-1 min-w-0">
              {title && <h2 className="text-base font-semibold text-foreground leading-tight">{title}</h2>}
              {description && <p className="text-xs text-muted mt-1 leading-relaxed">{description}</p>}
            </div>
            {showClose && (
              <button onClick={doClose} aria-label="Cerrar"
                className="shrink-0 w-8 h-8 rounded-lg inline-flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-alt transition-colors">
                {I.close}
              </button>
            )}
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 pb-2">{children}</div>

        <div className={`shrink-0 ${footer ? "px-6 pt-3 pb-5 border-t border-border bg-surface" : "pb-2"}`}>
          {footer}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { PreviewBottomSheet, SHEET_SIZES });
