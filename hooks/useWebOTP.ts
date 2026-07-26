"use client";

import { useEffect } from "react";

/**
 * Autocompleta el código de un SMS en Android/Chrome (WebOTP API).
 * El SMS tiene que terminar con: `@tu-dominio.com #123456`.
 *
 * En iOS no existe la API, pero funciona el autofill nativo si el input
 * tiene autocomplete="one-time-code" (ya lo pone <CodeOTP/>).
 */
export function useWebOTP(onCode: (code: string) => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined" || !("OTPCredential" in window)) return;

    const controller = new AbortController();
    navigator.credentials
      ?.get({
        otp: { transport: ["sms"] },
        signal: controller.signal,
      } as CredentialRequestOptions)
      .then((cred) => {
        const code = (cred as unknown as { code?: string } | null)?.code;
        if (code) onCode(code);
      })
      .catch(() => {
        /* cancelado o sin soporte */
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
