"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCamera } from "../hooks/useCamera";
import { useHaptics } from "../hooks/useHaptics";

interface CameraCaptureProps {
  open: boolean;
  onClose: () => void;
  /** foto tomada (y confirmada, si hay revisión) */
  onCapture: (blob: Blob, dataUrl: string) => void | Promise<void>;
  /** mostrar la foto antes de confirmar. Default: true */
  review?: boolean;
  facing?: "user" | "environment";
  /** guía visual: marco cuadrado, documento o libre */
  guide?: "none" | "square" | "document";
  title?: string;
}

/**
 * Captura de foto a pantalla completa: preview en vivo, cambio de cámara,
 * revisión antes de confirmar y apagado del stream al cerrar.
 */
export function CameraCapture({
  open,
  onClose,
  onCapture,
  review = true,
  facing = "environment",
  guide = "none",
  title = "Tomar foto",
}: CameraCaptureProps) {
  const { videoRef, start, stop, flip, capture, active, facing: current, hasMultiple, error } = useCamera({ facing });
  const { haptic } = useHaptics();
  const [shot, setShot] = useState<{ blob: Blob; url: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) start(facing);
    else {
      stop();
      setShot((s) => {
        if (s) URL.revokeObjectURL(s.url);
        return null;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const take = async () => {
    haptic("tap");
    const blob = await capture();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    if (review) setShot({ blob, url });
    else {
      await onCapture(blob, url);
      onClose();
    }
  };

  const confirm = async () => {
    if (!shot) return;
    setBusy(true);
    await onCapture(shot.blob, shot.url);
    setBusy(false);
    haptic("success");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[140] bg-black flex flex-col"
        >
          <div
            className="flex items-center justify-between px-3 h-14 text-white/90"
            style={{ paddingTop: "var(--sa-top, env(safe-area-inset-top, 0px))" }}
          >
            <button onClick={onClose} aria-label="Cerrar" className="w-10 h-10 rounded-xl inline-flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
            <p className="text-sm font-semibold">{title}</p>
            <span className="w-10" />
          </div>

          <div className="relative flex-1 overflow-hidden">
            <video
              ref={videoRef}
              playsInline
              muted
              className={`absolute inset-0 w-full h-full object-cover ${current === "user" ? "scale-x-[-1]" : ""} ${shot ? "opacity-0" : ""}`}
            />
            {shot && <img src={shot.url} alt="" className="absolute inset-0 w-full h-full object-cover" />}

            {guide !== "none" && !shot && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className={`border-2 border-white/70 rounded-2xl ${guide === "square" ? "w-[74vw] max-w-[380px] aspect-square" : "w-[86vw] max-w-[440px] aspect-[1.586]"}`}
                  style={{ boxShadow: "0 0 0 100vmax rgba(0,0,0,0.45)" }}
                />
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                <p className="text-sm text-white/80 leading-relaxed">{error}</p>
              </div>
            )}
            {!active && !error && !shot && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="w-8 h-8 rounded-full border-2 border-white/25 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}
          </div>

          <div
            className="shrink-0 px-6 pt-5 pb-6 flex items-center justify-between"
            style={{ paddingBottom: "calc(1.5rem + var(--sa-bottom, env(safe-area-inset-bottom, 0px)))" }}
          >
            {shot ? (
              <>
                <button
                  onClick={() => {
                    URL.revokeObjectURL(shot.url);
                    setShot(null);
                  }}
                  className="h-11 px-5 rounded-xl text-sm font-semibold text-white/90 hover:bg-white/10 active:scale-95 transition-all"
                >
                  Repetir
                </button>
                <button
                  onClick={confirm}
                  disabled={busy}
                  className="h-11 px-6 rounded-xl bg-white text-black text-sm font-bold active:scale-95 transition-all disabled:opacity-60"
                >
                  {busy ? "Guardando…" : "Usar foto"}
                </button>
              </>
            ) : (
              <>
                <span className="w-11" />
                <button onClick={take} aria-label="Disparar" disabled={!active} className="relative w-[68px] h-[68px] rounded-full active:scale-95 transition-transform disabled:opacity-40">
                  <span className="absolute inset-0 rounded-full border-[3px] border-white" />
                  <span className="absolute inset-[6px] rounded-full bg-white" />
                </button>
                <button
                  onClick={() => flip()}
                  disabled={!hasMultiple}
                  aria-label="Cambiar cámara"
                  className="w-11 h-11 rounded-full inline-flex items-center justify-center text-white/90 bg-white/10 active:scale-90 transition-all disabled:opacity-30"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 0 1 15-6.7" /><polyline points="18 2 18 6 14 6" />
                    <path d="M21 12a9 9 0 0 1-15 6.7" /><polyline points="6 22 6 18 10 18" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
