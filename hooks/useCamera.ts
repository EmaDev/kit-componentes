"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CameraFacing = "user" | "environment";

interface UseCameraOptions {
  /** cámara inicial. Default: "environment" (trasera) */
  facing?: CameraFacing;
  /** resolución ideal */
  width?: number;
  height?: number;
  /** arrancar automáticamente al montar. Default: false */
  auto?: boolean;
}

/**
 * Cámara del dispositivo: stream, cambio frontal/trasera, captura a Blob
 * y apagado prolijo (si no parás los tracks, el LED queda encendido).
 */
export function useCamera({ facing = "environment", width = 1280, height = 720, auto = false }: UseCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [current, setCurrent] = useState<CameraFacing>(facing);
  const [error, setError] = useState<string | null>(null);
  const [hasMultiple, setHasMultiple] = useState(false);

  const supported = typeof navigator !== "undefined" && Boolean(navigator.mediaDevices?.getUserMedia);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  }, []);

  const start = useCallback(
    async (which: CameraFacing = current) => {
      if (!supported) {
        setError("Este navegador no expone la cámara.");
        return false;
      }
      stop();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: which, width: { ideal: width }, height: { ideal: height } },
          audio: false,
        });
        streamRef.current = stream;
        setCurrent(which);
        setActive(true);
        setError(null);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", "true");
          await videoRef.current.play().catch(() => {});
        }
        const devices = await navigator.mediaDevices.enumerateDevices();
        setHasMultiple(devices.filter((d) => d.kind === "videoinput").length > 1);
        return true;
      } catch (e) {
        const err = e as DOMException;
        setError(
          err.name === "NotAllowedError"
            ? "Permiso de cámara denegado."
            : err.name === "NotFoundError"
              ? "No encontramos ninguna cámara."
              : err.message || "No pudimos abrir la cámara.",
        );
        return false;
      }
    },
    [current, height, stop, supported, width],
  );

  const flip = useCallback(
    () => start(current === "environment" ? "user" : "environment"),
    [current, start],
  );

  /** foto del frame actual */
  const capture = useCallback(async (quality = 0.92): Promise<Blob | null> => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    if (current === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1); // espejo, como se ve en pantalla
    }
    ctx.drawImage(video, 0, 0);
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/jpeg", quality));
  }, [current]);

  useEffect(() => {
    if (auto) start(facing);
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { videoRef, start, stop, flip, capture, active, facing: current, hasMultiple, error, supported };
}
