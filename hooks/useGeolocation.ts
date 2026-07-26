"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Coords {
  lat: number;
  lng: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  at: number;
}

interface UseGeolocationOptions extends PositionOptions {
  /** seguir la posición en vivo en vez de pedirla una vez. Default: false */
  watch?: boolean;
  /** pedir la posición al montar. Default: false (mejor pedirla en un gesto) */
  auto?: boolean;
}

/**
 * Ubicación del dispositivo, con mensajes de error legibles.
 * Ojo: iOS exige HTTPS y un gesto del usuario para el primer pedido.
 */
export function useGeolocation({
  watch = false,
  auto = false,
  enableHighAccuracy = true,
  timeout = 10000,
  maximumAge = 30000,
}: UseGeolocationOptions = {}) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const watchId = useRef<number | null>(null);
  const supported = typeof navigator !== "undefined" && "geolocation" in navigator;

  const handle = useCallback((pos: GeolocationPosition) => {
    setCoords({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      heading: pos.coords.heading,
      speed: pos.coords.speed,
      at: pos.timestamp,
    });
    setError(null);
    setLoading(false);
  }, []);

  const fail = useCallback((e: GeolocationPositionError) => {
    setError(
      e.code === e.PERMISSION_DENIED
        ? "Permiso de ubicación denegado."
        : e.code === e.POSITION_UNAVAILABLE
          ? "No pudimos determinar tu ubicación."
          : "La ubicación tardó demasiado.",
    );
    setLoading(false);
  }, []);

  const request = useCallback(() => {
    if (!supported) {
      setError("Este navegador no expone la ubicación.");
      return;
    }
    setLoading(true);
    const opts = { enableHighAccuracy, timeout, maximumAge };
    if (watch) {
      watchId.current = navigator.geolocation.watchPosition(handle, fail, opts);
    } else {
      navigator.geolocation.getCurrentPosition(handle, fail, opts);
    }
  }, [enableHighAccuracy, fail, handle, maximumAge, supported, timeout, watch]);

  const stop = useCallback(() => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
    watchId.current = null;
    setLoading(false);
  }, []);

  useEffect(() => {
    if (auto) request();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { coords, error, loading, supported, request, stop };
}
