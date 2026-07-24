// =============================================================
//  SplashScreen — preview version (CSS keyframes)
//  6 variantes: fade · pulse · orbit · bars · zoom · wipe
// =============================================================

const SPLASH_VARIANTS = [
  { id: "fade",  label: "Fade",  hint: "Sobrio: fade + leve subida" },
  { id: "pulse", label: "Pulse", hint: "Anillos concéntricos latiendo" },
  { id: "orbit", label: "Orbit", hint: "Punto orbitando el icono" },
  { id: "bars",  label: "Bars",  hint: "Barra de progreso real" },
  { id: "zoom",  label: "Zoom",  hint: "Spring in, escala al salir (iOS)" },
  { id: "wipe",  label: "Wipe",  hint: "Dos paneles que se abren" },
];

function PreviewSplash({
  visible, appName = "Scaffolding", tagline, version, footnote, icon,
  variant = "fade", progress = 0, background = "surface", hideName = false,
  onExited, mode = "device",
}) {
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wasVisible = useRef(visible);

  useEffect(() => {
    if (visible && !wasVisible.current) { setExiting(false); setMounted(false); }
    if (!visible && wasVisible.current) {
      setExiting(true);
      const t = setTimeout(() => { setExiting(false); onExited?.(); }, 620);
      wasVisible.current = visible;
      return () => clearTimeout(t);
    }
    wasVisible.current = visible;
  }, [visible, onExited]);

  useEffect(() => {
    if (!visible) return;
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [visible]);

  if (!visible && !exiting) return null;

  const onBrand = background === "brand" || background === "dark";
  const bgCls =
    background === "surface" ? "bg-surface"
    : background === "dark"  ? "bg-foreground"
    : background === "brand" ? "bg-gradient-to-br from-primary to-accent"
    : "";
  const pos = mode === "device" ? "absolute" : "fixed";

  // animación de salida del contenedor por variante
  const shellAnim = exiting
    ? variant === "zoom" ? "splashZoomOut 0.5s cubic-bezier(0.16,1,0.3,1) forwards"
    : variant === "wipe" ? "none"
    : "fadeOut 0.42s ease-in-out forwards"
    : "fadeIn 0.3s ease-out";

  const plate = onBrand
    ? "bg-white/15 text-white backdrop-blur-sm"
    : "bg-gradient-to-br from-primary to-accent text-white shadow-xl shadow-primary/25";

  const mark = (
    <div className={`w-20 h-20 rounded-[26px] flex items-center justify-center overflow-hidden ${plate}`}>
      {icon ?? (
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/>
        </svg>
      )}
    </div>
  );

  const markAnim = {
    fade:  "splashRise 0.6s cubic-bezier(0.16,1,0.3,1) both",
    pulse: "splashPop 0.55s cubic-bezier(0.16,1,0.3,1) both",
    orbit: "splashTilt 0.6s cubic-bezier(0.16,1,0.3,1) both",
    bars:  "splashRise 0.5s cubic-bezier(0.16,1,0.3,1) both",
    zoom:  "splashSpring 0.7s cubic-bezier(0.34,1.56,0.64,1) both",
    wipe:  "splashDrop 0.6s cubic-bezier(0.16,1,0.3,1) both",
  }[variant];

  return (
    <div
      role="status"
      className={`${pos} inset-0 z-[200] overflow-hidden flex flex-col items-center justify-center ${variant === "wipe" ? "" : bgCls}`}
      style={{ animation: shellAnim }}
    >
      {variant === "wipe" && (
        <>
          <div className={`absolute inset-x-0 top-0 h-1/2 ${bgCls}`}
            style={{ animation: exiting ? "splashWipeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards" : "none" }}/>
          <div className={`absolute inset-x-0 bottom-0 h-1/2 ${bgCls}`}
            style={{ animation: exiting ? "splashWipeDown 0.6s cubic-bezier(0.16,1,0.3,1) forwards" : "none" }}/>
        </>
      )}

      <div className="relative z-10 flex flex-col items-center px-10"
        style={exiting && variant === "wipe" ? { animation: "splashContentOut 0.26s ease-in forwards" } : undefined}>

        {variant === "pulse" ? (
          <div className="relative grid place-items-center">
            {[0,1,2].map(i => (
              <span key={i}
                className={`absolute rounded-[34px] ${onBrand ? "bg-white/20" : "bg-primary/15"}`}
                style={{ width: 80, height: 80, animation: `splashPulse 2.1s ${i*0.7}s ease-out infinite` }}/>
            ))}
            <div className="relative" style={{ animation: markAnim }}>{mark}</div>
          </div>
        ) : variant === "orbit" ? (
          <div className="relative grid place-items-center w-[124px] h-[124px]">
            <span className={`absolute inset-0 rounded-full border ${onBrand ? "border-white/20" : "border-border"}`}/>
            <span className="absolute inset-0" style={{ animation: "spin 2.4s linear infinite" }}>
              <span className={`absolute left-1/2 -translate-x-1/2 -top-1 w-2.5 h-2.5 rounded-full ${onBrand ? "bg-white" : "bg-primary"}`}/>
            </span>
            <div style={{ animation: markAnim }}>{mark}</div>
          </div>
        ) : (
          <div style={{ animation: markAnim }}>{mark}</div>
        )}

        {!hideName && (
          <div className="mt-7 text-center"
            style={{ animation: `splashRise 0.5s ${variant === "fade" ? 0.18 : 0.3}s cubic-bezier(0.16,1,0.3,1) both` }}>
            <h1 className={`text-2xl font-bold tracking-tight ${onBrand ? "text-white" : "text-foreground"}`}>{appName}</h1>
            {tagline && <p className={`mt-1.5 text-sm ${onBrand ? "text-white/70" : "text-muted"}`}>{tagline}</p>}
          </div>
        )}

        {variant === "bars" && (
          <div className={`mt-8 h-1 w-40 rounded-full overflow-hidden ${onBrand ? "bg-white/20" : "bg-border"}`}>
            <div className={`h-full rounded-full ${onBrand ? "bg-white" : "bg-primary"}`}
              style={{ width: `${Math.round(progress * 100)}%`, transition: "width 0.3s ease-out" }}/>
          </div>
        )}
      </div>

      {(version || footnote) && (
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-1 pb-8"
          style={{ animation: exiting && variant === "wipe"
            ? "fadeOut 0.2s ease-in forwards"
            : "fadeIn 0.5s 0.5s both" }}>
          {version && <span className={`text-[11px] font-mono ${onBrand ? "text-white/60" : "text-muted"}`}>v{version}</span>}
          {footnote && <span className={`text-[10px] ${onBrand ? "text-white/40" : "text-muted/70"}`}>{footnote}</span>}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { PreviewSplash, SPLASH_VARIANTS });
