// =============================================================
//  Platform detection + Native feel — preview versions
//  Estos SÍ corren la detección real del navegador del usuario.
// =============================================================

function previewDetectPlatform() {
  const ua = navigator.userAgent;
  const maxTouch = navigator.maxTouchPoints || 0;
  const isTouch = maxTouch > 0 || "ontouchstart" in window;

  const isIphone = /iPhone|iPod/.test(ua);
  const isIpad = /iPad/.test(ua) || (/Macintosh/.test(ua) && maxTouch > 1);
  const isAndroid = /Android/i.test(ua);
  let os = "unknown";
  if (isIphone) os = "ios";
  else if (isIpad) os = "ipados";
  else if (isAndroid) os = "android";
  else if (/Mac OS X/.test(ua)) os = "macos";
  else if (/Windows/.test(ua)) os = "windows";
  else if (/Linux|X11/.test(ua)) os = "linux";

  let browser = "unknown";
  if (/SamsungBrowser/i.test(ua)) browser = "samsung";
  else if (/Edg\//i.test(ua)) browser = "edge";
  else if (/Firefox|FxiOS/i.test(ua)) browser = "firefox";
  else if (/CriOS|Chrome/i.test(ua)) browser = "chrome";
  else if (/Safari/i.test(ua)) browser = "safari";

  const modes = ["fullscreen", "standalone", "minimal-ui"];
  let displayMode = "browser";
  for (const m of modes) {
    if (window.matchMedia?.(`(display-mode: ${m})`).matches) { displayMode = m; break; }
  }
  if (document.referrer.startsWith("android-app://")) displayMode = "twa";
  else if (navigator.standalone === true) displayMode = "standalone";

  const shortest = Math.min(window.screen.width, window.screen.height);
  let formFactor = "desktop";
  if (isIpad || (isTouch && shortest >= 600 && shortest < 1100)) formFactor = "tablet";
  else if (isIphone || isAndroid || (isTouch && shortest < 600)) formFactor = "mobile";

  // safe areas vía probe
  const probe = document.createElement("div");
  probe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;top:env(safe-area-inset-top,0px);right:env(safe-area-inset-right,0px);bottom:env(safe-area-inset-bottom,0px);left:env(safe-area-inset-left,0px)";
  document.documentElement.appendChild(probe);
  const cs = getComputedStyle(probe);
  const safeArea = {
    top: parseFloat(cs.top) || 0, right: parseFloat(cs.right) || 0,
    bottom: parseFloat(cs.bottom) || 0, left: parseFloat(cs.left) || 0,
  };
  probe.remove();

  const isIosWebView = (isIphone || isIpad) && !/Safari/.test(ua);
  const isAndroidWebView = isAndroid && /; wv\)/.test(ua);
  const isInApp = /FBAN|FBAV|Instagram|Line\/|Twitter|WhatsApp|TikTok/i.test(ua);

  return {
    os, browser, formFactor, displayMode,
    isStandalone: displayMode !== "browser",
    isIos: isIphone || isIpad, isAndroid,
    isMobileOs: isIphone || isIpad || isAndroid,
    isTouch, isWebView: isIosWebView || isAndroidWebView || isInApp,
    hasSafeArea: safeArea.top > 0 || safeArea.bottom > 0,
    safeArea,
    prefersReducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    pixelRatio: window.devicePixelRatio || 1,
  };
}

