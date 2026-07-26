"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Copiar al portapapeles con feedback de "copiado" y fallback para
 * navegadores sin Clipboard API o contextos no seguros (http).
 */
export function useClipboard(resetMs = 1800) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string) => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        // fallback: textarea fuera de pantalla + execCommand
        try {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.cssText = "position:fixed;top:-9999px;opacity:0";
          document.body.appendChild(ta);
          ta.select();
          ok = document.execCommand("copy");
          document.body.removeChild(ta);
        } catch {
          ok = false;
        }
      }
      setCopied(ok);
      setError(ok ? null : "No pudimos copiar. Copialo a mano.");
      if (timer.current) clearTimeout(timer.current);
      if (ok) timer.current = setTimeout(() => setCopied(false), resetMs);
      return ok;
    },
    [resetMs],
  );

  /** lee el portapapeles (requiere permiso y gesto del usuario) */
  const read = useCallback(async () => {
    try {
      return await navigator.clipboard.readText();
    } catch {
      setError("No pudimos leer el portapapeles.");
      return null;
    }
  }, []);

  return { copy, read, copied, error };
}
