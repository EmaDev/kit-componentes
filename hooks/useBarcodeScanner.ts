"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ScanResult {
  value: string;
  format: string;
  /** caja del código en coordenadas del video, si el navegador la da */
  box?: { x: number; y: number; width: number; height: number };
}

type BarcodeDetectorCtor = new (opts?: { formats?: string[] }) => {
  detect: (source: CanvasImageSource) => Promise<
    { rawValue: string; format: string; boundingBox: DOMRectReadOnly }[]
  >;
};

interface UseScannerOptions {
  /** formatos a buscar. Default: qr_code + los de barras habituales */
  formats?: string[];
  /** ms entre lecturas del frame. Default: 250 */
  interval?: number;
  /** ignorar el mismo código si se repite antes de esto. Default: 2500 ms */
  dedupeMs?: number;
  onScan?: (result: ScanResult) => void;
}

const DEFAULT_FORMATS = ["qr_code", "ean_13", "ean_8", "code_128", "code_39", "upc_a", "upc_e", "pdf417"];

/**
 * Lector de QR y códigos de barras sobre un <video> ya en marcha (useCamera).
 * Usa la BarcodeDetector API nativa; devolvé `supported: false` para caer
 * a un input de foto o a una librería externa.
 */
export function useBarcodeScanner(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  { formats = DEFAULT_FORMATS, interval = 250, dedupeMs = 2500, onScan }: UseScannerOptions = {},
) {
  const [scanning, setScanning] = useState(false);
  const [last, setLast] = useState<ScanResult | null>(null);
  const [supported, setSupported] = useState(false);
  const detectorRef = useRef<InstanceType<BarcodeDetectorCtor> | null>(null);
  const lastHit = useRef<{ value: string; at: number } | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const cb = useRef(onScan);
  cb.current = onScan;

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "BarcodeDetector" in window);
  }, []);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setScanning(false);
  }, []);

  const start = useCallback(async () => {
    const Ctor = (window as unknown as { BarcodeDetector?: BarcodeDetectorCtor }).BarcodeDetector;
    if (!Ctor) return false;
    detectorRef.current ??= new Ctor({ formats });
    setScanning(true);

    timer.current = setInterval(async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2 || !detectorRef.current) return;
      try {
        const found = await detectorRef.current.detect(video);
        if (!found.length) return;
        const hit = found[0];
        const now = Date.now();
        if (lastHit.current?.value === hit.rawValue && now - lastHit.current.at < dedupeMs) return;
        lastHit.current = { value: hit.rawValue, at: now };
        const result: ScanResult = {
          value: hit.rawValue,
          format: hit.format,
          box: hit.boundingBox
            ? {
                x: hit.boundingBox.x,
                y: hit.boundingBox.y,
                width: hit.boundingBox.width,
                height: hit.boundingBox.height,
              }
            : undefined,
        };
        setLast(result);
        cb.current?.(result);
      } catch {
        /* frame no legible */
      }
    }, interval);
    return true;
  }, [dedupeMs, formats, interval, videoRef]);

  useEffect(() => stop, [stop]);

  return { start, stop, scanning, last, supported, reset: () => setLast(null) };
}
