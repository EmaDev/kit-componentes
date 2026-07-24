"use client";

import { useEffect, useState } from "react";

interface UseKeyboardInsetOptions {
  /**
   * Publicar la altura del teclado en `--kb-inset` (px) sobre <html>,
   * para empujar barras fijas desde CSS. Default: true
   */
  publishCssVar?: boolean;
  /** px mínimos para considerar que el teclado está abierto. Default: 120 */
  threshold?: number;
}

interface UseKeyboardInsetReturn {
  /** altura que ocupa el teclado sobre el viewport, en px */
  inset: number;
  /** el teclado está abierto */
  open: boolean;
}

/**
 * Detecta el teclado virtual con la Visual Viewport API.
 * Sirve para que una barra fija (input de chat, CTA) no quede tapada.
 *
 * ```tsx
 * const { inset } = useKeyboardInset();
 * <div style={{ paddingBottom: inset }} />
 * // o en CSS: bottom: calc(var(--kb-inset) + var(--sa-bottom));
 * ```
 */
export function useKeyboardInset(options: UseKeyboardInsetOptions = {}): UseKeyboardInsetReturn {
  const { publishCssVar = true, threshold = 120 } = options;
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const sync = () => {
      // lo que el teclado tapa = alto de la ventana - alto visible - scroll del viewport
      const hidden = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      const next = Math.round(hidden);
      setInset(next);
      if (publishCssVar) {
        document.documentElement.style.setProperty("--kb-inset", `${next}px`);
      }
    };

    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
      if (publishCssVar) document.documentElement.style.setProperty("--kb-inset", "0px");
    };
  }, [publishCssVar]);

  return { inset, open: inset > threshold };
}