function usePreviewPlatform() {
  const [info, setInfo] = useState(null);
  useEffect(() => {
    const sync = () => setInfo(previewDetectPlatform());
    sync();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);
  return info;
}

// ---- Panel de plataforma detectada ------------------------------
function PlatformPanel({ info }) {
  if (!info) return <div className="h-40 rounded-2xl border border-border bg-surface-alt/40 animate-pulse"/>;

  const os = {
    ios: "iOS", ipados: "iPadOS", android: "Android",
    macos: "macOS", windows: "Windows", linux: "Linux", unknown: "Desconocido",
  }[info.os];
  const mode = {
    browser: "Navegador", standalone: "Instalada (standalone)",
    "minimal-ui": "Minimal UI", fullscreen: "Pantalla completa", twa: "TWA (Android)",
  }[info.displayMode];
  const form = { mobile: "Mobile", tablet: "Tablet", desktop: "Escritorio" }[info.formFactor];

  const rows = [
    { label: "Sistema",     value: os,                                     tone: "ok" },
    { label: "Navegador",   value: info.browser,                           tone: "ok" },
    { label: "Form factor", value: form,                                   tone: "ok" },
    { label: "Display mode",value: mode,                                   tone: info.isStandalone ? "ok" : "warn" },
    { label: "Táctil",      value: info.isTouch ? "Sí" : "No",             tone: info.isTouch ? "ok" : "off" },
    { label: "WebView",     value: info.isWebView ? "Sí" : "No",           tone: info.isWebView ? "warn" : "off" },
    { label: "Safe areas",  value: info.hasSafeArea
        ? `${info.safeArea.top} / ${info.safeArea.bottom} px`
        : "Ninguna",                                                       tone: info.hasSafeArea ? "ok" : "off" },
    { label: "Pixel ratio", value: `${info.pixelRatio}×`,                  tone: "off" },
    { label: "Menos animación", value: info.prefersReducedMotion ? "Sí" : "No", tone: info.prefersReducedMotion ? "warn" : "off" },
  ];
  const dot = { ok: "bg-success", warn: "bg-accent", off: "bg-muted/50" };

  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-success"/>
        <p className="text-sm font-semibold text-foreground">Tu dispositivo, ahora</p>
      </div>
      <dl className="divide-y divide-border">
        {rows.map((r, i) => (
          <div key={r.label} className="px-4 py-2.5 flex items-center justify-between gap-4"
            style={{ animation: `fadeInUp 0.3s ${i*0.04}s both` }}>
            <dt className="text-xs text-muted">{r.label}</dt>
            <dd className="flex items-center gap-2 text-xs font-semibold text-foreground capitalize">
              <span className={`w-1.5 h-1.5 rounded-full ${dot[r.tone]}`}/>
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ---- Toggles de los bloqueos (funcionales, en vivo) --------------
function NativeFeelDemo({ opts, setOpts, onToast }) {
  const items = [
    { key: "blockZoom",          label: "Bloquear zoom",           hint: "pinch · doble-tap · ctrl+scroll · ctrl +/-" },
    { key: "blockOverscroll",    label: "Bloquear overscroll",     hint: "pull-to-refresh y rebote del body" },
    { key: "blockContextMenu",   label: "Bloquear menú contextual",hint: "long-press y click derecho (respeta inputs)" },
    { key: "blockTextSelection", label: "Bloquear selección",      hint: "fuera de inputs y textareas" },
  ];
  return (
    <div className="space-y-2">
      {items.map(it => {
        const on = opts[it.key];
        return (
          <button key={it.key}
            onClick={() => { setOpts(o => ({ ...o, [it.key]: !o[it.key] })); onToast?.(it.label, !on); }}
            className="w-full text-left rounded-xl border border-border bg-surface p-3 flex items-center gap-3 hover:bg-surface-alt transition-colors">
            <span className={cx(
              "relative shrink-0 w-10 h-6 rounded-full transition-colors",
              on ? "bg-primary" : "bg-border"
            )}>
              <span className={cx(
                "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all",
                on ? "left-[18px]" : "left-0.5"
              )}/>
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-semibold text-foreground">{it.label}</span>
              <span className="block text-[11px] text-muted mt-0.5">{it.hint}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---- Versión preview del hook useNativeFeel (bloqueos reales) ----
function usePreviewNativeFeel(opts) {
  const { blockZoom, blockOverscroll, blockContextMenu, blockTextSelection, patchViewportMeta } = opts;
  useEffect(() => {
    const cleanups = [];
    const html = document.documentElement, body = document.body;

    if (blockZoom) {
      if (patchViewportMeta) {
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
          const prev = meta.content;
          meta.content = "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover";
          cleanups.push(() => { meta.content = prev; });
        }
      }
      const killGesture = (e) => e.preventDefault();
      ["gesturestart","gesturechange","gestureend"].forEach(t =>
        document.addEventListener(t, killGesture, { passive: false }));
      cleanups.push(() => ["gesturestart","gesturechange","gestureend"].forEach(t =>
        document.removeEventListener(t, killGesture)));

      const killPinch = (e) => { if (e.touches.length > 1) e.preventDefault(); };
      document.addEventListener("touchmove", killPinch, { passive: false });
      cleanups.push(() => document.removeEventListener("touchmove", killPinch));

      let lastTouch = 0;
      const killDoubleTap = (e) => {
        const now = Date.now();
        if (now - lastTouch < 320) e.preventDefault();
        lastTouch = now;
      };
      document.addEventListener("touchend", killDoubleTap, { passive: false });
      cleanups.push(() => document.removeEventListener("touchend", killDoubleTap));

      const killWheelZoom = (e) => { if (e.ctrlKey || e.metaKey) e.preventDefault(); };
      const killKeyZoom = (e) => {
        if ((e.ctrlKey || e.metaKey) && ["+","-","=","0"].includes(e.key)) e.preventDefault();
      };
      window.addEventListener("wheel", killWheelZoom, { passive: false });
      window.addEventListener("keydown", killKeyZoom);
      cleanups.push(() => {
        window.removeEventListener("wheel", killWheelZoom);
        window.removeEventListener("keydown", killKeyZoom);
      });
    }

    if (blockOverscroll) {
      const p1 = html.style.overscrollBehavior, p2 = body.style.overscrollBehavior;
      html.style.overscrollBehavior = "none";
      body.style.overscrollBehavior = "none";
      cleanups.push(() => { html.style.overscrollBehavior = p1; body.style.overscrollBehavior = p2; });
    }

    if (blockContextMenu) {
      const kill = (e) => {
        if (e.target?.closest?.("input, textarea, [contenteditable='true']")) return;
        e.preventDefault();
      };
      document.addEventListener("contextmenu", kill);
      cleanups.push(() => document.removeEventListener("contextmenu", kill));
    }

    if (blockTextSelection) {
      const prev = body.style.userSelect;
      body.style.userSelect = "none";
      cleanups.push(() => { body.style.userSelect = prev; });
    }

    return () => cleanups.forEach(fn => fn());
  }, [blockZoom, blockOverscroll, blockContextMenu, blockTextSelection, patchViewportMeta]);
}

Object.assign(window, { usePreviewPlatform, usePreviewNativeFeel, PlatformPanel, NativeFeelDemo, previewDetectPlatform });
