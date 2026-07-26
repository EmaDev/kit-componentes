"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type NDEFReaderCtor = new () => {
  scan: (opts?: { signal?: AbortSignal }) => Promise<void>;
  write: (message: unknown, opts?: { signal?: AbortSignal }) => Promise<void>;
  addEventListener: (t: string, cb: (e: NfcReadEvent) => void) => void;
};

type NfcReadEvent = {
  serialNumber: string;
  message: { records: { recordType: string; data?: BufferSource; encoding?: string }[] };
};

export interface NfcTag {
  serialNumber: string;
  records: { type: string; text: string }[];
}

/**
 * Lectura y escritura NFC (Web NFC — sólo Android/Chrome, HTTPS y gesto del
 * usuario). Útil para credenciales, control de acceso, inventario.
 */
export function useNfc() {
  const [supported, setSupported] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [tag, setTag] = useState<NfcTag | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "NDEFReader" in window);
    return () => abort.current?.abort();
  }, []);

  const scan = useCallback(async () => {
    const Ctor = (window as unknown as { NDEFReader?: NDEFReaderCtor }).NDEFReader;
    if (!Ctor) {
      setError("Este dispositivo no soporta NFC en el navegador.");
      return false;
    }
    try {
      abort.current = new AbortController();
      const reader = new Ctor();
      await reader.scan({ signal: abort.current.signal });
      setScanning(true);
      setError(null);
      reader.addEventListener("reading", (e) => {
        const records = e.message.records.map((r) => ({
          type: r.recordType,
          text: r.data ? new TextDecoder(r.encoding ?? "utf-8").decode(r.data) : "",
        }));
        setTag({ serialNumber: e.serialNumber, records });
      });
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos activar el lector NFC.");
      setScanning(false);
      return false;
    }
  }, []);

  const write = useCallback(async (text: string) => {
    const Ctor = (window as unknown as { NDEFReader?: NDEFReaderCtor }).NDEFReader;
    if (!Ctor) return false;
    try {
      await new Ctor().write({ records: [{ recordType: "text", data: text }] });
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "No pudimos escribir el tag.");
      return false;
    }
  }, []);

  const stop = useCallback(() => {
    abort.current?.abort();
    abort.current = null;
    setScanning(false);
  }, []);

  return { supported, scanning, tag, error, scan, write, stop };
}
