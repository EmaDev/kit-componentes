"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type PlayerOrientation = "landscape" | "portrait";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  subtitle?: string;
  /** landscape = streaming clásico · portrait = feed vertical tipo reel */
  orientation?: PlayerOrientation;
  /** Segundos que saltan los botones y el doble tap */
  skipSeconds?: number;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  /** Guarda y restaura la posición en localStorage con esta clave */
  resumeKey?: string;
  /** Marcas en la barra (segundos): capítulos, hitos, etc. */
  markers?: { at: number; label?: string }[];
  onEnded?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  /** Overlay libre (acciones del feed vertical, badges, etc.) */
  overlay?: ReactNode;
  className?: string;
}

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

export function formatTime(s: number): string {
  if (!isFinite(s) || s < 0) s = 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return `${h ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

const Ico = {
  play: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z"/></svg>,
  pause: <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full"><rect x="6" y="4.5" width="4" height="15" rx="1.2"/><rect x="14" y="4.5" width="4" height="15" rx="1.2"/></svg>,
  back: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>,
  fwd: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/></svg>,
  vol: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>,
  mute: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M11 5 6 9H3v6h3l5 4z"/><line x1="16" y1="9" x2="22" y2="15"/><line x1="22" y1="9" x2="16" y2="15"/></svg>,
  full: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>,
  exit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full"><path d="M3 8h3a2 2 0 0 0 2-2V3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/></svg>,
};

export function VideoPlayer({
  src,
  poster,
  title,
  subtitle,
  orientation = "landscape",
  skipSeconds = 10,
  autoPlay = false,
  loop = false,
  muted: mutedProp = false,
  resumeKey,
  markers = [],
  onEnded,
  onNext,
  onPrev,
  overlay,
  className = "",
}: VideoPlayerProps) {
  const vertical = orientation === "portrait";
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | null>(null);
  const tapRef = useRef<{ t: number; x: number }>({ t: 0, x: 0 });

  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(mutedProp);
  const [rate, setRate] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [scrubbing, setScrubbing] = useState(false);
  const [flash, setFlash] = useState<null | { dir: -1 | 1; n: number }>(null);

  // ---- reproducción -------------------------------------------------
  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }, []);

  const seekTo = useCallback((t: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(v.duration || 0, t));
    setTime(v.currentTime);
  }, []);

  const skip = useCallback((dir: -1 | 1) => {
    const v = videoRef.current;
    if (!v) return;
    seekTo(v.currentTime + dir * skipSeconds);
    setFlash((f) => ({ dir, n: f && f.dir === dir ? f.n + skipSeconds : skipSeconds }));
    window.setTimeout(() => setFlash(null), 650);
  }, [seekTo, skipSeconds]);

  // ---- autohide de controles -----------------------------------------
  const poke = useCallback(() => {
    setUiVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (!videoRef.current?.paused) setUiVisible(false);
    }, 2600);
  }, []);

  useEffect(() => () => { if (hideTimer.current) window.clearTimeout(hideTimer.current); }, []);

  // ---- posición guardada ---------------------------------------------
  useEffect(() => {
    if (!resumeKey) return;
    const raw = localStorage.getItem(`vp:${resumeKey}`);
    const t = raw ? parseFloat(raw) : 0;
    if (t > 0 && videoRef.current) videoRef.current.currentTime = t;
  }, [resumeKey, src]);

  useEffect(() => {
    if (!resumeKey) return;
    const id = window.setInterval(() => {
      const v = videoRef.current;
      if (v && !v.paused) localStorage.setItem(`vp:${resumeKey}`, String(v.currentTime));
    }, 2000);
    return () => window.clearInterval(id);
  }, [resumeKey]);

  // ---- teclado ---------------------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = wrapRef.current;
      if (!el || !el.contains(document.activeElement) && document.activeElement !== document.body) return;
      const k = e.key.toLowerCase();
      if ([" ", "k", "arrowleft", "arrowright", "j", "l", "m", "f"].includes(k)) e.preventDefault();
      if (k === " " || k === "k") toggle();
      else if (k === "arrowleft" || k === "j") skip(-1);
      else if (k === "arrowright" || k === "l") skip(1);
      else if (k === "m") setMuted((m) => !m);
      else if (k === "f") void toggleFullscreen();
      else if (/^[0-9]$/.test(k)) seekTo((duration * Number(k)) / 10);
      poke();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toggle, skip, seekTo, duration, poke]);

  // ---- fullscreen ------------------------------------------------------
  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await wrapRef.current?.requestFullscreen();
    } catch { /* no soportado */ }
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // ---- video events ----------------------------------------------------
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = volume;
    v.muted = muted;
    v.playbackRate = rate;
  }, [volume, muted, rate]);

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || scrubbing) return;
    setTime(v.currentTime);
    if (v.buffered.length) setBuffered(v.buffered.end(v.buffered.length - 1));
  };

  // ---- scrub ------------------------------------------------------------
  const posFromEvent = (e: React.PointerEvent | PointerEvent) => {
    const el = barRef.current;
    if (!el || !duration) return 0;
    const r = el.getBoundingClientRect();
    const p = vertical
      ? (e.clientX - r.left) / r.width
      : (e.clientX - r.left) / r.width;
    return Math.max(0, Math.min(1, p)) * duration;
  };

  const startScrub = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setScrubbing(true);
    setTime(posFromEvent(e));
  };
  const moveScrub = (e: React.PointerEvent) => {
    if (!scrubbing) return;
    setTime(posFromEvent(e));
  };
  const endScrub = (e: React.PointerEvent) => {
    if (!scrubbing) return;
    setScrubbing(false);
    seekTo(posFromEvent(e));
  };

  // doble tap a los costados = adelantar / retroceder
  const onSurfaceTap = (e: React.PointerEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    const x = e.clientX - r.left;
    const now = Date.now();
    const isDouble = now - tapRef.current.t < 320 && Math.abs(x - tapRef.current.x) < 80;
    tapRef.current = { t: now, x };
    if (isDouble) {
      if (x < r.width * 0.4) skip(-1);
      else if (x > r.width * 0.6) skip(1);
      else toggle();
    } else {
      window.setTimeout(() => {
        if (Date.now() - tapRef.current.t >= 300) { toggle(); poke(); }
      }, 300);
    }
  };

  const pct = duration ? (time / duration) * 100 : 0;
  const bufPct = duration ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      onPointerMove={poke}
      onMouseLeave={() => playing && setUiVisible(false)}
      className={cx(
        "relative overflow-hidden bg-black select-none outline-none group/vp",
        fullscreen ? "w-screen h-screen rounded-none" : vertical ? "rounded-3xl aspect-[9/16]" : "rounded-2xl aspect-video",
        className
      )}
      style={{ cursor: uiVisible ? "default" : "none" }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        loop={loop}
        autoPlay={autoPlay}
        preload="metadata"
        className={cx("absolute inset-0 w-full h-full", vertical ? "object-cover" : "object-contain")}
        onClick={(e) => e.preventDefault()}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={onTimeUpdate}
        onProgress={onTimeUpdate}
        onPlay={() => { setPlaying(true); poke(); }}
        onPause={() => { setPlaying(false); setUiVisible(true); }}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onEnded={() => { setPlaying(false); setUiVisible(true); onEnded?.(); }}
      />

      {/* superficie de gestos */}
      <div className="absolute inset-0" onPointerDown={onSurfaceTap}/>

      {/* flash de salto */}
      {flash && (
        <div className={cx(
          "absolute top-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center gap-1 text-white",
          flash.dir === 1 ? "right-[12%]" : "left-[12%]"
        )}>
          <span className="w-12 h-12 rounded-full bg-white/15 backdrop-blur flex items-center justify-center p-3">
            {flash.dir === 1 ? Ico.fwd : Ico.back}
          </span>
          <span className="text-xs font-semibold tabular-nums">{flash.n}s</span>
        </div>
      )}

      {/* spinner de buffering */}
      {waiting && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-[3px] border-white/25 border-t-white animate-spin pointer-events-none"/>
      )}

      {/* botón central */}
      {(!playing || uiVisible) && (
        <button
          type="button" onClick={toggle} aria-label={playing ? "Pausar" : "Reproducir"}
          className={cx(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/45 backdrop-blur text-white",
            "flex items-center justify-center transition-all hover:bg-black/60 active:scale-90",
            vertical ? "w-16 h-16 p-5" : "w-[72px] h-[72px] p-6",
            playing && "opacity-0 group-hover/vp:opacity-100"
          )}
        >
          {playing ? Ico.pause : Ico.play}
        </button>
      )}

      {/* título */}
      {(title || subtitle) && !vertical && (
        <div className={cx(
          "absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/70 to-transparent transition-opacity duration-300",
          uiVisible ? "opacity-100" : "opacity-0"
        )}>
          <p className="text-sm font-semibold text-white leading-tight">{title}</p>
          {subtitle && <p className="text-[11px] text-white/70 mt-0.5">{subtitle}</p>}
        </div>
      )}

      {overlay}

      {/* controles */}
      <div className={cx(
        "absolute inset-x-0 bottom-0 transition-all duration-300",
        vertical ? "px-3 pb-3" : "px-4 pb-3 pt-10 bg-gradient-to-t from-black/80 via-black/35 to-transparent",
        uiVisible || scrubbing ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      )}>
        {vertical && (title || subtitle) && (
          <div className="mb-2 pr-16">
            <p className="text-sm font-semibold text-white leading-tight drop-shadow">{title}</p>
            {subtitle && <p className="text-[11px] text-white/75 mt-0.5 line-clamp-2 drop-shadow">{subtitle}</p>}
          </div>
        )}

        {/* barra */}
        <div
          ref={barRef}
          onPointerDown={startScrub} onPointerMove={moveScrub} onPointerUp={endScrub}
          className="relative h-6 flex items-center cursor-pointer touch-none"
        >
          <div className={cx("relative w-full rounded-full bg-white/25 transition-all", scrubbing ? "h-1.5" : "h-1 group-hover/vp:h-1.5")}>
            <div className="absolute inset-y-0 left-0 rounded-full bg-white/35" style={{ width: `${bufPct}%` }}/>
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${pct}%` }}/>
            {markers.map((m, i) => (
              <span key={i} title={m.label}
                className="absolute top-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-white/80"
                style={{ left: `${duration ? (m.at / duration) * 100 : 0}%` }}/>
            ))}
            <span
              className={cx("absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full bg-primary shadow transition-transform",
                scrubbing ? "w-4 h-4" : "w-3 h-3 scale-0 group-hover/vp:scale-100")}
              style={{ left: `${pct}%` }}/>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-white">
          <CtrlBtn onClick={toggle} label={playing ? "Pausar" : "Reproducir"}>{playing ? Ico.pause : Ico.play}</CtrlBtn>
          <CtrlBtn onClick={() => skip(-1)} label={`Retroceder ${skipSeconds}s`}>{Ico.back}</CtrlBtn>
          <CtrlBtn onClick={() => skip(1)} label={`Adelantar ${skipSeconds}s`}>{Ico.fwd}</CtrlBtn>

          <div className="group/vol flex items-center gap-1">
            <CtrlBtn onClick={() => setMuted((m) => !m)} label={muted ? "Activar sonido" : "Silenciar"}>
              {muted || volume === 0 ? Ico.mute : Ico.vol}
            </CtrlBtn>
            <input
              type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume} aria-label="Volumen"
              onChange={(e) => { setVolume(Number(e.target.value)); setMuted(Number(e.target.value) === 0); }}
              className="w-0 group-hover/vol:w-16 focus:w-16 transition-all duration-200 accent-white h-1 cursor-pointer"
            />
          </div>

          <span className="ml-1 text-[11px] font-medium tabular-nums text-white/85">
            {formatTime(time)} <span className="text-white/45">/ {formatTime(duration)}</span>
          </span>

          <span className="flex-1"/>

          {onPrev && <CtrlBtn onClick={onPrev} label="Anterior"><span className="rotate-180 w-full h-full">{Ico.play}</span></CtrlBtn>}
          {onNext && <CtrlBtn onClick={onNext} label="Siguiente">{Ico.play}</CtrlBtn>}

          <button
            type="button" onClick={() => setRate(RATES[(RATES.indexOf(rate) + 1) % RATES.length])}
            className="h-8 px-2 rounded-lg text-[11px] font-bold tabular-nums hover:bg-white/15 transition-colors"
            aria-label="Velocidad"
          >
            {rate}×
          </button>
          <CtrlBtn onClick={toggleFullscreen} label="Pantalla completa">{fullscreen ? Ico.exit : Ico.full}</CtrlBtn>
        </div>
      </div>
    </div>
  );
}

function CtrlBtn({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      type="button" onClick={onClick} aria-label={label} title={label}
      className="w-8 h-8 shrink-0 rounded-lg p-1.5 inline-flex items-center justify-center hover:bg-white/15 active:scale-90 transition-all"
    >
      {children}
    </button>
  );
}
